import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand, colors, fonts } from "../config";
import { CodeRain } from "../components/CodeRain";
import { Grid } from "../components/Grid";
import { GlitchText } from "../components/GlitchText";
import { Overlay } from "../components/Overlay";
import { Badge } from "../components/Badge";
import { useLayout } from "../components/useLayout";

export const Brand: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { vertical } = useLayout();
  const pop = spring({ frame, fps, config: { damping: 12, stiffness: 120 } });
  const scale = interpolate(pop, [0, 1], [2.2, 1]);
  const tagOp = interpolate(frame, [25, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tagY = interpolate(frame, [25, 45], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const badgeOp = interpolate(frame, [45, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glitchI = interpolate(frame, [0, 15, 40], [1, 0.9, 0.15], { extrapolateRight: "clamp" });
  const flash = interpolate(frame, [0, 4, 12], [1, 0.6, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <Grid opacity={0.35} />
      <CodeRain opacity={0.12} columns={vertical ? 34 : 60} color={colors.cyan} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 28 }}>
        <div style={{ transform: `scale(${scale})`, fontFamily: fonts.display, fontWeight: 700, fontSize: vertical ? 120 : 170, letterSpacing: -4, lineHeight: 1, textAlign: "center" }}>
          <GlitchText text={brand.name} intensity={glitchI} style={{ color: colors.text, textShadow: `0 0 30px ${colors.cyan}66` }} />
          <GlitchText text={brand.suffix} intensity={glitchI} style={{ color: colors.green, textShadow: `0 0 30px ${colors.green}88` }} />
        </div>
        <div style={{ opacity: tagOp, transform: `translateY(${tagY}px)`, fontFamily: fonts.mono, fontSize: vertical ? 30 : 40, color: colors.muted, letterSpacing: 1, textAlign: "center", padding: "0 40px" }}>
          <span style={{ color: colors.cyan }}>{"// "}</span>
          {brand.tagline}
        </div>
        <div style={{ opacity: badgeOp, display: "flex", gap: 16, marginTop: 10 }}>
          <Badge>Web</Badge>
          <Badge color={colors.cyan}>Mobile</Badge>
          <Badge color={colors.magenta}>Cloud</Badge>
          <Badge color={colors.yellow}>IA</Badge>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#fff", opacity: flash, pointerEvents: "none" }} />
      <Overlay />
    </AbsoluteFill>
  );
};
