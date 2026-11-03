#!/usr/bin/env python3
"""Compone la pista musical del video: chill / lo-fi tranquilo, 78 BPM, con teclas
tipo Rhodes, pad cálido, bajo suave y una percusión muy liviana que entra con la marca.
Todo por síntesis con numpy/scipy (sin samples de terceros).

Salida: public/music.mp3  (44.1 kHz, estéreo)
Uso:    python3 tools/make_music.py [duración_en_segundos]   (por defecto 38.5)
"""
import os, subprocess, sys
import numpy as np
from scipy.signal import butter, lfilter
from scipy.io import wavfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 44100
BPM = 78
BEAT = 60 / BPM
BAR = BEAT * 4
DUR = float(sys.argv[1]) if len(sys.argv) > 1 else 38.5
ENTER = 130 / 30            # la percusión suave entra con la marca (frame 130)
END_BEAT = ENTER + int((DUR - 4.6 - ENTER) / BAR) * BAR   # último compás con percusión
FADE_START = DUR - 2.5
N = int(SR * DUR)
rng = np.random.default_rng(11)
L = np.zeros(N); R = np.zeros(N)

def midi(n): return 440.0 * 2 ** ((n - 69) / 12)
def lp(x, fc, order=2):
    b, a = butter(order, min(fc, SR / 2 - 100) / (SR / 2), "low"); return lfilter(b, a, x)
def hp(x, fc, order=2):
    b, a = butter(order, fc / (SR / 2), "high"); return lfilter(b, a, x)
def bp(x, lo, hi):
    b, a = butter(2, [lo / (SR / 2), hi / (SR / 2)], "band"); return lfilter(b, a, x)
def add(buf, start_s, sig, gain=1.0):
    i = int(start_s * SR)
    if i >= N or i < 0: return
    seg = sig[: N - i]; buf[i:i + len(seg)] += seg * gain
def add_st(start_s, sig, gain=1.0, pan=0.0):
    add(L, start_s, sig, gain * (1 - max(pan, 0))); add(R, start_s, sig, gain * (1 + min(pan, 0)))
def env(n, attack, decay, curve=4.0):
    t = np.arange(n) / SR
    return np.clip(t / max(attack, 1e-5), 0, 1) * np.exp(-t / decay * curve)

# ---------- instrumentos ----------
def keys(freq, length, vel=1.0):
    """Teclas tipo piano eléctrico: parciales con decaimiento y trémolo suave."""
    n = int(length * SR); t = np.arange(n) / SR
    out = np.zeros(n)
    for h, a, dec in ((1, 1.0, 1.6), (2, 0.35, 0.9), (3, 0.12, 0.5), (4, 0.06, 0.35), (5.04, 0.03, 0.3)):
        out += a * np.sin(2 * np.pi * freq * h * t + 0.3 * h) * np.exp(-t / dec * 2.2)
    trem = 1 + 0.06 * np.sin(2 * np.pi * 4.5 * t)
    out *= trem * np.clip(t / 0.006, 0, 1)
    return lp(out, 3800) * 0.35 * vel

def pad(notes, length):
    n = int(length * SR); t = np.arange(n) / SR
    l = np.zeros(n); r = np.zeros(n)
    for m in notes:
        f = midi(m)
        for det, side in ((-0.004, l), (0.003, l), (-0.002, r), (0.005, r)):
            side += np.sin(2 * np.pi * f * (1 + det) * t) + 0.25 * np.sin(2 * np.pi * 2 * f * (1 + det) * t)
    e = np.minimum(t / 1.2, 1) * np.clip((length - t) / 1.0, 0, 1)
    return lp(l, 700) * e / 10, lp(r, 700) * e / 10

def bass(freq, length):
    n = int(length * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * freq * t) + 0.3 * np.sin(2 * np.pi * 2 * freq * t) * np.exp(-t / 0.4)
    e = np.minimum(t / 0.04, 1) * np.clip((length - t) / 0.25, 0, 1)
    return x * e * 0.5

def soft_kick(n=int(0.4 * SR)):
    t = np.arange(n) / SR
    f = 48 + 70 * np.exp(-t / 0.05)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.003, 0.3, 4) * 0.8

def rim(n=int(0.12 * SR)):
    x = bp(rng.standard_normal(n), 1500, 4500)
    return x * env(n, 0.001, 0.05, 5) * 0.35

def shaker(n=int(0.09 * SR)):
    x = hp(rng.standard_normal(n), 6000)
    return x * env(n, 0.004, 0.05, 4) * 0.18

def bell(freq, length):
    n = int(length * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * freq * t) + 0.4 * np.sin(2 * np.pi * freq * 2.76 * t) * np.exp(-t / 0.3)
    return x * env(n, 0.004, 1.2, 3) * 0.2

# ---------- progresión (lo-fi, cálida): Cmaj7  Am7  Fmaj7  G(add9) ----------
chords = [
    (36, [60, 64, 67, 71]),      # Cmaj7
    (33, [57, 60, 64, 67]),      # Am7
    (29, [53, 57, 60, 64]),      # Fmaj7
    (31, [55, 59, 62, 69]),      # G add9
]
melody_pool = [72, 74, 76, 79, 81, 83, 84]   # pentatónica + 7ma, registro alto

# la grilla arranca un compás antes de ENTER para que la intro ya tenga acordes
GRID0 = ENTER - 2 * BAR
n_bars = int((DUR - GRID0) / BAR) + 1
for bar in range(n_bars):
    bs = GRID0 + bar * BAR
    if bs >= FADE_START: break
    root, notes = chords[bar % 4]
    intro = bs < ENTER - 0.01
    # pad sostenido
    pl, pr = pad(notes, BAR + 0.6)
    add(L, bs, pl, 0.9 if intro else 0.75); add(R, bs, pr, 0.9 if intro else 0.75)
    # bajo: redonda + un toque en el 3er tiempo
    add_st(bs, bass(midi(root + 12), BEAT * 2.4), 0.9)
    add_st(bs + BEAT * 2.5, bass(midi(root + 12), BEAT * 1.4), 0.6)
    # teclas: acorde en el 1 (arpegiado suave) y en el "y" del 2
    for k, m in enumerate(notes):
        add_st(bs + k * 0.035, keys(midi(m), BAR * 0.9, 0.9), 0.9, pan=(k - 1.5) * 0.25)
    for k, m in enumerate(notes[1:]):
        add_st(bs + BEAT * 2.5 + k * 0.03, keys(midi(m), BEAT * 1.4, 0.55), 0.8, pan=(k - 1) * 0.25)
    # melodía de campanitas, esporádica
    for s in range(8):
        if rng.random() < (0.18 if intro else 0.3):
            note = melody_pool[int(rng.integers(len(melody_pool)))]
            add_st(bs + s * BEAT / 2, bell(midi(note), 1.6), 0.5, pan=0.4)
            add_st(bs + s * BEAT / 2 + BEAT * 0.75, bell(midi(note), 1.2), 0.2, pan=-0.4)   # eco
    # percusión liviana sólo entre ENTER y END_BEAT
    if not intro and bs < END_BEAT - 0.01:
        for beat in range(4):
            t0 = bs + beat * BEAT
            if beat in (0, 2): add_st(t0, soft_kick(), 0.55)
            if beat in (1, 3): add_st(t0, rim(), 0.5)
            add_st(t0, shaker(), 0.6, pan=0.3)
            add_st(t0 + BEAT / 2, shaker(), 0.9, pan=-0.3)
            if beat == 3: add_st(t0 + BEAT * 0.75, shaker(), 0.5)

# textura de vinilo muy baja (calidez lo-fi)
crackle = rng.standard_normal(N) * (rng.random(N) < 0.0006)
crackle = lp(crackle, 5000) * 0.6 + lp(rng.standard_normal(N), 300) * 0.015
add_st(0, crackle, 1.0)

# acorde final sostenido y fade
pl, pr = pad([60, 64, 67, 71, 76], DUR - END_BEAT)
add(L, END_BEAT, pl, 0.9); add(R, END_BEAT, pr, 0.9)
for k, m in enumerate([48, 55, 60, 64, 71]):
    add_st(END_BEAT + k * 0.05, keys(midi(m), DUR - END_BEAT, 1.0), 0.9, pan=(k - 2) * 0.2)

# ---------- master ----------
fade = np.ones(N); i0 = int(FADE_START * SR); fade[i0:] = np.linspace(1, 0, N - i0) ** 1.3
fi = np.ones(N); fi[: SR] = np.linspace(0, 1, SR)
mixL = np.tanh(L * 1.05) * fade * fi; mixR = np.tanh(R * 1.05) * fade * fi
peak = max(np.abs(mixL).max(), np.abs(mixR).max())
st = np.stack([mixL, mixR], axis=1) / peak * 0.95
wav = os.path.join(ROOT, "public", "music.wav"); mp3 = os.path.join(ROOT, "public", "music.mp3")
wavfile.write(wav, SR, (st * 32767).astype(np.int16))
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", wav, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-b:a", "192k", mp3], check=True)
os.remove(wav)
print("OK ->", mp3, f"({DUR}s, {BPM} BPM, percusión {ENTER:.2f}s → {END_BEAT:.2f}s)")
