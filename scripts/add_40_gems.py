#!/usr/bin/env python3
"""Add 40 gemstones: SVGs, Commons JPGs, GEMS entries, and Sixty→100 copy."""
import json, re, urllib.request, urllib.parse, ssl, io
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
IMG = ROOT / "images"
HTML = ROOT / "index.html"
SOURCES = IMG / "PHOTO_SOURCES.json"

ctx = ssl.create_default_context()
UA = "LithosGemCatalog/1.0 (educational; https://github.com/grahamgattegno/lithos)"

GEMS = [
dict(name="Obsidian", formula="SiO₂ (volcanic glass)", klass="Mineraloid — Glass", system="Amorphous", mohs=5.5, sg="2.40", ri="1.49",
     colorHex=["#1a1a1e","#0a0a0c"], stone="#1a1a1e", colors=["Deep black","Mahogany"], origins=["USA","Mexico","Iceland"],
     desc="Volcanic glass that cools so fast it never forms crystals. Obsidian breaks into razor-sharp edges — ancient peoples used it for knives and arrowheads. Snowflake obsidian has white speckles that look like falling snow.",
     search="Obsidian volcanic glass mineral specimen -arrowhead"),
dict(name="Smoky Quartz", formula="SiO₂", klass="Silicate — Quartz", system="Trigonal", mohs=7, sg="2.65", ri="1.55",
     colorHex=["#5a4a3a","#2e2418"], stone="#5a4a3a", colors=["Smoky brown","Grey"], origins=["Brazil","Scotland","Switzerland"],
     desc="A brown-to-grey variety of quartz coloured by natural radiation deep underground. Large clear crystals are common, and Scotland's Cairngorm mountains are famous for dark smoky quartz.",
     search="Smoky quartz crystal specimen"),
dict(name="Rock Crystal", formula="SiO₂", klass="Silicate — Quartz", system="Trigonal", mohs=7, sg="2.65", ri="1.55",
     colorHex=["#e8eef4","#c5d0dc"], stone="#dfe6ee", colors=["Colorless","Clear"], origins=["Brazil","Madagascar","Alps"],
     desc="Clear, colorless quartz — the classic crystal of fairy tales. People once thought it was forever-frozen ice. Today it's carved into spheres, points, and jewelry, and used in watches and electronics.",
     search="Rock crystal quartz clear specimen"),
dict(name="Ametrine", formula="SiO₂", klass="Silicate — Quartz", system="Trigonal", mohs=7, sg="2.65", ri="1.55",
     colorHex=["#7b3fb0","#d98a2b"], stone="#9a5a7a", colors=["Purple and gold"], origins=["Bolivia"],
     desc="A rare natural mix of amethyst and citrine in one crystal — half purple, half golden! Nearly all gem ametrine comes from Bolivia's Anahí mine, where the two colors grow side by side.",
     search="Ametrine crystal Bolivia"),
dict(name="Prasiolite", formula="SiO₂", klass="Silicate — Quartz", system="Trigonal", mohs=7, sg="2.65", ri="1.55",
     colorHex=["#7aaa6a","#4a7040"], stone="#7aaa6a", colors=["Pale green"], origins=["Brazil","Poland","Canada"],
     desc="A soft leek-green quartz, sometimes called green amethyst. Natural prasiolite is uncommon; much of the market material is heated amethyst that turns gently green.",
     search="Prasiolite green quartz gem"),
dict(name="Jasper", formula="SiO₂", klass="Silicate — Chalcedony", system="Trigonal", mohs=7, sg="2.60", ri="1.54",
     colorHex=["#a05030","#6a3018"], stone="#a05030", colors=["Red","Multicolor patterns"], origins=["India","Australia","USA"],
     desc="An opaque, patterned type of quartz that comes in almost every color. Picture jasper looks like tiny painted landscapes. It's tough, takes a polish, and has been carved into seals and beads for thousands of years.",
     search="Jasper polished mineral specimen red"),
dict(name="Chrysoprase", formula="SiO₂", klass="Silicate — Chalcedony", system="Trigonal", mohs=7, sg="2.60", ri="1.53",
     colorHex=["#3fbf7a","#228a52"], stone="#3fbf7a", colors=["Apple green"], origins=["Australia","Poland","Brazil"],
     desc="The most valuable green chalcedony — a bright apple-green color from tiny amounts of nickel. Australia produces some of the finest. Ancient Greeks and Romans prized it for seals and jewelry.",
     search="Chrysoprase green chalcedony"),
dict(name="Howlite", formula="Ca₂B₅SiO₉(OH)₅", klass="Silicate — Borosilicate", system="Monoclinic", mohs=3.5, sg="2.58", ri="1.59",
     colorHex=["#f2f0ea","#c8c4b8"], stone="#eceae4", colors=["White","Grey veins"], origins=["Canada","USA"],
     desc="A soft white stone with grey spiderweb veins. It's often dyed bright turquoise-blue for beads (which can confuse people!). Natural howlite looks a bit like marble with delicate cracks.",
     search="Howlite white mineral specimen"),
dict(name="Charoite", formula="K(Ca,Na)₂Si₄O₁₀(OH,F)·H₂O", klass="Silicate", system="Monoclinic", mohs=5.5, sg="2.60", ri="1.55",
     colorHex=["#7a4aa0","#4a2870"], stone="#7a4aa0", colors=["Purple swirls"], origins=["Russia"],
     desc="A swirling purple stone found in only one place on Earth — near the Chara River in Siberia. Its lilac ribbons look painted by hand. Discovered in the 1940s but only named in the 1970s.",
     search="Charoite purple mineral Russia"),
dict(name="Sugilite", formula="KNa₂(Fe,Mn,Al)₂Li₃Si₁₂O₃₀", klass="Silicate", system="Hexagonal", mohs=6.5, sg="2.75", ri="1.61",
     colorHex=["#6a2a8a","#3e1858"], stone="#6a2a8a", colors=["Purple","Magenta"], origins=["South Africa","Japan"],
     desc="A rich grape-purple gem named after Japanese petrologist Ken-ichi Sugi. Fine translucent sugilite is uncommon and popular with collectors. Most gem material comes from South Africa.",
     search="Sugilite purple gem mineral"),
dict(name="Kyanite", formula="Al₂SiO₅", klass="Silicate", system="Triclinic", mohs=5.5, sg="3.60", ri="1.72",
     colorHex=["#3a6ab0","#1e3f70"], stone="#3a6ab0", colors=["Blue","Blue-green"], origins=["Brazil","Nepal","USA"],
     desc="A blue blade-shaped crystal with a wild trick: it's Mohs 5 along its length but nearly 7 across — different hardness in different directions! Its name means 'blue' in Greek.",
     search="Kyanite blue crystal specimen"),
dict(name="Azurite", formula="Cu₃(CO₃)₂(OH)₂", klass="Carbonate", system="Monoclinic", mohs=3.75, sg="3.80", ri="1.75",
     colorHex=["#1a4aaa","#0e2866"], stone="#1a4aaa", colors=["Deep blue"], origins=["Morocco","USA","Namibia"],
     desc="A deep sky-to-royal blue copper mineral. Ancient artists ground it into blue paint. Soft and brittle, it's better for display than rings — but the color is unforgettable.",
     search="Azurite crystal mineral specimen"),
dict(name="Dioptase", formula="CuSiO₃·H₂O", klass="Silicate", system="Trigonal", mohs=5, sg="3.30", ri="1.67",
     colorHex=["#0f8a6a","#085a45"], stone="#0f8a6a", colors=["Emerald green"], origins=["Namibia","Congo","Kazakhstan"],
     desc="Tiny crystals of electric emerald-green, colored by copper. They sparkle like glass and look almost too bright to be real. Soft and fragile, so mostly for collectors' cabinets.",
     search="Dioptase green crystal specimen"),
dict(name="Pyrite", formula="FeS₂", klass="Sulfide", system="Cubic", mohs=6.5, sg="5.00", ri="—",
     colorHex=["#c9a84a","#8a7020"], stone="#c9a84a", colors=["Metallic gold"], origins=["Spain","Peru","USA"],
     desc="Fool's gold! Shiny metallic cubes that look like treasure but are iron sulfide. It sparks when struck and was once used in early firearms. Perfect cubes make awesome specimens.",
     search="Pyrite cubic crystal specimen"),
dict(name="Celestite", formula="SrSO₄", klass="Sulfate", system="Orthorhombic", mohs=3.5, sg="3.95", ri="1.62",
     colorHex=["#9ab8d8","#6a8ab0"], stone="#9ab8d8", colors=["Sky blue"], origins=["Madagascar","USA","Poland"],
     desc="Soft sky-blue crystals of strontium sulfate. Clusters from Madagascar look like frozen ice. Soft, so handle gently — but the pale blue glow is peaceful and beautiful.",
     search="Celestite blue crystal Madagascar"),
dict(name="Smithsonite", formula="ZnCO₃", klass="Carbonate", system="Trigonal", mohs=4.5, sg="4.40", ri="1.70",
     colorHex=["#7ab8a8","#4a8878"], stone="#7ab8a8", colors=["Blue-green","Pink"], origins=["Namibia","Mexico","USA"],
     desc="A zinc carbonate named after James Smithson (who funded the Smithsonian!). Botryoidal bubbly blue-green pieces look like candy. Soft, so usually shaped into smooth cabochons.",
     search="Smithsonite mineral specimen blue green"),
dict(name="Tsavorite", formula="Ca₃Al₂(SiO₄)₃", klass="Silicate — Garnet", system="Cubic", mohs=7.25, sg="3.60", ri="1.74",
     colorHex=["#1f8a4a","#0f5230"], stone="#1f8a4a", colors=["Vivid green"], origins=["Kenya","Tanzania"],
     desc="A bright green garnet colored by vanadium and chromium — discovered in East Africa in the 1960s and named for Tsavo National Park. Tougher than emerald and often cleaner.",
     search="Tsavorite green garnet gem"),
dict(name="Demantoid", formula="Ca₃Fe₂(SiO₄)₃", klass="Silicate — Garnet", system="Cubic", mohs=6.75, sg="3.85", ri="1.89",
     colorHex=["#2f9a4a","#186030"], stone="#2f9a4a", colors=["Green","Yellow-green"], origins=["Russia","Namibia","Italy"],
     desc="The diamond-like green garnet — demantoid has more fire (rainbow sparkle) than diamond! Famous Russian stones often show horsetail inclusions that collectors love.",
     search="Demantoid garnet green gem"),
dict(name="Heliodor", formula="Be₃Al₂Si₆O₁₈", klass="Silicate — Beryl", system="Hexagonal", mohs=7.75, sg="2.70", ri="1.58",
     colorHex=["#d4b84a","#a08820"], stone="#d4b84a", colors=["Golden yellow"], origins=["Brazil","Ukraine","Namibia"],
     desc="Golden-yellow beryl — same family as emerald and aquamarine. Its name means gift of the sun. Clean yellow crystals can be large and bright.",
     search="Heliodor golden beryl crystal"),
dict(name="Hiddenite", formula="LiAlSi₂O₆", klass="Silicate — Spodumene", system="Monoclinic", mohs=6.75, sg="3.18", ri="1.66",
     colorHex=["#6aaa5a","#3e7038"], stone="#6aaa5a", colors=["Yellow-green","Green"], origins=["USA","Brazil","Afghanistan"],
     desc="The green cousin of pink kunzite (both are spodumene). First found in North Carolina and named for mineralogist W.E. Hidden. Fine emerald-green stones are rare.",
     search="Hiddenite spodumene green crystal"),
dict(name="Red Beryl", formula="Be₃Al₂Si₆O₁₈", klass="Silicate — Beryl", system="Hexagonal", mohs=7.75, sg="2.70", ri="1.58",
     colorHex=["#c02840","#7a1428"], stone="#c02840", colors=["Raspberry red"], origins=["USA (Utah)"],
     desc="One of the rarest gems on Earth — raspberry-red beryl from Utah's Wah Wah Mountains. Far scarcer than emerald. Also called bixbite. Tiny crystals can still be worth a fortune.",
     search="Red beryl bixbite Utah crystal"),
dict(name="Fire Opal", formula="SiO₂·nH₂O", klass="Mineraloid", system="Amorphous", mohs=5.75, sg="2.00", ri="1.45",
     colorHex=["#d85a20","#a03810"], stone="#d85a20", colors=["Orange","Red-orange"], origins=["Mexico","Brazil","Ethiopia"],
     desc="A glowing orange-to-red opal that may or may not show play-of-color. Mexican fire opal is famous for its warm sunset hues. Softer than most gems, so best in protected settings.",
     search="Fire opal Mexico orange gem"),
dict(name="Coral", formula="CaCO₃", klass="Organic", system="Amorphous", mohs=3.5, sg="2.65", ri="1.55",
     colorHex=["#d85a5a","#a03030"], stone="#d85a5a", colors=["Red","Pink","White"], origins=["Mediterranean","Pacific","Japan"],
     desc="Not a mineral — it's the skeleton of tiny sea animals! Red coral has been prized jewelry for thousands of years. Soft and organic, so treat it gently and keep it away from acids.",
     search="Precious coral red gemstone polished"),
dict(name="Serpentine", formula="(Mg,Fe)₃Si₂O₅(OH)₄", klass="Silicate", system="Monoclinic", mohs=4, sg="2.55", ri="1.56",
     colorHex=["#5a8a4a","#3a5a30"], stone="#5a8a4a", colors=["Green","Mottled"], origins=["Afghanistan","China","USA"],
     desc="A green stone with a smooth, waxy feel, named because its patterns can look like snake skin. Soft enough to carve easily into animals and beads. Sometimes confused with jade.",
     search="Serpentine green mineral polished stone"),
dict(name="Unakite", formula="Epidote + Feldspar", klass="Rock (metamorphic)", system="—", mohs=6.5, sg="2.90", ri="—",
     colorHex=["#6a8a4a","#c07070"], stone="#7a8a5a", colors=["Green and pink"], origins=["USA","South Africa","Brazil"],
     desc="A speckled rock of green epidote and pink feldspar — like mint-and-berry ice cream! Named for the Unaka Mountains. Popular for beads and tumbled stones.",
     search="Unakite polished stone pink green"),
dict(name="Dumortierite", formula="Al₇BO₃(SiO₄)₃O₃", klass="Silicate — Borosilicate", system="Orthorhombic", mohs=7, sg="3.30", ri="1.68",
     colorHex=["#4a5aa0","#2a3568"], stone="#4a5aa0", colors=["Blue","Violet-blue"], origins=["Brazil","Madagascar","USA"],
     desc="A tough blue stone often mixed with quartz. Soft denim-to-violet blues make nice beads. Named after French paleontologist Eugène Dumortier.",
     search="Dumortierite blue mineral specimen"),
dict(name="Epidote", formula="Ca₂(Al,Fe)₃(SiO₄)₃(OH)", klass="Silicate", system="Monoclinic", mohs=6.5, sg="3.40", ri="1.75",
     colorHex=["#4a6a30","#2a4018"], stone="#4a6a30", colors=["Pistachio green"], origins=["Austria","Pakistan","USA"],
     desc="A pistachio-to-olive green mineral that often forms skinny, glossy crystals. The name means increase in Greek — for an optical property. Common in metamorphic rocks.",
     search="Epidote green crystal specimen"),
dict(name="Cuprite", formula="Cu₂O", klass="Oxide", system="Cubic", mohs=3.75, sg="6.10", ri="2.85",
     colorHex=["#8a1a1a","#4a0c0c"], stone="#8a1a1a", colors=["Deep red"], origins=["Namibia","Congo","USA"],
     desc="A deep ruby-red copper oxide. Faceted cuprite can look like dark red glass with high shine, but it's soft. Namibia has produced famous crystals.",
     search="Cuprite red crystal mineral"),
dict(name="Aragonite", formula="CaCO₃", klass="Carbonate", system="Orthorhombic", mohs=3.75, sg="2.95", ri="1.63",
     colorHex=["#d8c8a0","#a89060"], stone="#d8c8a0", colors=["White","Orange","Blue"], origins=["Spain","Morocco","Italy"],
     desc="Same chemistry as calcite, different crystal shape! Forms pretty hexagon-looking twins and coral-like branches. Pearls and some shells are made of aragonite.",
     search="Aragonite crystal specimen mineral"),
dict(name="Calcite", formula="CaCO₃", klass="Carbonate", system="Trigonal", mohs=3, sg="2.71", ri="1.55",
     colorHex=["#f0ebe0","#c8c0b0"], stone="#ebe6dc", colors=["Colorless","Many colors"], origins=["Mexico","USA","Iceland"],
     desc="One of Earth's most common minerals — chalk, limestone, and marble are made of it. Clear calcite doubles images underneath (double refraction). Soft enough to scratch with a copper coin.",
     search="Calcite crystal transparent specimen"),
dict(name="Uvarovite", formula="Ca₃Cr₂(SiO₄)₃", klass="Silicate — Garnet", system="Cubic", mohs=7.25, sg="3.75", ri="1.86",
     colorHex=["#1a7a3a","#0c4820"], stone="#1a7a3a", colors=["Emerald green"], origins=["Russia","Finland","Canada"],
     desc="A chrome-green garnet that usually grows as sparkly tiny crystals coating rock — like green sugar! Rarely large enough to facet. Named for Count Uvarov of Russia.",
     search="Uvarovite green garnet crystal"),
dict(name="Spessartine", formula="Mn₃Al₂(SiO₄)₃", klass="Silicate — Garnet", system="Cubic", mohs=7.25, sg="4.15", ri="1.80",
     colorHex=["#d86a20","#a04010"], stone="#d86a20", colors=["Orange","Red-orange"], origins=["Nigeria","Brazil","Madagascar"],
     desc="An orange-to-red garnet named for Germany's Spessart mountains. Mandarin-orange stones from Namibia and Nigeria are especially vivid and popular in jewelry.",
     search="Spessartine orange garnet gem"),
dict(name="Moldavite", formula="SiO₂-rich glass", klass="Tektite — Glass", system="Amorphous", mohs=5.5, sg="2.35", ri="1.50",
     colorHex=["#3a6a3a","#1e3a1e"], stone="#3a6a3a", colors=["Forest green"], origins=["Czech Republic"],
     desc="A mysterious green glass formed when a meteorite slammed into Earth about 15 million years ago! Found mostly in the Czech Republic. Collectors love its wrinkled, splashy shapes.",
     search="Moldavite tektite green glass Czech"),
dict(name="Variscite", formula="AlPO₄·2H₂O", klass="Phosphate", system="Orthorhombic", mohs=4.5, sg="2.50", ri="1.58",
     colorHex=["#5aaa7a","#3a7050"], stone="#5aaa7a", colors=["Apple green","Blue-green"], origins=["USA","Australia","Germany"],
     desc="A soft apple-green phosphate that can look a bit like turquoise. Utah and Nevada produce nice material for cabochons. Named for the German region of Variscia.",
     search="Variscite green mineral polished"),
dict(name="Seraphinite", formula="(Mg,Fe)₅Al(Si₃Al)O₁₀(OH)₈", klass="Silicate — Clinochlore", system="Monoclinic", mohs=2.5, sg="2.70", ri="1.58",
     colorHex=["#3a6a5a","#c8d8d0"], stone="#4a7a6a", colors=["Green with silver feathers"], origins=["Russia"],
     desc="A silky green stone with silvery feather patterns that look like angel wings — hence the trade name. Soft chlorite mineral from Siberia, usually cut as cabochons.",
     search="Seraphinite clinochlore Russia"),
dict(name="Pietersite", formula="SiO₂", klass="Silicate — Quartz", system="Trigonal", mohs=7, sg="2.65", ri="1.55",
     colorHex=["#4a3a2a","#c08040"], stone="#5a4a3a", colors=["Stormy blue-gold"], origins=["Namibia","China"],
     desc="A stormy mix of blue, gold, and black chatoyant fibers in quartz — like tiger's eye that got tangled in a hurricane! Discovered in Namibia by Sid Pieters.",
     search="Pietersite polished stone Namibia"),
dict(name="Hawk's Eye", formula="SiO₂", klass="Silicate — Quartz", system="Trigonal", mohs=7, sg="2.65", ri="1.55",
     colorHex=["#3a5a7a","#1e3048"], stone="#3a5a7a", colors=["Blue-grey bands"], origins=["South Africa"],
     desc="The blue cousin of tiger's eye. Same silky moving line of light (chatoyancy), but blue-grey instead of golden. When tiger's eye oxidizes, it can turn this color.",
     search="Hawk eye quartz blue tiger eye"),
dict(name="Cat's Eye", formula="BeAl₂O₄", klass="Oxide — Chrysoberyl", system="Orthorhombic", mohs=8.5, sg="3.73", ri="1.75",
     colorHex=["#c8a84a","#8a7020"], stone="#c8a84a", colors=["Honey with bright eye"], origins=["Sri Lanka","Brazil","India"],
     desc="Chrysoberyl with a sharp glowing band that slides as you turn it — like a cat's eye watching you! The finest milk and honey stones come from Sri Lanka.",
     search="Cat's eye chrysoberyl cabochon gem"),
dict(name="Padparadscha", formula="Al₂O₃", klass="Oxide — Corundum", system="Trigonal", mohs=9, sg="4.00", ri="1.77",
     colorHex=["#e87850","#c05030"], stone="#e87850", colors=["Pink-orange"], origins=["Sri Lanka","Madagascar","Vietnam"],
     desc="A rare sapphire the color of a lotus blossom at sunset — soft pink-orange. True padparadscha is scarce and highly prized. The name comes from a Sanskrit word for lotus.",
     search="Padparadscha sapphire gem pink orange"),
dict(name="Lepidolite", formula="K(Li,Al)₃(Al,Si,Rb)₄O₁₀(F,OH)₂", klass="Silicate — Mica", system="Monoclinic", mohs=3, sg="2.85", ri="1.56",
     colorHex=["#c090b8","#8a6080"], stone="#c090b8", colors=["Lilac","Pink"], origins=["Brazil","USA","Madagascar"],
     desc="A sparkly lilac mica that contains lithium. Soft and flaky in sheets, but dense pieces polish into pretty purple beads. A hint that lithium-rich pegmatites are nearby.",
     search="Lepidolite purple mica specimen"),
]

assert len(GEMS) == 40


def api(params):
    q = urllib.parse.urlencode({**params, "format": "json"})
    req = urllib.request.Request(f"https://commons.wikimedia.org/w/api.php?{q}", headers={"User-Agent": UA})
    with urllib.request.urlopen(req, context=ctx, timeout=90) as r:
        return json.load(r)


def search(term, limit=10):
    data = api({"action": "query", "list": "search", "srsearch": term, "srnamespace": 6, "srlimit": limit})
    return [x["title"].removeprefix("File:") for x in data["query"]["search"]]


def info(title):
    data = api({"action": "query", "titles": f"File:{title}", "prop": "imageinfo", "iiprop": "url|size|mime"})
    for p in data["query"]["pages"].values():
        if "missing" in p:
            return None
        return p["imageinfo"][0]


def slugify(name):
    s = name.lower().replace("'", "")
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


def hex_to_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))


def lighten(h, f=0.4):
    r, g, b = hex_to_rgb(h)
    return f"#{int(r+(255-r)*f):02x}{int(g+(255-g)*f):02x}{int(b+(255-b)*f):02x}"


def darken(h, f=0.5):
    r, g, b = hex_to_rgb(h)
    return f"#{int(r*(1-f)):02x}{int(g*(1-f)):02x}{int(b*(1-f)):02x}"


def rgba_glow(stone, a=0.5):
    r, g, b = hex_to_rgb(stone)
    return f"rgba({r},{g},{b},{a})"


def make_svg(path, stone):
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


def download_jpg(url, dest, max_w=960):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, context=ctx, timeout=180) as r:
        data = r.read()
    img = Image.open(io.BytesIO(data))
    if img.mode != "RGB":
        img = img.convert("RGB")
    w, h = img.size
    if min(w, h) < 100:
        raise ValueError("too small")
    if w > max_w:
        img = img.resize((max_w, int(h * max_w / w)), Image.Resampling.LANCZOS)
    img.save(dest, "JPEG", quality=86, optimize=True)


def js_escape(s):
    return s.replace("\\", "\\\\").replace('"', '\\"')


def gem_js(g):
    slug = slugify(g["name"])
    colors = ",".join(f'"{c}"' for c in g["colors"])
    origins = ",".join(f'"{o}"' for o in g["origins"])
    ch = ",".join(f'"{c}"' for c in g["colorHex"])
    return (
        f' {{name:"{js_escape(g["name"])}",img:"images/{slug}.jpg",formula:"{js_escape(g["formula"])}",'
        f'class:"{js_escape(g["klass"])}",system:"{js_escape(g["system"])}",mohs:{g["mohs"]},'
        f'sg:"{g["sg"]}",ri:"{g["ri"]}",colorHex:[{ch}],stone:"{g["stone"]}",'
        f'glow:"{rgba_glow(g["stone"])}",colors:[{colors}],origins:[{origins}],'
        f'desc:"{js_escape(g["desc"])}"}}'
    )


def fetch_photo(g, slug, sources):
    jpg = IMG / f"{slug}.jpg"
    if jpg.exists() and jpg.stat().st_size > 8000:
        print(f"  keep existing {slug}.jpg")
        return True
    skip = (".pdf", ".svg", ".png", ".gif", ".tif", ".tiff")
    for title in search(g["search"]):
        if title.lower().endswith(skip):
            continue
        # skip obvious non-gems
        low = title.lower()
        if any(x in low for x in ["map of", "logo", "flag", "portrait", "painting", "bird", "flower"]):
            continue
        inf = info(title)
        if not inf or not inf.get("mime", "").startswith("image/"):
            continue
        if inf["size"] < 15000:
            continue
        try:
            print(f"  DL {title[:70]}…")
            download_jpg(inf["url"], jpg)
            sources[slug] = title
            return True
        except Exception as e:
            print(f"  fail {title[:40]}: {e}")
            continue
    print(f"  NO PHOTO for {g['name']} — SVG only")
    return False


def main():
    assert len(GEMS) == 40
    sources = json.loads(SOURCES.read_text()) if SOURCES.exists() else {}
    entries = []
    for g in GEMS:
        slug = slugify(g["name"])
        make_svg(IMG / f"{slug}.svg", g["stone"])
        ok = fetch_photo(g, slug, sources)
        if not ok:
            # leave jpg missing → onerror falls back to svg
            pass
        entries.append(gem_js(g))
        print(f"OK {g['name']} -> {slug}")

    SOURCES.write_text(json.dumps(sources, indent=2) + "\n")

    html = HTML.read_text()
    # Insert before closing of GEMS array
    marker = '{name:"Star Sapphire"'
    idx = html.find(marker)
    if idx < 0:
        raise SystemExit("Star Sapphire marker not found")
    # find end of that object line
    end = html.find("},", idx)
    if end < 0:
        end = html.find("}\n];", idx)
        insert_at = end + 1
        block = ",\n" + ",\n".join(entries)
    else:
        insert_at = end + 1
        block = ",\n" + ",\n".join(entries)

    if "name:\"Obsidian\"" in html or 'name:"Obsidian"' in html:
        print("Obsidian already present — skipping HTML insert")
    else:
        html = html[:insert_at] + block + html[insert_at:]

    # Copy updates
    reps = [
        ("Mineralogy · Sixty Specimens · Hand-Documented", "Mineralogy · One Hundred Specimens · Hand-Documented"),
        (
            "Sixty precious, semi-precious, and famously rare gemstones",
            "One hundred precious, semi-precious, and famously rare gemstones",
        ),
        ("Uses all 25 gemstones in the catalog", "Uses all 100 gemstones in the catalog"),
    ]
    for a, b in reps:
        if a in html:
            html = html.replace(a, b)
            print(f"updated copy: {b[:50]}…")

    # Expand rare filter
    old_filt = r"/Alexandrite\|Paraíba\|Benitoite\|Painite\|Grandidierite\|Ammolite\|Larimar\|Black Opal\|Moissanite/"
    new_filt = r"/Alexandrite|Paraíba|Benitoite|Painite|Grandidierite|Ammolite|Larimar|Black Opal|Moissanite|Red Beryl|Padparadscha|Moldavite|Musgravite|Tsavorite|Demantoid/"
    html2 = re.sub(
        r"test:g=>/Alexandrite\|Paraíba\|Benitoite\|Painite\|Grandidierite\|Ammolite\|Larimar\|Black Opal\|Moissanite/\.test\(g\.name\)",
        'test:g=>/Alexandrite|Paraíba|Benitoite|Painite|Grandidierite|Ammolite|Larimar|Black Opal|Moissanite|Red Beryl|Padparadscha|Moldavite|Musgravite|Tsavorite|Demantoid/.test(g.name)',
        html,
    )
    if html2 != html:
        html = html2
        print("updated rare filter")

    HTML.write_text(html)
    print("Wrote index.html with", len(GEMS), "new gems")


if __name__ == "__main__":
    main()
