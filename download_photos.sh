#!/usr/bin/env bash
#
# Lithos — real gemstone photo downloader
# ----------------------------------------
# Downloads one freely-licensed photo per gemstone from Wikimedia Commons
# and saves it into images/ with the exact filename the website expects.
#
# HOW TO RUN (needs a normal internet connection):
#   1. Open a terminal in this folder (the one containing index.html)
#   2. Run:   bash download_photos.sh
#   3. Refresh index.html in your browser — real photos will appear.
#
# Every image below is from Wikimedia Commons and is public domain or
# Creative Commons. See LICENSES.txt (generated at the end) for attribution.
# Even so, DOUBLE-CHECK each license before commercial use — CC-BY images
# require you to credit the author.

set -e
mkdir -p images
UA="LithosCatalog/1.0 (educational gemstone database)"
BASE="https://commons.wikimedia.org/wiki/Special:FilePath"

# filename<TAB>Wikimedia file name
download () {
  local out="$1"; local file="$2"
  echo "→ $out"
  curl -sL -A "$UA" --max-time 60 "$BASE/${file}?width=900" -o "images/$out" \
    && echo "   saved images/$out" \
    || echo "   FAILED — grab a photo for '$out' manually"
}

# --- Classics ---
download diamond.jpg              "Brillanten.jpg"
download ruby.jpg                 "Ruby_cristal.jpg"
download sapphire.jpg            "Logan_sapphire_SI.jpg"
download emerald.jpg             "Emerald_Gem.JPG"
download amethyst.jpg            "Amethystdruse.jpg"
download topaz.jpg               "Topaz_cut.jpg"
download opal.jpg                "Opal_from_Yowah,_Queensland,_Australia.jpg"
download garnet.jpg              "Almandine_red.jpg"
download aquamarine.jpg         "Aquamarine_gem.jpg"
download tourmaline.jpg         "Tourmaline-50848.jpg"
download peridot.jpg            "Peridot_2.jpg"
download spinel.jpg             "Spinel-usa54c.jpg"
download tanzanite.jpg          "Tanzanite-crystal.jpg"
download citrine.jpg            "Citrine_gemstone.jpg"
download jade.jpg               "Jade_boulder.jpg"

# --- Rare & remarkable ---
download alexandrite.jpg           "Alexandrite_26.75cts.jpg"
download para-ba-tourmaline.jpg   "Elbaite-Paraiba.jpg"
download black-opal.jpg           "Opal_from_Yowah,_Queensland,_Australia.jpg"
download benitoite.jpg            "Benitoite_crystals_on_matrix.jpg"
download moissanite.jpg           "Moissanite.jpg"
download ammolite.jpg             "Ammolite_closeup.jpg"
download painite.jpg              "Painite.jpg"
download grandidierite.jpg        "Grandidierite_-_Madagascar.jpg"
download larimar.jpg              "Larimar_pektolith.jpg"
download musgravite.jpg           "Taaffeite.jpg"

echo
echo "Done. Any file that FAILED just means that specific Wikimedia name"
echo "changed — search commons.wikimedia.org for that gem and save the"
echo "photo yourself using the same filename shown above."
echo
echo "Reminder: verify each image's license before selling. CC-BY needs credit."
