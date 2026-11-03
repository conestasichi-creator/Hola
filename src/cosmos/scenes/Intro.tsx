import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Space, Vignette, Caption } from "../ui";
import { C, F } from "../theme";
import { GlitchText } from "../../components/GlitchText";

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const ring = interpolate(frame, [10, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const R = 300, circ = 2 * Math.PI * R;
  const op = interpolate(frame, [20, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hand = frame * 2.4;
  return (
    <AbsoluteFill>
      <Space />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <circle cx={960} cy={500} r={R} fill="none" stroke={`${C.cyan}33`} strokeWidth={2} />
        <circle cx={960} cy={500} r={R} fill="none" stroke={C.cyan} strokeWidth={4} strokeDasharray={circ} strokeDashoffset={circ * (1 - ring)} transform="rotate(-90 960 500)" style={{ filter: `drop-shadow(0 0 12px ${C.cyan})` }} />
        {new Array(12).fill(0).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return <line key={i} x1={960 + Math.cos(a) * (R - 22)} y1={500 + Math.sin(a) * (R - 22)} x2={960 + Math.cos(a) * (R - 8)} y2={500 + Math.sin(a) * (R - 8)} stroke={C.muted} strokeWidth={3} opacity={ring} />;
        })}
        <line x1={960} y1={500} x2={960 + Math.cos((hand - 90) * Math.PI / 180) * (R - 60)} y2={500 + Math.sin((hand - 90) * Math.PI / 180) * (R - 60)} stroke={C.gold} strokeWidth={4} strokeLinecap="round" opacity={op} />
        <circle cx={960} cy={500} r={8} fill={C.gold} opacity={op} />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center", opacity: op, fontFamily: F.display, fontWeight: 700, fontSize: 92, color: C.text, letterSpacing: -2 }}>
        <GlitchText text="¿Qué es el tiempo?" intensity={0.2} />
      </div>
      <Caption text="Un viaje desde la Tierra hasta el borde del universo" start={60} color={C.muted} size={34} bottom={140} />
      <Vignette />
    </AbsoluteFill>
  );
};
