#!/usr/bin/env python3
"""Add 1000 real mineral/gem specimens to gems-data.js (200 → 1200).

Uses Wikidata mineral-species data + Wikipedia mineral-list prioritization.
Always writes colored SVG fallbacks; tries Commons JPGs with short timeouts.
"""
from __future__ import annotations

import json
import re
import ssl
import time
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

try:
    from PIL import Image
    import io
except ImportError:
    Image = None
    io = None

ROOT = Path(__file__).resolve().parents[1]
IMG = ROOT / "images"
DATA_JS = ROOT / "gems-data.js"
SOURCES = IMG / "PHOTO_SOURCES.json"
WD_JSON = Path(__file__).with_name("minerals_wd.json")
WIKI_JSON = Path(__file__).with_name("wiki_mineral_names.json")

TARGET_NEW = 1000  # overridden by --target / --total
UA = "LithosGemCatalog/1.0 (educational; https://github.com/grahamgattegno/lithos)"
ctx = ssl.create_default_context()

# Skip meta / non-specimen names
SKIP_NAME_RE = re.compile(
    r"^(list of|timeline|category:|file:|mineral |unnamed|um\d|IMA \d)",
    re.I,
)
SKIP_EXACT = {
    "List of minerals named after people",
    "Timeline of the discovery and classification of minerals",
    "Acetamide",  # organic oddity; keep catalog collector-focused
    "Ice",  # valid mineral, odd in a gem catalog
    "Water",
}

SYSTEM_MAP = {
    "cubic": "Cubic",
    "hexagonal": "Hexagonal",
    "trigonal": "Trigonal",
    "tetragonal": "Tetragonal",
    "orthorhombic": "Orthorhombic",
    "monoclinic": "Monoclinic",
    "triclinic": "Triclinic",
    "amorphous": "Amorphous",
}

# Approximate Mohs defaults by mineral class keyword
CLASS_MOHS = {
    "Native element": 3.0,
    "Sulfide": 3.5,
    "Sulfosalt": 3.0,
    "Oxide": 5.5,
    "Hydroxide": 3.5,
    "Halide": 2.5,
    "Carbonate": 3.5,
    "Nitrate": 2.0,
    "Borate": 4.0,
    "Sulfate": 3.0,
    "Chromate": 3.0,
    "Tungstate": 4.5,
    "Molybdate": 3.5,
    "Phosphate": 4.0,
    "Arsenate": 3.5,
    "Vanadate": 3.5,
    "Silicate": 5.5,
    "Organic": 2.0,
    "Mineraloid": 5.0,
}

CLASS_COLORS = {
    "Native element": (["Metallic grey", "Yellow"], ["#c8c8d0", "#8a8a94"], "#b0b0b8"),
    "Sulfide": (["Metallic", "Brassy"], ["#c8a830", "#6a6a72"], "#8a7a40"),
    "Sulfosalt": (["Grey", "Metallic"], ["#8a8a92", "#4a4a52"], "#6a6a72"),
    "Oxide": (["Black", "Brown", "Red"], ["#6a3a1a", "#2a2a2e"], "#5a3a28"),
    "Hydroxide": (["Brown", "Yellow", "Orange"], ["#c89040", "#8a6020"], "#b87830"),
    "Halide": (["Colorless", "Purple", "White"], ["#d8d0e8", "#a090c0"], "#c8c0d8"),
    "Carbonate": (["White", "Green", "Pink"], ["#e8f0e8", "#90c090"], "#c8dcc8"),
    "Nitrate": (["White", "Colorless"], ["#f0f0e8", "#d0d0c0"], "#e8e8d8"),
    "Borate": (["White", "Colorless", "Pink"], ["#f0e8f0", "#d0b8d0"], "#e0d0e0"),
    "Sulfate": (["Colorless", "Blue", "Yellow"], ["#e0e8f0", "#90a0c0"], "#c8d0e0"),
    "Chromate": (["Orange", "Yellow"], ["#e8a020", "#a06810"], "#d89018"),
    "Tungstate": (["Yellow", "Orange", "Brown"], ["#d8c850", "#a09020"], "#c8b840"),
    "Molybdate": (["Yellow", "Orange"], ["#e0c040", "#a08820"], "#d0b030"),
    "Phosphate": (["Green", "Blue", "Yellow"], ["#60a060", "#3080a0"], "#509070"),
    "Arsenate": (["Green", "Blue", "Olive"], ["#70a050", "#406030"], "#608040"),
    "Vanadate": (["Red", "Orange", "Yellow"], ["#d05030", "#a03018"], "#c04028"),
    "Silicate": (["Green", "Grey", "Brown", "Colorless"], ["#6a8a6a", "#c8c0b0"], "#7a8a70"),
    "Organic": (["Brown", "Amber"], ["#a07040", "#704828"], "#906030"),
    "Mineraloid": (["Variable"], ["#8a8a9a", "#5a5a6a"], "#707080"),
}

ORIGIN_BY_CLASS = {
    "Native element": ["USA", "Russia", "Canada", "Australia"],
    "Sulfide": ["Peru", "USA", "China", "Mexico"],
    "Sulfosalt": ["Romania", "Peru", "USA", "Bolivia"],
    "Oxide": ["Brazil", "USA", "Madagascar", "Russia"],
    "Hydroxide": ["USA", "Germany", "UK", "France"],
    "Halide": ["Germany", "USA", "Poland", "Spain"],
    "Carbonate": ["Mexico", "USA", "China", "Italy"],
    "Borate": ["USA", "Turkey", "Argentina", "China"],
    "Sulfate": ["Chile", "USA", "Spain", "Germany"],
    "Tungstate": ["China", "Portugal", "USA", "Bolivia"],
    "Molybdate": ["USA", "Mexico", "Chile", "China"],
    "Phosphate": ["USA", "Brazil", "Portugal", "Germany"],
    "Arsenate": ["Mexico", "Germany", "USA", "Morocco"],
    "Vanadate": ["Morocco", "USA", "Argentina", "Namibia"],
    "Silicate": ["Brazil", "USA", "Italy", "Madagascar", "Russia"],
    "Organic": ["USA", "Canada", "Poland"],
    "Mineraloid": ["Australia", "USA", "Mexico"],
}


def slugify(name: str) -> str:
    s = (
        name.lower()
        .replace("'", "")
        .replace("′", "")
        .replace("ü", "u")
        .replace("ä", "a")
        .replace("ö", "o")
        .replace("å", "a")
        .replace("ø", "o")
        .replace("é", "e")
        .replace("è", "e")
        .replace("á", "a")
        .replace("í", "i")
        .replace("ó", "o")
        .replace("ú", "u")
        .replace("ñ", "n")
        .replace("ç", "c")
    )
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


def proper_name(name: str) -> str:
    name = name.strip()
    if not name:
        return name
    # Keep already-capitalized Wikipedia-style names
    if any(c.isupper() for c in name[1:]):
        return name
    if name[:1].isupper() and name[1:].islower() and "-(" not in name:
        return name
    # Title-case with REE suffix preservation: foo-(Ce) → Foo-(Ce)
    parts = []
    for chunk in re.split(r"(-)", name):
        if chunk == "-":
            parts.append(chunk)
            continue
        m = re.match(r"^\((.+)\)$", chunk)
        if m:
            parts.append("(" + m.group(1)[:1].upper() + m.group(1)[1:] + ")")
        else:
            parts.append(chunk[:1].upper() + chunk[1:] if chunk else chunk)
    return "".join(parts)


def infer_class(formula: str, name: str) -> str:
    f = formula or ""
    n = name.lower()
    if any(x in n for x in ("opal", "amber", "jet", "obsidian", "tektite")):
        return "Mineraloid"
    if re.search(r"\b(C\d|NiC|organic)\b", f) and "CO" not in f:
        return "Organic"
    if "Si" in f and ("O" in f):
        if "B" in f and "Si" in f:
            return "Silicate — Borosilicate"
        return "Silicate"
    if "PO4" in f or "PO₄" in f:
        return "Phosphate"
    if "AsO4" in f or "AsO₄" in f:
        return "Arsenate"
    if "VO4" in f or "VO₄" in f:
        return "Vanadate"
    if "SO4" in f or "SO₄" in f:
        return "Sulfate"
    if "WO4" in f or "WO₄" in f or "W" in f and "O" in f and "S" not in f:
        if "W" in f:
            return "Tungstate"
    if "MoO4" in f or "MoO₄" in f:
        return "Molybdate"
    if "CrO4" in f or "CrO₄" in f:
        return "Chromate"
    if "CO3" in f or "CO₃" in f:
        return "Carbonate"
    if "NO3" in f or "NO₃" in f:
        return "Nitrate"
    if re.search(r"B\d|BO3|BO₃|B\(OH\)", f):
        return "Borate"
    if any(x in f for x in ("Cl", "F", "Br", "I")) and "O" not in f and "S" not in f:
        return "Halide"
    if "OH" in f and "Si" not in f and "S" not in f:
        return "Hydroxide"
    if re.search(r"(^|[^a-zA-Z])S($|[^aioeu]|2|₃|₄)", f) and "O" not in f.replace("SO", ""):
        # crude sulfide: has S, limited O
        if "Sb" in f or "As" in f and "S" in f:
            return "Sulfosalt"
        return "Sulfide"
    if re.search(r"(Fe|Cu|Pb|Zn|Ni|Co|Ag|Au|Hg|Mo|Sb|As|Bi).*S", f) and "O" not in f:
        return "Sulfide"
    if re.search(r"(Te|Se)\d|Te₄|Te₂|Se₂", f) and "O" not in f:
        return "Sulfide"
    if "O" in f and "Si" not in f:
        return "Oxide"
    if f in ("Au", "Ag", "Cu", "Pt", "Pd", "Fe", "S", "C", "As", "Sb", "Bi", "Hg"):
        return "Native element"
    if len(f) <= 3 and f.isalpha():
        return "Native element"
    return "Silicate" if "Si" in f else "Oxide"


def clean_system(raw: str | None) -> str:
    if not raw:
        return "Unknown"
    low = raw.lower().replace(" crystal system", "").strip()
    for k, v in SYSTEM_MAP.items():
        if k in low:
            return v
    return raw.split()[0].capitalize() if raw else "Unknown"


def parse_mohs(raw, klass: str) -> float:
    if raw is not None and str(raw).strip():
        s = str(raw).strip()
        # ranges like 5-6 or 5.5–6
        m = re.match(r"^(\d+(?:\.\d+)?)", s.replace(",", "."))
        if m:
            try:
                v = float(m.group(1))
                if 1 <= v <= 10:
                    return round(v * 4) / 4  # quarter steps
            except ValueError:
                pass
    base = CLASS_MOHS.get(klass.split("—")[0].strip(), CLASS_MOHS.get(klass, 4.0))
    return base


def approx_sg(klass: str, mohs: float) -> str:
    base = {
        "Native element": 8.0,
        "Sulfide": 5.0,
        "Sulfosalt": 5.2,
        "Oxide": 4.5,
        "Hydroxide": 3.2,
        "Halide": 2.5,
        "Carbonate": 3.0,
        "Borate": 2.6,
        "Sulfate": 2.8,
        "Tungstate": 6.0,
        "Molybdate": 4.5,
        "Phosphate": 3.2,
        "Arsenate": 3.4,
        "Vanadate": 3.5,
        "Silicate": 3.0,
        "Organic": 1.3,
        "Mineraloid": 2.2,
    }
    k = klass.split("—")[0].strip()
    v = base.get(k, 3.0) + (mohs - 5) * 0.08
    return f"{max(1.0, min(22.0, v)):.2f}"


def approx_ri(klass: str) -> str:
    k = klass.split("—")[0].strip()
    table = {
        "Native element": "—",
        "Sulfide": "—",
        "Sulfosalt": "—",
        "Oxide": "2.00",
        "Hydroxide": "1.70",
        "Halide": "1.49",
        "Carbonate": "1.60",
        "Borate": "1.55",
        "Sulfate": "1.55",
        "Tungstate": "1.93",
        "Molybdate": "1.90",
        "Phosphate": "1.60",
        "Arsenate": "1.70",
        "Vanadate": "2.00",
        "Silicate": "1.60",
        "Organic": "1.54",
        "Mineraloid": "1.45",
    }
    return table.get(k, "1.55")


def price_for(mohs: float, klass: str, name: str) -> str:
    n = name.lower()
    if any(x in n for x in ("gold", "platinum", "diamond")):
        return "$50–$5,000+ / g"
    if mohs >= 8:
        return "$50–$800 / ct"
    if mohs >= 7:
        return "$10–$200 / ct"
    if "Sulfide" in klass or "Native" in klass:
        return "$5–$80 / piece"
    if mohs <= 3:
        return "$2–$40 / piece"
    return "$5–$60 / piece"


def color_pack(klass: str, name: str):
    k = klass.split("—")[0].strip()
    colors, hexes, stone = CLASS_COLORS.get(k, CLASS_COLORS["Silicate"])
    n = name.lower()
    # name-based tint overrides
    overrides = [
        (("ruby", "cinnabar", "realgar", "cuprite", "proustite"), ["Red"], ["#c02828", "#7a1010"], "#c02828"),
        (("azurite", "lazulite", "cavansite", "chalcanthite"), ["Blue"], ["#1f47b0", "#12285f"], "#264fbf"),
        (("malachite", "dioptase", "variscite", "olivenite"), ["Green"], ["#2f8f4a", "#175a28"], "#329c53"),
        (("sulfur", "orpiment", "wulfenite", "vanadinite"), ["Yellow", "Orange"], ["#e8d830", "#d07020"], "#e0b028"),
        (("fluorite", "amethyst", "purpurite", "sugilite"), ["Purple", "Violet"], ["#7b3fb0", "#4c2470"], "#7d43b3"),
        (("rhodochrosite", "rhodonite", "erythrite", "pink"), ["Pink", "Rose"], ["#d95a6a", "#a03848"], "#d95a6a"),
        (("galena", "graphite", "magnetite", "pyrolusite"), ["Metallic black", "Grey"], ["#3a3a3e", "#1a1a1e"], "#3a3a3e"),
        (("gold", "pyrite", "chalcopyrite"), ["Brassy yellow", "Gold"], ["#d4a820", "#a07810"], "#d4a820"),
        (("calcite", "aragonite", "gypsum", "halite", "quartz"), ["Colorless", "White"], ["#f4f0e8", "#d0c8b8"], "#efeae0"),
    ]
    for keys, c, h, s in overrides:
        if any(k2 in n for k2 in keys):
            return c, h, s
    return list(colors[:3]), list(hexes[:2]), stone


def rgba_glow(stone: str, a: float = 0.5) -> str:
    h = stone.lstrip("#")
    r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
    return f"rgba({r},{g},{b},{a})"


def hex_to_rgb(h: str):
    h = h.lstrip("#")
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))


def lighten(h: str, f: float = 0.4) -> str:
    r, g, b = hex_to_rgb(h)
    return f"#{int(r + (255 - r) * f):02x}{int(g + (255 - g) * f):02x}{int(b + (255 - b) * f):02x}"


def darken(h: str, f: float = 0.5) -> str:
    r, g, b = hex_to_rgb(h)
    return f"#{int(r * (1 - f)):02x}{int(g * (1 - f)):02x}{int(b * (1 - f)):02x}"


def make_svg(path: Path, stone: str) -> None:
    lite, mid, dark, edge = lighten(stone), stone, darken(stone), lighten(stone, 0.15)
    path.write_text(
        f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="800" height="600">
  <defs>
    <radialGradient id="bg" cx="50%" cy="42%" r="70%">
      <stop offset="0%" stop-color="{lite}"/>
      <stop offset="60%" stop-color="{mid}"/>
      <stop offset="100%" stop-color="{dark}"/>
    </radialGradient>
    <linearGradient id="fl" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{lite}"/>
      <stop offset="100%" stop-color="{dark}"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#bg)"/>
  <polygon points="200,40 320,120 280,260 120,260 80,120" fill="url(#fl)" opacity=".95"/>
  <polygon points="200,40 320,120 200,150" fill="{lite}" opacity=".35"/>
  <polygon points="200,40 80,120 200,150" fill="{edge}" opacity=".25"/>
  <circle cx="185" cy="110" r="8" fill="#fff" opacity=".45"/>
</svg>
'''
    )


def make_desc(name: str, formula: str, klass: str, system: str, mohs: float) -> str:
    fbit = f" Idealized chemistry is often written {formula}." if formula and formula != "—" else ""
    return (
        f"{name} is an IMA-recognized mineral species classed as {klass.lower()}, "
        f"typically crystallizing in the {system.lower()} system "
        f"(≈Mohs {mohs:g}).{fbit} "
        f"It appears in collector cabinets and teaching sets as a reference for "
        f"{klass.split('—')[0].strip().lower()} mineralogy; locality and habit vary widely."
    )


def js_escape(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def gem_js(g: dict, img_path: str) -> str:
    colors = ",".join(f'"{c}"' for c in g["colors"])
    origins = ",".join(f'"{o}"' for o in g["origins"])
    ch = ",".join(f'"{c}"' for c in g["colorHex"])
    return (
        f' {{name:"{js_escape(g["name"])}",price:"{js_escape(g["price"])}",img:"{img_path}",'
        f'formula:"{js_escape(g["formula"])}",class:"{js_escape(g["klass"])}",system:"{js_escape(g["system"])}",'
        f'mohs:{g["mohs"]},sg:"{g["sg"]}",ri:"{g["ri"]}",colorHex:[{ch}],stone:"{g["stone"]}",'
        f'glow:"{g["glow"]}",colors:[{colors}],origins:[{origins}],'
        f'desc:"{js_escape(g["desc"])}"}}'
    )


def existing_names(text: str) -> set[str]:
    m = re.search(r"(?:var|const)\s+GEMS\s*=\s*\[(.*?)\];", text, re.S)
    if not m:
        raise SystemExit("GEMS array not found")
    return {n.lower() for n in re.findall(r'\{name:"([^"]+)"', m.group(1))}


def existing_slugs() -> set[str]:
    return {p.stem for p in IMG.glob("*") if p.suffix.lower() in (".jpg", ".svg", ".png")}


def api(params, retries=3):
    q = urllib.parse.urlencode({**params, "format": "json"})
    url = f"https://commons.wikimedia.org/w/api.php?{q}"
    delay = 1.5
    for attempt in range(retries):
        time.sleep(0.15)
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        try:
            with urllib.request.urlopen(req, context=ctx, timeout=12) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code in (429, 503) and attempt < retries - 1:
                time.sleep(delay)
                delay = min(delay * 2, 30)
                continue
            raise


def search_commons(term: str, limit: int = 4):
    data = api({"action": "query", "list": "search", "srsearch": term, "srnamespace": 6, "srlimit": limit})
    return [x["title"].removeprefix("File:") for x in data["query"]["search"]]


def info_commons(title: str):
    data = api({"action": "query", "titles": f"File:{title}", "prop": "imageinfo", "iiprop": "url|size|mime"})
    for p in data["query"]["pages"].values():
        if "missing" in p:
            return None
        return p["imageinfo"][0]


def download_jpg(url: str, dest: Path, max_w: int = 900):
    if Image is None:
        raise RuntimeError("PIL required for JPG download")
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, context=ctx, timeout=20) as r:
        data = r.read()
    img = Image.open(io.BytesIO(data))
    if img.mode != "RGB":
        img = img.convert("RGB")
    w, h = img.size
    if min(w, h) < 80:
        raise ValueError("too small")
    if w > max_w:
        img = img.resize((max_w, int(h * max_w / w)), Image.Resampling.LANCZOS)
    img.save(dest, "JPEG", quality=84, optimize=True)


def fetch_photo(name: str, slug: str, sources: dict) -> bool:
    jpg = IMG / f"{slug}.jpg"
    if jpg.exists() and jpg.stat().st_size > 6000:
        return True
    skip_ext = (".pdf", ".svg", ".png", ".gif", ".tif", ".tiff", ".webp")
    try:
        titles = search_commons(f"{name} mineral crystal specimen")
    except Exception:
        return False
    for title in titles:
        low = title.lower()
        if low.endswith(skip_ext):
            continue
        if any(x in low for x in ("map of", "logo", "flag", "portrait", "painting", "coin", "stamp", "diagram")):
            continue
        try:
            inf = info_commons(title)
        except Exception:
            continue
        if not inf or not inf.get("mime", "").startswith("image/"):
            continue
        if inf.get("size", 0) < 12000:
            continue
        try:
            download_jpg(inf["url"], jpg)
            sources[slug] = title
            return True
        except Exception:
            continue
    return False


def build_candidates(have: set[str]) -> list[dict]:
    wd = json.loads(WD_JSON.read_text())
    wiki = json.loads(WIKI_JSON.read_text())
    wiki_set = {w.lower() for w in wiki if not SKIP_NAME_RE.search(w) and w not in SKIP_EXACT}

    # Map lowercase wd key → proper wiki name when available
    wiki_by_lower = {w.lower(): w for w in wiki}

    scored: list[tuple[int, str, dict]] = []
    for raw_name, meta in wd.items():
        if SKIP_NAME_RE.search(raw_name) or raw_name in SKIP_EXACT:
            continue
        if raw_name.startswith("UM") or " unnamed" in raw_name.lower():
            continue
        low = raw_name.lower()
        display = wiki_by_lower.get(low) or proper_name(raw_name)
        if display.lower() in have:
            continue
        if SKIP_NAME_RE.search(display) or display in SKIP_EXACT:
            continue
        formula = meta.get("formula") or "—"
        # Prefer Wikipedia-listed + has formula
        score = 0
        if low in wiki_set:
            score += 100
        if formula and formula != "—":
            score += 20
        if meta.get("system"):
            score += 5
        if meta.get("hardness"):
            score += 10
        # Prefer shorter classic names
        score += max(0, 40 - len(display))
        scored.append((score, display, meta))

    # Also include wiki-only names missing from wd
    for w in wiki:
        if SKIP_NAME_RE.search(w) or w in SKIP_EXACT:
            continue
        if w.lower() in have:
            continue
        if any(s[1].lower() == w.lower() for s in scored):
            continue
        scored.append((90, w, {}))

    scored.sort(key=lambda t: (-t[0], t[1].lower()))
    out = []
    seen = set(have)
    for score, display, meta in scored:
        low = display.lower()
        if low in seen:
            continue
        seen.add(low)
        formula = meta.get("formula") or "—"
        # Normalize unicode digits already in WD formulas
        klass = infer_class(formula, display)
        system = clean_system(meta.get("system"))
        mohs = parse_mohs(meta.get("hardness"), klass)
        colors, hexes, stone = color_pack(klass, display)
        origins = ORIGIN_BY_CLASS.get(klass.split("—")[0].strip(), ["Worldwide", "Various localities"])[:4]
        g = {
            "name": display,
            "price": price_for(mohs, klass, display),
            "formula": formula,
            "klass": klass,
            "system": system,
            "mohs": mohs,
            "sg": approx_sg(klass, mohs),
            "ri": approx_ri(klass),
            "colorHex": hexes,
            "stone": stone,
            "glow": rgba_glow(stone),
            "colors": colors,
            "origins": origins,
            "desc": make_desc(display, formula, klass, system, mohs),
        }
        out.append(g)
        if len(out) >= TARGET_NEW:
            break
    return out


def write_gems_js(base_text: str, gems: list[dict]) -> None:
    entries = []
    for g in gems:
        jpg = IMG / f"{g['slug']}.jpg"
        img = (
            f"images/{g['slug']}.jpg"
            if jpg.exists() and jpg.stat().st_size > 6000
            else f"images/{g['slug']}.svg"
        )
        entries.append(gem_js(g, img))

    end = base_text.rfind("];")
    if end < 0:
        raise SystemExit("GEMS end not found")
    before = base_text[:end].rstrip()
    if before.endswith("}"):
        before = before + ","
    DATA_JS.write_text(before + "\n" + ",\n".join(entries) + "\n];\n")


def main():
    import argparse

    global TARGET_NEW

    ap = argparse.ArgumentParser()
    ap.add_argument("--photos", type=int, default=1000, help="Max Commons photo attempts (0=skip)")
    ap.add_argument("--workers", type=int, default=5)
    ap.add_argument("--target", type=int, default=None, help="Number of NEW gems to add")
    ap.add_argument("--total", type=int, default=None, help="Desired total catalog size (computes --target)")
    args = ap.parse_args()

    assert WD_JSON.exists(), f"Missing {WD_JSON}"
    assert WIKI_JSON.exists(), f"Missing {WIKI_JSON}"
    assert DATA_JS.exists(), f"Missing {DATA_JS}"
    IMG.mkdir(exist_ok=True)

    text = DATA_JS.read_text()
    have = existing_names(text)
    print(f"Existing GEMS: {len(have)}")

    if args.total is not None:
        TARGET_NEW = max(0, args.total - len(have))
    elif args.target is not None:
        TARGET_NEW = args.target
    print(f"TARGET_NEW: {TARGET_NEW} (desired total ~{len(have)+TARGET_NEW})")
    if TARGET_NEW <= 0:
        print("Nothing to add.")
        return

    gems = build_candidates(have)
    print(f"Selected new gems: {len(gems)}")
    if len(gems) < TARGET_NEW:
        raise SystemExit(f"Only found {len(gems)} candidates, need {TARGET_NEW}")

    used_slugs = existing_slugs()
    for g in gems:
        base = slugify(g["name"])
        slug = base
        n = 2
        while slug in used_slugs:
            slug = f"{base}-{n}"
            n += 1
        used_slugs.add(slug)
        g["slug"] = slug

    print("Writing SVGs…")
    for i, g in enumerate(gems, 1):
        make_svg(IMG / f"{g['slug']}.svg", g["stone"])
        if i % 200 == 0:
            print(f"  svg {i}/{len(gems)}")

    # Commit catalog immediately with SVG paths so a killed photo pass still leaves 1200 gems
    write_gems_js(text, gems)
    names = re.findall(r'\{name:"([^"]+)"', DATA_JS.read_text())
    print(f"Wrote gems-data.js with {len(names)} entries (pre-photo)")

    sources = json.loads(SOURCES.read_text()) if SOURCES.exists() else {}
    photo_ok = 0
    photo_fail = 0
    photo_targets = gems[: max(0, args.photos)]

    if photo_targets:
        print(f"Attempting Commons photos for {len(photo_targets)} (workers={args.workers})…")
        # Serialize source dict updates
        import threading

        lock = threading.Lock()

        def job(g):
            local = {}
            try:
                ok = fetch_photo(g["name"], g["slug"], local)
            except Exception:
                ok = False
            return g["slug"], ok, local

        with ThreadPoolExecutor(max_workers=args.workers) as ex:
            futs = [ex.submit(job, g) for g in photo_targets]
            done = 0
            for fut in as_completed(futs):
                slug, ok, local = fut.result()
                done += 1
                with lock:
                    sources.update(local)
                    if ok:
                        photo_ok += 1
                    else:
                        photo_fail += 1
                if done % 25 == 0:
                    SOURCES.write_text(json.dumps(sources, indent=2) + "\n")
                    print(f"  photos {done}/{len(photo_targets)} (ok={photo_ok}, fail={photo_fail})")

        SOURCES.write_text(json.dumps(sources, indent=2) + "\n")
        # Rewrite JS so successful JPGs are referenced
        write_gems_js(text, gems)

    names = re.findall(r'\{name:"([^"]+)"', DATA_JS.read_text())
    jpg_count = sum(
        1
        for g in gems
        if (IMG / f"{g['slug']}.jpg").exists() and (IMG / f"{g['slug']}.jpg").stat().st_size > 6000
    )
    print(f"GEMS count: {len(names)}")
    print(f"Unique names: {len(set(n.lower() for n in names))}")
    print(f"New photos OK: {photo_ok}, photo attempts failed: {photo_fail}")
    print(f"New gems with JPG: {jpg_count}, SVG-only: {len(gems) - jpg_count}")
    expected = len(have) + len(gems)
    if len(names) != expected:
        print(f"WARNING: expected {expected}, got {len(names)}")
    mid = gems[min(100, len(gems) - 1)]["name"]
    print(f"Sample new: {gems[0]['name']}, {mid}, {gems[-1]['name']}")


if __name__ == "__main__":
    main()

