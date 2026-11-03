#!/usr/bin/env python3
"""Verifica los clips de voz: tono medio (f0) y transcripción con Whisper (sherpa-onnx)."""
import glob, os, subprocess, sys, tempfile
import numpy as np, librosa
from scipy.io import wavfile
import sherpa_onnx

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
M = os.path.join(ROOT, ".voices", "asr", "sherpa-onnx-whisper-small")
rec = sherpa_onnx.OfflineRecognizer.from_whisper(
    encoder=f"{M}/small-encoder.int8.onnx", decoder=f"{M}/small-decoder.int8.onnx",
    tokens=f"{M}/small-tokens.txt", language="es", task="transcribe", num_threads=4)
files = sys.argv[1:] or sorted(glob.glob(os.path.join(ROOT, "public", "voice", "vo-*.mp3")))
for f in files:
    with tempfile.NamedTemporaryFile(suffix=".wav") as tmp:
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f, "-ac", "1", "-ar", "16000", tmp.name], check=True)
        sr, y = wavfile.read(tmp.name)
    y = y.astype(np.float32) / 32768
    f0, _, _ = librosa.pyin(y, fmin=60, fmax=400, sr=sr); f0 = f0[~np.isnan(f0)]
    s = rec.create_stream(); s.accept_waveform(sr, y); rec.decode_stream(s)
    print(f"{os.path.basename(f):18s} f0≈{np.median(f0):3.0f} Hz | {s.result.text.strip()}")
