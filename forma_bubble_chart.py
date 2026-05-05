"""
Forma Language Prioritization — Animated Bubble Chart
------------------------------------------------------
Dependencies: matplotlib, Pillow, numpy
Install:  pip install matplotlib Pillow numpy

Usage:
    python forma_bubble_chart.py

Output:
    forma_bubble_chart.gif  (in the same directory)

Notes:
- Font: SF Pro Text (macOS)
- To change output path, edit the `out` variable at the bottom
"""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import numpy as np
from PIL import Image
import io
import os

# ── Colors ────────────────────────────────────────────────
BG         = '#f8f8f8'
GRID_C     = '#e8e8e8'
PURPLE     = '#4E008E'    # selected bubble fill
PURPLE_D   = '#3A0070'    # selected bubble edge
GRAY_FILL  = '#C8C8C8'    # other bubbles
GRAY_EDGE  = '#AAAAAA'
TEXT_DARK  = '#1c1c1e'    # axis titles
TEXT_MUTED = '#808080'    # muted labels, ticks, captions

# ── Font ──────────────────────────────────────────────────
FONT_REG  = '/Library/Fonts/SF-Pro-Text-Regular.otf'
FONT_BOLD = '/Library/Fonts/SF-Pro-Text-Bold.otf'

for fp in [FONT_REG, FONT_BOLD]:
    if os.path.exists(fp):
        fm.fontManager.addfont(fp)

plt.rcParams['font.family'] = 'SF Pro Text'
plt.rcParams['text.color']  = TEXT_DARK

# ── Data ──────────────────────────────────────────────────
# (name, x=countries, y=user_reach%, speakers_M, selected)
langs = [
    ('Spanish',  3,    97,  500,  True),
    ('French',   2,    65,  280,  True),
    ('German',   1,    35,  90,   True),
    ('Arabic',   1,    22,  85,   True),
    ('Japanese', 1,    79,  125,  False),
    ('Dutch',    1,    44,  25,   False),
    ('Hindi',    1.2,  68,  600,  False),
    ('English',  5,    100, 1500, False),
]

# ── Animation settings ────────────────────────────────────
TOTAL_FRAMES  = 54     # total frames per loop
FPS           = 18     # frames per second
RIPPLE_PERIOD = 36     # frames for one full ripple cycle
N_RINGS       = 3      # concentric ripple rings per bubble

# Aspect ratio matches neighboring img-block: 476 / 390.63 ≈ 1.219
FIG_W = 8.77
FIG_H = 7.2


def bubble_r(speakers_M: float) -> float:
    return np.sqrt(speakers_M) * 2.2


def make_frame(frame_idx: int):
    fig, ax = plt.subplots(figsize=(FIG_W, FIG_H))
    fig.patch.set_facecolor(BG)
    ax.set_facecolor(BG)

    phase = (frame_idx % RIPPLE_PERIOD) / RIPPLE_PERIOD

    # ── Grid lines (x only up to 5, y as before) ─────────
    for yv in [0, 20, 40, 60, 80, 100, 115]:
        ax.axhline(yv, color=GRID_C, linewidth=0.5, zorder=0)
    for xv in range(0, 6):
        ax.axvline(xv, color=GRID_C, linewidth=0.5, zorder=0)

    # ── Draw each bubble ──────────────────────────────────
    for i, (name, x, y, sp, selected) in enumerate(langs):
        r_base = bubble_r(sp)

        if name == 'English':
            fill_c = '#D0D0D0'
            ring_c = '#B8B8B8'
        elif selected:
            fill_c = PURPLE
            ring_c = PURPLE_D
        else:
            fill_c = GRAY_FILL
            ring_c = GRAY_EDGE

        offset      = (i * 0.13) % 1.0
        local_phase = (phase + offset) % 1.0

        # Ripple rings
        for ring_idx in range(N_RINGS):
            ring_phase = (local_phase + ring_idx / N_RINGS) % 1.0
            expand     = ring_phase
            ring_r     = r_base * (1.0 + 0.7 * expand)
            ring_alpha = (1 - expand) * (0.30 if selected else 0.15)
            if ring_alpha > 0.01:
                ax.scatter(x, y,
                           s=ring_r ** 2,
                           facecolors='none',
                           edgecolors=ring_c,
                           linewidths=0.8,
                           alpha=ring_alpha,
                           zorder=1)

        # Core bubble
        breathe = 1.0 + 0.03 * np.sin(local_phase * 2 * np.pi)
        core_s  = (r_base * breathe) ** 2
        ax.scatter(x, y,
                   s=core_s,
                   color=fill_c,
                   edgecolors=ring_c,
                   linewidths=1.2,
                   alpha=0.92,
                   zorder=2)

        # Label — white bg bbox ensures readability if label overlaps bubble fill
        label_y = y + r_base * 0.012 + 5
        fw      = 'bold' if selected else 'normal'
        fc      = TEXT_DARK if selected else TEXT_MUTED
        ax.text(x + 0.08, label_y, name,
                color=fc, fontsize=11, fontweight=fw,
                fontfamily='SF Pro Text',
                alpha=1.0, zorder=4, va='bottom',
                bbox=dict(facecolor='white', alpha=0.82, pad=1.5,
                          edgecolor='none', boxstyle='round,pad=0.15'))

    # ── Axes styling ──────────────────────────────────────
    ax.set_xlim(-0.3, 5.7)   # column 6 and 7 removed
    ax.set_ylim(-8, 130)
    ax.set_xticks(range(0, 6))
    ax.set_yticks([0, 20, 40, 60, 80, 100, 115])
    ax.set_yticklabels(
        [f'{v}%' for v in [0, 20, 40, 60, 80, 100, 115]],
        color=TEXT_MUTED, fontsize=9, fontfamily='SF Pro Text')
    ax.set_xticklabels(
        [str(v) for v in range(0, 6)],
        color=TEXT_MUTED, fontsize=9, fontfamily='SF Pro Text')
    ax.tick_params(colors=TEXT_MUTED, length=0)
    for spine in ax.spines.values():
        spine.set_visible(False)

    ax.set_xlabel(
        'Number of countries using this language among Forma clients',
        color=TEXT_MUTED, fontsize=9.5, labelpad=10,
        fontfamily='SF Pro Text')
    ax.set_ylabel(
        'Estimated % of Forma international users reached',
        color=TEXT_MUTED, fontsize=9.5, labelpad=10,
        fontfamily='SF Pro Text')

    # ── Legend — left-padded to spacing-1 ─────────────────
    fig.text(0.04, 0.032,
             '●  Selected — top 4 languages',
             color=PURPLE, fontsize=9, fontfamily='SF Pro Text',
             transform=fig.transFigure)
    fig.text(0.46, 0.032,
             '●  Other languages',
             color=TEXT_MUTED, fontsize=9, fontfamily='SF Pro Text',
             transform=fig.transFigure)
    fig.text(0.04, 0.009,
             'Bubble size = estimated global speaker count',
             color=TEXT_MUTED, fontsize=8.5, fontfamily='SF Pro Text',
             transform=fig.transFigure)

    plt.tight_layout(rect=[0.01, 0.07, 0.99, 1])

    buf = io.BytesIO()
    fig.savefig(buf, format='png', dpi=110,
                facecolor=BG, bbox_inches='tight')
    plt.close(fig)
    buf.seek(0)
    return Image.open(buf).copy()


# ── Generate & save ───────────────────────────────────────
if __name__ == '__main__':
    print("Generating frames...")
    frames = []
    for i in range(TOTAL_FRAMES):
        if i % 10 == 0:
            print(f"  frame {i}/{TOTAL_FRAMES}")
        frames.append(make_frame(i))

    out = 'forma_bubble_chart.gif'
    frames[0].save(
        out,
        save_all=True,
        append_images=frames[1:],
        optimize=True,
        duration=int(1000 / FPS),
        loop=0,
    )
    print(f"Saved → {out}")
