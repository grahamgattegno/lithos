#!/usr/bin/env python3
"""Re-fetch Commons photos for radioactive U/Th minerals still on SVG or mismatched JPGs.

Also corrects yellow uranyl-mineral UI colors that inherited wrong vanadate defaults.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import fetch_all_gem_photos as fetch  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
DATA_JS = ROOT / "gems-data.js"
IMG = ROOT / "images"
SOURCES = IMG / "PHOTO_SOURCES.json"

RADIO_NAME_RE = re.compile(
    r"^(?:Autunite|Meta-?autunite|Uraninite|Torbernite|Meta-?torbernite|Carnotite|"
    r"Thorianite|Pitchblende|Coffinite|Uranophane|Tyuyamunite|Boltwoodite|Kasolite|"
    r"Soddyite|Curite|Becquerelite|Fourmarierite|Vandendriesscheite|Ianthinite|Zippeite|"
    r"Johannite|Saleeite|Novacekite|Zeunerite|Meta-?zeunerite|Cuprosklodows?kite|"
    r"Sklodows?kite|Andersonite|Liebigite|Rutherfordine|Schoepite|Para-?schoepite|"
    r"Clarkeite|Brannerite|Davidite|Thorite|Huttonite|Betafite|Samarskite|Euxenite|"
    r"Fergusonite|Gummite|Uranocircite|Phosphuranylite|Weeksite|Haiweeite|Studtite|"
    r"Francevillite|Parsonsite|Bayleyite|Bergenite|Ulrichite|Zellerite|Mundite|Upalite|"
    r"Masuyite|Umohoite|Wyartite|Althupite|Rameauite|Steacyite|Aspedamite|Cleusonite|"
    r"Ichnusaite|Nuragheite|Sengierite|Vanuralite|Agrinierite|Uranopilite|Abernathyite|"
    r"Guilleminite|Mathesiusite|Wolfsriedite|Yingjiangite|Brockite|Margaritasite|"
    r"Ekanite|Albrechtschraufite|Znucalite|Monazite)(?:-\([A-Za-z]+\))?$",
    re.I,
)

YELLOW_URANYL = {
    "Carnotite": (["Bright yellow", "Canary yellow"], ["#e8d030", "#b8a010"], "#d4c020"),
    "Tyuyamunite": (["Yellow-green", "Green"], ["#c8d040", "#809818"], "#a8b828"),
    "Sengierite": (["Green", "Yellow-green"], ["#60a040", "#306820"], "#508830"),
    "Francevillite": (["Yellow", "Orange-yellow"], ["#e0c030", "#a88810"], "#d0b020"),
    "Margaritasite": (["Yellow", "Orange"], ["#e8c840", "#b09018"], "#d8b828"),
    "Guilleminite": (["Yellow", "Canary yellow"], ["#e8d040", "#b0a018"], "#d4c028"),
    "Uranophane": (["Yellow", "Orange-yellow"], ["#e0c848", "#a89020"], "#d0b030"),
    "Autunite": (["Yellow-green"], ["#c8d830", "#8a9810"], "#c8d830"),
    "Torbernite": (["Emerald green"], ["#3aaa3a", "#1e701e"], "#3aaa3a"),
}


def is_radioactive_entry(name: str, formula: str) -> bool:
    if RADIO_NAME_RE.match(name.strip()):
        return True
    f = formula or ""
    if re.search(r"(?:^|[^A-Za-z])U(?:[^a-z]|$)", f):
        return True
    if re.search(r"(?:^|[^A-Za-z])Th(?:[^a-z]|$)", f):
        return True
    return False


def parse_entries(text: str) -> list[dict]:
    m = re.search(r"(?:var|const)\s+GEMS\s*=\s*\[(.*?)\];", text, re.S)
    if not m:
        raise SystemExit("GEMS not found")
    body = m.group(1)
    out = []
    for block in re.finditer(
        r'\{name:"([^"]+)"[\s\S]*?img:"([^"]+)"[\s\S]*?formula:"([^"]*)"',
        body,
    ):
        name, img, formula = block.group(1), block.group(2), block.group(3)
        out.append({"name": name, "img": img, "formula": formula, "slug": Path(img).stem})
    return out


def rgba_glow(hex_color: str) -> str:
    h = hex_color.lstrip("#")
    if len(h) != 6:
        return "rgba(180,160,40,0.5)"
    r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
    return f"rgba({r},{g},{b},0.5)"


def patch_colors(text: str, name: str, colors, hexes, stone: str) -> str:
    pat = re.compile(
        rf'(\{{name:"{re.escape(name)}",[\s\S]*?)'
        r'colorHex:\[[^\]]+\],stone:"[^"]*",glow:"[^"]*",colors:\[[^\]]+\]',
        re.M,
    )

    def repl(m):
        colors_js = ",".join(f'"{c}"' for c in colors)
        hex_js = ",".join(f'"{h}"' for h in hexes)
        return (
            f'{m.group(1)}colorHex:[{hex_js}],stone:"{stone}",'
            f'glow:"{rgba_glow(stone)}",colors:[{colors_js}]'
        )

    new, n = pat.subn(repl, text, count=1)
    return new if n else text


def set_img_path(text: str, name: str, img_path: str) -> str:
    pat = re.compile(rf'(\{{name:"{re.escape(name)}",[\s\S]*?img:")([^"]+)(")')
    return pat.sub(rf"\g<1>{img_path}\3", text, count=1)


def main():
    text = DATA_JS.read_text(encoding="utf-8")
    entries = parse_entries(text)
    radio = [e for e in entries if is_radioactive_entry(e["name"], e["formula"])]
    print(f"Radioactive / U-Th entries: {len(radio)}")

    sources = fetch.load_sources()
    fetch_targets = []
    for e in radio:
        jpg = IMG / f"{e['slug']}.jpg"
        svg_only = e["img"].endswith(".svg") or not fetch.valid_jpg(jpg)
        force_color = e["name"] in YELLOW_URANYL
        if svg_only or force_color:
            fetch_targets.append(e)

    # de-dupe by slug
    seen = set()
    uniq = []
    for e in fetch_targets:
        if e["slug"] in seen:
            continue
        seen.add(e["slug"])
        uniq.append(e)
    fetch_targets = uniq
    print(f"Photo fetch targets: {len(fetch_targets)}")

    ok = fail = 0
    for i, e in enumerate(fetch_targets, 1):
        jpg = IMG / f"{e['slug']}.jpg"
        # Force re-fetch for SVG-only / tiny files
        if jpg.exists() and not fetch.valid_jpg(jpg):
            jpg.unlink(missing_ok=True)
        elif e["img"].endswith(".svg") and jpg.exists() and jpg.stat().st_size < 12000:
            jpg.unlink(missing_ok=True)

        got, title, reason = fetch.pick_and_download(e["name"], e["slug"])
        if got and fetch.valid_jpg(IMG / f"{e['slug']}.jpg"):
            ok += 1
            if title:
                sources[e["slug"]] = title
            text = set_img_path(text, e["name"], f"images/{e['slug']}.jpg")
            print(f"  [{i}/{len(fetch_targets)}] OK {e['name']} ← {title or 'existing'}")
        else:
            fail += 1
            print(f"  [{i}/{len(fetch_targets)}] miss {e['name']} ({reason})")
        if i % 8 == 0:
            fetch.save_sources(sources)
            DATA_JS.write_text(text, encoding="utf-8")

    for name, (colors, hexes, stone) in YELLOW_URANYL.items():
        text = patch_colors(text, name, colors, hexes, stone)

    for e in radio:
        if fetch.valid_jpg(IMG / f"{e['slug']}.jpg"):
            text = set_img_path(text, e["name"], f"images/{e['slug']}.jpg")

    DATA_JS.write_text(text, encoding="utf-8")
    fetch.save_sources(sources)
    svg_left = sum(1 for e in radio if not fetch.valid_jpg(IMG / f"{e['slug']}.jpg"))
    print(f"Done. photo ok={ok} fail={fail}. Radioactive still without JPG: {svg_left}")


if __name__ == "__main__":
    main()
