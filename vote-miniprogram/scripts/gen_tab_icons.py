# -*- coding: utf-8 -*-
"""生成 tabBar 用的小体积 PNG 图标（单色简图，保证 < 40KB）"""
import os
import sys

try:
    from PIL import Image, ImageDraw
except ImportError:
    print("请先安装: pip install Pillow")
    sys.exit(1)

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "images")
os.makedirs(OUT_DIR, exist_ok=True)
SIZE = 81
GRAY = (0x99, 0x99, 0x99, 255)
GREEN = (0x07, 0xc1, 0x60, 255)
WHITE = (255, 255, 255, 0)

def save_icon(path, color, draw_fn):
    img = Image.new("RGBA", (SIZE, SIZE), WHITE)
    draw = ImageDraw.Draw(img)
    draw_fn(draw, color)
    img.save(path, "PNG", optimize=True)
    assert os.path.getsize(path) < 40 * 1024, f"{path} still too large"

# 首页 - 房子
def draw_home(d, color):
    d.polygon([(40, 20), (20, 45), (20, 70), (60, 70), (60, 45)], outline=color, fill=None, width=4)
    d.rectangle([(35, 50), (45, 70)], outline=color, fill=None, width=3)

# 投票 - 对勾/列表
def draw_vote(d, color):
    d.rectangle([(22, 25), (58, 35)], outline=color, width=3)
    d.rectangle([(22, 42), (58, 52)], outline=color, width=3)
    d.rectangle([(22, 59), (58, 69)], outline=color, width=3)
    d.polygon([(48, 28), (42, 34), (55, 48), (62, 40)], outline=color, fill=color, width=2)

# 我的 - 人形（头+半圆身体）
def draw_my(d, color):
    d.ellipse([(28, 18), (52, 42)], outline=color, width=3)
    d.arc([(22, 38), (58, 78)], 0, 180, outline=color, width=3)

def main():
    save_icon(os.path.join(OUT_DIR, "tab-home.png"), GRAY, draw_home)
    save_icon(os.path.join(OUT_DIR, "tab-home-active.png"), GREEN, draw_home)
    save_icon(os.path.join(OUT_DIR, "tab-vote.png"), GRAY, draw_vote)
    save_icon(os.path.join(OUT_DIR, "tab-vote-active.png"), GREEN, draw_vote)
    save_icon(os.path.join(OUT_DIR, "tab-my.png"), GRAY, draw_my)
    save_icon(os.path.join(OUT_DIR, "tab-my-active.png"), GREEN, draw_my)
    print("OK: 6 tab icons written to", OUT_DIR)
    for name in ["tab-home.png", "tab-home-active.png", "tab-vote.png", "tab-vote-active.png", "tab-my.png", "tab-my-active.png"]:
        p = os.path.join(OUT_DIR, name)
        if os.path.exists(p):
            print("  ", name, os.path.getsize(p), "bytes")

if __name__ == "__main__":
    main()
