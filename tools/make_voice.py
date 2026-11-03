#!/usr/bin/env python3
"""Genera la voz en off con Piper (TTS offline) a partir de tools/guion.json.

- Voz base: la indicada en guion.json.
- "synthesis": velocidad (length_scale >1 = más lento) y variabilidad de la voz.
- "transform": ajuste de tono. mode "pitch" baja/sube el tono conservando los
  formantes (pitchRatio 0.9 ≈ -2 semitonos). mode "combo" además achica los
  formantes (formantRatio) para cambiar el timbre (ej: voz femenina → masculina).
  Poner null para desactivar.
- "phonemeFixes": reemplazos en fonemas IPA (espeak-ng) para corregir pronunciación.

Salida:
  public/voice/vo-<escena>.mp3   un clip por línea
  src/voice-cues.ts              duraciones en frames para Remotion

Uso:  python3 tools/make_voice.py [voz]      ej: python3 tools/make_voice.py es_ES-davefx-medium
"""
import json, os, subprocess, sys, tarfile, urllib.request
import numpy as np
from scipy.io import wavfile
from piper import PiperVoice, SynthesisConfig

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOICES = os.path.join(ROOT, ".voices")
FPS = 30
MODELS_URL = "https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-{v}.tar.bz2"

guion = json.load(open(os.path.join(ROOT, "tools", "guion.json"), encoding="utf-8"))
voice = sys.argv[1] if len(sys.argv) > 1 else guion["voice"]
transform = guion.get("transform") if len(sys.argv) < 2 else None
fixes = {k: v for k, v in guion.get("phonemeFixes", {}).items() if not k.startswith("_")}

model = os.path.join(VOICES, f"vits-piper-{voice}", f"{voice}.onnx")
if not os.path.exists(model):
    os.makedirs(VOICES, exist_ok=True)
    tgz = os.path.join(VOICES, f"{voice}.tar.bz2")
    print("Descargando voz", voice)
    urllib.request.urlretrieve(MODELS_URL.format(v=voice), tgz)
    with tarfile.open(tgz) as tf:
        tf.extractall(VOICES, members=[m for m in tf.getmembers() if m.name.endswith((".onnx", ".onnx.json"))])
    os.remove(tgz)

tts = PiperVoice.load(model)
sr = tts.config.sample_rate
sc = guion.get("synthesis", {})
syn = SynthesisConfig(length_scale=sc.get("lengthScale", 1.1), noise_scale=sc.get("noiseScale", 0.4), noise_w_scale=sc.get("noiseWScale", 0.6))
SENT_GAP = np.zeros(int(0.30 * sr), dtype=np.float32)

def synth(text: str) -> np.ndarray:
    chunks = []
    for sentence in tts.phonemize(text):
        ph = "".join(sentence)
        for bad, good in fixes.items():
            ph = ph.replace(bad, good)
        ids = tts.phonemes_to_ids(list(ph))
        audio = tts.phoneme_ids_to_audio(ids, syn)
        chunks += [np.asarray(audio, dtype=np.float32), SENT_GAP]
    return np.concatenate(chunks[:-1])

out_dir = os.path.join(ROOT, "public", "voice")
os.makedirs(out_dir, exist_ok=True)

# cadena de procesamiento ffmpeg
chain = []
if transform:
    fr = float(transform.get("formantRatio", 1.0)); pr = float(transform.get("pitchRatio", 1.0))
    if transform.get("mode", "pitch") == "combo" and fr != 1.0:
        # 1) asetrate: baja tono y formantes juntos (achica el tracto vocal)
        chain += [f"asetrate={sr}*{fr}", f"aresample={sr}", f"atempo={1/fr:.5f}"]
        pr = pr / fr
    if abs(pr - 1.0) > 1e-3:
        # 2) rubberband: cambia el tono conservando los formantes
        chain += [f"rubberband=pitch={pr:.4f}:formant=preserved:pitchq=quality:transients=smooth"]
chain += [
    "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05",
    "areverse", "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.12", "areverse",
    "highpass=f=70", "lowpass=f=10500",
    "acompressor=threshold=-18dB:ratio=3:attack=10:release=120:makeup=4",
    "loudnorm=I=-16:TP=-1.5:LRA=9",
    "aresample=44100",
]

cues = []
for line in guion["lines"]:
    raw = os.path.join(out_dir, f"raw-{line['scene']}.wav")
    mp3 = os.path.join(out_dir, f"vo-{line['scene']}.mp3")
    audio = synth(line["text"])
    wavfile.write(raw, sr, (np.clip(audio, -1, 1) * 32767).astype(np.int16))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-af", ",".join(chain), "-b:a", "160k", mp3], check=True)
    os.remove(raw)
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp3]).strip())
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
