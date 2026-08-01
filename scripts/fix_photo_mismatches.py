#!/usr/bin/env python3
"""Force re-download Commons photos for known/flagged mismatches.

Deletes existing JPGs for listed slugs, then searches with stricter queries
requiring the mineral name in the Commons title. Updates PHOTO_SOURCES.json.
"""
from __future__ import annotations

import re
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import fetch_all_gem_photos as m  # noqa: E402
from retry_leftover_photos import (  # noqa: E402
    name_in_title,
    try_download_title,
    wikidata_image,
    base_name,
    norm,
)

# High-confidence wrong / weak photos to replace this session.
FORCE_SLUGS = [
    # Prior session + remaining live accuracy problems
    "sapphire",       # Logan sapphire jewelry mount — prefer unset crystal
    "natron",         # currently Natrolite photo (wrong species)
    "pascoite",       # crystallographic diagram PNG
    "huemulite",      # crystal drawing
    "tongbaite",      # crystallographic alignment PNG
    "urusovite",      # unit-cell 3D model
    "szenicsite",     # crystal drawing
    "alum-na",        # identical image reused with Alum-(K)
    "jade",           # fibrous amphibole stock; prefer clear jadeite/nephrite
    "nephrite",
    "willemite",
    "sardonyx",
    "ikaite",
    "fayalite",
    "gibbsite",
    "apjohnite",
    "artroeite",
    "goshenite",
    "schorl",
    "abswurmbachite",
    "copiapite",
    "diamond",
    "topaz",          # cut stone OK but refresh if jewelry-adjacent
]


def strict_queries(name: str) -> list[str]:
    b = base_name(name)
    return [
        f'"{b}" mineral crystal -jewelry -jewellery -necklace -ring -bracelet',
        f'"{b}" mineral specimen -jewelry',
        f'"{b}" crystal -jewelry',
        f'"{b}" mineral',
        f"{b} mineral crystal",
    ]


def search_strict(name: str, limit_per: int = 12) -> list[tuple[int, str]]:
    cands: list[tuple[int, str]] = []
    seen: set[str] = set()
    for q in strict_queries(name):
        try:
            titles = m.search_commons(q, limit=limit_per)
        except Exception as e:
            print(f"  search err {q}: {e}", flush=True)
            time.sleep(1)
            continue
        for t in titles:
            if t in seen:
                continue
            seen.add(t)
            if m.SKIP_TITLE_RE.search(t) or t.lower().endswith(m.SKIP_EXT):
                continue
            low = t.lower()
            if any(x in low for x in ("jewelry", "jewellery", "necklace", "bracelet", "earring", " ring", "pendant", "museum", "cup ", "carving")):
                continue
            if not name_in_title(name, t):
                # Allow known mineral synonyms in title for varieties
                syn = {
                    "sardonyx": ["sardonyx", "onyx", "agate"],
                    "nephrite": ["nephrite", "jade"],
                    "jade": ["jade", "jadeite", "nephrite"],
                    "goshenite": ["goshenite", "beryl"],
                    "schorl": ["schorl", "tourmaline"],
                    "ikaite": ["ikaite", "glendonite"],
                    "diamond": ["diamond", "diamant"],
                    "sapphire": ["sapphire", "corundum"],
                    "natron": ["natron", "soda"],
                    "copiapite": ["copiapite"],
                    "willemite": ["willemite"],
                    "alum-na": ["alum", "sodium alum", "sodium aluminium sulfate"],
                    "pascoite": ["pascoite"],
                    "huemulite": ["huemulite"],
                    "tongbaite": ["tongbaite"],
                    "urusovite": ["urusovite"],
                    "szenicsite": ["szenicsite"],
                    "topaz": ["topaz"],
                }.get(norm(base_name(name)), [])
                tnorm = norm(t)
                if not any(s in tnorm for s in syn if len(s) >= 4):
                    continue
            sc = m.score_title(t, name)
            if sc < 40:
                sc = 85
            # Prefer titles that literally contain the mineral name
            if name_in_title(name, t):
                sc += 30
            cands.append((sc, t))
        if cands and max(c[0] for c in cands) >= 120:
            break
        time.sleep(0.2)
    cands.sort(key=lambda x: -x[0])
    return cands


def main() -> None:
    gems = {g["slug"]: g for g in m.parse_gems(m.DATA_JS.read_text())}
    sources = m.load_sources()
    ok = fail = 0
    results = []

    for slug in FORCE_SLUGS:
        g = gems.get(slug)
        if not g:
            print(f"SKIP unknown slug {slug}", flush=True)
            continue
        name = g["name"]
        jpg = m.IMG / f"{slug}.jpg"
        old = sources.get(slug, "(none)")
        print(f"\n=== {name} ({slug}) was ← {old}", flush=True)

        # Remove existing so pick doesn't short-circuit
        if jpg.exists():
            jpg.unlink()

        got_title = None

        # 1) Wikidata P18 if name matches
        try:
            wd = wikidata_image(name)
        except Exception as e:
            wd = None
            print(f"  WD err: {e}", flush=True)
        if wd and (name_in_title(name, wd) or slug == "ikaite" and "glendonite" in norm(wd)):
            if try_download_title(wd, slug):
                got_title = wd
                print(f"  OK WD ← {wd}", flush=True)

        # 2) Strict Commons search
        if not got_title:
            for sc, t in search_strict(name)[:15]:
                # Avoid reusing the same bad title
                if t == old:
                    continue
                if try_download_title(t, slug):
                    got_title = t
                    print(f"  OK CM ({sc}) ← {t}", flush=True)
                    break
                time.sleep(0.3)

        if got_title and m.valid_jpg(jpg):
            sources[slug] = got_title
            ok += 1
            results.append((name, old, got_title, "ok"))
        else:
            fail += 1
            results.append((name, old, None, "fail"))
            print(f"  FAIL {name}", flush=True)
            # If we wiped the file and failed, try restoring via old title once
            if old and old != "(none)" and not old.startswith("("):
                if try_download_title(old, slug):
                    sources[slug] = old
                    print(f"  restored previous ← {old}", flush=True)

        m.save_sources(sources)
        time.sleep(0.4)

    m.save_sources(sources)
    jpg_n, svg_n = m.update_gems_data()
    print("\n=== SUMMARY ===", flush=True)
    print(f"Replaced OK={ok} FAIL={fail}", flush=True)
    print(f"Catalog refs JPG={jpg_n} SVG={svg_n}", flush=True)
    for name, old, new, st in results:
        print(f"  [{st}] {name}: {old} → {new}", flush=True)


if __name__ == "__main__":
    main()
