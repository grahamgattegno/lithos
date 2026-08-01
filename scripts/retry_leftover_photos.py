#!/usr/bin/env python3
"""Second-pass recovery: exact Wikidata P18 + stem-matched Commons only."""
from __future__ import annotations

import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import fetch_all_gem_photos as m  # noqa: E402

UA = m.UA
ctx = m.ctx
FAIL = Path("scripts/photo_fetch_failures.json")


def wd_api(params, retries=5):
    q = urllib.parse.urlencode({**params, "format": "json"})
    url = f"https://www.wikidata.org/w/api.php?{q}"
    delay = 2
    for attempt in range(retries):
        time.sleep(0.2)
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        try:
            with urllib.request.urlopen(req, context=ctx, timeout=25) as r:
                return json.load(r)
        except Exception:
            if attempt == retries - 1:
                raise
            time.sleep(delay)
            delay = min(delay * 2, 40)


def base_name(name: str) -> str:
    return re.sub(r"-\([A-Za-z0-9]+\)$", "", name.strip())


def norm(s: str) -> str:
    s = s.lower().replace("á", "a").replace("é", "e").replace("í", "i")
    s = s.replace("ó", "o").replace("ú", "u").replace("ñ", "n").replace("ü", "u")
    return re.sub(r"[^a-z0-9]+", "", s)


def name_in_title(name: str, title: str) -> bool:
    """True if mineral name (or close stem) appears in Commons filename."""
    b = norm(base_name(name))
    t = norm(title)
    if not b or len(b) < 4:
        return False
    if b in t:
        return True
    # Allow truncated final vowel (Cohenit/Cohenite, Baileyclor/Baileychlore)
    if len(b) >= 6 and b[:-1] in t:
        return True
    return False


def wikidata_image(name: str) -> str | None:
    """Return P18 Commons filename only for exact (normalized) mineral item."""
    data = wd_api(
        {
            "action": "wbsearchentities",
            "search": name,
            "language": "en",
            "type": "item",
            "limit": 8,
        }
    )
    target = norm(base_name(name))
    for ent in data.get("search", []):
        qid = ent["id"]
        ent_data = wd_api(
            {
                "action": "wbgetentities",
                "ids": qid,
                "props": "claims|labels|aliases",
                "languages": "en",
            }
        )
        entity = ent_data["entities"].get(qid, {})
        elabel = (entity.get("labels", {}).get("en", {}) or {}).get("value", "")
        aliases = [a.get("value", "") for a in entity.get("aliases", {}).get("en", [])]
        names = {norm(elabel), *(norm(a) for a in aliases), norm(ent.get("label") or "")}
        if target not in names:
            continue
        claims = entity.get("claims", {})
        if "P18" not in claims:
            return None
        for cl in claims["P18"]:
            try:
                fn = cl["mainsnak"]["datavalue"]["value"]
            except Exception:
                continue
            # Prefer images whose filename mentions the mineral
            if name_in_title(name, fn):
                return fn
            # Also accept if not an obvious skip (diagram etc.) — but only if
            # filename is short / starts with mineral-ish; otherwise skip
            if not m.SKIP_TITLE_RE.search(fn) and not fn.lower().endswith(m.SKIP_EXT):
                # Require at least 4-char stem overlap somewhere
                if name_in_title(name, fn) or len(fn) < 40:
                    # Short generic names like "X.jpg" are risky — require stem
                    if name_in_title(name, fn):
                        return fn
        return None
    return None


def loose_commons(name: str) -> list[tuple[int, str]]:
    cands = []
    seen = set()
    for q in [f'"{base_name(name)}"', f"{base_name(name)} mineral", base_name(name)]:
        try:
            data = m.api(
                {
                    "action": "query",
                    "list": "search",
                    "srsearch": q,
                    "srnamespace": 6,
                    "srlimit": 15,
                }
            )
            titles = [x["title"].removeprefix("File:") for x in data["query"]["search"]]
        except Exception:
            continue
        for t in titles:
            if t in seen:
                continue
            seen.add(t)
            if m.SKIP_TITLE_RE.search(t) or t.lower().endswith(m.SKIP_EXT):
                continue
            if not name_in_title(name, t):
                continue
            sc = m.score_title(t, name)
            if sc < 50:
                sc = 90  # name-in-title is enough for rare minerals
            cands.append((sc, t))
        if cands:
            break
    cands.sort(key=lambda x: -x[0])
    return cands


def try_download_title(title: str, slug: str) -> bool:
    try:
        inf = m.info_commons(title)
    except Exception:
        return False
    if not inf:
        return False
    mime = inf.get("mime") or ""
    if not mime.startswith("image/") or mime in ("image/svg+xml", "image/gif"):
        return False
    url = m.thumb_or_full_url(inf)
    if not url:
        return False
    jpg = m.IMG / f"{slug}.jpg"
    try:
        m.download_and_resize(url, jpg)
        return m.valid_jpg(jpg)
    except Exception:
        if jpg.exists() and not m.valid_jpg(jpg):
            jpg.unlink(missing_ok=True)
        return False


def main() -> None:
    gems_list = m.parse_gems(m.DATA_JS.read_text())
    gems = {g["slug"]: g for g in gems_list}
    need = [g for g in gems_list if not m.valid_jpg(m.IMG / f'{g["slug"]}.jpg')]
    sources = m.load_sources()
    print(f"Retrying {len(need)} leftovers (exact-match only)…", flush=True)

    ok_n = fail_n = 0
    remaining: dict[str, str] = {}

    for i, g in enumerate(need, 1):
        slug, name = g["slug"], g["name"]
        got = False

        title = None
        try:
            title = wikidata_image(name)
        except Exception as e:
            print(f"[{i}/{len(need)}] WD err {name}: {e}", flush=True)

        if title and name_in_title(name, title):
            if try_download_title(title, slug):
                sources[slug] = title
                ok_n += 1
                got = True
                print(f"[{i}/{len(need)}] OK WD  {name} ← {title}", flush=True)

        if not got:
            for sc, t in loose_commons(name)[:10]:
                if try_download_title(t, slug):
                    sources[slug] = t
                    ok_n += 1
                    got = True
                    print(f"[{i}/{len(need)}] OK CM  {name} ← {t}", flush=True)
                    break

        if not got:
            fail_n += 1
            remaining[slug] = "no_usable_commons_or_wikidata_photo"
            print(f"[{i}/{len(need)}] FAIL {name}", flush=True)

        if i % 15 == 0:
            m.save_sources(sources)
            FAIL.write_text(json.dumps(remaining, indent=2, ensure_ascii=False) + "\n")

    m.save_sources(sources)
    FAIL.write_text(json.dumps(remaining, indent=2, ensure_ascii=False) + "\n")
    jpg_n, svg_n = m.update_gems_data()
    print("=== RETRY SUMMARY ===", flush=True)
    print(f"Newly recovered: {ok_n}  Still failed: {fail_n}", flush=True)
    print(f"After refs JPG={jpg_n} SVG={svg_n}", flush=True)
    if remaining:
        names = [gems[s]["name"] for s in remaining if s in gems]
        print(f"Leftovers ({len(names)}): {', '.join(names)}", flush=True)


if __name__ == "__main__":
    main()
