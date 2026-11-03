import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { loadFonts } from "../components/Fonts";
import { Soundtrack } from "../Soundtrack";
import { voiceCues, SceneId } from "./voice-cues";
import { C } from "./theme";
import { Intro } from "./scenes/Intro";
import { EarthSpin } from "./scenes/EarthSpin";
import { EarthOrbit } from "./scenes/EarthOrbit";
import { SunSpin } from "./scenes/SunSpin";
import { Light } from "./scenes/Light";
import { Star } from "./scenes/Star";
import { Galaxy } from "./scenes/Galaxy";
import { Universe } from "./scenes/Universe";
import { Calendar } from "./scenes/Calendar";
import { Relativity } from "./scenes/Relativity";
import { Closing } from "./scenes/Closing";

loadFonts();

export type CosmosProps = { withMusic: boolean; withVoice: boolean };

const T = 24; // frames de transición
const TAIL = 50; // frames de aire después de que termina la voz

// Cada escena dura lo que necesita su locución (más un mínimo visual)
const ORDER: { id: SceneId; comp: React.FC; min: number }[] = [
  { id: "intro", comp: Intro, min: 150 },
  { id: "earthSpin", comp: EarthSpin, min: 240 },
  { id: "earthOrbit", comp: EarthOrbit, min: 240 },
  { id: "sunSpin", comp: SunSpin, min: 240 },
  { id: "light", comp: Light, min: 330 },
  { id: "star", comp: Star, min: 240 },
  { id: "galaxy", comp: Galaxy, min: 320 },
  { id: "universe", comp: Universe, min: 240 },
  { id: "calendar", comp: Calendar, min: 330 },
  { id: "relativity", comp: Relativity, min: 240 },
  { id: "closing", comp: Closing, min: 200 },
];

export const SCENES: Record<string, number> = {};
for (const s of ORDER) {
  const cue = voiceCues.find((c) => c.scene === s.id);
  SCENES[s.id] = Math.max(s.min, cue ? cue.offsetFrames + cue.durationInFrames + TAIL : 0);
}
export const SCENE_START: Record<string, number> = {};
ORDER.forEach((s, i) => { SCENE_START[s.id] = i === 0 ? 0 : SCENE_START[ORDER[i - 1].id] + SCENES[ORDER[i - 1].id] - T; });
export const COSMOS_TOTAL = ORDER.reduce((a, s) => a + SCENES[s.id], 0) - T * (ORDER.length - 1);

export const Cosmos: React.FC<CosmosProps> = ({ withMusic, withVoice }) => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Soundtrack music="cosmos-music.mp3" cues={voiceCues} sceneStart={SCENE_START} total={COSMOS_TOTAL} withMusic={withMusic} withVoice={withVoice} musicFull={0.45} musicDucked={0.16} />
    <TransitionSeries>
      {ORDER.flatMap((s, i) => {
        const Comp = s.comp;
        const seq = (
          <TransitionSeries.Sequence key={s.id} durationInFrames={SCENES[s.id]}>
            <Comp />
          </TransitionSeries.Sequence>
        );
        if (i === 0) return [seq];
        return [<TransitionSeries.Transition key={`t-${s.id}`} presentation={fade()} timing={linearTiming({ durationInFrames: T })} />, seq];
      })}
    </TransitionSeries>
  </AbsoluteFill>
);
