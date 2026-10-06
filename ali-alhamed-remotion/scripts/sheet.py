# QA helper: tile stills into labelled contact sheets. python3 -I scripts/sheet.py <dir> <out_prefix> [cols] [w]
import sys, glob
from PIL import Image, ImageDraw
d, out = sys.argv[1], sys.argv[2]
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 2
W = int(sys.argv[4]) if len(sys.argv) > 4 else 960
fs = sorted(glob.glob(d + "/f_*.jpg"))
H = W * 9 // 16
per = cols * 3
for k in range(0, len(fs), per):
    chunk = fs[k:k + per]
    rows = (len(chunk) + cols - 1) // cols
    sh = Image.new("RGB", (W * cols, H * rows), "gray")
    dr = ImageDraw.Draw(sh)
    for i, f in enumerate(chunk):
        im = Image.open(f).resize((W, H))
        x, y = (i % cols) * W, (i // cols) * H
        sh.paste(im, (x, y))
        dr.rectangle([x, y, x + 70, y + 16], fill="black")
        dr.text((x + 3, y + 2), f.split("f_")[1][:-4], fill="yellow")
    sh.save(f"{out}_{k // per}.jpg", quality=88)
print("sheets", (len(fs) + per - 1) // per)
