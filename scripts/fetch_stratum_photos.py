#!/usr/bin/env python3
"""Fetch Stratum artifact photos from Wikimedia Commons (search + download)."""
from __future__ import annotations

import json
import re
import ssl
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
IMG = ROOT / "images" / "stratum"
DATA = ROOT / "stratum-data.js"
SOURCES = IMG / "PHOTO_SOURCES.json"
FAILURES = ROOT / "scripts" / "stratum_photo_failures.json"
UA = "StratumArchCatalog/1.0 (educational; lithos)"
CTX = ssl.create_default_context()
MAX_EDGE = 900
API_SLEEP = 2.0
DL_SLEEP = 0.8

# Best search query per slug
QUERIES: dict[str, str] = {
    "tyrannosaurus-femur": "Tyrannosaurus rex fossil bone",
    "triceratops-skull-frill": "Triceratops skull fossil",
    "mammoth-tusk": "woolly mammoth tusk",
    "neanderthal-skull-cap": "Neanderthal skull fossil",
    "homo-sapiens-cranium": "Homo sapiens skull fossil",
    "australopithecus-jaw": "Australopithecus afarensis fossil",
    "saber-tooth-cat-skull": "Smilodon skull fossil",
    "giant-ground-sloth-claw": "Megatherium fossil",
    "pterosaur-wing-bone": "Pterosaur fossil",
    "ichthyosaur-vertebra": "Ichthyosaur fossil",
    "trilobite": "trilobite fossil",
    "ammonite": "ammonite fossil",
    "dinosaur-egg-shell": "dinosaur egg fossil",
    "megladon-tooth": "megalodon tooth fossil",
    "crinoid-stem": "crinoid fossil",
    "fossil-fish": "Knightia fossil fish",
    "mosasaur-jaw": "mosasaur fossil skull",
    "pleistocene-cave-bear-skull": "cave bear skull fossil",
    "atlatl-spear-point": "Clovis point arrowhead",
    "hand-axe-acheulean": "Acheulean hand axe",
    "neolithic-flint-blade": "Neolithic flint tool",
    "bronze-age-axe-head": "Bronze Age axe",
    "iron-age-sword": "Iron Age sword",
    "roman-gladius": "Roman gladius",
    "egyptian-canopic-jar": "Egyptian canopic jar",
    "mummy-cartonnage-mask": "Egyptian mummy mask",
    "sarcophagus-fragment": "Egyptian sarcophagus",
    "shabti-figurine": "Egyptian shabti",
    "greek-red-figure-vase": "red-figure Greek vase",
    "roman-amphora": "Roman amphora",
    "minoan-octopus-jar": "Minoan octopus vase",
    "chinese-bronze-ding": "Shang bronze ding",
    "oracle-bone": "oracle bone Shang",
    "cuneiform-tablet": "cuneiform tablet clay",
    "rosetta-stone-cast": "Rosetta Stone",
    "aztec-sun-stone": "Aztec sun stone",
    "mayan-stela": "Maya stela Copan",
    "olmec-colossal-head": "Olmec colossal head",
    "moai-fragment": "moai Easter Island",
    "stonehenge-bluestone": "Stonehenge",
    "venus-of-willendorf": "Venus of Willendorf",
    "cave-painting-panel": "Lascaux cave painting",
    "petroglyph-boulder": "petroglyph rock art",
    "terracotta-warrior": "Terracotta Army warrior",
    "viking-ship-rivet": "Viking ship Oseberg",
    "anglo-saxon-helmet": "Sutton Hoo helmet",
    "byzantine-mosaic-tessera": "Byzantine mosaic Ravenna",
    "islamic-glass-bottle": "Islamic glass bottle museum",
    "indus-seal": "Indus valley seal",
    "phoenician-glass-bead": "ancient glass beads",
    "roman-coin-hoard": "Roman silver coins",
    "celtic-torc": "Celtic gold torc",
    "inca-quipu": "Inca quipu khipu",
    "maori-patu": "Maori greenstone mere",
    "aboriginal-grinding-stone": "Aboriginal grinding stone",
    "pueblo-pottery-jar": "Anasazi pottery",
    "hopewell-platform-pipe": "Hopewell platform pipe",
    "j-mon-pottery": "Jomon pottery",
    "ban-chiang-pottery": "Ban Chiang pottery",
    "samian-ware-bowl": "samian ware terra sigillata",
    "medieval-illuminated-fragment": "illuminated manuscript medieval",
    "piltdown-skull-hoax-cast": "Piltdown man skull",
    "lucy-a-l-288-1-cast": "Lucy Australopithecus fossil",
    "tzi-the-iceman-replica-kit": "Otzi iceman mummy",
    "bog-body-hand": "Tollund Man bog body",
    "chinchorro-mummy": "Chinchorro mummy",
    "dead-sea-scroll-jar": "Dead Sea Scrolls jar",
    "pompeii-carbonized-bread": "Pompeii bread carbonized",
    "antikythera-mechanism-gear": "Antikythera mechanism",
    "lewis-chessmen": "Lewis chessmen",
    "rapa-nui-birdman-tablet": "rongorongo tablet",
    "hittite-cuneiform-tablet": "Hittite cuneiform tablet",
    "sumerian-ziggurat-brick": "Ziggurat of Ur",
    "parthenon-marble-fragment": "Parthenon frieze marble",
    "colosseum-keystone": "Colosseum Rome",
    "great-wall-beacon-tower-brick": "Great Wall of China",
    "machu-picchu-tool-stone": "Machu Picchu stone",
    "acropolis-owl-tetradrachm": "Athenian owl tetradrachm coin",
    "scarab-seal": "Egyptian scarab amulet",
    "khmer-sandstone-apsara": "Angkor Wat apsara",
    "persian-royal-road-post-stone": "Persepolis relief",
    "nok-terracotta-head": "Nok terracotta head",
    "great-zimbabwe-wall-stone": "Great Zimbabwe ruins",
    "moche-stirrup-spout-vessel": "Moche portrait vessel",
    "uruk-beveled-rim-bowl": "Uruk beveled rim bowl",
}

SKIP_TITLE = re.compile(
    r"(diagram|map of|logo|flag|coat of arms|icon|svg|chart|graph|"
    r"location map|distribution|photo montage|collage|comparison chart)",
    re.I,
)


def slugify(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def api(params: dict, retries: int = 4) -> dict:
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(params)
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, context=CTX, timeout=90) as r:
                return json.loads(r.read().decode())
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < retries - 1:
                time.sleep(5 * (attempt + 1))
                continue
            raise
    raise RuntimeError("api failed")


def search_file(query: str) -> str | None:
    data = api(
        {
            "action": "query",
            "format": "json",
            "generator": "search",
            "gsrnamespace": 6,
            "gsrsearch": query,
            "gsrlimit": 12,
            "prop": "imageinfo",
            "iiprop": "url|mime|size",
            "iiurlwidth": MAX_EDGE,
        }
    )
    pages = data.get("query", {}).get("pages", {})
    best = None
    best_size = 0
    for p in pages.values():
        title = p.get("title", "").replace("File:", "")
        if SKIP_TITLE.search(title):
            continue
        ii = (p.get("imageinfo") or [{}])[0]
        mime = ii.get("mime", "")
        if mime not in ("image/jpeg", "image/png", "image/webp"):
            continue
        size = ii.get("size", 0)
        if size > best_size and size >= 12000:
            best_size = size
            best = title
    return best


def download_title(title: str, dest: Path) -> Path | None:
    fn = title.replace(" ", "_")
    url = f"https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(
        {"action": "query", "format": "json", "titles": f"File:{title}", "prop": "imageinfo", "iiprop": "url", "iiurlwidth": MAX_EDGE}
    )
    img_url = None
    try:
        data = api(
            {
                "action": "query",
                "format": "json",
                "titles": f"File:{title}",
                "prop": "imageinfo",
                "iiprop": "url",
                "iiurlwidth": MAX_EDGE,
            }
        )
        page = next(iter(data.get("query", {}).get("pages", {}).values()), {})
        ii = (page.get("imageinfo") or [{}])[0]
        img_url = ii.get("thumburl") or ii.get("url")
    except Exception:
        img_url = None
    if not img_url:
        img_url = f"https://commons.wikimedia.org/wiki/Special:FilePath/{urllib.parse.quote(fn)}?width={MAX_EDGE}"
    req = urllib.request.Request(img_url, headers={"User-Agent": UA})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, context=CTX, timeout=120) as r:
                raw = r.read()
            break
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < 3:
                time.sleep(6 * (attempt + 1))
                continue
            return None
        except Exception:
            return None
    else:
        return None
    if len(raw) < 4000:
        return None
    dest.parent.mkdir(parents=True, exist_ok=True)
    ext = ".png" if raw[:8] == b"\x89PNG\r\n\x1a\n" else ".jpg"
    out = dest.with_suffix(ext)
    out.write_bytes(raw)
    return out if out.stat().st_size >= 4000 else None


def parse_artifacts(text: str) -> list[str]:
    return [m.group(1) for m in re.finditer(r'name:"([^"]+)"', text)]


def patch_data_js(text: str, img_map: dict[str, str]) -> str:
    def repl(m):
        name, img = m.group(1), m.group(2)
        slug = slugify(name)
        if slug not in img_map:
            return m.group(0)
        return m.group(0).replace(f'img:"{img}"', f'img:"{img_map[slug]}"', 1)

    return re.sub(r'\{name:"([^"]+)"[\s\S]*?img:"([^"]*)"', repl, text)


def patch_from_disk() -> dict[str, str]:
    img_map: dict[str, str] = {}
    for p in IMG.glob("*.*"):
        if p.suffix.lower() not in (".jpg", ".jpeg", ".png", ".webp"):
            continue
        if p.name.startswith("PHOTO"):
            continue
        if p.stat().st_size >= 4000:
            img_map[p.stem] = f"images/stratum/{p.name}"
    return img_map


def main():
    import sys

    if "--patch-only" in sys.argv:
        text = DATA.read_text(encoding="utf-8")
        img_map = patch_from_disk()
        DATA.write_text(patch_data_js(text, img_map), encoding="utf-8")
        print(f"Patched {len(img_map)} img paths into stratum-data.js")
        return

    only_fail = "--retry-failures" in sys.argv
    text = DATA.read_text(encoding="utf-8")
    names = parse_artifacts(text)
    img_map: dict[str, str] = patch_from_disk()
    sources: dict[str, str] = {}
    if SOURCES.exists():
        sources = json.loads(SOURCES.read_text())

    fail_list = json.loads(FAILURES.read_text()) if only_fail and FAILURES.exists() else []
    failures: list[str] = []

    for i, name in enumerate(names, 1):
        slug = slugify(name)
        if slug in img_map and img_map[slug]:
            print(f"[{i}/{len(names)}] keep {slug}")
            continue
        if only_fail and slug not in fail_list:
            continue

        query = QUERIES.get(slug, name)
        print(f"[{i}/{len(names)}] search: {query}")
        time.sleep(API_SLEEP)
        try:
            title = search_file(f"filetype:bitmap {query}")
        except Exception as e:
            print(f"  search error: {e}")
            title = None
        if not title:
            failures.append(slug)
            print(f"  FAIL no result")
            continue
        time.sleep(DL_SLEEP)
        out = download_title(title, IMG / f"{slug}.jpg")
        if out:
            img_map[slug] = f"images/stratum/{out.name}"
            sources[slug] = title
            print(f"  OK <- {title}")
        else:
            failures.append(slug)
            print(f"  FAIL download {title}")

    DATA.write_text(patch_data_js(text, img_map), encoding="utf-8")
    SOURCES.write_text(json.dumps(sources, indent=2), encoding="utf-8")
    FAILURES.write_text(json.dumps(failures, indent=2), encoding="utf-8")
    print(f"\nDone: {len(img_map)}/{len(names)} with photos, {len(failures)} still missing")


if __name__ == "__main__":
    main()
