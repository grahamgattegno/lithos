#!/usr/bin/env python3
"""Fix inaccurate / missing photos in field-catalog Q4 (~idx 900–1200).

- Force-replace known wrong JPGs (name-not-matching specimen)
- Recover SVG leftovers via Wikidata P18 (exact mineral) + name-stem Commons
- Record sources in images/PHOTO_SOURCES.json and refresh gems-data.js img paths

Usage:
  python3 scripts/fix_q4_catalog_photos.py
  python3 scripts/fix_q4_catalog_photos.py --force-only
  python3 scripts/fix_q4_catalog_photos.py --svg-only
"""
from __future__ import annotations

import argparse
import re
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import fetch_all_gem_photos as m  # noqa: E402
from retry_leftover_photos import (  # noqa: E402
    base_name,
    loose_commons,
    name_in_title,
    norm,
    try_download_title,
    wd_api,
)

# Definitely wrong / untrusted local JPGs in late field catalog (visual audit).
FORCE_SLUGS = [
    "rhodolite",  # metallic ore, not pink-purple garnet
    "selenite",  # orange needles, not gypsum selenite
    "clinochlore",  # teal hexagonal (apatite-like), not chlorite
    "baileychlore",  # pale blue crust, not green chlorite-group
    "londonite",  # wrong multi-mineral assemblage
    "rhodizite",  # scheelite-like yellow; replace with WD specimen
    "fluor-uvite",  # black schorl-like; prefer uvite brown
    "fontarnauite",  # untrusted; WD has Fontarnauita.jpg
    "hessonite",  # OK-ish but missing source — pin to WD/Commons
    "dravite",
    "liddicoatite",
    "heulandite",
]

# Hand-picked Commons titles when search/WD title stems are awkward.
CURATED: dict[str, list[str]] = {
    "rhodolite": [
        "Rhodolite (GeoDIL number - 2752).jpg",
        "Rhodolite (GeoDIL number - 2733).jpg",
    ],
    "selenite": [
        "Gypse Caresse.jpg",
        "Gypsum crystals.jpg",
        "NM Gypsum Selenite Cluster.jpg",
    ],
    "clinochlore": [
        "Clinochlore, quartzite and calcite 01.jpg",
        "Clinochlore. Stubachtal, Totenköpfe, Austria-9206.jpg",
        "Iziko Mineral Clinochlore.JPG",
    ],
    "baileychlore": [
        "Baileyclor i fraipontita de Prullans.png",
        "Baileyclor.jpg",
    ],
    "londonite": [
        "Londonite-67794.jpg",
        "Londonite-54304.jpg",
        "Londonite-44405.jpg",
    ],
    "rhodizite": [
        "Rhodizite-27526.jpg",
        "Rhodizite.JPG",
        "Rhodizite 1.JPG",
    ],
    "fluor-uvite": [
        "Red brown crystal cluster of Uvite.jpg",
        "Uvite-155037.jpg",
        "Uvite-Quartz-64332.jpg",
    ],
    "fontarnauite": [
        "Fontarnauita.jpg",
    ],
    "hessonite": [
        "Hessonite striated crytals.jpg",
        "Grossular-Diopside-258967.jpg",
    ],
    "dravite": [
        "Dravite cristal.jpg",
        "Béryl var. émeraude, tourmaline var. dravite et calcite (Mingora Mine Swat - Pakistan).jpg",
    ],
    "liddicoatite": [
        "Liddicoatite-68003.jpg",
        "Liddicoatite-t5151b.jpg",
    ],
    "heulandite": [
        "Heulandite-Ca-240277.jpg",
        "HeulanditeLonavala.jpg",
        "HeulanditeItalie.jpg",
    ],
}

SYNONYMS: dict[str, list[str]] = {
    "selenite": ["selenite", "gypsum", "gypse"],
    "fluor-uvite": ["fluoruvite", "uvite", "fluor-uvite"],
    "rhodolite": ["rhodolite", "garnet"],
    "hessonite": ["hessonite", "grossular"],
    "baileychlore": ["baileychlore", "baileyclor"],
    "fontarnauite": ["fontarnauite", "fontarnauita"],
    "dravite": ["dravite", "tourmaline"],
}


def field_catalog() -> list[dict]:
    text = m.DATA_JS.read_text(encoding="utf-8")
    entries = []
    for mm in re.finditer(r'\{name:"([^"]+)"([^}]*)\}', text):
        body = mm.group(0)
        kind_m = re.search(r'kind:"([^"]+)"', body)
        img_m = re.search(r'img:"([^"]+)"', body)
        if not kind_m or not img_m:
            continue
        if kind_m.group(1) not in ("gem", "mineral"):
            continue
        img = img_m.group(1)
        entries.append(
            {
                "name": mm.group(1),
                "kind": kind_m.group(1),
                "img": img,
                "slug": Path(img).stem,
            }
        )
    return entries


def title_ok(name: str, title: str, slug: str | None = None) -> bool:
    if m.SKIP_TITLE_RE.search(title) or title.lower().endswith(m.SKIP_EXT):
        return False
    low = title.lower()
    if any(
        x in low
        for x in (
            "microphotograph",
            "fluid inclusion",
            "bony ",
            "anatomy",
            "thin section",
        )
    ):
        return False
    if name_in_title(name, title):
        return True
    t = norm(title)
    keys = SYNONYMS.get(slug or "", []) or SYNONYMS.get(norm(base_name(name)), [])
    for s in keys:
        sn = norm(s)
        if len(sn) >= 5 and sn in t:
            return True
    # Romance-language stem (Fontarnauita / Baileyclor) — require long shared prefix
    b = norm(base_name(name))
    if len(b) >= 9 and b[:9] in t:
        return True
    return False


def wikidata_p18_titles(name: str) -> list[str]:
    """Return all P18 Commons filenames for the exact mineral Wikidata item."""
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
    out: list[str] = []
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
            return []
        for cl in claims["P18"]:
            try:
                fn = cl["mainsnak"]["datavalue"]["value"]
            except Exception:
                continue
            if m.SKIP_TITLE_RE.search(fn) or fn.lower().endswith(m.SKIP_EXT):
                continue
            out.append(fn)
        return out
    return []


def try_download_list(slug: str, titles: list[str]) -> str | None:
    seen: set[str] = set()
    for t in titles:
        if not t or t in seen:
            continue
        seen.add(t)
        if m.SKIP_TITLE_RE.search(t) or t.lower().endswith(m.SKIP_EXT):
            continue
        if try_download_title(t, slug):
            return t
        time.sleep(0.25)
    return None


def recover_one(slug: str, name: str, *, wipe: bool) -> tuple[bool, str | None]:
    jpg = m.IMG / f"{slug}.jpg"
    if wipe and jpg.exists():
        jpg.unlink()

    # 1) Curated hand-picks
    curated = CURATED.get(slug, [])
    if curated:
        got = try_download_list(slug, curated)
        if got:
            return True, got

    # 2) Wikidata P18 for exact mineral — accept official image
    try:
        p18 = wikidata_p18_titles(name)
    except Exception as e:
        print(f"  WD err: {e}", flush=True)
        p18 = []
    # Prefer title_ok matches first, then any remaining P18
    ordered = [t for t in p18 if title_ok(name, t, slug)] + [
        t for t in p18 if not title_ok(name, t, slug)
    ]
    got = try_download_list(slug, ordered)
    if got:
        return True, got

    # 3) Commons with name-in-title
    for _sc, t in loose_commons(name)[:12]:
        if try_download_title(t, slug):
            return True, t
        time.sleep(0.25)

    # 4) Broader search
    for q in (
        f'"{base_name(name)}" mineral',
        f'"{base_name(name)}" crystal',
        f"{base_name(name)} specimen",
        base_name(name),
    ):
        try:
            titles = m.search_commons(q, limit=10)
        except Exception:
            continue
        cands = [t for t in titles if title_ok(name, t, slug)]
        got = try_download_list(slug, cands)
        if got:
            return True, got
        time.sleep(0.2)

    return False, None


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--force-only", action="store_true")
    ap.add_argument("--svg-only", action="store_true")
    ap.add_argument("--also-past", action="store_true", help="Sample recover SVGs just past curated")
    args = ap.parse_args()

    catalog = field_catalog()
    q4 = catalog[900:]
    by_slug = {e["slug"]: e for e in catalog}
    sources = m.load_sources()

    force = [] if args.svg_only else [by_slug[s] for s in FORCE_SLUGS if s in by_slug]
    svg_need = []
    if not args.force_only:
        svg_need = [
            e
            for e in q4
            if e["img"].endswith(".svg") or not m.valid_jpg(m.IMG / f'{e["slug"]}.jpg')
        ]

    # Deduplicate (force first)
    seen = set()
    work = []
    for e in force + svg_need:
        if e["slug"] in seen:
            continue
        seen.add(e["slug"])
        work.append(e)

    print(f"Field catalog size={len(catalog)} Q4={len(q4)}", flush=True)
    print(f"Force replace={len(force)} SVG/missing retry={len(svg_need)} work={len(work)}", flush=True)

    ok = fail = 0
    fixed: list[tuple[str, str]] = []
    failed: list[str] = []

    for i, e in enumerate(work, 1):
        slug, name = e["slug"], e["name"]
        wipe = slug in FORCE_SLUGS
        print(f"\n[{i}/{len(work)}] {name} ({slug}) wipe={wipe}", flush=True)
        success, title = recover_one(slug, name, wipe=wipe)
        if success and title and m.valid_jpg(m.IMG / f"{slug}.jpg"):
            sources[slug] = title
            ok += 1
            fixed.append((name, title))
            print(f"  OK ← {title}", flush=True)
        else:
            fail += 1
            failed.append(name)
            print(f"  FAIL", flush=True)
            # Restore previous source if we wiped and failed
            if wipe:
                old = sources.get(slug)
                if old and try_download_title(old, slug):
                    print(f"  restored ← {old}", flush=True)
        if i % 10 == 0:
            m.save_sources(sources)
        time.sleep(0.35)

    if args.also_past:
        # Recover a sample of first ~80 SVG entries past curated (All minerals)
        text = m.DATA_JS.read_text(encoding="utf-8")
        all_gems = m.parse_gems(text)
        past = all_gems[len(catalog) : len(catalog) + 120]
        past_need = [g for g in past if not m.valid_jpg(m.IMG / f'{g["slug"]}.jpg')][:40]
        print(f"\n=== Past curated sample retry: {len(past_need)} ===", flush=True)
        for i, g in enumerate(past_need, 1):
            print(f"\n[past {i}/{len(past_need)}] {g['name']}", flush=True)
            success, title = recover_one(g["slug"], g["name"], wipe=False)
            if success and title:
                sources[g["slug"]] = title
                ok += 1
                fixed.append((g["name"], title))
                print(f"  OK ← {title}", flush=True)
            else:
                fail += 1
                failed.append(g["name"])
                print("  FAIL", flush=True)
            time.sleep(0.35)

    m.save_sources(sources)
    jpg_n, svg_n = m.update_gems_data()

    # Recount Q4 SVG
    catalog2 = field_catalog()
    q4b = catalog2[900:]
    q4_svg = sum(1 for e in q4b if e["img"].endswith(".svg"))
    q4_jpg = sum(1 for e in q4b if e["img"].lower().endswith((".jpg", ".jpeg")))

    print("\n=== SUMMARY ===", flush=True)
    print(f"Recovered OK={ok} FAIL={fail}", flush=True)
    print(f"Catalog refs JPG={jpg_n} SVG={svg_n}", flush=True)
    print(f"Q4 after: JPG={q4_jpg} SVG={q4_svg}", flush=True)
    print("Fixed:", flush=True)
    for name, title in fixed:
        print(f"  {name} ← {title}", flush=True)
    if failed:
        print(f"Still failed ({len(failed)}): {', '.join(failed)}", flush=True)


if __name__ == "__main__":
    main()
