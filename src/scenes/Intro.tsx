import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { brand, colors } from "../config";
import { CodeRain } from "../components/CodeRain";
import { Terminal } from "../components/Terminal";
import { Overlay } from "../components/Overlay";
import { useLayout } from "../components/useLayout";

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { vertical } = useLayout();
  const fade = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const rise = interpolate(frame, [0, 25], [40, 0], { extrapolateRight: "clamp" });
  // "boot" flicker at the very start
  const flicker = frame < 6 ? (frame % 2 === 0 ? 0.2 : 1) : 1;
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CodeRain opacity={0.28} columns={vertical ? 28 : 48} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: fade * flicker, transform: `translateY(${rise}px)` }}>
        <Terminal lines={brand.terminalLines} startFrame={12} width={vertical ? 980 : 1100} fontSize={vertical ? 26 : 30} />
      </AbsoluteFill>
      <Overlay />
    </AbsoluteFill>
  );
};
