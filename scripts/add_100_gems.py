#!/usr/bin/env python3
"""Add 100 gemstones/minerals for geologists: SVGs, Commons JPGs, GEMS entries, 100→200 copy."""
import json, re, urllib.request, urllib.parse, urllib.error, ssl, io, time
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
IMG = ROOT / "images"
HTML = ROOT / "index.html"
SOURCES = IMG / "PHOTO_SOURCES.json"

ctx = ssl.create_default_context()
UA = "LithosGemCatalog/1.0 (educational; https://github.com/grahamgattegno/lithos)"

# 100 new specimens — rock-forming, industrial, collector, rare. No duplicates of existing catalog.
GEMS = [
dict(name="Orthoclase", price="$2–$40 / ct", formula="KAlSi₃O₈", klass="Silicate — Feldspar", system="Monoclinic", mohs=6, sg="2.56", ri="1.52",
     colorHex=["#f0e8d0", "#c8b890"], stone="#e8dcc0", colors=["Flesh pink", "White", "Colorless"], origins=["Italy", "Madagascar", "USA"],
     desc="A potassium feldspar and one of Earth's most important rock-forming minerals — a major ingredient of granite. Clear yellow orthoclase from Madagascar is occasionally faceted; the name means 'straight fracture' for its right-angle cleavage.",
     search="Orthoclase feldspar crystal specimen"),
dict(name="Albite", price="$1–$30 / ct", formula="NaAlSi₃O₈", klass="Silicate — Feldspar", system="Triclinic", mohs=6.5, sg="2.62", ri="1.53",
     colorHex=["#f4f2ea", "#c8c4b8"], stone="#eceae2", colors=["White", "Colorless", "Pale blue"], origins=["Brazil", "USA", "Switzerland"],
     desc="Sodium end-member of the plagioclase series and a rock-forming staple of granite and pegmatite. Fine crystals are often white and blocky; cleavelandite is a bladed variety prized by collectors.",
     search="Albite feldspar crystal specimen"),
dict(name="Sanidine", price="$2–$25 / ct", formula="KAlSi₃O₈", klass="Silicate — Feldspar", system="Monoclinic", mohs=6, sg="2.56", ri="1.52",
     colorHex=["#e8e0d0", "#b8a888"], stone="#ddd4c0", colors=["Colorless", "Grey", "Yellow"], origins=["Germany", "Italy", "USA"],
     desc="High-temperature potassium feldspar typical of volcanic rocks — sanidine phenocrysts float in trachyte and rhyolite. Optical properties help petrologists read cooling history.",
     search="Sanidine feldspar crystal volcanic"),
dict(name="Augite", price="$1–$20 / piece", formula="(Ca,Na)(Mg,Fe,Al,Ti)(Si,Al)₂O₆", klass="Silicate — Pyroxene", system="Monoclinic", mohs=5.5, sg="3.40", ri="1.70",
     colorHex=["#2a3a2a", "#1a2418"], stone="#2a3a2a", colors=["Dark green", "Black"], origins=["Italy", "USA", "Canada"],
     desc="The common dark pyroxene of basalt and gabbro. Short stubby crystals with characteristic cleavage angles help geologists identify mafic igneous rocks in hand sample.",
     search="Augite pyroxene crystal specimen"),
dict(name="Hornblende", price="$1–$20 / piece", formula="Ca₂(Mg,Fe,Al)₅(Al,Si)₈O₂₂(OH)₂", klass="Silicate — Amphibole", system="Monoclinic", mohs=5.5, sg="3.20", ri="1.65",
     colorHex=["#1e2a1e", "#0e1610"], stone="#1e2a1e", colors=["Black", "Dark green"], origins=["Canada", "Norway", "USA"],
     desc="A dark amphibole group name used for common black prismatic crystals in granite, diorite, and amphibolite. Its 56°/124° cleavage distinguishes it from pyroxene in the field.",
     search="Hornblende amphibole crystal specimen"),
dict(name="Biotite", price="$1–$15 / piece", formula="K(Mg,Fe)₃AlSi₃O₁₀(F,OH)₂", klass="Silicate — Mica", system="Monoclinic", mohs=2.5, sg="3.00", ri="1.60",
     colorHex=["#3a2a1a", "#1e140c"], stone="#3a2a1a", colors=["Black", "Dark brown"], origins=["Canada", "Brazil", "USA"],
     desc="Dark iron-magnesium mica that peels into flexible sheets. Extremely common in granite and schist; geologists use biotite chemistry as a thermometer and oxygen-fugacity sensor.",
     search="Biotite mica crystal specimen books"),
dict(name="Muscovite", price="$1–$15 / piece", formula="KAl₂(AlSi₃O₁₀)(F,OH)₂", klass="Silicate — Mica", system="Monoclinic", mohs=2.5, sg="2.82", ri="1.58",
     colorHex=["#e8e4d8", "#c0b8a8"], stone="#e0dcd0", colors=["Colorless", "Silvery"], origins=["India", "Brazil", "USA"],
     desc="Light mica — once mined as 'isinglass' for stove windows and electrical insulation. Perfect basal cleavage yields transparent flexible sheets; a classic pegmatite and schist mineral.",
     search="Muscovite mica sheet crystal specimen"),
dict(name="Enstatite", price="$10–$80 / ct", formula="Mg₂Si₂O₆", klass="Silicate — Pyroxene", system="Orthorhombic", mohs=5.5, sg="3.20", ri="1.66",
     colorHex=["#6a7a5a", "#3a4830"], stone="#6a7a5a", colors=["Green", "Brown", "Grey"], origins=["Myanmar", "Sri Lanka", "USA"],
     desc="Magnesium orthopyroxene of the mantle and ultramafic rocks. Gemmy green enstatite is uncommon; bronzite is a chatoyant iron-bearing relative with a metallic sheen.",
     search="Enstatite pyroxene crystal gem"),
dict(name="Bronzite", price="$5–$40 / ct", formula="(Mg,Fe)₂Si₂O₆", klass="Silicate — Pyroxene", system="Orthorhombic", mohs=5.5, sg="3.30", ri="1.67",
     colorHex=["#8a6a3a", "#5a4020"], stone="#8a6a3a", colors=["Bronze sheen", "Brown"], origins=["Austria", "India", "USA"],
     desc="An iron-bearing enstatite with a bronze metallic schiller from exsolved lamellae. Polished cabochons show a warm metallic glow; common in norite and some meteorites.",
     search="Bronzite mineral polished specimen"),
dict(name="Wollastonite", price="$2–$25 / piece", formula="CaSiO₃", klass="Silicate", system="Triclinic", mohs=5, sg="2.90", ri="1.63",
     colorHex=["#f0ece4", "#c8c0b4"], stone="#ebe6dc", colors=["White", "Grey"], origins=["USA", "Finland", "Mexico"],
     desc="A calcium silicate of contact-metamorphosed limestones (skarns). Industrial uses include ceramics and plastics; fibrous white masses are distinctive under the hand lens.",
     search="Wollastonite mineral specimen white"),
dict(name="Tremolite", price="$5–$40 / piece", formula="Ca₂Mg₅Si₈O₂₂(OH)₂", klass="Silicate — Amphibole", system="Monoclinic", mohs=5.5, sg="2.98", ri="1.62",
     colorHex=["#d8e0d0", "#a0b098"], stone="#d0d8c8", colors=["White", "Pale green"], origins=["Canada", "Italy", "USA"],
     desc="A magnesium amphibole that forms silky white to pale-green blades. Hexagonite is a lilac manganese variety. Important in metamorphic petrology and as a jade-like carving stone when dense.",
     search="Tremolite amphibole crystal specimen"),
dict(name="Actinolite", price="$5–$50 / ct", formula="Ca₂(Mg,Fe)₅Si₈O₂₂(OH)₂", klass="Silicate — Amphibole", system="Monoclinic", mohs=5.5, sg="3.05", ri="1.63",
     colorHex=["#5a8a4a", "#3a5a30"], stone="#5a8a4a", colors=["Green", "Dark green"], origins=["Canada", "Austria", "USA"],
     desc="Iron-bearing amphibole of greenschist-facies rocks — the green that gives greenschist its name. Cat's-eye actinolite and nephrite jade are related fibrous aggregates.",
     search="Actinolite green amphibole crystal"),
dict(name="Staurolite", price="$10–$80 / piece", formula="Fe₂Al₉O₆(SiO₄)₄(O,OH)₂", klass="Silicate", system="Monoclinic", mohs=7, sg="3.75", ri="1.75",
     colorHex=["#6a3a1a", "#3e200c"], stone="#6a3a1a", colors=["Brown", "Reddish brown"], origins=["USA", "France", "Russia"],
     desc="Famous for natural cross-shaped twins — 'fairy crosses.' A classic index mineral of medium-grade metamorphic rocks; the name means 'cross stone' in Greek.",
     search="Staurolite cross twin crystal specimen"),
dict(name="Sillimanite", price="$20–$150 / ct", formula="Al₂SiO₅", klass="Silicate", system="Orthorhombic", mohs=7, sg="3.25", ri="1.66",
     colorHex=["#c8b890", "#8a7850"], stone="#c8b890", colors=["Brown", "Grey", "Green"], origins=["Sri Lanka", "Brazil", "India"],
     desc="One of the Al₂SiO₅ polymorph trio with andalusite and kyanite — each stable in different P–T fields, so together they map metamorphic conditions. Fibrolite is a fibrous variety; gemmy crystals are scarce.",
     search="Sillimanite crystal gem specimen"),
dict(name="Talc", price="$1–$10 / piece", formula="Mg₃Si₄O₁₀(OH)₂", klass="Silicate", system="Monoclinic", mohs=1, sg="2.75", ri="1.59",
     colorHex=["#e8eae0", "#c0c4b4"], stone="#e0e4d8", colors=["White", "Pale green", "Grey"], origins=["USA", "France", "China"],
     desc="The softest mineral on the Mohs scale — you can scratch it with a fingernail. Soapstone is massive talc; industrially it is used in cosmetics, paper, and ceramics. Greasy feel is diagnostic.",
     search="Talc mineral specimen soapstone"),
dict(name="Graphite", price="$1–$15 / piece", formula="C", klass="Native element", system="Hexagonal", mohs=1.5, sg="2.20", ri="—",
     colorHex=["#3a3a3e", "#1a1a1e"], stone="#3a3a3e", colors=["Metallic grey", "Black"], origins=["Sri Lanka", "China", "Canada"],
     desc="Soft crystalline carbon — pencil 'lead' and a high-temperature metamorphic mineral. Same element as diamond, different structure (allotrope). Marks paper and feels greasy.",
     search="Graphite mineral crystal specimen"),
dict(name="Magnetite", price="$2–$30 / piece", formula="Fe₃O₄", klass="Oxide — Spinel group", system="Cubic", mohs=6, sg="5.15", ri="—",
     colorHex=["#2a2a2e", "#0e0e12"], stone="#2a2a2e", colors=["Metallic black"], origins=["Sweden", "USA", "Brazil"],
     desc="The classic magnetic iron oxide — lodestone is naturally magnetized magnetite. Octahedral crystals and a black streak help identify it; a major iron ore and a paleomagnetic recorder in rocks.",
     search="Magnetite octahedron crystal specimen"),
dict(name="Ilmenite", price="$2–$25 / piece", formula="FeTiO₃", klass="Oxide", system="Trigonal", mohs=5.5, sg="4.70", ri="—",
     colorHex=["#2e2a28", "#141210"], stone="#2e2a28", colors=["Metallic black"], origins=["Norway", "Canada", "Australia"],
     desc="Iron-titanium oxide and the chief ore of titanium. Common in mafic igneous rocks and heavy-mineral beach sands. Weakly magnetic compared with magnetite.",
     search="Ilmenite mineral crystal specimen"),
dict(name="Chromite", price="$2–$30 / piece", formula="FeCr₂O₄", klass="Oxide — Spinel group", system="Cubic", mohs=5.5, sg="4.60", ri="—",
     colorHex=["#2a2824", "#12100e"], stone="#2a2824", colors=["Black", "Brownish black"], origins=["South Africa", "Turkey", "Kazakhstan"],
     desc="The only significant ore of chromium. Forms in ultramafic layered intrusions and ophiolites; a key pathfinder mineral for platinum-group elements.",
     search="Chromite mineral specimen ore"),
dict(name="Rutile", price="$20–$200 / ct", formula="TiO₂", klass="Oxide", system="Tetragonal", mohs=6.5, sg="4.25", ri="2.70",
     colorHex=["#8a4a20", "#5a2e10"], stone="#8a4a20", colors=["Red-brown", "Golden", "Black"], origins=["Brazil", "Australia", "USA"],
     desc="Titanium dioxide with extreme refractive index and adamantine luster. Golden rutile needles in quartz make classic 'rutilated quartz.' Also a major titanium ore mineral.",
     search="Rutile crystal specimen mineral"),
dict(name="Cassiterite", price="$50–$400 / ct", formula="SnO₂", klass="Oxide", system="Tetragonal", mohs=6.5, sg="6.90", ri="2.00",
     colorHex=["#6a3a1a", "#3e200c"], stone="#6a3a1a", colors=["Brown", "Black", "Yellow"], origins=["Bolivia", "China", "Portugal"],
     desc="The primary ore of tin — hard, dense, and brilliantly adamantine when gemmy. Twinned crystals and high specific gravity are diagnostic. Faceted stones are uncommon collector gems.",
     search="Cassiterite crystal specimen Bolivia"),
dict(name="Scheelite", price="$50–$500 / ct", formula="CaWO₄", klass="Tungstate", system="Tetragonal", mohs=4.5, sg="6.10", ri="1.93",
     colorHex=["#d8c850", "#a09020"], stone="#d8c850", colors=["Yellow", "Orange", "Colorless"], origins=["China", "Korea", "USA"],
     desc="Calcium tungstate and a major tungsten ore. Glows vivid blue-white under shortwave UV — a favorite of fluorescent-mineral collectors. Dense and soft for a gem.",
     search="Scheelite crystal fluorescent mineral"),
dict(name="Galena", price="$2–$40 / piece", formula="PbS", klass="Sulfide", system="Cubic", mohs=2.5, sg="7.50", ri="—",
     colorHex=["#8a8a92", "#4a4a52"], stone="#8a8a92", colors=["Metallic silver-grey"], origins=["USA", "Peru", "UK"],
     desc="Lead sulfide — the chief lead ore. Perfect cubic cleavage and brilliant metallic luster make textbook specimens. Dense enough that a small cube feels surprisingly heavy.",
     search="Galena cubic crystal specimen"),
dict(name="Sphalerite", price="$20–$200 / ct", formula="(Zn,Fe)S", klass="Sulfide", system="Cubic", mohs=3.75, sg="4.00", ri="2.37",
     colorHex=["#c8a030", "#8a6810"], stone="#c8a030", colors=["Yellow", "Brown", "Black", "Red"], origins=["Spain", "USA", "Peru"],
     desc="Zinc sulfide and the main zinc ore. Gemmy yellow-orange 'golden sphalerite' has a refractive index near diamond but is soft. Resinous luster and dodecahedral cleavage are classic.",
     search="Sphalerite crystal gem yellow"),
dict(name="Chalcopyrite", price="$2–$30 / piece", formula="CuFeS₂", klass="Sulfide", system="Tetragonal", mohs=3.5, sg="4.20", ri="—",
     colorHex=["#c8a830", "#8a7010"], stone="#c8a830", colors=["Brassy yellow", "Iridescent"], origins=["Spain", "Peru", "USA"],
     desc="Copper-iron sulfide — the most important copper ore worldwide. Brassy yellow like pyrite but softer and often iridescent ('peacock ore' when tarnished with bornite).",
     search="Chalcopyrite crystal specimen mineral"),
dict(name="Bornite", price="$5–$50 / piece", formula="Cu₅FeS₄", klass="Sulfide", system="Orthorhombic", mohs=3, sg="5.00", ri="—",
     colorHex=["#6a3a8a", "#c85020"], stone="#5a3a6a", colors=["Purple", "Blue", "Copper red"], origins=["USA", "Mexico", "Kazakhstan"],
     desc="Peacock ore — fresh bornite is brownish bronze, but tarnish blooms into purple, blue, and magenta. An important copper ore mineral in hydrothermal deposits.",
     search="Bornite peacock ore mineral specimen"),
dict(name="Cinnabar", price="$20–$150 / piece", formula="HgS", klass="Sulfide", system="Trigonal", mohs=2.5, sg="8.10", ri="2.90",
     colorHex=["#c02828", "#7a1010"], stone="#c02828", colors=["Vermilion red"], origins=["Spain", "China", "USA"],
     desc="Mercury sulfide — the classic bright vermilion ore of mercury. Extremely dense and soft; historically the source of pigment vermilion. Handle specimens carefully (mercury content).",
     search="Cinnabar crystal mineral specimen red"),
dict(name="Stibnite", price="$10–$100 / piece", formula="Sb₂S₃", klass="Sulfide", system="Orthorhombic", mohs=2, sg="4.60", ri="—",
     colorHex=["#6a6a72", "#3a3a42"], stone="#6a6a72", colors=["Metallic grey"], origins=["China", "Romania", "Japan"],
     desc="Antimony sulfide forming spectacular radiating metallic needles and blades. Soft enough to scratch with a fingernail; Japan's Ichinokawa mine produced legendary crystals.",
     search="Stibnite crystal spray specimen"),
dict(name="Native Gold", price="$50–$500+ / g", formula="Au", klass="Native element", system="Cubic", mohs=2.5, sg="19.3", ri="—",
     colorHex=["#d4a820", "#a07810"], stone="#d4a820", colors=["Metallic gold"], origins=["USA", "Australia", "South Africa", "Russia"],
     desc="Elemental gold — soft, dense, and malleable. Forms in hydrothermal veins and placer deposits. Crystal habits include octahedra and dendritic wires; nuggets are rounded stream-worn masses.",
     search="Native gold crystal specimen nugget"),
dict(name="Native Copper", price="$5–$80 / piece", formula="Cu", klass="Native element", system="Cubic", mohs=2.5, sg="8.90", ri="—",
     colorHex=["#c06030", "#8a3810"], stone="#c06030", colors=["Copper red", "Tarnished green"], origins=["USA", "Namibia", "Russia"],
     desc="Elemental copper — Michigan's Keweenaw Peninsula produced world-famous crystallized masses. Soft, dense, and electrically conductive; tarnishes to greens and browns.",
     search="Native copper crystal specimen Michigan"),
dict(name="Native Silver", price="$20–$200 / piece", formula="Ag", klass="Native element", system="Cubic", mohs=2.5, sg="10.5", ri="—",
     colorHex=["#c8c8d0", "#8a8a94"], stone="#c8c8d0", colors=["Metallic silver"], origins=["Norway", "Mexico", "Canada"],
     desc="Elemental silver as wires, sheets, and crystals. Tarnishes black; Kongsberg, Norway, produced museum-quality wire silver. Soft and extremely dense.",
     search="Native silver wire crystal specimen"),
dict(name="Sulfur", price="$1–$20 / piece", formula="S₈", klass="Native element", system="Orthorhombic", mohs=2, sg="2.05", ri="1.96",
     colorHex=["#e8d830", "#b0a010"], stone="#e8d830", colors=["Bright yellow"], origins=["Italy", "USA", "Indonesia"],
     desc="Native sulfur — bright yellow crystals from volcanic fumaroles and evaporite settings. Soft, brittle, and smells faintly of matches when crushed. Classic Sicilian specimens.",
     search="Sulfur crystal yellow mineral specimen"),
dict(name="Gypsum", price="$1–$25 / piece", formula="CaSO₄·2H₂O", klass="Sulfate", system="Monoclinic", mohs=2, sg="2.30", ri="1.52",
     colorHex=["#f4f0e8", "#d0c8b8"], stone="#efeae0", colors=["Colorless", "White", "Selenite"], origins=["Mexico", "USA", "Spain"],
     desc="Hydrous calcium sulfate — Mohs 2, so soft you can scratch it with a fingernail. Selenite is the clear variety; desert roses and satin spar are popular forms. The basis of plaster of Paris.",
     search="Gypsum selenite crystal specimen"),
dict(name="Barite", price="$5–$60 / piece", formula="BaSO₄", klass="Sulfate", system="Orthorhombic", mohs=3.5, sg="4.50", ri="1.63",
     colorHex=["#d0d8e8", "#9098b0"], stone="#c8d0e0", colors=["Colorless", "Blue", "Yellow"], origins=["UK", "USA", "Romania"],
     desc="Barium sulfate — surprisingly heavy for a pale mineral (high SG). Used as drilling mud weighting agent. Blue barite blades and desert roses are collector favourites.",
     search="Barite crystal specimen blue"),
dict(name="Halite", price="$1–$15 / piece", formula="NaCl", klass="Halide", system="Cubic", mohs=2.5, sg="2.16", ri="1.54",
     colorHex=["#f0f4f8", "#c8d0d8"], stone="#e8eef4", colors=["Colorless", "Pink", "Blue"], origins=["USA", "Poland", "Austria"],
     desc="Rock salt — cubic cleavage, tastes salty (don't lick museum specimens!). Forms in evaporite basins. Blue halite from New Mexico is a striking collector curiosity.",
     search="Halite salt crystal cubic specimen"),
dict(name="Dolomite", price="$1–$20 / piece", formula="CaMg(CO₃)₂", klass="Carbonate", system="Trigonal", mohs=3.75, sg="2.85", ri="1.68",
     colorHex=["#e8d8d0", "#c0a898"], stone="#e0d0c8", colors=["White", "Pink", "Grey"], origins=["Spain", "USA", "Italy"],
     desc="Calcium-magnesium carbonate — namesake of dolomite rock and the Dolomite Alps. Curved saddle-shaped rhombs are classic. Distinguishing dolomite from calcite is a standard lab skill.",
     search="Dolomite crystal saddle specimen"),
dict(name="Magnesite", price="$2–$30 / piece", formula="MgCO₃", klass="Carbonate", system="Trigonal", mohs=4, sg="3.00", ri="1.70",
     colorHex=["#f0ece4", "#c8c0b4"], stone="#ebe6dc", colors=["White", "Grey", "Brown"], origins=["Brazil", "Australia", "USA"],
     desc="Magnesium carbonate — an industrial source of magnesia and a metamorphic/hydrothermal mineral. Massive white magnesite can resemble porcelain; crystals are less common.",
     search="Magnesite mineral specimen white"),
dict(name="Siderite", price="$5–$50 / piece", formula="FeCO₃", klass="Carbonate", system="Trigonal", mohs=4, sg="3.90", ri="1.80",
     colorHex=["#8a6a3a", "#5a4020"], stone="#8a6a3a", colors=["Brown", "Tan", "Grey"], origins=["Portugal", "Brazil", "Canada"],
     desc="Iron carbonate — a minor iron ore and common gangue in hydrothermal veins. Curved rhombohedra and a brown color from oxidation are typical. High SG for a carbonate.",
     search="Siderite crystal specimen mineral"),
dict(name="Cerussite", price="$20–$200 / ct", formula="PbCO₃", klass="Carbonate", system="Orthorhombic", mohs=3.5, sg="6.55", ri="2.08",
     colorHex=["#f0ece8", "#c8c0b8"], stone="#ebe6e0", colors=["Colorless", "White", "Grey"], origins=["Namibia", "Morocco", "Australia"],
     desc="Lead carbonate of the oxidized zone of lead deposits. Extremely high refractive index and adamantine flash; twinned 'snowflake' crystals from Tsumeb are legendary.",
     search="Cerussite crystal Tsumeb specimen"),
dict(name="Wulfenite", price="$30–$300 / piece", formula="PbMoO₄", klass="Molybdate", system="Tetragonal", mohs=3, sg="6.75", ri="2.30",
     colorHex=["#d86020", "#a03810"], stone="#d86020", colors=["Orange", "Yellow", "Red"], origins=["Mexico", "USA", "Morocco"],
     desc="Lead molybdate famous for thin, fiery orange tabular crystals — Red Cloud Mine, Arizona, produced world icons. Soft but spectacular in the cabinet.",
     search="Wulfenite orange crystal specimen"),
dict(name="Vanadinite", price="$20–$200 / piece", formula="Pb₅(VO₄)₃Cl", klass="Vanadate", system="Hexagonal", mohs=3, sg="6.90", ri="2.35",
     colorHex=["#c02818", "#7a1008"], stone="#c02818", colors=["Red", "Orange-red"], origins=["Morocco", "USA", "Namibia"],
     desc="Lead vanadate chloride forming hexagonal barrels of intense red-orange. Mibladen, Morocco, supplies most modern specimens. Soft and dense — display carefully.",
     search="Vanadinite crystal red Morocco"),
dict(name="Pyromorphite", price="$20–$200 / piece", formula="Pb₅(PO₄)₃Cl", klass="Phosphate", system="Hexagonal", mohs=3.5, sg="7.00", ri="2.05",
     colorHex=["#6aaa3a", "#3e7020"], stone="#6aaa3a", colors=["Green", "Yellow-green", "Brown"], origins=["China", "Germany", "USA"],
     desc="Lead phosphate chloride of oxidized lead deposits. Barrel-shaped green crystals are classic; Chinese finds revitalized the market. Soft and heavy.",
     search="Pyromorphite green crystal specimen"),
dict(name="Crocoite", price="$50–$400 / piece", formula="PbCrO₄", klass="Chromate", system="Monoclinic", mohs=2.5, sg="6.00", ri="2.30",
     colorHex=["#d84818", "#a02808"], stone="#d84818", colors=["Hyacinth red", "Orange"], origins=["Australia (Tasmania)", "Russia"],
     desc="Lead chromate — blazing hyacinth-red needles, almost all from Dundas, Tasmania. Extremely soft and fragile; one of the most photogenic minerals on Earth.",
     search="Crocoite crystal Tasmania red"),
dict(name="Vivianite", price="$20–$150 / piece", formula="Fe₃(PO₄)₂·8H₂O", klass="Phosphate", system="Monoclinic", mohs=2, sg="2.70", ri="1.60",
     colorHex=["#2a5a8a", "#1a3058"], stone="#2a5a8a", colors=["Blue", "Blue-green", "Colorless"], origins=["Ukraine", "Brazil", "USA"],
     desc="Iron phosphate that starts nearly colorless and turns deep blue on exposure to light as Fe²⁺ oxidizes. Soft blades; famous from Bolivian and Ukrainian localities.",
     search="Vivianite blue crystal specimen"),
dict(name="Lazulite", price="$50–$400 / ct", formula="(Mg,Fe)Al₂(PO₄)₂(OH)₂", klass="Phosphate", system="Monoclinic", mohs=5.5, sg="3.10", ri="1.63",
     colorHex=["#2a4a9a", "#1a2e68"], stone="#2a4a9a", colors=["Blue", "Blue-green"], origins=["Brazil", "USA", "Austria"],
     desc="A deep blue phosphate sometimes confused with lazurite (lapis). Forms in metamorphic and pegmatitic settings; gemmy crystals are uncommon and prized.",
     search="Lazulite blue crystal specimen"),
dict(name="Brazilianite", price="$50–$400 / ct", formula="NaAl₃(PO₄)₂(OH)₄", klass="Phosphate", system="Monoclinic", mohs=5.5, sg="2.98", ri="1.60",
     colorHex=["#c8c030", "#8a8810"], stone="#c8c030", colors=["Yellow-green", "Chartreuse"], origins=["Brazil", "USA"],
     desc="A chartreuse phosphate first described from Brazil in 1945. Clean crystals facet into bright collector stones; softer than quartz so best for careful wear.",
     search="Brazilianite crystal yellow green"),
dict(name="Amblygonite", price="$20–$150 / ct", formula="(Li,Na)AlPO₄(F,OH)", klass="Phosphate", system="Triclinic", mohs=6, sg="3.05", ri="1.60",
     colorHex=["#e8d850", "#b0a020"], stone="#e8d850", colors=["Yellow", "White", "Green"], origins=["Brazil", "USA", "Zimbabwe"],
     desc="Lithium aluminum phosphate of granite pegmatites — a lithium ore mineral and occasional pale yellow gem. Montebrasite is the hydroxyl-dominant end-member.",
     search="Amblygonite crystal gem yellow"),
dict(name="Phenakite", price="$100–$1,000 / ct", formula="Be₂SiO₄", klass="Silicate", system="Trigonal", mohs=7.5, sg="3.00", ri="1.66",
     colorHex=["#e8eef4", "#c0c8d0"], stone="#e0e6ee", colors=["Colorless", "Yellow", "Pink"], origins=["Russia", "Brazil", "Madagascar"],
     desc="Beryllium orthosilicate — hard, bright, and often mistaken for diamond when colorless. Named from Greek phenax, 'deceiver.' Fine crystals are scarce collector gems.",
     search="Phenakite crystal gem specimen"),
dict(name="Euclase", price="$100–$1,500 / ct", formula="BeAlSiO₄(OH)", klass="Silicate", system="Monoclinic", mohs=7.5, sg="3.10", ri="1.67",
     colorHex=["#5a8ab8", "#3a5a80"], stone="#5a8ab8", colors=["Blue", "Colorless", "Green"], origins=["Brazil", "Colombia", "Zimbabwe"],
     desc="A rare beryllium aluminum silicate with perfect cleavage (euclase = 'breaks well'). Fine blue stones rival aquamarine in hue but are far scarcer and fragile to cut.",
     search="Euclase blue crystal gem"),
dict(name="Danburite", price="$20–$150 / ct", formula="CaB₂Si₂O₈", klass="Silicate — Borosilicate", system="Orthorhombic", mohs=7, sg="3.00", ri="1.63",
     colorHex=["#f0e8d8", "#c8b8a0"], stone="#e8e0d0", colors=["Colorless", "Yellow", "Pink"], origins=["Mexico", "Myanmar", "Madagascar"],
     desc="Calcium borosilicate named for Danbury, Connecticut. Hard and clean enough for jewelry; Mexican yellow-pink crystals are popular. Often compared optically to topaz.",
     search="Danburite crystal gem Mexico"),
dict(name="Axinite", price="$30–$250 / ct", formula="Ca₂(Fe,Mn)Al₂BSi₄O₁₅(OH)", klass="Silicate — Borosilicate", system="Triclinic", mohs=7, sg="3.30", ri="1.68",
     colorHex=["#6a4a3a", "#3e2a1e"], stone="#6a4a3a", colors=["Brown", "Clove", "Violet"], origins=["France", "USA", "Pakistan"],
     desc="A sharp, axe-blade-shaped borosilicate (name from Greek axine, axe). Strong pleochroism and triclinic symmetry delight crystallographers; gemmy clove-brown stones are cut for collectors.",
     search="Axinite crystal specimen brown"),
dict(name="Vesuvianite", price="$20–$200 / ct", formula="Ca₁₀(Mg,Fe)₂Al₄(SiO₄)₅(Si₂O₇)₂(OH,F)₄", klass="Silicate", system="Tetragonal", mohs=6.5, sg="3.40", ri="1.72",
     colorHex=["#4a7a3a", "#2a4820"], stone="#4a7a3a", colors=["Green", "Brown", "Yellow"], origins=["Italy", "Canada", "Kenya"],
     desc="Also called idocrase — named for Mount Vesuvius. Forms in skarns and contact rocks. Chromium-green 'californite' and Kenya's bright green gems are jewelry favourites.",
     search="Vesuvianite idocrase crystal specimen"),
dict(name="Scapolite", price="$20–$150 / ct", formula="(Na,Ca)₄(Al,Si)₁₂O₂₄(Cl,CO₃,SO₄)", klass="Silicate", system="Tetragonal", mohs=6, sg="2.70", ri="1.57",
     colorHex=["#d8c050", "#a08820"], stone="#d8c050", colors=["Yellow", "Pink", "Violet", "Colorless"], origins=["Myanmar", "Tanzania", "Canada"],
     desc="A solid-solution series between marialite and meionite in metamorphic rocks. Gemmy yellow and purple scapolite is cut; some shows chatoyancy. Common as a rock-forming metamorphic mineral.",
     search="Scapolite gem crystal yellow"),
dict(name="Apophyllite", price="$5–$60 / piece", formula="KCa₄Si₈O₂₀(F,OH)·8H₂O", klass="Silicate — Phyllosilicate", system="Tetragonal", mohs=4.5, sg="2.35", ri="1.54",
     colorHex=["#e8f0e8", "#b0c8b0"], stone="#dce8dc", colors=["Colorless", "Green", "Pink"], origins=["India", "Brazil", "USA"],
     desc="A zeolite-associated mineral famous for glassy pyramidal crystals lining basalt cavities — India's Deccan Traps produce thousands. Soft but brilliantly clear.",
     search="Apophyllite crystal India green"),
dict(name="Stilbite", price="$5–$50 / piece", formula="NaCa₂Al₅Si₁₃O₃₆·14H₂O", klass="Silicate — Zeolite", system="Monoclinic", mohs=3.5, sg="2.20", ri="1.50",
     colorHex=["#e8c8a0", "#c09060"], stone="#e0c098", colors=["Peach", "White", "Orange"], origins=["India", "Iceland", "USA"],
     desc="A zeolite with sheaf-like 'wheat sheaf' aggregates. Common lining cavities in basalt; Indian peach stilbite with green apophyllite is a classic display combination.",
     search="Stilbite zeolite crystal peach"),
dict(name="Natrolite", price="$5–$50 / piece", formula="Na₂Al₂Si₃O₁₀·2H₂O", klass="Silicate — Zeolite", system="Orthorhombic", mohs=5.5, sg="2.25", ri="1.48",
     colorHex=["#f0f4f8", "#c8d0d8"], stone="#e8eef4", colors=["Colorless", "White"], origins=["Canada", "USA", "Czech Republic"],
     desc="A fibrous zeolite forming radiating sprays of slender needles. Type locality associations include Nova Scotia basalts. Soft and fragile — cabinet only.",
     search="Natrolite zeolite crystal spray"),
dict(name="Petalite", price="$20–$150 / ct", formula="LiAlSi₄O₁₀", klass="Silicate", system="Monoclinic", mohs=6.5, sg="2.40", ri="1.51",
     colorHex=["#f0ece8", "#c8c0b8"], stone="#ebe6e0", colors=["Colorless", "Pink", "White"], origins=["Brazil", "Australia", "Zimbabwe"],
     desc="Lithium aluminum silicate — an important lithium ore mineral from pegmatites and an occasional colorless gem. Name means 'leaf stone' for its cleavage.",
     search="Petalite crystal gem specimen"),
dict(name="Taaffeite", price="$1,500–$10,000+ / ct", formula="BeMg₃Al₈O₁₆", klass="Oxide", system="Hexagonal", mohs=8, sg="3.60", ri="1.72",
     colorHex=["#8a4a8a", "#5a2858"], stone="#8a4a8a", colors=["Mauve", "Purple", "Red"], origins=["Sri Lanka", "Tanzania", "China"],
     desc="One of the rarest gem oxides — first identified from a cut stone mistaken for spinel by Richard Taaffe in 1945. Hexagonal and doubly refractive, unlike cubic spinel.",
     search="Taaffeite gem crystal rare"),
dict(name="Jeremejevite", price="$500–$5,000+ / ct", formula="Al₆B₅O₁₅(F,OH)₃", klass="Borate", system="Hexagonal", mohs=7, sg="3.30", ri="1.64",
     colorHex=["#5a7ab0", "#3a5080"], stone="#5a7ab0", colors=["Blue", "Colorless", "Yellow"], origins=["Namibia", "Myanmar", "Russia"],
     desc="A rare aluminum borate forming slender hexagonal prisms. Fine blue Namibian crystals are among the most coveted collector stones; named for Russian mineralogist Pavel Jeremejev.",
     search="Jeremejevite crystal Namibia blue"),
dict(name="Pezzottaite", price="$500–$5,000+ / ct", formula="Cs(Be₂Li)Al₂Si₆O₁₈", klass="Silicate — Beryl group", system="Trigonal", mohs=8, sg="3.10", ri="1.61",
     colorHex=["#c04878", "#8a2848"], stone="#c04878", colors=["Raspberry pink", "Raspberry red"], origins=["Madagascar", "Afghanistan"],
     desc="A cesium-rich beryl-group mineral discovered in Madagascar in 2002 and named for Federico Pezzotta. Raspberry-pink crystals caused a collector sensation; still extremely scarce.",
     search="Pezzottaite crystal Madagascar pink"),
dict(name="Kornerupine", price="$100–$1,000 / ct", formula="(Mg,Fe)₃Al₆(Si,Al,B)₅O₂₁(OH)", klass="Silicate", system="Orthorhombic", mohs=6.5, sg="3.30", ri="1.67",
     colorHex=["#4a6a3a", "#2a4020"], stone="#4a6a3a", colors=["Green", "Brown", "Yellow"], origins=["Madagascar", "Sri Lanka", "Kenya"],
     desc="A complex magnesium aluminum borosilicate of metamorphic rocks. Gemmy green stones from Madagascar and East Africa are cut for collectors; named for Danish geologist Andreas Kornerup.",
     search="Kornerupine gem crystal green"),
dict(name="Sinhalite", price="$100–$800 / ct", formula="MgAlBO₄", klass="Borate", system="Orthorhombic", mohs=6.5, sg="3.48", ri="1.70",
     colorHex=["#8a6a2a", "#5a4010"], stone="#8a6a2a", colors=["Brown", "Yellow-brown", "Green"], origins=["Sri Lanka", "Myanmar", "Tanzania"],
     desc="Magnesium aluminum borate — long thought to be brown peridot until 1952. Named for Sinhala (Sri Lanka). Orthorhombic optics distinguish it from olivine.",
     search="Sinhalite gem crystal brown"),
dict(name="Hackmanite", price="$50–$400 / ct", formula="Na₈Al₆Si₆O₂₄(Cl₂,S)", klass="Silicate — Sodalite group", system="Cubic", mohs=5.5, sg="2.30", ri="1.48",
     colorHex=["#8a4a9a", "#5a2870"], stone="#8a4a9a", colors=["Purple", "Pink", "White"], origins=["Afghanistan", "Canada", "Myanmar"],
     desc="A sulfur-bearing sodalite famous for tenebrescence — it darkens in UV or sunlight and fades indoors. Afghan material can flash from white to vivid purple.",
     search="Hackmanite tenebrescent sodalite"),
dict(name="Haüyne", price="$100–$1,000 / ct", formula="Na₃Ca(Si₃Al₃)O₁₂(SO₄)", klass="Silicate — Feldspathoid", system="Cubic", mohs=5.5, sg="2.45", ri="1.50",
     colorHex=["#2a5aaa", "#1a3878"], stone="#2a5aaa", colors=["Blue", "Green-blue"], origins=["Germany", "Italy", "Afghanistan"],
     desc="A vivid blue feldspathoid of alkaline volcanic rocks — a key component of lapis lazuli with lazurite. Named for crystallographer René Just Haüy. Gem crystals are rare and soft.",
     search="Haüyne hauyne blue crystal gem"),
dict(name="Eudialyte", price="$20–$150 / ct", formula="Na₄(Ca,Ce)₂(Fe,Mn,Y)ZrSi₈O₂₂(OH,Cl)₂", klass="Silicate", system="Trigonal", mohs=5.5, sg="2.90", ri="1.61",
     colorHex=["#c02840", "#7a1020"], stone="#c02840", colors=["Red", "Pink", "Brown"], origins=["Greenland", "Russia", "Canada"],
     desc="A zirconium silicate of agpaitic nepheline syenites — bright red masses from Greenland's Ilimaussaq complex are iconic. Soft; usually cut as cabochons.",
     search="Eudialyte red mineral Greenland"),
dict(name="Aegirine", price="$10–$80 / piece", formula="NaFeSi₂O₆", klass="Silicate — Pyroxene", system="Monoclinic", mohs=6, sg="3.55", ri="1.78",
     colorHex=["#1a2a1a", "#0c160c"], stone="#1a2a1a", colors=["Black", "Dark green"], origins=["Greenland", "Russia", "Canada"],
     desc="Sodium-iron pyroxene of alkaline igneous rocks — slender black prisms with pointed terminations. Named for the Norse sea-god Ægir. A petrologic marker of agpaitic suites.",
     search="Aegirine pyroxene crystal specimen"),
dict(name="Nepheline", price="$5–$40 / piece", formula="(Na,K)AlSiO₄", klass="Silicate — Feldspathoid", system="Hexagonal", mohs=5.5, sg="2.60", ri="1.54",
     colorHex=["#e8e4d8", "#c0b8a8"], stone="#e0dcd0", colors=["Grey", "White", "Colorless"], origins=["Canada", "Russia", "Norway"],
     desc="The most important feldspathoid — silica-undersaturated rocks crystallize nepheline instead of quartz. Greasy luster and lack of good cleavage help distinguish it from feldspar.",
     search="Nepheline crystal specimen mineral"),
dict(name="Leucite", price="$5–$40 / piece", formula="KAlSi₂O₆", klass="Silicate — Feldspathoid", system="Tetragonal", mohs=5.5, sg="2.47", ri="1.51",
     colorHex=["#e8e4dc", "#c0b8b0"], stone="#e0dcd4", colors=["White", "Grey"], origins=["Italy", "USA", "Uganda"],
     desc="Potassium feldspathoid forming trapezohedral crystals in potassium-rich volcanic rocks — Vesuvius is classic. Pseudo-cubic habit is a student favourite.",
     search="Leucite crystal trapezohedron Vesuvius"),
dict(name="Thulite", price="$10–$80 / ct", formula="Ca₂Al₃(SiO₄)₃(OH)", klass="Silicate — Zoisite", system="Orthorhombic", mohs=6.5, sg="3.30", ri="1.70",
     colorHex=["#c05070", "#8a2848"], stone="#c05070", colors=["Pink", "Manganese pink"], origins=["Norway", "USA", "Australia"],
     desc="Manganese-pink zoisite — Norway's national stone. Opaque to translucent massive material is carved and cabbed; related to tanzanite chemically but colored by Mn, not V/Cr.",
     search="Thulite pink zoisite Norway"),
dict(name="Almandine", price="$20–$150 / ct", formula="Fe₃Al₂(SiO₄)₃", klass="Silicate — Garnet", system="Cubic", mohs=7.5, sg="4.20", ri="1.79",
     colorHex=["#8a1a24", "#5a1014"], stone="#8a1a24", colors=["Deep red", "Brownish red"], origins=["India", "USA", "Czech Republic"],
     desc="Iron-aluminum garnet — the classic deep-red garnet of schists and metamorphic rocks. Harder and denser than pyrope; widely used historically as an abrasive and gem.",
     search="Almandine garnet crystal specimen"),
dict(name="Pyrope", price="$30–$250 / ct", formula="Mg₃Al₂(SiO₄)₃", klass="Silicate — Garnet", system="Cubic", mohs=7.5, sg="3.70", ri="1.74",
     colorHex=["#9a1028", "#601018"], stone="#9a1028", colors=["Blood red", "Pink-red"], origins=["Czech Republic", "USA", "South Africa"],
     desc="Magnesium-aluminum garnet of ultramafic and high-pressure rocks — a kimberlite indicator mineral. Bohemian 'Cape ruby' pyrope fueled European garnet jewelry for centuries.",
     search="Pyrope garnet gem red"),
dict(name="Grossular", price="$30–$300 / ct", formula="Ca₃Al₂(SiO₄)₃", klass="Silicate — Garnet", system="Cubic", mohs=7, sg="3.60", ri="1.74",
     colorHex=["#d8a030", "#a07010"], stone="#d8a030", colors=["Yellow", "Orange", "Green", "Colorless"], origins=["Kenya", "Canada", "Mexico"],
     desc="Calcium-aluminum garnet of skarns and metamorphosed limestones. Hessonite is the cinnamon variety; tsavorite and mali garnet are green grossulars already famous as gems.",
     search="Grossular garnet crystal hessonite"),
dict(name="Andradite", price="$50–$500 / ct", formula="Ca₃Fe₂(SiO₄)₃", klass="Silicate — Garnet", system="Cubic", mohs=6.75, sg="3.85", ri="1.89",
     colorHex=["#6a5a2a", "#3e3410"], stone="#6a5a2a", colors=["Yellow", "Brown", "Green", "Black"], origins=["Russia", "Italy", "Namibia"],
     desc="Calcium-iron garnet — demantoid is the green gem variety; melanite is black titanium-rich andradite used in mourning jewelry. High dispersion gives demantoid its fire.",
     search="Andradite garnet crystal specimen"),
dict(name="Rubellite", price="$50–$800 / ct", formula="Na(Li,Al)₃Al₆(BO₃)₃Si₆O₁₈(OH)₄", klass="Silicate — Tourmaline", system="Trigonal", mohs=7.25, sg="3.06", ri="1.63",
     colorHex=["#c02860", "#8a1438"], stone="#c02860", colors=["Pink", "Red", "Hot pink"], origins=["Brazil", "Nigeria", "Afghanistan"],
     desc="The pink-to-red variety of elbaite tourmaline. Fine hot-pink stones from Brazil and Nigeria are jewelry staples; color comes mainly from manganese.",
     search="Rubellite tourmaline pink crystal"),
dict(name="Indicolite", price="$50–$600 / ct", formula="Na(Li,Al)₃Al₆(BO₃)₃Si₆O₁₈(OH)₄", klass="Silicate — Tourmaline", system="Trigonal", mohs=7.25, sg="3.10", ri="1.63",
     colorHex=["#2a5a9a", "#1a3868"], stone="#2a5a9a", colors=["Blue", "Blue-green"], origins=["Brazil", "Afghanistan", "Nigeria"],
     desc="Blue tourmaline — from soft sky to deep ink. Often greener in one direction due to strong dichroism. Named from Latin indicum, indigo.",
     search="Indicolite blue tourmaline crystal"),
dict(name="Schorl", price="$5–$40 / piece", formula="NaFe₃Al₆(BO₃)₃Si₆O₁₈(OH)₄", klass="Silicate — Tourmaline", system="Trigonal", mohs=7.25, sg="3.20", ri="1.65",
     colorHex=["#1a1a1e", "#0a0a0c"], stone="#1a1a1e", colors=["Black"], origins=["Brazil", "USA", "Pakistan"],
     desc="Black iron-rich tourmaline — the most common tourmaline species. Long striated prisms in pegmatites are textbook specimens; once used as mourning jewelry.",
     search="Schorl black tourmaline crystal"),
dict(name="Goshenite", price="$20–$150 / ct", formula="Be₃Al₂Si₆O₁₈", klass="Silicate — Beryl", system="Hexagonal", mohs=7.75, sg="2.70", ri="1.58",
     colorHex=["#e8eef4", "#c0c8d0"], stone="#e0e6ee", colors=["Colorless"], origins=["USA", "Brazil", "Pakistan"],
     desc="Colorless beryl — named for Goshen, Massachusetts. Lacks the chromophores that make emerald, aquamarine, and morganite colorful; clean crystals make bright, hard gems.",
     search="Goshenite colorless beryl crystal"),
dict(name="Star Ruby", price="$200–$5,000+ / ct", formula="Al₂O₃", klass="Oxide — Corundum", system="Trigonal", mohs=9, sg="4.00", ri="1.77",
     colorHex=["#a01828", "#6a0c18"], stone="#a01828", colors=["Red with white star"], origins=["Myanmar", "Sri Lanka", "Thailand"],
     desc="Ruby showing asterism — a six-rayed star from aligned rutile silk. Cabochon-cut only; fine sharp stars on a saturated red body are rare and valuable.",
     search="Star ruby cabochon gem asterism"),
dict(name="Spectrolite", price="$20–$150 / ct", formula="(Ca,Na)(Al,Si)₄O₈", klass="Silicate — Feldspar", system="Triclinic", mohs=6, sg="2.70", ri="1.56",
     colorHex=["#1a2a4a", "#c04080"], stone="#2a3a5a", colors=["Spectral play-of-color"], origins=["Finland"],
     desc="A trade name for labradorite from Finland with exceptionally vivid spectral flashes — full rainbow schiller on a dark base. Same mineral as labradorite, premium optical quality.",
     search="Spectrolite labradorite Finland polished"),
dict(name="Nephrite", price="$10–$500 / ct", formula="Ca₂(Mg,Fe)₅Si₈O₂₂(OH)₂", klass="Silicate — Amphibole", system="Monoclinic", mohs=6.5, sg="3.00", ri="1.62",
     colorHex=["#4a7a4a", "#2a4a2a"], stone="#4a7a4a", colors=["Green", "White", "Black"], origins=["China", "New Zealand", "Canada"],
     desc="One of the two jade minerals (with jadeite) — a tough felted amphibole aggregate. New Zealand pounamu and Chinese 'mutton-fat' white nephrite are culturally treasured.",
     search="Nephrite jade polished carved"),
dict(name="Chalcedony", price="$2–$30 / ct", formula="SiO₂", klass="Silicate — Quartz", system="Trigonal", mohs=7, sg="2.60", ri="1.54",
     colorHex=["#a8c0d0", "#708898"], stone="#a8c0d0", colors=["Blue-grey", "White", "Many colors"], origins=["Brazil", "India", "USA"],
     desc="Microcrystalline quartz — the parent of agate, carnelian, onyx, and chrysoprase. Tough, takes a high polish, and has been carved since antiquity.",
     search="Chalcedony blue mineral polished"),
dict(name="Moss Agate", price="$3–$30 / ct", formula="SiO₂", klass="Silicate — Chalcedony", system="Trigonal", mohs=7, sg="2.60", ri="1.54",
     colorHex=["#6a8a5a", "#d8e0d0"], stone="#7a9a6a", colors=["Green mossy inclusions"], origins=["India", "USA", "Brazil"],
     desc="Translucent chalcedony with green hornblende or chlorite inclusions that look like moss or miniature landscapes. Not a true moss fossil — mineral dendritic growth.",
     search="Moss agate polished stone green"),
dict(name="Fire Agate", price="$20–$200 / ct", formula="SiO₂", klass="Silicate — Chalcedony", system="Trigonal", mohs=7, sg="2.60", ri="1.54",
     colorHex=["#c05020", "#2a6ab0"], stone="#a04828", colors=["Iridescent fire"], origins=["USA", "Mexico"],
     desc="Chalcedony layered with limonite producing iridescent 'fire' like a thin-film oil slick. Arizona and Mexico produce the best; cabochons reveal bubbling rainbows.",
     search="Fire agate polished iridescent"),
dict(name="Sardonyx", price="$5–$40 / ct", formula="SiO₂", klass="Silicate — Chalcedony", system="Trigonal", mohs=7, sg="2.60", ri="1.54",
     colorHex=["#8a3a2a", "#e8d8c8"], stone="#8a3a2a", colors=["Red and white bands"], origins=["India", "Brazil", "Germany"],
     desc="Banded sard (brown-red chalcedony) and white onyx — a classical cameo and seal stone of Rome and Greece. Tough and historically important in glyptic art.",
     search="Sardonyx banded chalcedony cameo"),
dict(name="Petrified Wood", price="$2–$40 / piece", formula="SiO₂ (replacement)", klass="Silicate — Chalcedony", system="Trigonal", mohs=7, sg="2.60", ri="1.54",
     colorHex=["#8a5a3a", "#c08050"], stone="#8a5a3a", colors=["Brown", "Red", "Multicolor"], origins=["USA", "Madagascar", "Indonesia"],
     desc="Fossil wood permineralized by silica — cell structure preserved in chalcedony or opal. Arizona's Petrified Forest is world-famous; polished slabs show annual rings in stone.",
     search="Petrified wood polished slab fossil"),
dict(name="Marcasite", price="$5–$40 / piece", formula="FeS₂", klass="Sulfide", system="Orthorhombic", mohs=6.5, sg="4.90", ri="—",
     colorHex=["#c8b850", "#8a7820"], stone="#c8b850", colors=["Metallic pale brass"], origins=["Germany", "USA", "Czech Republic"],
     desc="Iron disulfide — same chemistry as pyrite, different crystal system (orthorhombic). Radiating cockscomb aggregates are classic; unstable in humid air ('pyrite disease' cousin).",
     search="Marcasite crystal cockscomb specimen"),
dict(name="Covellite", price="$20–$150 / piece", formula="CuS", klass="Sulfide", system="Hexagonal", mohs=1.5, sg="4.60", ri="—",
     colorHex=["#2a3a8a", "#1a2060"], stone="#2a3a8a", colors=["Indigo blue", "Purple"], origins=["USA", "Italy", "Serbia"],
     desc="Copper sulfide with an intense indigo-blue metallic color. Soft and flexible in thin plates; forms in the enriched zone of copper deposits. Named for Niccolò Covelli.",
     search="Covellite indigo blue mineral"),
dict(name="Proustite", price="$50–$400 / piece", formula="Ag₃AsS₃", klass="Sulfosalt", system="Trigonal", mohs=2.5, sg="5.55", ri="3.00",
     colorHex=["#c01828", "#7a0810"], stone="#c01828", colors=["Ruby red"], origins=["Chile", "Germany", "Czech Republic"],
     desc="Ruby silver — silver arsenic sulfosalt with gemmy scarlet crystals that darken in light. Extremely high refractive index; classic from Chanarcillo, Chile.",
     search="Proustite ruby silver crystal"),
dict(name="Native Platinum", price="$50–$500+ / g", formula="Pt", klass="Native element", system="Cubic", mohs=4, sg="21.5", ri="—",
     colorHex=["#c8c8c0", "#909088"], stone="#c8c8c0", colors=["Metallic silvery white"], origins=["Russia", "South Africa", "Colombia"],
     desc="Elemental platinum — denser than gold. Occurs as nuggets and grains in ultramafic-associated placers. The Urals and South Africa dominate historical and modern supply.",
     search="Native platinum nugget specimen"),
dict(name="Bismuth", price="$5–$50 / piece", formula="Bi", klass="Native element", system="Trigonal", mohs=2.5, sg="9.80", ri="—",
     colorHex=["#c080a0", "#6080c0"], stone="#9080b0", colors=["Iridescent hopper crystals"], origins=["Germany", "Bolivia", "Australia"],
     desc="Elemental bismuth — lab-grown hopper crystals show rainbow oxide tarnish beloved by collectors. Natural native bismuth is rarer; soft, dense, and slightly pinkish silver when fresh.",
     search="Bismuth crystal hopper iridescent"),
dict(name="Willemite", price="$20–$150 / piece", formula="Zn₂SiO₄", klass="Silicate", system="Trigonal", mohs=5.5, sg="4.00", ri="1.70",
     colorHex=["#6aaa4a", "#3e7028"], stone="#6aaa4a", colors=["Green", "Yellow", "Brown"], origins=["USA", "Namibia", "Belgium"],
     desc="Zinc orthosilicate from Franklin, New Jersey — glows brilliant green under UV and was an important zinc ore. Classic fluorescent suites with calcite and franklinite.",
     search="Willemite fluorescent Franklin mineral"),
dict(name="Zincite", price="$30–$200 / piece", formula="ZnO", klass="Oxide", system="Hexagonal", mohs=4, sg="5.70", ri="2.01",
     colorHex=["#c04020", "#8a2010"], stone="#c04020", colors=["Orange-red", "Yellow"], origins=["USA (Franklin NJ)"],
     desc="Zinc oxide — deep orange-red crystals essentially unique to Franklin–Sterling Hill, New Jersey. High refractive index; synthetic zincite also appears on the market.",
     search="Zincite crystal Franklin New Jersey"),
dict(name="Franklinite", price="$10–$80 / piece", formula="ZnFe₂O₄", klass="Oxide — Spinel group", system="Cubic", mohs=6, sg="5.15", ri="—",
     colorHex=["#2a2a2a", "#0e0e0e"], stone="#2a2a2a", colors=["Metallic black"], origins=["USA (Franklin NJ)"],
     desc="Zinc-iron spinel named for Franklin, New Jersey — the type locality of a unique ore mineral assemblage. Octahedra with willemite and zincite define the Franklin suite.",
     search="Franklinite crystal Franklin NJ"),
dict(name="Monazite", price="$10–$80 / piece", formula="(Ce,La,Nd,Th)PO₄", klass="Phosphate", system="Monoclinic", mohs=5, sg="5.15", ri="1.80",
     colorHex=["#8a6a3a", "#5a4018"], stone="#8a6a3a", colors=["Brown", "Yellow-brown", "Reddish"], origins=["Brazil", "India", "Australia"],
     desc="Rare-earth phosphate — a primary ore of cerium, lanthanum, and thorium. Common as a detrital heavy mineral; crystals are usually small and radioactive when Th-rich.",
     search="Monazite crystal mineral specimen"),
dict(name="Columbite", price="$20–$150 / piece", formula="(Fe,Mn)Nb₂O₆", klass="Oxide", system="Orthorhombic", mohs=6, sg="5.30", ri="2.40",
     colorHex=["#2a2a28", "#121210"], stone="#2a2a28", colors=["Black", "Brownish black"], origins=["Brazil", "Nigeria", "USA"],
     desc="Niobium-iron oxide of granite pegmatites — ore of niobium (columbium). Forms a series with tantalite; dense black tabular crystals are typical.",
     search="Columbite crystal pegmatite specimen"),
dict(name="Uraninite", price="$20–$200 / piece", formula="UO₂", klass="Oxide", system="Cubic", mohs=5.5, sg="10.0", ri="—",
     colorHex=["#2a2a2a", "#0e0e0e"], stone="#2a2a2a", colors=["Black", "Brownish black"], origins=["Canada", "Congo", "Czech Republic"],
     desc="Uranium dioxide — the primary uranium ore (pitchblende when massive). Extremely dense and radioactive; historically crucial to nuclear chemistry. Handle and store with care.",
     search="Uraninite pitchblende mineral specimen"),
dict(name="Autunite", price="$20–$150 / piece", formula="Ca(UO₂)₂(PO₄)₂·10–12H₂O", klass="Phosphate", system="Tetragonal", mohs=2, sg="3.15", ri="1.58",
     colorHex=["#c8d830", "#8a9810"], stone="#c8d830", colors=["Yellow-green"], origins=["France", "USA", "Portugal"],
     desc="Calcium uranyl phosphate — fluorescent yellow-green plates that dehydrate to meta-autunite. Soft and radioactive; a classic secondary uranium mineral of oxidized U deposits.",
     search="Autunite yellow green fluorescent"),
dict(name="Torbernite", price="$30–$200 / piece", formula="Cu(UO₂)₂(PO₄)₂·8–12H₂O", klass="Phosphate", system="Tetragonal", mohs=2.5, sg="3.20", ri="1.62",
     colorHex=["#3aaa3a", "#1e701e"], stone="#3aaa3a", colors=["Emerald green"], origins=["Germany", "Congo", "England"],
     desc="Copper uranyl phosphate — vivid green square plates, radioactive, soft. Named for Swedish chemist Torbern Bergman. Dehydrates to metatorbernite; cabinet specimens only.",
     search="Torbernite green crystal uranium"),
dict(name="Realgar", price="$10–$80 / piece", formula="As₄S₄", klass="Sulfide", system="Monoclinic", mohs=1.5, sg="3.55", ri="2.45",
     colorHex=["#d04020", "#8a2008"], stone="#d04020", colors=["Orange-red"], origins=["China", "USA", "Romania"],
     desc="Arsenic sulfide — soft orange-red crystals that alter to yellow orpiment in light. Historically a pigment and firework ingredient; store dark. Beautiful but toxic arsenic mineral.",
     search="Realgar crystal orange red specimen"),
dict(name="Orpiment", price="$10–$80 / piece", formula="As₂S₃", klass="Sulfide", system="Monoclinic", mohs=1.5, sg="3.50", ri="2.50",
     colorHex=["#d8a820", "#a07810"], stone="#d8a820", colors=["Lemon yellow", "Orange"], origins=["China", "Peru", "USA"],
     desc="Arsenic trisulfide — lemon-yellow foliated masses with a resinous luster. Soft and sectile; often associated with realgar. Historic yellow pigment; toxic arsenic content.",
     search="Orpiment yellow mineral specimen"),
]

assert len(GEMS) == 100, len(GEMS)


def api(params, retries=6):
    q = urllib.parse.urlencode({**params, "format": "json"})
    url = f"https://commons.wikimedia.org/w/api.php?{q}"
    delay = 2.0
    for attempt in range(retries):
        time.sleep(0.35)  # polite pacing
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        try:
            with urllib.request.urlopen(req, context=ctx, timeout=90) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code in (429, 503) and attempt < retries - 1:
                print(f"  rate-limit {e.code}, sleep {delay:.0f}s…")
                time.sleep(delay)
                delay = min(delay * 2, 90)
                continue
            raise


def search(term, limit=8):
    data = api({"action": "query", "list": "search", "srsearch": term, "srnamespace": 6, "srlimit": limit})
    return [x["title"].removeprefix("File:") for x in data["query"]["search"]]


def info(title):
    data = api({"action": "query", "titles": f"File:{title}", "prop": "imageinfo", "iiprop": "url|size|mime"})
    for p in data["query"]["pages"].values():
        if "missing" in p:
            return None
        return p["imageinfo"][0]


def slugify(name):
    s = name.lower().replace("'", "").replace("ü", "u").replace("ä", "a").replace("ö", "o")
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
        f' {{name:"{js_escape(g["name"])}",price:"{js_escape(g["price"])}",img:"images/{slug}.jpg",'
        f'formula:"{js_escape(g["formula"])}",class:"{js_escape(g["klass"])}",system:"{js_escape(g["system"])}",'
        f'mohs:{g["mohs"]},sg:"{g["sg"]}",ri:"{g["ri"]}",colorHex:[{ch}],stone:"{g["stone"]}",'
        f'glow:"{rgba_glow(g["stone"])}",colors:[{colors}],origins:[{origins}],'
        f'desc:"{js_escape(g["desc"])}"}}'
    )


def fetch_photo(g, slug, sources):
    jpg = IMG / f"{slug}.jpg"
    if jpg.exists() and jpg.stat().st_size > 8000:
        print(f"  keep existing {slug}.jpg")
        return True
    skip = (".pdf", ".svg", ".png", ".gif", ".tif", ".tiff")
    try:
        titles = search(g["search"])
    except Exception as e:
        print(f"  search fail {g['name']}: {e}")
        print(f"  NO PHOTO for {g['name']} — SVG only")
        return False
    for title in titles:
        if title.lower().endswith(skip):
            continue
        low = title.lower()
        if any(x in low for x in ["map of", "logo", "flag", "portrait", "painting", "bird", "flower", "coin", "stamp"]):
            continue
        try:
            inf = info(title)
        except Exception as e:
            print(f"  info fail {title[:40]}: {e}")
            time.sleep(3)
            continue
        if not inf or not inf.get("mime", "").startswith("image/"):
            continue
        if inf["size"] < 15000:
            continue
        try:
            print(f"  DL {title[:70]}…")
            time.sleep(0.5)
            download_jpg(inf["url"], jpg)
            sources[slug] = title
            return True
        except urllib.error.HTTPError as e:
            print(f"  fail {title[:40]}: {e}")
            if e.code in (429, 503):
                time.sleep(15)
            continue
        except Exception as e:
            print(f"  fail {title[:40]}: {e}")
            continue
    print(f"  NO PHOTO for {g['name']} — SVG only")
    return False


def existing_names(html):
    m = re.search(r"const GEMS\s*=\s*\[(.*?)\];", html, re.S)
    return set(re.findall(r'\{name:"([^"]+)"', m.group(1)))


def main():
    assert len(GEMS) == 100
    html = HTML.read_text()
    have = existing_names(html)
    gems = []
    for g in GEMS:
        if g["name"] in have:
            raise SystemExit(f"Duplicate name already in catalog: {g['name']}")
        gems.append(g)

    names = [g["name"] for g in gems]
    if len(names) != len(set(names)):
        raise SystemExit("Internal duplicate names in new list")

    sources = json.loads(SOURCES.read_text()) if SOURCES.exists() else {}
    entries = []
    photo_ok = 0
    photo_fail = []
    print("Cooling off 45s before Commons requests…")
    time.sleep(45)
    for i, g in enumerate(gems, 1):
        slug = slugify(g["name"])
        print(f"[{i}/100] {g['name']}")
        make_svg(IMG / f"{slug}.svg", g["stone"])
        ok = fetch_photo(g, slug, sources)
        if ok:
            photo_ok += 1
        else:
            photo_fail.append(g["name"])
        entries.append(gem_js(g))
        print(f"OK {g['name']} -> {slug}")
        if i % 10 == 0:
            SOURCES.write_text(json.dumps(sources, indent=2) + "\n")
            time.sleep(2)

    SOURCES.write_text(json.dumps(sources, indent=2) + "\n")

    # Insert before closing of GEMS only — after Lepidolite
    marker = '{name:"Lepidolite"'
    idx = html.find(marker)
    if idx < 0:
        raise SystemExit("Lepidolite marker not found")
    # end of Lepidolite object
    end = html.find("},", idx)
    if end < 0:
        end = html.find("}\n];", idx)
        if end < 0:
            end = html.find("}\r\n];", idx)
        if end < 0:
            raise SystemExit("Could not find end of Lepidolite entry")
        insert_at = end + 1
    else:
        insert_at = end + 1

    # Guard: ensure we are still inside GEMS, before filterDefs
    filter_at = html.find("const filterDefs")
    if filter_at < 0 or insert_at > filter_at:
        raise SystemExit("Insert point would hit filterDefs — aborting")

    if 'name:"Orthoclase"' in html:
        print("Orthoclase already present — skipping HTML insert")
    else:
        block = ",\n" + ",\n".join(entries)
        html = html[:insert_at] + block + html[insert_at:]
        print(f"Inserted {len(entries)} gems before filterDefs")

    # Copy updates (catalog size)
    reps = [
        ("Mineralogy · One Hundred Specimens · Hand-Documented", "Mineralogy · Two Hundred Specimens · Hand-Documented"),
        (
            "One hundred precious, semi-precious, and famously rare gemstones",
            "Two hundred precious, semi-precious, and famously rare gemstones — chosen for collectors, students, and geologists",
        ),
        ("Uses all 100 gemstones in the catalog", "Uses all 200 gemstones in the catalog"),
        ("Geology <em>classes</em> for kids", "Geology <em>classes</em> for kids & students"),
    ]
    for a, b in reps:
        if a in html:
            html = html.replace(a, b)
            print(f"updated copy: {b[:60]}…")

    # Expand rare filter with a few new rarities (do not break filterDefs structure)
    old = "Musgravite|Tsavorite|Demantoid"
    new = "Musgravite|Tsavorite|Demantoid|Taaffeite|Jeremejevite|Pezzottaite"
    if old in html and "Taaffeite|" not in html:
        html = html.replace(old, new, 1)
        print("updated rare filter")

    HTML.write_text(html)

    # Verify counts
    html2 = HTML.read_text()
    m = re.search(r"const GEMS\s*=\s*\[(.*?)\];", html2, re.S)
    count = len(re.findall(r'\{name:"([^"]+)"', m.group(1)))
    fd = re.search(r"const filterDefs\s*=\s*\[(.*?)\];", html2, re.S)
    fd_names = re.findall(r'\{name:"([^"]+)"', fd.group(1)) if fd else []
    print(f"GEMS count: {count}")
    print(f"filterDefs accidental names: {len(fd_names)}")
    print(f"Photos OK: {photo_ok}, SVG-only: {len(photo_fail)}")
    if photo_fail:
        print("SVG-only:", ", ".join(photo_fail))


if __name__ == "__main__":
    main()
