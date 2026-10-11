#!/usr/bin/env python3
"""Re-fetch Commons photos for kind=gem entries with wrong/jewelry/placeholder sources.

Targets the 199 default-catalog gemstones (activeFilter=Gemstones). Uses strict
name-in-title matching and curated fallbacks for tricky varieties (pearl, coral,
star gems). Updates images/*.jpg, PHOTO_SOURCES.json, and gems-data.js paths.

Usage:
  python3 scripts/fix_visible_gem_photos.py
  python3 scripts/fix_visible_gem_photos.py --slug pearl
"""
from __future__ import annotations

import argparse
import re
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import fetch_all_gem_photos as m  # noqa: E402
from fix_photo_mismatches import search_strict  # noqa: E402
from retry_leftover_photos import (  # noqa: E402
    base_name,
    name_in_title,
    norm,
    try_download_title,
    wikidata_image,
)

# Slugs flagged by jewelry/cut-stone/wrong-mineral heuristics.
FLAGGED_SLUGS = [
    "moissanite",
    "pearl",
    "alexandrite",
    "zircon",
    "rhodonite",
    "ametrine",
    "coral",
    "hackmanite",
    "black-opal",
    "star-sapphire",
    "star-ruby",
    "cats-eye",
    "obsidian",  # Snowflake Obsidian shares this slug
]

# Hand-picked Commons titles when search is noisy (ships, flowers, wrong species).
CURATED: dict[str, list[str]] = {
    "pearl": ["Pinctada margaritifera MHNT.CON.2002.893.jpg"],
    "coral": ["Corallium rubrum (Linnaeus, 1758) 11.jpg"],
    "star-sapphire": [
        "World's 3rd Largest Star Sapphire with Asterism Star of Maharlika 02.jpg",
    ],
    "star-ruby": [
        "2009 04 19 - 4700 - Washington DC - Natural History Museum - Rosser Reeves Ruby (3526704403).jpg",
    ],
    "black-opal": [
        "Precious opal (Lightning Ridge, New South Wales, Australia) 3 (29801544831).jpg",
    ],
    "ametrine": ["Amétrine 300-4-6418.JPG"],
    "cats-eye": ["Chrysoberyl (GeoDIL number - 38).jpg"],
    "obsidian": ["Snowflake obsidian - Utah.jpg"],
}

BAD_TITLE = re.compile(
    r"ship|imo |synthetic|carborundum|pearls\.jpg|rhododendron|diopside cabochon|"
    r"mineral 7|quartz-114|erythrina|crystal river|faceted|tumble|gem_grade|"
    r"delong star|polished bohouskovice|crystal coral rock|restaurant|noodle",
    re.I,
)

SYNONYMS: dict[str, list[str]] = {
    "Pearl": ["pearl", "nacre", "pinctada", "oyster"],
    "Coral": ["corallium", "coral"],
    "Star Sapphire": ["star sapphire", "sapphire"],
    "Star Ruby": ["star ruby", "ruby"],
    "Black Opal": ["black opal", "lightning ridge", "precious opal"],
    "Ametrine": ["ametrine", "amétrine"],
    "Cat's Eye": ["chrysoberyl", "cymophane", "cat eye", "cats eye"],
    "Snowflake Obsidian": ["snowflake obsidian", "obsidian"],
}


def title_ok(name: str, title: str) -> bool:
    if BAD_TITLE.search(title):
        return False
    syns = SYNONYMS.get(name, [norm(base_name(name))])
    tnorm = norm(title)
    return any(len(s) >= 4 and s in tnorm for s in syns)


def fix_slug(g: dict, sources: dict) -> tuple[bool, str | None]:
    slug, name = g["slug"], g["name"]
    jpg = m.IMG / f"{slug}.jpg"
    old = sources.get(slug, "(none)")
    print(f"\n=== {name} ({slug}) was ← {old}", flush=True)

    if jpg.exists():
        jpg.unlink()

    got: str | None = None

    for title in CURATED.get(slug, []):
        if try_download_title(title, slug):
            got = title
            print(f"  OK curated ← {title}", flush=True)
            break

    if not got:
        try:
            wd = wikidata_image(name)
        except Exception as e:
            wd = None
            print(f"  WD err: {e}", flush=True)
        if wd and title_ok(name, wd) and try_download_title(wd, slug):
            got = wd
            print(f"  OK WD ← {wd}", flush=True)

    if not got:
        for sc, t in search_strict(name)[:20]:
            if t == old or not title_ok(name, t):
                continue
            if try_download_title(t, slug):
                got = t
                print(f"  OK CM ({sc}) ← {t}", flush=True)
                break
            time.sleep(0.25)

    if got and m.valid_jpg(jpg):
        sources[slug] = got
        return True, got

    if old and old != "(none)":
        if try_download_title(old, slug):
            sources[slug] = old
            print(f"  restored ← {old}", flush=True)
    print(f"  FAIL {name}", flush=True)
    return False, None


def parse_gem_slugs(text: str) -> list[dict]:
    out = []
    for m in re.finditer(
        r'\{name:"([^"]+)",kind:"gem"[^}]*?img:"([^"]+)"',
        text,
    ):
        out.append({"name": m.group(1), "img": m.group(2), "slug": Path(m.group(2)).stem})
    return out


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug", default="", help="Fix one slug only")
    args = ap.parse_args()

    text = m.DATA_JS.read_text(encoding="utf-8")
    gems = {g["slug"]: g for g in parse_gem_slugs(text)}
    slugs = [args.slug] if args.slug else FLAGGED_SLUGS

    sources = m.load_sources()
    ok = fail = 0
    for slug in slugs:
        g = gems.get(slug)
        if not g:
            print(f"SKIP unknown gem slug {slug}", flush=True)
            continue
        if fix_slug(g, sources):
            ok += 1
        else:
            fail += 1
        m.save_sources(sources)
        time.sleep(0.3)

    m.update_gems_data()
    gem_svgs = sum(
        1 for g in parse_gem_slugs(m.DATA_JS.read_text()) if g["img"].endswith(".svg")
    )
    print(f"\nDone. ok={ok} fail={fail}. kind=gem SVG placeholders: {gem_svgs}", flush=True)


if __name__ == "__main__":
    main()
