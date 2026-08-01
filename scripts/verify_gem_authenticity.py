#!/usr/bin/env python3
"""Cross-check gems-data.js names against IMA master list text + local Wikidata minerals."""
from __future__ import annotations
import json, re, unicodedata, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def fold(s: str) -> str:
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    return s.lower().replace("'", "").strip()

GEM_VARIETIES = {
    fold(x) for x in """
    ruby sapphire emerald amethyst citrine aquamarine morganite heliodor goshenite
    garnet tourmaline peridot tanzanite jade alexandrite paraiba tourmaline
    black opal fire opal ammolite larimar moonstone lapis lazuli pearl onyx rose quartz
    kunzite iolite sphene chrome diopside bloodstone carnelian agate labradorite sunstone
    amber jet amazonite tigers eye blue lace agate aventurine star sapphire star ruby
    snowflake obsidian smoky quartz rock crystal ametrine prasiolite jasper chrysoprase
    tsavorite demantoid padparadscha red beryl indicolite rubellite spectrolite moldavite
    chalcedony sardonyx moss agate pietersite serpentine petrified wood moissanite unakite
    seraphinite cats eye hackmanite fire agate hawks eye native platinum native gold
    native silver native copper apatite howlite turquoise hessonite rhodolite selenite
    taaffeite pezzottaite barite
    """.split()
}

def main() -> int:
    ima_path = Path(sys.argv[1]) if len(sys.argv) > 1 else None
    src = (ROOT / "gems-data.js").read_text()
    names = re.findall(r'\{name:"((?:\\.|[^"\\])*)"', src)
    wd = {fold(k) for k in json.loads((ROOT / "scripts/minerals_wd.json").read_text())}
    ima_text = fold(ima_path.read_text()) if ima_path and ima_path.exists() else ""

    bad = []
    for n in names:
        f = fold(n)
        ok = f in GEM_VARIETIES or f in wd
        if ima_text and not ok:
            ok = bool(re.search(r"(?:^|[^a-z0-9])" + re.escape(f) + r"(?:[^a-z0-9]|$)", ima_text))
        if not ok:
            bad.append(n)
    print(f"checked={len(names)} bad={len(bad)}")
    for b in bad:
        print(" ", b)
    return 1 if bad else 0

if __name__ == "__main__":
    raise SystemExit(main())
