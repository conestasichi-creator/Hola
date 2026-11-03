import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand, colors, fonts } from "../config";
import { Grid } from "../components/Grid";
import { CodeRain } from "../components/CodeRain";
import { Overlay } from "../components/Overlay";
import { useLayout } from "../components/useLayout";

const accents = [colors.green, colors.cyan, colors.magenta, colors.yellow];

export const Stats: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { vertical } = useLayout();
  const titleOp = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CodeRain opacity={0.1} columns={vertical ? 40 : 70} color={colors.magenta} />
      <Grid color={colors.magenta} opacity={0.25} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 60 }}>
        <div style={{ opacity: titleOp, fontFamily: fonts.display, fontWeight: 700, fontSize: vertical ? 56 : 70, color: colors.text, textAlign: "center" }}>
          <span style={{ fontFamily: fonts.mono, color: colors.cyan }}>{"{ "}</span>
          ¿Por qué nosotros?
          <span style={{ fontFamily: fonts.mono, color: colors.cyan }}>{" }"}</span>
        </div>
        <div style={{ display: "flex", gap: vertical ? 28 : 40, flexWrap: "wrap", justifyContent: "center", maxWidth: vertical ? 960 : 1800 }}>
          {brand.stats.map((s, i) => {
            const start = 10 + i * 10;
            const p = spring({ frame: frame - start, fps, config: { damping: 13, stiffness: 100 } });
            const count = Math.round(interpolate(frame - start, [0, 45], [0, s.value], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
            const accent = accents[i];
            return (
              <div
                key={s.label}
                style={{
                  opacity: p,
                  transform: `translateY(${interpolate(p, [0, 1], [80, 0])}px) scale(${interpolate(p, [0, 1], [0.8, 1])})`,
                  width: vertical ? 440 : 360,
                  padding: "40px 20px",
                  borderRadius: 20,
                  background: "rgba(13,19,32,0.8)",
                  border: `1px solid ${accent}66`,
                  boxShadow: `0 0 40px ${accent}22`,
                  textAlign: "center",
                }}
              >
                <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 96, color: accent, textShadow: `0 0 30px ${accent}99`, lineHeight: 1, whiteSpace: "nowrap" }}>
                  {s.prefix}
                  {count}
                  {s.suffix}
                </div>
                <div style={{ fontFamily: fonts.display, fontSize: 28, color: colors.muted, marginTop: 16 }}>{s.label}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <Overlay />
    </AbsoluteFill>
  );
};
