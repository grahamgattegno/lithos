#!/usr/bin/env python3
"""Fix inaccurate radioactive-tier mineral metadata in gems-data.js."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "gems-data.js"

# Handwritten corrections for uranium/thorium minerals with placeholder copy.
RADIOACTIVE_CORRECTIONS: dict[str, dict] = {
    "Zippeite": {
        "mohs": 2,
        "colors": ["Yellow", "Orange"],
        "origins": ["USA", "Spain", "Chile"],
        "desc": "Potassium uranyl sulfate — soft yellow to orange crusts on oxidized uranium ore. Named for Austrian mineralogist Adolf Zippe; forms in the weathering zone of U deposits.",
    },
    "Carnotite": {
        "mohs": 2,
        "colors": ["Bright yellow", "Canary yellow"],
        "origins": ["USA (Colorado Plateau)", "Congo", "Morocco"],
        "desc": "Potassium uranyl vanadate — the classic bright yellow ore of the Colorado Plateau, often coating sandstone with tyuyamunite. Soft, radioactive, and historically a major U source.",
    },
    "Haiweeite": {
        "mohs": 2.5,
        "colors": ["Yellow-green", "Green"],
        "origins": ["USA (California)", "Congo"],
        "desc": "Calcium uranyl silicate — yellow-green coatings named for Haiwee Reservoir, California. A secondary uranium mineral of the oxidized zone; soft and radioactive.",
    },
    "Johannite": {
        "mohs": 2,
        "colors": ["Emerald green", "Blue-green"],
        "origins": ["Germany", "USA", "Congo"],
        "desc": "Copper uranyl sulfate — vivid green crystals from Johanngeorgenstadt, Saxony. Soft, radioactive, and a classic secondary mineral of oxidized uranium veins.",
    },
    "Schoepite": {
        "mohs": 2.5,
        "colors": ["Yellow", "Orange-yellow"],
        "origins": ["Congo", "USA", "France"],
        "desc": "Hydrated uranyl oxide-hydroxide — yellow alteration crusts on uraninite, especially from Shinkolobwe and other African U deposits. Named for Belgian mineralogist Alfred Schoep.",
    },
    "Zeunerite": {
        "mohs": 2.5,
        "colors": ["Emerald green", "Apple green"],
        "origins": ["Germany", "USA", "Portugal"],
        "desc": "Copper uranyl arsenate — emerald-green square plates, the arsenic analogue of autunite. Soft, radioactive, and dehydrates to metazeunerite.",
    },
    "Curite": {
        "mohs": 3,
        "colors": ["Orange-red", "Red-brown"],
        "origins": ["Congo", "Germany"],
        "desc": "Lead uranyl oxide-hydroxide — orange-red crusts from Shinkolobwe, Congo. Named for Marie Curie; a secondary uranium mineral of deeply oxidized U ore.",
    },
    "Cuprosklodowskite": {
        "mohs": 4,
        "colors": ["Emerald green", "Yellow-green"],
        "origins": ["Congo", "Germany", "USA"],
        "desc": "Copper uranyl silicate — bright green fibrous crystals from Katanga, named for Marie Skłodowska-Curie. Radioactive; a signature mineral of the Shinkolobwe assemblage.",
    },
    "Ekanite": {
        "mohs": 5.5,
        "colors": ["Green", "Brownish green"],
        "origins": ["Sri Lanka", "Myanmar", "Canada"],
        "desc": "Calcium thorium silicate — one of the few faceted gems containing significant thorium. First found near Eheliyagoda, Sri Lanka; green stones are rare collector gems.",
    },
    "Mundite": {
        "mohs": 2.5,
        "colors": ["Yellow", "Pale green"],
        "origins": ["France", "Portugal", "Germany"],
        "desc": "Aluminium uranyl phosphate — soft yellow crusts from the Autun-type uranium deposits of France. A secondary phosphate of oxidized U-bearing rocks.",
    },
    "Thorite": {
        "mohs": 4.5,
        "colors": ["Brown", "Black", "Orange"],
        "origins": ["Norway", "Madagascar", "USA"],
        "desc": "Thorium silicate — brown to black tetragonal crystals, historically the main ore of thorium. Named for the element thorium; radioactive and often metamict.",
    },
    "Upalite": {
        "mohs": 2.5,
        "colors": ["Yellow", "Pale yellow"],
        "origins": ["France", "Portugal"],
        "desc": "Aluminium uranyl phosphate — soft yellow crusts from French and Portuguese uranium deposits. Closely related to mundite in the uranyl phosphate group.",
    },
    "Albrechtschraufite": {
        "mohs": 2.5,
        "colors": ["Yellow-green", "Green"],
        "origins": ["Germany (Jáchymov)", "Czech Republic"],
        "desc": "Magnesium calcium uranyl carbonate-fluoride — yellow-green crusts from the Jáchymov (Joachimsthal) district, a classic Central European uranium field.",
    },
    "Kasolite": {
        "mohs": 4.5,
        "colors": ["Yellow", "Brown", "Orange"],
        "origins": ["Congo", "Germany", "USA"],
        "desc": "Lead uranyl silicate — yellow to brown tabular crystals, named for Kasolo in Katanga. Radioactive secondary mineral of oxidized uranium-lead veins.",
    },
    "Masuyite": {
        "mohs": 3,
        "colors": ["Dark brown", "Black"],
        "origins": ["Congo", "Germany"],
        "desc": "Lead uranyl oxide-hydroxide — dark brown to black crusts from Shinkolobwe, Congo. A late-stage alteration product of uraninite in deeply weathered U ore.",
    },
    "Soddyite": {
        "mohs": 2.5,
        "colors": ["Yellow", "Pale yellow"],
        "origins": ["Congo", "USA", "Germany"],
        "desc": "Uranyl silicate — soft yellow crusts named for radiochemist Frederick Soddy. Common secondary uranium mineral on altered uraninite.",
    },
    "Umohoite": {
        "mohs": 2,
        "colors": ["Yellow", "Pale yellow"],
        "origins": ["USA (Colorado)", "Czech Republic"],
        "desc": "Uranyl molybdate — soft yellow coatings from Colorado and Jáchymov. One of the few natural uranyl molybdates; radioactive and water-soluble.",
    },
    "Weeksite": {
        "mohs": 2.5,
        "colors": ["Yellow-green", "Green"],
        "origins": ["USA (Utah)", "USA (Colorado)"],
        "desc": "Potassium uranyl silicate — yellow-green fibrous masses from Utah and Colorado. Named for Weeks Island, Louisiana (type locality in salt-dome U deposits).",
    },
    "Wyartite": {
        "mohs": 3.5,
        "colors": ["Black", "Dark violet"],
        "origins": ["Congo", "France"],
        "desc": "Calcium uranyl carbonate-oxide — unusual black crystals containing U⁵⁺, from Shinkolobwe. Named for Belgian mineralogist Jean Wyart; highly radioactive.",
    },
    "Althupite": {
        "mohs": 2.5,
        "colors": ["Yellow", "Greenish yellow"],
        "origins": ["France (Autun)", "Germany"],
        "desc": "Aluminium thorium uranyl phosphate — soft yellow crusts from Autun, France. One of the few minerals combining thorium and uranium in the same structure.",
    },
    "Bayleyite": {
        "mohs": 2.5,
        "colors": ["Yellow", "Pale yellow"],
        "origins": ["USA (Utah)", "Germany"],
        "desc": "Magnesium uranyl carbonate — soft yellow efflorescences from Utah U deposits. Named for USGS chemist W. S. Bayley; very soluble and short-lived on exposure.",
    },
    "Bergenite": {
        "mohs": 2.5,
        "colors": ["Yellow", "Pale yellow-green"],
        "origins": ["Germany (Schneeberg)", "Congo"],
        "desc": "Calcium barium uranyl phosphate — yellow crusts from Schneeberg, Saxony. A rare secondary phosphate of complex U-Ba assemblages.",
    },
    "Clarkeite": {
        "mohs": 3,
        "colors": ["Black", "Dark brown"],
        "origins": ["Congo", "USA"],
        "desc": "Sodium-calcium-lead uranyl oxide-hydroxide — black alteration rims around uraninite, especially from Shinkolobwe. Named for Frank Wigglesworth Clarke.",
    },
    "Coffinite": {
        "mohs": 5.5,
        "colors": ["Black", "Grey-black"],
        "origins": ["USA (Colorado Plateau)", "Congo", "Canada"],
        "desc": "Uranium silicate — dense black grains that can replace or accompany uraninite in sandstone-hosted U deposits. Named for Pierre Coffin; an important U ore mineral.",
    },
    "Huttonite": {
        "mohs": 5,
        "colors": ["Colourless", "Pale yellow"],
        "origins": ["Canada (Ontario)", "Madagascar"],
        "desc": "Monoclinic dimorph of thorite (ThSiO₄) — colourless to pale yellow, much rarer than tetragonal thorite. Named for geologist James Hutton; found in granitic pegmatites.",
    },
    "Liebigite": {
        "mohs": 2.5,
        "colors": ["Yellow-green", "Green"],
        "origins": ["Germany", "USA", "Czech Republic"],
        "desc": "Calcium uranyl carbonate — yellow-green crusts named for chemist Justus von Liebig. A secondary carbonate of oxidized uranium deposits.",
    },
    "Rameauite": {
        "formula": "K₂Ca[(UO₂)₆O₆(OH)₄]·8H₂O",
        "mohs": 2.5,
        "colors": ["Yellow", "Orange-yellow"],
        "origins": ["France", "Congo"],
        "desc": "Potassium calcium uranyl oxide-hydroxide — yellow crusts from French and African U deposits. A rare secondary phase in the uraninite alteration series.",
    },
    "Steacyite": {
        "mohs": 5,
        "colors": ["Brown", "Grey-brown"],
        "origins": ["Canada (Quebec)", "Russia"],
        "desc": "Potassium thorium silicate — brown alteration product of ekanite-group minerals in Quebec pegmatites. Named for Canadian mineralogist H. R. Steacy.",
    },
    "Ulrichite": {
        "mohs": 2.5,
        "colors": ["Green", "Yellow-green"],
        "origins": ["Australia", "Germany"],
        "desc": "Calcium copper uranyl phosphate — green crusts from the Mount Painter district, South Australia. Named for Australian geologist H. H. Ulrich.",
    },
    "Zellerite": {
        "mohs": 2.5,
        "colors": ["Yellow", "Pale yellow"],
        "origins": ["USA (Colorado)", "Germany"],
        "desc": "Calcium uranyl carbonate — soft yellow efflorescences from Colorado Plateau U mines. Named for mineral collector M. Zeller.",
    },
    "Znucalite": {
        "mohs": 2.5,
        "colors": ["Yellow", "Greenish yellow"],
        "origins": ["Czech Republic (Jáchymov)", "Germany"],
        "desc": "Calcium zinc uranyl carbonate-hydroxide — yellow crusts from Jáchymov, one of the most zinc-rich uranyl carbonates known. Soft and radioactive.",
    },
    "Aspedamite": {
        "formula": "☐₁₂(Fe²⁺,Mg)₄Nb₄(Th,Nb)Fe²⁺₃Ti₄O₄₂(H₂O)₉(OH)₃",
        "class": "Oxide",
        "system": "Cubic",
        "mohs": 5.5,
        "colors": ["Brown", "Black"],
        "origins": ["Italy (Sardinia)"],
        "desc": "Niobium iron titanium oxide with essential thorium — discovered in Sardinian pegmatites. Very rare; radioactive due to Th content in a complex cubic structure.",
    },
    "Cleusonite": {
        "mohs": 6,
        "colors": ["Black", "Dark brown"],
        "origins": ["Italy (Valais)", "Switzerland"],
        "desc": "Lead strontium uranothorite-related oxide — black metamict grains from alpine fissures near the Cleuson dam, Switzerland. Contains both U and Th; named for the type locality.",
    },
    "Ichnusaite": {
        "mohs": 2,
        "colors": ["Colourless", "Pale yellow"],
        "origins": ["Italy (Sardinia)"],
        "desc": "Thorium molybdate — colourless to pale yellow crusts from Sardinian fumaroles, approved in 2013. One of the few natural Th-Mo minerals; radioactive.",
    },
    "Nuragheite": {
        "mohs": 2,
        "colors": ["Colourless", "White"],
        "origins": ["Italy (Sardinia)"],
        "desc": "Thorium molybdate dihydrate — a Sardinian fumarole mineral closely related to ichnusaite. Soft, radioactive, and named for Sardinian nuraghe towers.",
    },
    "Parsonsite": {
        "mohs": 3,
        "colors": ["Yellow", "Pale green"],
        "origins": ["USA (Utah)", "Congo"],
        "desc": "Lead uranyl phosphate — yellow to greenish plates from Utah and Shinkolobwe. Named for mineralogist A. L. Parsons; a secondary U-Pb phosphate.",
    },
    "Sengierite": {
        "mohs": 2.5,
        "colors": ["Green", "Yellow-green"],
        "origins": ["Congo", "Germany"],
        "desc": "Copper uranyl vanadate-hydroxide — green crusts from Kolwezi, Katanga. Named for Belgian geologist Pierre Sengier; radioactive secondary U-V mineral.",
    },
    "Thorianite": {
        "mohs": 6.5,
        "colors": ["Black", "Brownish black"],
        "origins": ["Sri Lanka", "Madagascar", "Brazil"],
        "desc": "Thorium dioxide — dense black cubic crystals, the primary ore of thorium. Type locality Sri Lanka; extremely radioactive and historically mined for Th.",
    },
    "Uranophane": {
        "mohs": 2.5,
        "colors": ["Yellow", "Greenish yellow"],
        "origins": ["Czech Republic", "USA", "Congo"],
        "desc": "Calcium uranyl silicate — fibrous yellow to greenish-yellow masses, a common secondary uranium mineral worldwide. Named from Greek 'uran' and 'phainesthai' (to appear).",
    },
    "Vanuralite": {
        "mohs": 2,
        "colors": ["Yellow-green", "Green"],
        "origins": ["USA (Colorado)", "Congo"],
        "desc": "Aluminium uranyl vanadate-hydroxide — soft yellow-green crusts from Colorado Plateau U mines. A rare Al-U-V secondary mineral.",
    },
    "Agrinierite": {
        "mohs": 3,
        "colors": ["Yellow", "Orange-yellow"],
        "origins": ["France", "Congo"],
        "desc": "Potassium calcium uranyl oxide-hydroxide — yellow crusts from Shinkolobwe and French U deposits. Named for mineral collector J. Agrinier.",
    },
    "Andersonite": {
        "mohs": 2.5,
        "colors": ["Yellow-green", "Green"],
        "origins": ["USA (Utah)", "USA (Arizona)"],
        "desc": "Sodium calcium uranyl carbonate — fluorescent yellow-green crusts from Utah U mines. One of the most vividly fluorescent uranium minerals under UV.",
    },
    "Boltwoodite": {
        "mohs": 3.5,
        "colors": ["Yellow", "Orange-yellow"],
        "origins": ["USA (Utah)", "Congo"],
        "desc": "Potassium-sodium uranyl silicate — yellow fibrous masses named for radiochemist Bertram Boltwood. A key U-dating mineral from Utah and African U deposits.",
    },
    "Tyuyamunite": {
        "mohs": 2,
        "colors": ["Yellow-green", "Green"],
        "origins": ["Kazakhstan", "USA (Colorado Plateau)", "Congo"],
        "desc": "Calcium uranyl vanadate — the calcium analogue of carnotite, forming yellow-green crusts. Type locality Tyuya Muyun, Kyrgyzstan; a major U-V ore mineral.",
    },
    "Uranopilite": {
        "mohs": 2.5,
        "colors": ["Yellow", "Orange-yellow"],
        "origins": ["Congo", "USA", "Germany"],
        "desc": "Uranyl sulfate oxide-hydroxide — soft yellow fibrous masses from Shinkolobwe and other U deposits. Highly soluble; specimens must be stored dry.",
    },
    "Abernathyite": {
        "mohs": 2.5,
        "colors": ["Yellow-green", "Green"],
        "origins": ["USA (Utah)", "USA (Colorado)"],
        "desc": "Potassium uranyl arsenate — greenish-yellow crystals from Utah, the arsenic analogue of uranospinite. Named for USGS chemist F. Abernathy.",
    },
    "Becquerelite": {
        "mohs": 2.5,
        "colors": ["Yellow", "Orange-yellow"],
        "origins": ["Congo", "France", "Germany"],
        "desc": "Calcium uranyl oxide-hydroxide — yellow crusts named for Henri Becquerel, discoverer of radioactivity. A common alteration product of uraninite.",
    },
    "Euxenite-(Y)": {
        "mohs": 5.5,
        "colors": ["Black", "Brownish black"],
        "origins": ["Norway", "Canada", "Madagascar"],
        "desc": "Yttrium niobium-tantalum oxide with U and Th — black metamict pegmatite mineral, historically an ore of Nb, Ta, and rare earths. Radioactive and often opaque.",
    },
    "Guilleminite": {
        "class": "Selenite",
        "mohs": 2.5,
        "colors": ["Yellow", "Pale yellow"],
        "origins": ["Congo (Musonoi)"],
        "desc": "Barium uranyl selenite — yellow crystals from Musonoi mine, Katanga, one of the few uranyl selenites. Soft, radioactive, and named for crystallographer Henri Guillemin.",
    },
    "Mathesiusite": {
        "formula": "K₂(UO₂)₂(SO₄)(VO₄)·3H₂O",
        "mohs": 2.5,
        "colors": ["Yellow", "Orange-yellow"],
        "origins": ["USA (Utah)", "Czech Republic"],
        "desc": "Potassium uranyl sulfate-vanadate — yellow crusts from Utah and Jáchymov. A rare mixed S-V uranyl mineral of the oxidized zone.",
    },
    "Sklodowskite": {
        "mohs": 3,
        "colors": ["Yellow-green", "Green"],
        "origins": ["Congo", "Germany", "Czech Republic"],
        "desc": "Magnesium uranyl silicate — yellow-green fibres named for Marie Skłodowska-Curie. The Mg analogue of uranophane; common at Jáchymov and Shinkolobwe.",
    },
    "Uranocircite": {
        "mohs": 2.5,
        "colors": ["Yellow-green", "Green"],
        "origins": ["Germany", "USA", "Czech Republic"],
        "desc": "Barium uranyl phosphate — yellow-green square plates, the barium analogue of autunite. Soft, fluorescent, and a classic cabinet uranium mineral.",
    },
    "Wolfsriedite": {
        "mohs": 3,
        "colors": ["Yellow", "Greenish yellow"],
        "origins": ["Germany (Bavaria)"],
        "desc": "Lead uranyl tungstate-hydroxide — yellow crusts from Wolfsried, Bavaria. A rare U-W secondary mineral of the Jáchymov-Bavarian uranium province.",
    },
    "Yingjiangite": {
        "mohs": 2.5,
        "colors": ["Yellow", "Pale yellow-green"],
        "origins": ["China (Yunnan)"],
        "desc": "Potassium calcium uranyl phosphate-hydroxide — yellow crusts from Yingjiang, Yunnan, China. A recently described member of the uranyl phosphate group.",
    },
    "Brockite": {
        "mohs": 4.5,
        "colors": ["Brown", "Yellow-brown"],
        "origins": ["USA (Florida)", "Brazil"],
        "desc": "Calcium thorium phosphate — brown to yellow grains in Florida phosphate gravels and pegmatites. Named for mineralogist M. R. Brock; radioactive when Th-rich.",
    },
    "Fourmarierite": {
        "mohs": 3,
        "colors": ["Red-brown", "Orange"],
        "origins": ["Congo", "Germany"],
        "desc": "Lead uranyl oxide-hydroxide — red-brown crusts from Shinkolobwe. Named for Belgian geologist Pierre Fourmarier; a late-stage uraninite alteration product.",
    },
    "Francevillite": {
        "mohs": 2.5,
        "colors": ["Yellow-green", "Green"],
        "origins": ["Gabon", "Congo", "France"],
        "desc": "Barium uranyl vanadate — yellow-green crusts from Franceville, Gabon. The Ba analogue of carnotite; radioactive secondary U-V mineral.",
    },
    "Margaritasite": {
        "mohs": 2.5,
        "colors": ["Yellow", "Greenish yellow"],
        "origins": ["USA (Arizona)", "Congo"],
        "desc": "Caesium uranyl vanadate — yellow crusts from the Margarita mine, Arizona. One of the few Cs-bearing uranium minerals; soft and radioactive.",
    },
    "Metazeunerite": {
        "mohs": 2.5,
        "colors": ["Green", "Dark green"],
        "origins": ["Germany", "USA", "Portugal"],
        "desc": "Dehydrated copper uranyl arsenate — the meta form of zeunerite, forming darker green pseudomorphs after the hydrated mineral. Soft and radioactive.",
    },
    "Rutherfordine": {
        "mohs": 2.5,
        "colors": ["Yellow", "Pale yellow"],
        "origins": ["Czech Republic (Jáchymov)", "Canada"],
        "desc": "Uranyl carbonate — soft yellow crystals named for Ernest Rutherford. One of the simplest U minerals; common at Jáchymov and other U deposits.",
    },
    "Studtite": {
        "mohs": 2.5,
        "colors": ["Yellow", "Orange-yellow"],
        "origins": ["Congo", "France", "Germany"],
        "desc": "Uranyl peroxide — the first natural peroxide mineral recognized, forming yellow crusts on altered uraninite. Named for mineralogist Adolf Studt; contains peroxide O₂²⁻.",
    },
}


def js_escape(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def parse_objects(text: str) -> list[tuple[int, int, str]]:
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


def set_str(chunk: str, key: str, value: str) -> str:
    if re.search(rf'{key}:"(?:\\.|[^"\\])*"', chunk):
        return re.sub(rf'{key}:"(?:\\.|[^"\\])*"', f'{key}:"{js_escape(value)}"', chunk, count=1)
    return re.sub(r'(desc:")', f'{key}:"{js_escape(value)}",\\1', chunk, count=1)


def set_num(chunk: str, key: str, value: float) -> str:
    v = int(value) if float(value).is_integer() else value
    if re.search(rf"{key}:\d+(?:\.\d+)?", chunk):
        return re.sub(rf"{key}:\d+(?:\.\d+)?", f"{key}:{v}", chunk, count=1)
    return chunk


def set_array(chunk: str, key: str, values: list[str]) -> str:
    inner = ",".join(f'"{js_escape(v)}"' for v in values)
    arr = f"{key}:[{inner}]"
    if re.search(rf"{key}:\[[^\]]*\]", chunk):
        return re.sub(rf"{key}:\[[^\]]*\]", arr, chunk, count=1)
    return chunk


def main() -> None:
    text = DATA.read_text(encoding="utf-8")
    objs = parse_objects(text)
    fixed = 0
    new_parts: list[str] = []

    for _start, _end, chunk in objs:
        name = field_str(chunk, "name") or ""
        if name in RADIOACTIVE_CORRECTIONS:
            c = RADIOACTIVE_CORRECTIONS[name]
            if "formula" in c:
                chunk = set_str(chunk, "formula", c["formula"])
            if "class" in c:
                chunk = set_str(chunk, "class", c["class"])
            if "system" in c:
                chunk = set_str(chunk, "system", c["system"])
            if "mohs" in c:
                chunk = set_num(chunk, "mohs", float(c["mohs"]))
            if "colors" in c:
                chunk = set_array(chunk, "colors", c["colors"])
            if "origins" in c:
                chunk = set_array(chunk, "origins", c["origins"])
            if "desc" in c:
                chunk = set_str(chunk, "desc", c["desc"])
            fixed += 1
        new_parts.append(chunk)

    head = text[: objs[0][0]]
    tail = text[objs[-1][1] :]
    DATA.write_text(head + ",\n".join(new_parts) + tail, encoding="utf-8")
    print(f"fixed {fixed} radioactive minerals in {DATA}")


if __name__ == "__main__":
    main()
