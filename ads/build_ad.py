#!/usr/bin/env python3
"""Build Lithos gems promo frames with text overlays, then assemble via ffmpeg."""

from __future__ import annotations

import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFont

ROOT = Path(__file__).resolve().parent
FRAMES = ROOT / "frames"
OUT_FRAMES = ROOT / "out_frames"
OUT_MP4 = ROOT / "lithos-gems-ad.mp4"
W, H = 1280, 720

FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_REG = "/System/Library/Fonts/Supplemental/Arial.ttf"


def load_font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def fit_cover(img: Image.Image, w: int, h: int) -> Image.Image:
    img = img.convert("RGB")
    scale = max(w / img.width, h / img.height)
    nw, nh = int(img.width * scale), int(img.height * scale)
    img = img.resize((nw, nh), Image.Resampling.LANCZOS)
    left = (nw - w) // 2
    top = (nh - h) // 2
    return img.crop((left, top, left + w, top + h))


def darken(img: Image.Image, amount: float = 0.55) -> Image.Image:
    overlay = Image.new("RGB", img.size, (0, 0, 0))
    return Image.blend(img, overlay, amount)


def center_text(
    draw: ImageDraw.ImageDraw,
    text: str,
    y: int,
    font: ImageFont.FreeTypeFont,
    fill: tuple[int, int, int],
    stroke: int = 2,
) -> None:
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    x = (W - tw) // 2
    draw.text(
        (x, y),
        text,
        font=font,
        fill=fill,
        stroke_width=stroke,
        stroke_fill=(0, 0, 0),
    )


def banner(draw: ImageDraw.ImageDraw, y: int, h: int = 100) -> None:
    draw.rectangle((0, y, W, y + h), fill=(0, 0, 0, 160))


def make_slide(
    src: Path,
    out: Path,
    *,
    mode: str,
    title: str | None = None,
    subtitle: str | None = None,
    banner_text: str | None = None,
) -> None:
    base = fit_cover(Image.open(src), W, H)
    base = ImageEnhance.Color(base).enhance(1.12)

    if mode == "title":
        base = darken(base, 0.42)
        draw = ImageDraw.Draw(base)
        center_text(draw, title or "LITHOS", H // 2 - 70, load_font(FONT_BOLD, 92), (255, 255, 255), 3)
        if subtitle:
            center_text(draw, subtitle, H // 2 + 40, load_font(FONT_REG, 34), (232, 213, 163), 2)
    elif mode == "end":
        base = darken(base, 0.48)
        draw = ImageDraw.Draw(base)
        center_text(draw, title or "Explore the catalog", H // 2 - 50, load_font(FONT_BOLD, 46), (255, 255, 255), 2)
        if subtitle:
            center_text(draw, subtitle, H // 2 + 30, load_font(FONT_REG, 28), (232, 213, 163), 2)
    elif mode == "banner":
        rgba = base.convert("RGBA")
        overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        od = ImageDraw.Draw(overlay)
        od.rectangle((0, H - 110, W, H), fill=(0, 0, 0, 150))
        base = Image.alpha_composite(rgba, overlay).convert("RGB")
        draw = ImageDraw.Draw(base)
        if banner_text:
            center_text(draw, banner_text, H - 78, load_font(FONT_REG, 30), (255, 255, 255), 1)
    else:
        # plain gem beauty shot
        pass

    base.save(out, quality=92)


def main() -> None:
    OUT_FRAMES.mkdir(parents=True, exist_ok=True)

    sequence = [
        # (source stem, duration, mode, kwargs)
        ("00-amethyst", 2.5, "title", {"title": "LITHOS", "subtitle": "Discover Real Gems"}),
        ("01-aquamarine", 1.4, "plain", {}),
        ("06-ruby", 1.4, "plain", {}),
        ("03-emerald", 1.4, "plain", {}),
        ("07-sapphire", 1.4, "plain", {}),
        ("05-opal", 1.8, "banner", {"banner_text": "6,000 minerals. Real specimens."}),
        ("04-garnet", 1.4, "plain", {}),
        ("11-malachite", 1.4, "plain", {}),
        ("10-lapis-lazuli", 1.4, "plain", {}),
        ("12-fluorite", 1.4, "plain", {}),
        ("09-turquoise", 1.8, "banner", {"banner_text": "Learn gems with Rock Teacher"}),
        ("13-pyrite", 1.4, "plain", {}),
        ("02-diamond", 1.4, "plain", {}),
        (
            "08-topaz",
            3.0,
            "end",
            {
                "title": "Explore the catalog",
                "subtitle": "grahamgattegno.github.io/lithos",
            },
        ),
    ]

    concat_lines: list[str] = []
    for i, (stem, dur, mode, kwargs) in enumerate(sequence):
        src = FRAMES / f"{stem}.jpg"
        out = OUT_FRAMES / f"{i:02d}.jpg"
        make_slide(src, out, mode=mode, **kwargs)
        concat_lines.append(f"file '{out}'")
        concat_lines.append(f"duration {dur}")

    # last frame must be listed again without duration for concat demuxer
    last = OUT_FRAMES / f"{len(sequence) - 1:02d}.jpg"
    concat_lines.append(f"file '{last}'")

    list_path = ROOT / "concat.txt"
    list_path.write_text("\n".join(concat_lines) + "\n")

    cmd = [
        "ffmpeg",
        "-y",
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        str(list_path),
        "-vf",
        "fps=30,format=yuv420p",
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        str(OUT_MP4),
    ]
    subprocess.run(cmd, check=True)
    print(f"Wrote {OUT_MP4}")


if __name__ == "__main__":
    main()
