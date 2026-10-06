# QA: audio offset between source and render at several points (cross-correlation),
# plus duration/stream report. Usage: python3 -I scripts/qa_sync.py public/source.mp4 out/ali_alhamed_final.mp4
import subprocess, sys, json
import numpy as np
src, out = sys.argv[1], sys.argv[2]
SR = 8000
def pcm(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"], capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.int16).astype(np.float32)
a, b = pcm(src), pcm(out)
print("audio samples @8k: src %d (%.3fs) out %d (%.3fs)" % (len(a), len(a)/SR, len(b), len(b)/SR))
for t in [1, 30, 60, 90, 120, 133]:
    s, n = int(t*SR), int(2*SR)
    x, y = a[s:s+n], b[s-800:s+n+800]
    if len(x) < n or len(y) < n + 1600: continue
    c = np.correlate(y, x, mode="valid")
    lag = int(np.argmax(c)) - 800
    corr = c.max() / (np.linalg.norm(x) * np.linalg.norm(y[lag+800:lag+800+n]) + 1e-9)
    print("t=%5.1fs  lag=%+d samples (%+.2f ms)  corr=%.3f" % (t, lag, lag/SR*1000, corr))
# loudness tail check: RMS of the last 0.5s of speech region
tail = b[int(134.5*SR):int(134.97*SR)]
print("render tail RMS (134.5–134.97s): %.1f" % (np.sqrt((tail**2).mean()) if len(tail) else -1))
