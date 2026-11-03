import React from "react";
import { Audio, Sequence, interpolate, staticFile } from "remotion";

export type Cue = { scene: string; file: string; offsetFrames: number; durationInFrames: number };

type Props = {
  music?: string;                 // archivo en public/
  cues: Cue[];
  sceneStart: Record<string, number>;
  total: number;
  withMusic: boolean;
  withVoice: boolean;
  musicFull?: number;
  musicDucked?: number;
};

/** Música de fondo con ducking automático + clips de voz ubicados por escena */
export const Soundtrack: React.FC<Props> = ({ music = "music.mp3", cues, sceneStart, total, withMusic, withVoice, musicFull = 0.55, musicDucked = 0.22 }) => {
  const RAMP = 8;
  const windows = cues.map((c) => {
    const from = sceneStart[c.scene] + c.offsetFrames;
    return { from, to: from + c.durationInFrames };
  });
  const volume = (f: number) => {
    const fadeIn = interpolate(f, [0, 20], [0, 1], { extrapolateRight: "clamp" });
    const fadeOut = interpolate(f, [total - 30, total], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    let duck = 0;
    if (withVoice) {
      for (const w of windows) {
        duck = Math.max(duck, interpolate(f, [w.from - RAMP, w.from, w.to, w.to + RAMP * 2], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
      }
    }
    return interpolate(duck, [0, 1], [musicFull, musicDucked]) * fadeIn * fadeOut;
  };
  return (
    <>
      {withMusic && <Audio src={staticFile(music)} volume={volume} />}
      {withVoice &&
        cues.map((c) => (
          <Sequence key={c.scene} from={sceneStart[c.scene] + c.offsetFrames} durationInFrames={c.durationInFrames + 5} name={`voz:${c.scene}`}>
            <Audio src={staticFile(c.file)} />
          </Sequence>
        ))}
    </>
  );
};
