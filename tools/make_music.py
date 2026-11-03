#!/usr/bin/env python3
"""Compone la pista musical del video (synthwave / electrónica oscura) con numpy.

Salida: public/music.mp3  (~30 s, 44.1 kHz, estéreo)
Uso:    python3 tools/make_music.py
"""
import os, subprocess
import numpy as np
from scipy.signal import butter, lfilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 44100
BPM = 112
BEAT = 60 / BPM
BAR = BEAT * 4
DUR = 30.0
DROP = 130 / 30          # el beat entra cuando aparece la marca (frame 130)
END_BEAT = DROP + 10 * BAR  # último compás con batería
FADE_START = 27.4
N = int(SR * DUR)
rng = np.random.default_rng(7)

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
    if i >= N: return
    seg = sig[: N - i]
    buf[i:i + len(seg)] += seg * gain
def add_st(start_s, sig, gain=1.0, pan=0.0):
    add(L, start_s, sig, gain * (1 - max(pan, 0))); add(R, start_s, sig, gain * (1 + min(pan, 0)))
def env(n, attack=0.002, decay=0.2, curve=4.0):
    t = np.arange(n) / SR
    a = np.clip(t / max(attack, 1e-5), 0, 1)
    d = np.exp(-t / decay * curve)
    return a * d

# ---------- progresión: Am  F  C  G ----------
chords = [(45, [57, 60, 64]), (41, [53, 57, 60]), (48, [55, 60, 64]), (43, [55, 59, 62])]

# ---------- instrumentos ----------
def kick(n=int(0.45 * SR)):
    t = np.arange(n) / SR
    f = 42 + 130 * np.exp(-t / 0.045)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * env(n, 0.001, 0.32, 5)
    click = hp(rng.standard_normal(n), 3000) * env(n, 0.0005, 0.015, 5) * 0.4
    return np.tanh((body + click) * 1.8)

def clap(n=int(0.3 * SR)):
    x = bp(rng.standard_normal(n), 900, 5000)
    e = env(n, 0.001, 0.11, 4) + 0.5 * np.roll(env(n, 0.001, 0.08, 4), int(0.012 * SR)) + 0.3 * np.roll(env(n, 0.001, 0.08, 4), int(0.024 * SR))
    return x * e * 0.8

def hat(open_=False):
    n = int((0.25 if open_ else 0.07) * SR)
    x = hp(rng.standard_normal(n), 7500)
    return x * env(n, 0.0005, 0.18 if open_ else 0.035, 5) * 0.5

def bass_note(freq, length):
    n = int(length * SR); t = np.arange(n) / SR
    saw = 2 * ((freq * t) % 1) - 1
    sub = np.sin(2 * np.pi * freq * t)
    cutoff = 180 + 900 * np.exp(-t / 0.09)
    out = np.zeros(n); step = 512
    for i in range(0, n, step):
        out[i:i + step] = lp(saw[max(0, i - 2048):i + step], cutoff[i])[-min(step, n - i):]
    return (out * 0.8 + sub * 0.6) * env(n, 0.003, length * 0.9, 3)

def pluck(freq, length, pan_seed):
    n = int(length * SR); t = np.arange(n) / SR
    sq = np.sign(np.sin(2 * np.pi * freq * t)) * 0.6 + np.sin(2 * np.pi * freq * 2 * t) * 0.4
    return lp(sq, 2800) * env(n, 0.002, 0.16, 4)

def pad(chord_notes, length):
    n = int(length * SR); t = np.arange(n) / SR
    l = np.zeros(n); r = np.zeros(n)
    for m in chord_notes:
        f = midi(m)
        for det, side in ((-0.006, l), (0.0, l), (0.006, r), (0.012, r)):
            side += 2 * ((f * (1 + det) * t) % 1) - 1
    e = np.minimum(t / 0.35, 1) * np.minimum((length - t) / 0.4, 1).clip(0, 1)
    return lp(l, 900) * e / 8, lp(r, 900) * e / 8

# ---------- intro (0 → DROP): pad + riser + arpegio tímido ----------
pl, pr = pad([57, 60, 64, 69], DROP + 0.1)
add(L, 0, pl, 0.9); add(R, 0, pr, 0.9)
# riser: ruido con filtro que sube + barrido de tono
n = int(DROP * SR); t = np.arange(n) / SR
noise = rng.standard_normal(n)
riser = np.zeros(n); step = 2048
for i in range(0, n, step):
    fc = 300 + (9000 - 300) * (i / n) ** 2
    riser[i:i + step] = bp(noise[max(0, i - 4096):i + step], fc * 0.6, min(fc * 1.4, 20000))[-min(step, n - i):]
riser *= (t / DROP) ** 2.5 * 0.35
sweep = np.sin(2 * np.pi * np.cumsum(60 + 900 * (t / DROP) ** 3) / SR) * (t / DROP) ** 3 * 0.12
add_st(0, riser + sweep, 1.0)
# arpegio tímido en la intro (corcheas, muy suave)
for k in range(int(DROP / (BEAT / 2))):
    note = [57, 60, 64, 69][k % 4] + 12
    add_st(k * BEAT / 2 + 0.3, pluck(midi(note), 0.35, k), 0.08 + 0.1 * (k / (DROP / (BEAT / 2))), pan=(-0.5 if k % 2 else 0.5))

# ---------- drop (DROP → END_BEAT): beat completo ----------
n_bars = int(round((END_BEAT - DROP) / BAR))
for bar in range(n_bars):
    root, notes = chords[bar % 4]
    bs = DROP + bar * BAR
    # pad del acorde
    pl, pr = pad(notes + [root + 24], BAR + 0.05)
    add(L, bs, pl, 0.55); add(R, bs, pr, 0.55)
    for beat in range(4):
        t0 = bs + beat * BEAT
        add_st(t0, kick(), 0.95)
        if beat in (1, 3): add_st(t0, clap(), 0.55)
        # hats: corcheas, offbeat abierto
        add_st(t0, hat(), 0.35, pan=0.2)
        add_st(t0 + BEAT / 2, hat(open_=(beat == 3)), 0.5, pan=-0.2)
        if bar % 2 == 1 and beat == 3:
            add_st(t0 + BEAT * 0.75, hat(), 0.3)
        # bajo: corcheas, octava en la segunda
        add_st(t0, bass_note(midi(root - 12), BEAT * 0.48), 0.9)
        add_st(t0 + BEAT / 2, bass_note(midi(root - 12 + (12 if beat % 2 else 0)), BEAT * 0.4), 0.7)
        # arpegio: semicorcheas sobre el acorde
        for s in range(4):
            idx = (beat * 4 + s)
            seq = [0, 1, 2, 1, 0, 2, 1, 2]
            note = notes[seq[idx % 8] % 3] + 12 + (12 if idx % 8 in (5, 7) else 0)
            g = 0.28 if s % 2 == 0 else 0.2
            add_st(t0 + s * BEAT / 4, pluck(midi(note), 0.3, idx), g, pan=0.6 if s % 2 else -0.6)
            # eco en el otro canal (delay de corchea con puntillo)
            add_st(t0 + s * BEAT / 4 + BEAT * 0.75, pluck(midi(note), 0.25, idx), g * 0.35, pan=-0.6 if s % 2 else 0.6)

# impacto en el drop y al final
def boom(n=int(1.6 * SR)):
    t = np.arange(n) / SR
    return np.sin(2 * np.pi * np.cumsum(38 + 60 * np.exp(-t / 0.08)) / SR) * env(n, 0.002, 0.9, 3)
add_st(DROP, boom(), 0.9)
# crash reverso antes del drop
n = int(1.2 * SR); rev = hp(rng.standard_normal(n), 4000) * (np.arange(n) / n) ** 3 * 0.35
add_st(DROP - 1.2, rev)
# cierre: golpe final + pad sostenido
add_st(END_BEAT, kick(), 1.0); add_st(END_BEAT, clap(), 0.6); add_st(END_BEAT, boom(), 1.0)
pl, pr = pad([57, 60, 64, 69, 76], DUR - END_BEAT)
add(L, END_BEAT, pl, 0.8); add(R, END_BEAT, pr, 0.8)
n = int(1.0 * SR); cym = hp(rng.standard_normal(n), 5000) * env(n, 0.001, 0.6, 3) * 0.3
add_st(END_BEAT, cym)

# ---------- sidechain (bombeo) durante el beat ----------
sc = np.ones(N)
for bar in range(n_bars):
    for beat in range(4):
        i = int((DROP + bar * BAR + beat * BEAT) * SR)
        n = int(0.32 * SR); t = np.arange(n) / SR
        sc[i:i + n] = np.minimum(sc[i:i + n], 0.35 + 0.65 * (1 - np.exp(-t / 0.09)))
# aplicar bombeo sólo a pad/arp sería lo ideal; aquí se aplica a la mezcla menos el kick (aprox)
mixL = L * sc; mixR = R * sc

# ---------- master ----------
fade = np.ones(N)
i0 = int(FADE_START * SR); fade[i0:] = np.linspace(1, 0, N - i0) ** 1.5
mixL = np.tanh(mixL * 1.15) * fade; mixR = np.tanh(mixR * 1.15) * fade
peak = max(np.abs(mixL).max(), np.abs(mixR).max())
st = np.stack([mixL, mixR], axis=1) / peak * 0.95
wav = os.path.join(ROOT, "public", "music.wav")
mp3 = os.path.join(ROOT, "public", "music.mp3")
from scipy.io import wavfile
wavfile.write(wav, SR, (st * 32767).astype(np.int16))
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", wav, "-af", "loudnorm=I=-14:TP=-1:LRA=11", "-b:a", "192k", mp3], check=True)
os.remove(wav)
print("OK ->", mp3, f"({DUR}s, {BPM} BPM, drop en {DROP:.2f}s, fin del beat en {END_BEAT:.2f}s)")
