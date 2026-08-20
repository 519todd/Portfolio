#!/usr/bin/env python3
"""Export all Localization icons as #4E008E, transparent bg, centered."""

import os
import subprocess
import tempfile
import glob
from PIL import Image

BASE = os.path.dirname(os.path.abspath(__file__))
ICONS_DIR = os.path.join(BASE, "Icons")
OUT_DIR = "/Users/toddwu/Desktop/Keynote slides/Localization"
COLOR = (0x4E, 0x00, 0x8E)
OUTPUT_SIZE = 200
PADDING_PCT = 0.12   # 12% padding on each side


def center_on_canvas(img_rgba, size=OUTPUT_SIZE, pad=PADDING_PCT):
    """Crop to content bbox, scale to fit with padding, center on transparent canvas."""
    bbox = img_rgba.getbbox()
    if not bbox:
        return img_rgba
    cropped = img_rgba.crop(bbox)
    cw, ch = cropped.size
    max_content = int(size * (1 - 2 * pad))
    scale = min(max_content / cw, max_content / ch)
    nw, nh = int(cw * scale), int(ch * scale)
    resized = cropped.resize((nw, nh), Image.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    canvas.paste(resized, ((size - nw) // 2, (size - nh) // 2), resized)
    return canvas


def recolor_png(src_path, out_name):
    """Recolor all non-transparent pixels to #4E008E, then center."""
    img = Image.open(src_path).convert("RGBA")
    r, g, b, a = img.split()
    tinted = Image.merge("RGBA", [
        Image.new("L", img.size, COLOR[0]),
        Image.new("L", img.size, COLOR[1]),
        Image.new("L", img.size, COLOR[2]),
        a,
    ])
    result = center_on_canvas(tinted)
    result.save(os.path.join(OUT_DIR, out_name + ".png"))
    print(f"  ✓ {out_name}.png")


def remove_white_bg_and_recolor(img):
    """Remove white background; use green channel (max contrast for #4E008E on white)
    as alpha proxy, then force all pixels to #4E008E."""
    img = img.convert("RGBA")
    pixels = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            # Green channel: 255=white (transparent), 0=pure #4E008E (opaque)
            new_alpha = 255 - g
            pixels[x, y] = (*COLOR, new_alpha)
    return img


def svg_to_png(svg_content, out_name):
    """Render SVG via qlmanage → remove white bg → center → save."""
    with tempfile.TemporaryDirectory() as tmp:
        svg_path = os.path.join(tmp, f"{out_name}.svg")
        with open(svg_path, "w") as f:
            f.write(svg_content)

        subprocess.run(
            ["qlmanage", "-t", "-s", str(OUTPUT_SIZE * 6), "-o", tmp, svg_path],
            capture_output=True
        )

        thumb_path = svg_path + ".png"
        if not os.path.exists(thumb_path):
            print(f"  ✗ {out_name}: qlmanage failed")
            return

        img = Image.open(thumb_path)
        img = remove_white_bg_and_recolor(img)
        result = center_on_canvas(img)
        result.save(os.path.join(OUT_DIR, out_name + ".png"))
        print(f"  ✓ {out_name}.png")


# ── Delete old icons ──────────────────────────────────────────────────────────
print("Deleting old icon files...")
for f in glob.glob(os.path.join(OUT_DIR, "Icon - *.png")):
    os.remove(f)
    print(f"  deleted {os.path.basename(f)}")


# ── 1. PNG icons ──────────────────────────────────────────────────────────────
print("\nRecoloring PNG icons...")
recolor_png(os.path.join(ICONS_DIR, "Interface", "Link_Break.png"),
            "Icon - Link Break")
recolor_png(os.path.join(ICONS_DIR, "local address formats.png"),
            "Icon - Local Address Formats")
recolor_png(os.path.join(ICONS_DIR, "currency-off.png"),
            "Icon - Currency Off")


# ── 2. SVG icons ──────────────────────────────────────────────────────────────
print("\nRendering SVG icons...")

def svg(paths):
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" '
        'viewBox="0 0 24 24" fill="none" stroke="#4E008E" stroke-width="2" '
        f'stroke-linecap="round" stroke-linejoin="round">{paths}</svg>'
    )

svgs = {
    "Icon - Language": svg(
        '<path d="m5 8 6 6"/>'
        '<path d="m4 14 6-6 3-3"/>'
        '<path d="M2 5h12"/>'
        '<path d="M7 2h1"/>'
        '<path d="m22 22-5-10-5 10"/>'
        '<path d="M14 18h6"/>'
    ),
    "Icon - Globe": svg(
        '<path d="M21.54 15H17a2 2 0 0 0-2 2v4.54"/>'
        '<path d="M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17"/>'
        '<path d="M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05"/>'
        '<circle cx="12" cy="12" r="10"/>'
    ),
    "Icon - Euro": svg(
        '<path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2"/>'
        '<path d="M16 10h-12"/>'
        '<path d="M13 14h-9"/>'
    ),
    "Icon - Annoyed": svg(
        '<circle cx="12" cy="12" r="10"/>'
        '<path d="M8 15h8"/>'
        '<path d="M8 9h2"/>'
        '<path d="M14 9h2"/>'
    ),
    "Icon - Rocket": svg(
        '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>'
        '<path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>'
        '<path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>'
        '<path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>'
    ),
    "Icon - Smile": svg(
        '<path d="M22 11v1a10 10 0 1 1-9-10"/>'
        '<path d="M8 14s1.5 2 4 2 4-2 4-2"/>'
        '<line x1="9" x2="9.01" y1="9" y2="9"/>'
        '<line x1="15" x2="15.01" y1="9" y2="9"/>'
        '<path d="M16 5h6"/>'
        '<path d="M19 2v6"/>'
    ),
    "Icon - Monitor": svg(
        '<rect height="14" rx="2" width="20" x="2" y="3"/>'
        '<path d="M12 17v4"/>'
        '<path d="M8 21h8"/>'
        '<path d="m9 10 2 2 4-4"/>'
    ),
}

for name, content in svgs.items():
    svg_to_png(content, name)

print(f"\nDone. 10 icons saved to:\n  {OUT_DIR}")
