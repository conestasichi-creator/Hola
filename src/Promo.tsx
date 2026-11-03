import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
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

loadFonts();

export type PromoProps = { withMusic: boolean };

// Duraciones en frames (30 fps)
export const SCENES = {
  intro: 150,
  brand: 130,
  services: 270,
  stats: 180,
  cta: 210,
};
const T = 20; // duración de cada transición
export const TOTAL = Object.values(SCENES).reduce((a, b) => a + b, 0) - T * 4;

export const Promo: React.FC<PromoProps> = ({ withMusic }) => (
  <AbsoluteFill style={{ background: colors.bg }}>
    {withMusic && <Audio src={staticFile("music.mp3")} volume={0.5} />}
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
