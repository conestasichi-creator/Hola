import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Space, Vignette } from "../ui";
import { C, F } from "../theme";
import { brand } from "../../config";

export const Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 14, stiffness: 80 } });
  const icons = [
    { label: "una rotación", color: C.gold }, { label: "una órbita", color: C.cyan }, { label: "un latido", color: C.red },
  ];
  const outro = interpolate(frame, [durationInFrames - 30, durationInFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const beat = Math.pow(Math.max(0, Math.sin(frame / 7)), 8);
  return (
    <AbsoluteFill>
      <Space drift={0.2} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", opacity: p, transform: `scale(${interpolate(p, [0, 1], [0.8, 1])})`, fontFamily: F.display, fontWeight: 700, fontSize: 84, color: C.text, letterSpacing: -2, lineHeight: 1.1 }}>
        El tiempo es la forma<br />en que medimos el cambio.
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 500, display: "flex", justifyContent: "center", gap: 120 }}>
        {icons.map((ic, i) => {
          const q = spring({ frame: frame - 40 - i * 20, fps, config: { damping: 14 } });
          return (
            <div key={ic.label} style={{ opacity: q, transform: `translateY(${(1 - q) * 40}px)`, textAlign: "center" }}>
              <svg width={200} height={200}>
                {i === 0 && <>
                  <circle cx={100} cy={100} r={60} fill="none" stroke={ic.color} strokeWidth={4} />
                  <ellipse cx={100} cy={100} rx={60} ry={18} fill="none" stroke={ic.color} strokeWidth={2} strokeDasharray="8 8" />
                  <circle cx={100 + Math.sin(frame / 15) * 60} cy={100} r={8} fill={ic.color} opacity={Math.cos(frame / 15) > 0 ? 1 : 0.3} />
                </>}
                {i === 1 && <>
                  <circle cx={100} cy={100} r={14} fill={C.gold} />
                  <ellipse cx={100} cy={100} rx={80} ry={40} fill="none" stroke={ic.color} strokeWidth={2} strokeDasharray="6 8" />
                  <circle cx={100 + Math.cos(frame / 20) * 80} cy={100 + Math.sin(frame / 20) * 40} r={9} fill={ic.color} />
                </>}
                {i === 2 && <>
                  <polyline points="10,100 50,100 65,60 80,140 95,80 110,110 125,100 190,100" fill="none" stroke={ic.color} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 ${6 + beat * 14}px ${ic.color})` }} />
                </>}
              </svg>
              <div style={{ fontFamily: F.mono, fontSize: 28, color: ic.color, marginTop: 6 }}>{ic.label}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center", fontFamily: F.display, fontSize: 36, color: C.muted, opacity: interpolate(frame, [110, 135], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        Sin movimiento, no habría nada que contar.
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 50, textAlign: "center", fontFamily: F.display, fontWeight: 700, fontSize: 30, color: C.muted, opacity: interpolate(frame, [140, 165], [0, 0.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        un video de {brand.name}<span style={{ color: C.green }}>{brand.suffix}</span>
      </div>
      <AbsoluteFill style={{ background: "#000", opacity: outro }} />
      <Vignette />
    </AbsoluteFill>
  );
};
