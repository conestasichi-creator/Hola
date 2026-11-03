import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand, colors, fonts } from "../config";
import { Particles } from "../components/Particles";
import { Overlay } from "../components/Overlay";
import { Typewriter } from "../components/Typewriter";
import { useLayout } from "../components/useLayout";

const accents = [colors.green, colors.cyan, colors.magenta, colors.yellow];

export const Services: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { vertical } = useLayout();
  const titleOp = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.bg} 0%, ${colors.bg2} 100%)` }}>
      <Particles count={70} />
      <AbsoluteFill style={{ padding: vertical ? "90px 60px" : "70px 110px" }}>
        <div style={{ opacity: titleOp, fontFamily: fonts.mono, fontSize: 34, color: colors.muted, marginBottom: 12 }}>
          <span style={{ color: colors.green }}>$</span> ls ./servicios
        </div>
        <div style={{ opacity: titleOp, fontFamily: fonts.display, fontWeight: 700, fontSize: vertical ? 64 : 72, color: colors.text, marginBottom: vertical ? 30 : 40 }}>
          ¿Qué hacemos?
        </div>
        <div style={{ display: "grid", gridTemplateColumns: vertical ? "1fr" : "1fr 1fr", gap: vertical ? 24 : 30, flex: 1 }}>
          {brand.services.map((s, i) => {
            const start = 12 + i * 16;
            const p = spring({ frame: frame - start, fps, config: { damping: 14, stiffness: 110 } });
            const x = interpolate(p, [0, 1], [i % 2 === 0 ? -200 : 200, 0]);
            const accent = accents[i % accents.length];
            return (
              <div
                key={s.title}
                style={{
                  opacity: p,
                  transform: `translateX(${x}px)`,
                  borderRadius: 18,
                  padding: vertical ? "24px 30px" : "30px 36px",
                  background: "rgba(13,19,32,0.85)",
                  border: `1px solid ${accent}55`,
                  boxShadow: `0 0 30px ${accent}22, inset 0 1px 0 rgba(255,255,255,0.05)`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 6, background: accent, boxShadow: `0 0 20px ${accent}` }} />
                <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                  <div style={{ fontFamily: fonts.mono, fontSize: 40, color: accent, textShadow: `0 0 16px ${accent}` }}>{s.icon}</div>
                  <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: vertical ? 40 : 46, color: colors.text }}>{s.title}</div>
                </div>
                <div style={{ fontFamily: fonts.display, fontSize: vertical ? 24 : 28, color: colors.muted, lineHeight: 1.35 }}>{s.desc}</div>
                <div
                  style={{
                    marginTop: "auto",
                    fontFamily: fonts.mono,
                    fontSize: vertical ? 18 : 22,
                    color: accent,
                    background: "rgba(0,0,0,0.45)",
                    padding: "12px 16px",
                    borderRadius: 10,
                    whiteSpace: "pre",
                    overflow: "hidden",
                  }}
                >
                  <Typewriter text={s.code} startFrame={start + 18} charsPerFrame={1.3} />
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <Overlay />
    </AbsoluteFill>
  );
};
