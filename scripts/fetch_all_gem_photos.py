#!/usr/bin/env python3
"""Fetch real photographic JPGs for every gem in gems-data.js from Wikimedia Commons.

Resume-friendly: skips gems that already have a valid JPG (>= ~4KB, openable).
Updates gems-data.js img paths to .jpg when a JPG exists.
Records Commons filenames in images/PHOTO_SOURCES.json.

Usage:
  python3 scripts/fetch_all_gem_photos.py
  python3 scripts/fetch_all_gem_photos.py --workers 2
  python3 scripts/fetch_all_gem_photos.py --update-only
  python3 scripts/fetch_all_gem_photos.py --retry-failures
"""
from __future__ import annotations

import argparse
import io
import json
import re
import ssl
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
IMG = ROOT / "images"
DATA_JS = ROOT / "gems-data.js"
SOURCES = IMG / "PHOTO_SOURCES.json"
FAIL_LOG = ROOT / "scripts" / "photo_fetch_failures.json"

UA = "LithosGemCatalog/1.0 (educational; https://github.com/grahamgattegno/lithos)"
ctx = ssl.create_default_context()

MIN_JPG_BYTES = 4000
MAX_EDGE = 1200
JPEG_QUALITY = 85

_api_lock = threading.Lock()
_last_api = 0.0
_api_min_interval = 0.35  # polite shared pacing

_sources_lock = threading.Lock()
_print_lock = threading.Lock()

SKIP_TITLE_RE = re.compile(
    r"(map of|\blogo\b|\bflag\b|portrait|painting|\bcoin\b|\bstamp\b|diagram|schematic|"
    r"crystal structure|unit cell|\bformula\b|periodic|\bchart\b|\bgraph\b|"
    r"coat of arms|signature|handwriting|manuscript|cartoon|clip art|"
    r"skeleton|skull|x[- ]?ray diffraction|powder diffraction|"
    r"electron.?microscop|sem image|tem image|\bbse\b|backscatter|"
    r"reflected light micrograph|thin section|optical micrograph|"
    r"\bafs\b|\bnmr\b|raman map|\.pdf$)",
    re.I,
)
SKIP_EXT = (".pdf", ".svg", ".gif", ".djvu", ".ogv", ".webm", ".mp3", ".wav", ".stl", ".ogg")


def log(msg: str) -> None:
    with _print_lock:
        print(msg, flush=True)


def parse_gems(text: str) -> list[dict]:
    m = re.search(r"(?:var|const)\s+GEMS\s*=\s*\[(.*?)\];", text, re.S)
    if not m:
        raise SystemExit("GEMS array not found")
    body = m.group(1)
    gems = []
    for nm, img in re.findall(r'\{name:"([^"]+)"[\s\S]*?img:"([^"]+)"', body):
        gems.append({"name": nm, "img": img, "slug": Path(img).stem})
    return gems


def valid_jpg(path: Path) -> bool:
    if not path.exists() or path.stat().st_size < MIN_JPG_BYTES:
        return False
    try:
        with Image.open(path) as im:
            im.verify()
        with Image.open(path) as im:
            w, h = im.size
            return min(w, h) >= 60
    except Exception:
        return False


def api(params: dict, retries: int = 6):
    global _last_api
    q = urllib.parse.urlencode({**params, "format": "json"})
    url = f"https://commons.wikimedia.org/w/api.php?{q}"
    delay = 2.0
    for attempt in range(retries):
        with _api_lock:
            now = time.monotonic()
            wait = _api_min_interval - (now - _last_api)
            if wait > 0:
                time.sleep(wait)
            _last_api = time.monotonic()
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        try:
            with urllib.request.urlopen(req, context=ctx, timeout=30) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code in (429, 503) and attempt < retries - 1:
                time.sleep(delay + attempt)
                delay = min(delay * 2, 60)
                continue
            raise
        except (TimeoutError, urllib.error.URLError, OSError):
            if attempt < retries - 1:
                time.sleep(delay)
                delay = min(delay * 2, 60)
                continue
            raise


def search_commons(term: str, limit: int = 10) -> list[str]:
    # Prefer bitmaps; exclude PDF noise
    data = api(
        {
            "action": "query",
            "list": "search",
            "srsearch": f"{term} filetype:bitmap",
            "srnamespace": 6,
            "srlimit": limit,
        }
    )
    return [x["title"].removeprefix("File:") for x in data["query"]["search"]]


def info_commons(title: str):
    data = api(
        {
            "action": "query",
            "titles": f"File:{title}",
            "prop": "imageinfo",
            "iiprop": "url|size|mime|thumbmime",
            "iiurlwidth": MAX_EDGE,
        }
    )
    for p in data["query"]["pages"].values():
        if "missing" in p:
            return None
        ii = p.get("imageinfo")
        return ii[0] if ii else None
    return None


def base_name(name: str) -> str:
    return re.sub(r"-\([A-Za-z0-9]+\)$", "", name.strip())


def search_queries(name: str) -> list[str]:
    base = base_name(name)
    qs = [
        f'"{base}"',
        f"{base} mineral",
        f"{base} crystal",
        f"{base} specimen",
    ]
    seen = set()
    out = []
    for q in qs:
        if q not in seen:
            seen.add(q)
            out.append(q)
    return out


def score_title(title: str, name: str) -> int:
    low = title.lower()
    nlow = name.lower()
    base = base_name(name).lower()
    score = 0

    if SKIP_TITLE_RE.search(low):
        return -1000
    if low.endswith(SKIP_EXT):
        return -1000

    compact = re.sub(r"[^a-z0-9]", "", low)
    ncompact = re.sub(r"[^a-z0-9]", "", nlow)
    bcompact = re.sub(r"[^a-z0-9]", "", base)
    if bcompact and bcompact in compact:
        score += 100
    if ncompact and ncompact in compact:
        score += 40

    for kw, pts in (
        ("mineral", 15),
        ("crystal", 20),
        ("specimen", 18),
        ("cluster", 8),
        ("matrix", 5),
        ("geode", 5),
        ("rough", 5),
    ):
        if kw in low:
            score += pts

    for kw, pts in (
        ("jewelry", -25),
        ("jewellery", -25),
        ("necklace", -30),
        ("bracelet", -30),
        ("earring", -30),
        ("bag", -15),
        ("delivered", -20),
    ):
        if kw in low:
            score += pts

    if low.endswith((".jpg", ".jpeg", ".png", ".tif", ".tiff", ".webp")):
        score += 5
    else:
        score -= 80

    return score


def http_get_bytes(url: str, retries: int = 5) -> bytes:
    delay = 2.0
    for attempt in range(retries):
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        try:
            with urllib.request.urlopen(req, context=ctx, timeout=60) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code in (429, 503) and attempt < retries - 1:
                time.sleep(delay + attempt)
                delay = min(delay * 2, 60)
                continue
            raise
        except (TimeoutError, urllib.error.URLError, OSError):
            if attempt < retries - 1:
                time.sleep(delay)
                delay = min(delay * 2, 60)
                continue
            raise


def download_and_resize(url: str, dest: Path) -> None:
    data = http_get_bytes(url)
    img = Image.open(io.BytesIO(data))
    if img.mode != "RGB":
        img = img.convert("RGB")
    w, h = img.size
    if min(w, h) < 80:
        raise ValueError("too small")
    long_edge = max(w, h)
    if long_edge > MAX_EDGE:
        scale = MAX_EDGE / long_edge
        img = img.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    tmp = dest.with_suffix(".tmp.jpg")
    img.save(tmp, "JPEG", quality=JPEG_QUALITY, optimize=True)
    tmp.replace(dest)


def thumb_or_full_url(inf: dict) -> str | None:
    # Prefer pre-scaled thumb from API
    thumb = inf.get("thumburl")
    if thumb:
        return thumb
    return inf.get("url")


def pick_and_download(name: str, slug: str) -> tuple[bool, str | None, str | None]:
    jpg = IMG / f"{slug}.jpg"
    if valid_jpg(jpg):
        return True, None, None

    candidates: list[tuple[int, str]] = []
    seen_titles: set[str] = set()
    errors: list[str] = []

    for q in search_queries(name):
        try:
            titles = search_commons(q, limit=10)
        except Exception as e:
            errors.append(f"search:{q}:{e}")
            time.sleep(1.5)
            continue
        for title in titles:
            if title in seen_titles:
                continue
            seen_titles.add(title)
            sc = score_title(title, name)
            if sc < 80:
                # Require mineral-name match in title for accuracy
                continue
            candidates.append((sc, title))
        if candidates and max(c[0] for c in candidates) >= 100:
            break
        time.sleep(0.15)

    candidates.sort(key=lambda t: -t[0])
    tried = 0
    for sc, title in candidates[:10]:
        tried += 1
        try:
            inf = info_commons(title)
        except Exception as e:
            errors.append(f"info:{title}:{e}")
            time.sleep(1.0)
            continue
        if not inf:
            continue
        mime = inf.get("mime") or ""
        if not mime.startswith("image/") or mime in ("image/svg+xml", "image/gif"):
            continue
        if inf.get("size", 0) < 8000 and not inf.get("thumburl"):
            continue
        url = thumb_or_full_url(inf)
        if not url:
            continue
        try:
            download_and_resize(url, jpg)
            if valid_jpg(jpg):
                return True, title, None
            if jpg.exists():
                jpg.unlink(missing_ok=True)
        except Exception as e:
            errors.append(f"dl:{title}:{e}")
            if jpg.exists() and not valid_jpg(jpg):
                jpg.unlink(missing_ok=True)
            time.sleep(0.8)
            continue

    if not candidates:
        reason = "no_suitable_commons_image"
        if errors:
            reason = f"search_failed:{errors[0]}"
    else:
        reason = f"download_failed_after_{tried}_candidates"
        if errors:
            reason += f":{errors[-1]}"
    return False, None, reason


def update_gems_data() -> tuple[int, int]:
    text = DATA_JS.read_text(encoding="utf-8")
    gems = parse_gems(text)

    def replacer(m: re.Match) -> str:
        old_img = m.group(2)
        slug = Path(old_img).stem
        jpg = IMG / f"{slug}.jpg"
        full = m.group(0)
        if valid_jpg(jpg):
            new_img = f"images/{slug}.jpg"
        else:
            svg = IMG / f"{slug}.svg"
            new_img = f"images/{slug}.svg" if svg.exists() else old_img
        return full.replace(f'img:"{old_img}"', f'img:"{new_img}"', 1)

    new_text, n = re.subn(
        r'\{name:"([^"]+)"[\s\S]*?img:"([^"]+)"',
        replacer,
        text,
    )
    if n != len(gems):
        log(f"WARNING: replaced {n} img fields vs {len(gems)} gems")
    DATA_JS.write_text(new_text, encoding="utf-8")
    gems2 = parse_gems(new_text)
    jpg_n = sum(1 for g in gems2 if g["img"].lower().endswith((".jpg", ".jpeg")))
    svg_n = sum(1 for g in gems2 if g["img"].lower().endswith(".svg"))
    return jpg_n, svg_n


def load_sources() -> dict:
    if SOURCES.exists():
        return json.loads(SOURCES.read_text(encoding="utf-8"))
    return {}


def save_sources(sources: dict) -> None:
    SOURCES.write_text(json.dumps(sources, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--workers", type=int, default=2)
    ap.add_argument("--update-only", action="store_true")
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--only-slug", type=str, default="")
    ap.add_argument("--retry-failures", action="store_true", help="Only retry slugs in failure log")
    args = ap.parse_args()

    text = DATA_JS.read_text(encoding="utf-8")
    gems = parse_gems(text)
    log(f"Parsed {len(gems)} gems from gems-data.js")

    before_jpg = sum(1 for g in gems if g["img"].lower().endswith((".jpg", ".jpeg")))
    before_svg = sum(1 for g in gems if g["img"].lower().endswith(".svg"))
    log(f"BEFORE refs: JPG={before_jpg} SVG={before_svg}")

    need = []
    already = 0
    for g in gems:
        jpg = IMG / f'{g["slug"]}.jpg'
        if valid_jpg(jpg):
            already += 1
        else:
            need.append(g)

    if args.retry_failures and FAIL_LOG.exists():
        fail_slugs = set(json.loads(FAIL_LOG.read_text()).keys())
        need = [g for g in gems if g["slug"] in fail_slugs and not valid_jpg(IMG / f'{g["slug"]}.jpg')]

    if args.only_slug:
        need = [g for g in gems if g["slug"] == args.only_slug]
    if args.limit:
        need = need[: args.limit]

    log(f"Already have valid JPG on disk: {already}")
    log(f"Need download: {len(need)}")

    sources = load_sources()
    failures: dict[str, str] = {}
    if FAIL_LOG.exists() and not args.retry_failures:
        try:
            failures = json.loads(FAIL_LOG.read_text())
        except Exception:
            failures = {}

    downloaded = 0
    failed = 0

    if not args.update_only and need:
        workers = max(1, min(args.workers, 3))
        log(f"Fetching with {workers} workers…")

        def work(g: dict):
            ok, title, reason = pick_and_download(g["name"], g["slug"])
            return g, ok, title, reason

        done = 0
        with ThreadPoolExecutor(max_workers=workers) as ex:
            futs = [ex.submit(work, g) for g in need]
            for fut in as_completed(futs):
                g, ok, title, reason = fut.result()
                done += 1
                if ok:
                    downloaded += 1
                    failures.pop(g["slug"], None)
                    if title:
                        with _sources_lock:
                            sources[g["slug"]] = title
                    log(f"[{done}/{len(need)}] OK  {g['name']} ← {title or '(existing)'}")
                else:
                    failed += 1
                    failures[g["slug"]] = reason or "unknown"
                    log(f"[{done}/{len(need)}] FAIL {g['name']}: {reason}")
                if done % 20 == 0:
                    with _sources_lock:
                        save_sources(sources)
                    FAIL_LOG.write_text(
                        json.dumps(failures, indent=2, ensure_ascii=False) + "\n",
                        encoding="utf-8",
                    )

        save_sources(sources)
        FAIL_LOG.write_text(json.dumps(failures, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        log(f"Wrote failure log: {FAIL_LOG} ({len(failures)} entries)")

    after_jpg, after_svg = update_gems_data()
    gems2 = parse_gems(DATA_JS.read_text(encoding="utf-8"))
    missing = [g["img"] for g in gems2 if not (ROOT / g["img"]).exists()]

    log("")
    log("=== SUMMARY ===")
    log(f"Before refs: JPG={before_jpg} SVG={before_svg}")
    log(f"After refs:  JPG={after_jpg} SVG={after_svg}")
    log(f"Newly downloaded this run: {downloaded}")
    log(f"Failed this run: {failed}")
    log(f"Missing image files (404): {len(missing)}")
    if after_svg:
        still = [g["name"] for g in gems2 if g["img"].endswith(".svg")]
        log(f"Still SVG ({len(still)}): {', '.join(still[:50])}{'…' if len(still) > 50 else ''}")


if __name__ == "__main__":
    main()
