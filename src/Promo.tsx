import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { Intro } from "./scenes/Intro";
import { Brand } from "./scenes/Brand";
import { Services } from "./scenes/Services";
import { Stats } from "./scenes/Stats";
import { CTA } from "./scenes/CTA";
import { loadFonts } from "./components/Fonts";
import { colors } from "./config";
import { voiceCues, SceneId } from "./voice-cues";

loadFonts();

export type PromoProps = { withMusic: boolean; withVoice: boolean };

// Duraciones en frames (30 fps)
export const SCENES: Record<SceneId, number> = {
  intro: 150,
  brand: 130,
  services: 270,
  stats: 200,
  cta: 210,
};
const T = 20; // duración de cada transición
const ORDER: SceneId[] = ["intro", "brand", "services", "stats", "cta"];
export const TOTAL = ORDER.reduce((a, id) => a + SCENES[id], 0) - T * (ORDER.length - 1);

// Frame absoluto en el que arranca cada escena
export const SCENE_START: Record<SceneId, number> = ORDER.reduce((acc, id, i) => {
  acc[id] = i === 0 ? 0 : acc[ORDER[i - 1]] + SCENES[ORDER[i - 1]] - T;
  return acc;
}, {} as Record<SceneId, number>);

// Ventanas absolutas donde habla la voz (para bajar la música)
const voiceWindows = voiceCues.map((c) => {
  const from = SCENE_START[c.scene] + c.offsetFrames;
  return { from, to: from + c.durationInFrames };
});

const MUSIC_FULL = 0.55;
const MUSIC_DUCKED = 0.22;
const DUCK_RAMP = 8;

const musicVolume = (f: number, withVoice: boolean) => {
  const fadeIn = interpolate(f, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(f, [TOTAL - 30, TOTAL], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (!withVoice) return MUSIC_FULL * fadeIn * fadeOut;
  let duck = 0;
  for (const w of voiceWindows) {
    const d = interpolate(f, [w.from - DUCK_RAMP, w.from, w.to, w.to + DUCK_RAMP * 2], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    duck = Math.max(duck, d);
  }
  return interpolate(duck, [0, 1], [MUSIC_FULL, MUSIC_DUCKED]) * fadeIn * fadeOut;
};

export const Promo: React.FC<PromoProps> = ({ withMusic, withVoice }) => (
  <AbsoluteFill style={{ background: colors.bg }}>
    {withMusic && <Audio src={staticFile("music.mp3")} volume={(f) => musicVolume(f, withVoice)} />}
    {withVoice &&
      voiceCues.map((c) => (
        <Sequence key={c.scene} from={SCENE_START[c.scene] + c.offsetFrames} durationInFrames={c.durationInFrames + 5} name={`voz:${c.scene}`}>
          <Audio src={staticFile(c.file)} volume={1} />
        </Sequence>
      ))}
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={SCENES.intro}>
        <Intro />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence durationInFrames={SCENES.brand}>
        <Brand />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-left" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: T })} />
      <TransitionSeries.Sequence durationInFrames={SCENES.services}>
        <Services />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: T })} />
      <TransitionSeries.Sequence durationInFrames={SCENES.stats}>
        <Stats />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence durationInFrames={SCENES.cta}>
        <CTA />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
