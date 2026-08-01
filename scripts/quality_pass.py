#!/usr/bin/env python3
"""Aggressive catalog quality pass for Lithos.

- Marks each entry kind:"gem" | kind:"mineral"
- Regenerates IMA-template descriptions from live fields
- Applies known class/system/mohs/formula corrections
- Leaves handwritten gemstone copy untouched
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "gems-data.js"

# Bulk / duplicate species that are still gemologically relevant.
PROMOTE_GEM = {
    "Quartz",
    "Corundum",
    "Beryl",
    "Zoisite",
    "Lazurite",
    "Titanite",
    "Jadeite",
    "Spodumene",
    "Adamite",
    "Ulexite",
    "Colemanite",
    "Microcline",
}

# Keep these as mineral even if handwritten (industrial / ore teaching pieces stay available under All).
FORCE_MINERAL = {
    "Graphite",
    "Talc",
    "Magnetite",
    "Ilmenite",
    "Chromite",
    "Galena",
    "Chalcopyrite",
    "Bornite",
    "Native Platinum",
    "Bismuth",
    "Uraninite",
    "Autunite",
    "Torbernite",
    "Monazite",
    "Columbite",
    "Franklinite",
    "Augite",
    "Hornblende",
    "Biotite",
    "Muscovite",
    "Enstatite",
    "Bronzite",
}

# Hard corrections when Wikidata/class defaults went wrong.
CORRECTIONS = {
    "Ulexite": {"class": "Borate", "system": "Triclinic", "mohs": 2.5, "formula": "NaCaB₅O₆(OH)₆·5H₂O"},
    "Colemanite": {"class": "Borate", "system": "Monoclinic", "mohs": 4.5},
    "Natron": {"class": "Carbonate", "system": "Monoclinic", "mohs": 1.5, "formula": "Na₂CO₃·10H₂O"},
    "Quartz": {"class": "Silicate — Quartz", "system": "Trigonal", "mohs": 7, "formula": "SiO₂"},
    "Corundum": {"class": "Oxide — Corundum", "system": "Trigonal", "mohs": 9, "formula": "Al₂O₃"},
    "Beryl": {"class": "Silicate — Beryl", "system": "Hexagonal", "mohs": 7.75, "formula": "Be₃Al₂Si₆O₁₈"},
    "Zoisite": {"class": "Silicate", "system": "Orthorhombic", "mohs": 6.5, "formula": "Ca₂Al₃(SiO₄)₃(OH)"},
    "Lazurite": {"class": "Silicate", "system": "Cubic", "mohs": 5.5},
    "Titanite": {"class": "Silicate — Titanite", "system": "Monoclinic", "mohs": 5.25, "formula": "CaTiSiO₅"},
    "Jadeite": {"class": "Silicate — Pyroxene", "system": "Monoclinic", "mohs": 6.5, "formula": "NaAlSi₂O₆"},
    "Spodumene": {"class": "Silicate — Spodumene", "system": "Monoclinic", "mohs": 6.75, "formula": "LiAlSi₂O₆"},
    "Adamite": {"class": "Arsenate", "system": "Orthorhombic", "mohs": 3.5},
    "Epsomite": {"class": "Sulfate", "system": "Orthorhombic", "mohs": 2.25},
    "Anhydrite": {"class": "Sulfate", "system": "Orthorhombic", "mohs": 3.5},
    "Sylvite": {"class": "Halide", "system": "Cubic", "mohs": 2},
    "Analcime": {"class": "Silicate — Zeolite", "system": "Cubic", "mohs": 5.25},
    "Kyanite": {"mohs": 6},  # mid of 5–7 anisotropy; desc already explains
}


def js_escape(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def make_desc(name: str, formula: str, klass: str, system: str, mohs: float) -> str:
    klass_l = klass.lower()
    fbit = f" Chemistry is often written {formula}." if formula and formula != "—" else ""
    return (
        f"{name} is a naturally occurring mineral ({klass_l}) that typically forms "
        f"in the {system.lower()} crystal system, around Mohs {mohs:g}.{fbit} "
        f"Locality and habit vary; specimens are useful for comparing "
        f"{klass.split('—')[0].strip().lower()} mineralogy."
    )


def parse_objects(text: str) -> list[tuple[int, int, str]]:
    """Return (start, end, chunk) for each gem object inside the GEMS array."""
    m = re.search(r"(?:var|const)\s+GEMS\s*=\s*\[", text)
    if not m:
        raise SystemExit("GEMS array not found")
    i = m.end()
    out = []
    n = len(text)
    while i < n:
        while i < n and text[i] in " \t\n\r,":
            i += 1
        if i < n and text[i] == "]":
            break
        if i >= n or text[i] != "{":
            break
        start = i
        depth = 0
        for j in range(i, n):
            ch = text[j]
            if ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0:
                    out.append((start, j + 1, text[start : j + 1]))
                    i = j + 1
                    break
        else:
            break
    return out


def field_str(chunk: str, key: str) -> str | None:
    m = re.search(rf'{key}:"((?:\\.|[^"\\])*)"', chunk)
    return m.group(1) if m else None


def field_num(chunk: str, key: str) -> float | None:
    m = re.search(rf"{key}:(\d+(?:\.\d+)?)", chunk)
    return float(m.group(1)) if m else None


def set_str(chunk: str, key: str, value: str) -> str:
    if re.search(rf'{key}:"(?:\\.|[^"\\])*"', chunk):
        return re.sub(rf'{key}:"(?:\\.|[^"\\])*"', f'{key}:"{js_escape(value)}"', chunk, count=1)
    # insert before desc if missing
    return re.sub(r'(desc:")', f'{key}:"{js_escape(value)}",\\1', chunk, count=1)


def set_num(chunk: str, key: str, value: float) -> str:
    v = int(value) if float(value).is_integer() else value
    if re.search(rf"{key}:\d+(?:\.\d+)?", chunk):
        return re.sub(rf"{key}:\d+(?:\.\d+)?", f"{key}:{v}", chunk, count=1)
    return chunk


def main() -> None:
    text = DATA.read_text(encoding="utf-8")
    objs = parse_objects(text)
    print(f"parsed {len(objs)} gems")

    gem_n = mineral_n = desc_n = corr_n = 0
    pieces: list[str] = []
    cursor = 0
    # Keep prefix through opening [
    prefix_end = objs[0][0]
    new_body_parts = []

    for start, end, chunk in objs:
        name = field_str(chunk, "name") or ""
        desc = field_str(chunk, "desc") or ""
        # unescape lightly for checks
        desc_plain = desc.encode("utf-8").decode("unicode_escape") if "\\" in desc else desc
        klass = field_str(chunk, "class") or "Mineral"
        system = field_str(chunk, "system") or "Unknown"
        formula = field_str(chunk, "formula") or "—"
        mohs = field_num(chunk, "mohs") or 5.0

        # Apply corrections
        if name in CORRECTIONS:
            c = CORRECTIONS[name]
            if "class" in c:
                chunk = set_str(chunk, "class", c["class"])
                klass = c["class"]
            if "system" in c:
                chunk = set_str(chunk, "system", c["system"])
                system = c["system"]
            if "formula" in c:
                chunk = set_str(chunk, "formula", c["formula"])
                formula = c["formula"]
            if "mohs" in c:
                chunk = set_num(chunk, "mohs", float(c["mohs"]))
                mohs = float(c["mohs"])
            corr_n += 1

        handwritten = "IMA-recognized" not in desc_plain and not desc_plain.startswith(
            f"{name} is a naturally occurring mineral"
        )
        # Also treat old regenerated pattern as regeneratable
        regeneratable = (
            "IMA-recognized" in desc_plain
            or "appears in collector cabinets and teaching sets" in desc_plain
            or "specimens are useful for comparing" in desc_plain
        )

        if regeneratable:
            new_desc = make_desc(name, formula, klass, system, mohs)
            chunk = set_str(chunk, "desc", new_desc)
            desc_n += 1
            handwritten = False

        if name in FORCE_MINERAL:
            kind = "mineral"
        elif handwritten or name in PROMOTE_GEM:
            kind = "gem"
        else:
            kind = "mineral"

        if kind == "gem":
            gem_n += 1
        else:
            mineral_n += 1

        # Set / replace kind field
        if re.search(r'kind:"(?:gem|mineral)"', chunk):
            chunk = re.sub(r'kind:"(?:gem|mineral)"', f'kind:"{kind}"', chunk, count=1)
        else:
            chunk = re.sub(r'(\{name:"[^"]+")', rf'\1,kind:"{kind}"', chunk, count=1)

        new_body_parts.append(chunk)

    # Reconstruct file
    head = text[: objs[0][0]]
    tail = text[objs[-1][1] :]
    # Normalize spacing between objects
    body = ",\n".join(new_body_parts)
    DATA.write_text(head + body + tail, encoding="utf-8")
    print(f"kind gem={gem_n} mineral={mineral_n}")
    print(f"regenerated descs={desc_n} corrections={corr_n}")
    print(f"wrote {DATA}")


if __name__ == "__main__":
    main()
