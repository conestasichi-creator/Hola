import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand, colors, fonts } from "../config";
import { CodeRain } from "../components/CodeRain";
import { Particles } from "../components/Particles";
import { GlitchText } from "../components/GlitchText";
import { Overlay } from "../components/Overlay";
import { Typewriter } from "../components/Typewriter";
import { useLayout } from "../components/useLayout";

export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const { vertical } = useLayout();
  const p = spring({ frame, fps, config: { damping: 14, stiffness: 90 } });
  const pulse = 1 + Math.sin(frame / 8) * 0.03;
  const rows = [
    ["📧", brand.cta.contact],
    ["📞", brand.cta.phone],
    ["🌐", brand.cta.web],
    ["📲", brand.cta.social],
  ];
  const outro = interpolate(frame, [durationInFrames - 25, durationInFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, ${colors.bg2} 0%, ${colors.bg} 70%)` }}>
      <CodeRain opacity={0.14} columns={vertical ? 32 : 56} />
      <Particles count={50} color={colors.green} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 24 }}>
        <div style={{ opacity: p, transform: `scale(${interpolate(p, [0, 1], [0.7, 1]) * pulse})`, fontFamily: fonts.display, fontWeight: 700, fontSize: vertical ? 92 : 120, color: colors.text, textAlign: "center", lineHeight: 1.05, padding: "0 30px" }}>
          <GlitchText text={brand.cta.headline} intensity={0.25} style={{ textShadow: `0 0 40px ${colors.cyan}55` }} />
        </div>
        <div style={{ fontFamily: fonts.mono, fontSize: vertical ? 38 : 48, color: colors.green, textShadow: `0 0 20px ${colors.green}88`, minHeight: 60 }}>
          <Typewriter text={brand.cta.sub} startFrame={18} charsPerFrame={0.9} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 36, alignItems: "flex-start" }}>
          {rows.map(([icon, txt], i) => {
            const s = spring({ frame: frame - 45 - i * 8, fps, config: { damping: 14 } });
            return (
              <div key={txt} style={{ opacity: s, transform: `translateX(${interpolate(s, [0, 1], [-60, 0])}px)`, display: "flex", gap: 22, alignItems: "center", fontFamily: fonts.mono, fontSize: vertical ? 30 : 36, color: colors.text }}>
                <span style={{ fontSize: 34 }}>{icon}</span>
                <span style={{ color: colors.cyan }}>{txt}</span>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", bottom: 60, fontFamily: fonts.display, fontWeight: 700, fontSize: 44, color: colors.muted, opacity: interpolate(frame, [80, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          {brand.name}
          <span style={{ color: colors.green }}>{brand.suffix}</span>
        </div>
      </AbsoluteFill>
      <Overlay />
      <AbsoluteFill style={{ background: "#000", opacity: outro, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
