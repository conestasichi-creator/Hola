#!/usr/bin/env python3
"""Genera la voz en off con Piper (TTS offline) a partir de tools/guion.json.

Salida:
  public/voice/vo-<escena>.mp3   un clip por línea del guion
  src/voice-cues.ts              duraciones en frames para sincronizar en Remotion

Uso:  python3 tools/make_voice.py            (voz por defecto del guion)
      python3 tools/make_voice.py es_ES-davefx-medium   (otra voz)
"""
import json, os, subprocess, sys, tarfile, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOICES = os.path.join(ROOT, ".voices")
FPS = 30
MODELS_URL = "https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-{v}.tar.bz2"

guion = json.load(open(os.path.join(ROOT, "tools", "guion.json"), encoding="utf-8"))
voice = sys.argv[1] if len(sys.argv) > 1 else guion["voice"]

model = os.path.join(VOICES, f"vits-piper-{voice}", f"{voice}.onnx")
if not os.path.exists(model):
    os.makedirs(VOICES, exist_ok=True)
    tgz = os.path.join(VOICES, f"{voice}.tar.bz2")
    print("Descargando voz", voice)
    urllib.request.urlretrieve(MODELS_URL.format(v=voice), tgz)
    with tarfile.open(tgz) as tf:
        tf.extractall(VOICES, members=[m for m in tf.getmembers() if m.name.endswith((".onnx", ".onnx.json"))])
    os.remove(tgz)

out_dir = os.path.join(ROOT, "public", "voice")
os.makedirs(out_dir, exist_ok=True)
cues = []
for line in guion["lines"]:
    raw = os.path.join(out_dir, f"raw-{line['scene']}.wav")
    mp3 = os.path.join(out_dir, f"vo-{line['scene']}.mp3")
    subprocess.run(
        ["piper", "-m", model, "-f", raw, "--length-scale", "1.02", "--sentence-silence", "0.28"],
        input=line["text"].encode("utf-8"), check=True, capture_output=True,
    )
    # recorte de silencios + ecualización suave + compresión + normalización de loudness
    af = (
        "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,"
        "areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.12,areverse,"
        "highpass=f=90,lowpass=f=11000,"
        "acompressor=threshold=-18dB:ratio=3:attack=10:release=120:makeup=4,"
        "loudnorm=I=-16:TP=-1.5:LRA=9,"
        "aresample=44100"
    )
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-af", af, "-b:a", "160k", mp3], check=True)
    os.remove(raw)
    dur = float(subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp3]).strip())
    frames = int(round(dur * FPS))
    cues.append({"scene": line["scene"], "file": f"voice/vo-{line['scene']}.mp3",
                 "offsetFrames": line["offsetFrames"], "durationInFrames": frames})
    print(f"{line['scene']:9s} {dur:5.2f}s  {frames:3d} frames  {line['text']}")

ts = "// Generado por tools/make_voice.py — no editar a mano\n"
ts += "export type SceneId = \"intro\" | \"brand\" | \"services\" | \"stats\" | \"cta\";\n"
ts += "export const voiceCues: { scene: SceneId; file: string; offsetFrames: number; durationInFrames: number }[] = "
ts += json.dumps(cues, indent=2, ensure_ascii=False) + ";\n"
open(os.path.join(ROOT, "src", "voice-cues.ts"), "w", encoding="utf-8").write(ts)
print("OK ->", os.path.join("src", "voice-cues.ts"))
