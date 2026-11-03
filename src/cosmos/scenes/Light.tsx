import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Space, Vignette, SceneTitle, DataCard, DataRow, Tag } from "../ui";
import { C, F } from "../theme";
import { Sun } from "./EarthOrbit";

const AU = 820;            // px por UA en fase 1
const SUN_X = 300, Y = 520;
const EARTH_X = SUN_X + AU, NEPT_X = SUN_X + AU * 30;
const T1 = 20, T1_END = 110;     // pulso Sol → Tierra
const Z0 = 125, Z1 = 175;        // zoom out
const T2 = 185, T2_END = 300;    // pulso Tierra → Neptuno

export const Light: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [Z0, Z1], [1, 1 / 30], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const p1 = interpolate(frame, [T1, T1_END], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p2 = interpolate(frame, [T2, T2_END], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulseX = frame < T2 ? SUN_X + p1 * AU : EARTH_X + p2 * (NEPT_X - EARTH_X);
  // cronómetro: 8 min 20 s hasta la Tierra; 4 h 10 min hasta Neptuno
  const secs = frame < T2 ? p1 * 500 : 500 + p2 * (15000 - 500);
  const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = Math.floor(secs % 60);
  const clock = h > 0 ? `${h} h ${String(m).padStart(2, "0")} min` : `${m} min ${String(s).padStart(2, "0")} s`;
  const planets = [
    ["Mercurio", 0.39, 10, "#b5b5b5"], ["Venus", 0.72, 20, "#e3c08a"], ["Marte", 1.52, 12, "#d9643a"], ["Júpiter", 5.2, 60, "#d8b48c"],
    ["Saturno", 9.5, 52, "#e8d8a6"], ["Urano", 19.2, 32, "#8fd5e8"], ["Neptuno", 30, 30, "#3a6fe0"],
  ] as const;
  return (
    <AbsoluteFill>
      <Space nebula={false} />
      <SceneTitle index={4} kicker="La velocidad de la luz" title="Ver es mirar al pasado" color={C.gold} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${scale})`, transformOrigin: `${SUN_X}px ${Y}px` }}>
        <div style={{ position: "absolute", left: SUN_X, top: Y, width: NEPT_X - SUN_X, height: 2, background: `${C.muted}33` }} />
        <Sun d={120} x={SUN_X} y={Y} glow={scale < 0.5 ? 6 : 1} />
        <div style={{ position: "absolute", left: EARTH_X - 22, top: Y - 22, width: 44, height: 44, borderRadius: 22, background: `radial-gradient(circle at 35% 35%, #7fd3ff, #1b5fb8 60%, #0b2a5c)`, boxShadow: `0 0 20px ${C.cyan}`, transform: `scale(${Math.max(1, 0.5 / scale)})` }} />
        {planets.map(([name, au, d, col]) => (
          <div key={name} style={{ position: "absolute", left: SUN_X + au * AU - d / 2, top: Y - d / 2, width: d, height: d, borderRadius: "50%", background: col, opacity: scale < 0.9 ? 1 : 0.35, transform: `scale(${Math.max(1, 0.45 / scale)})` }} />
        ))}
        <div style={{ position: "absolute", left: pulseX - 12, top: Y - 12, width: 24, height: 24, borderRadius: 12, background: "#fff", boxShadow: `0 0 30px 10px ${C.gold}`, transform: `scale(${Math.max(1, 0.6 / scale)})`, opacity: frame >= T1 ? 1 : 0 }} />
      </div>
      {scale > 0.9 && <Tag x={EARTH_X - 40} y={Y + 50} text="Tierra · 1 UA = 150 M km" start={5} />}
      {scale < 0.1 && <Tag x={SUN_X + (NEPT_X - SUN_X) * scale - 120} y={Y + 50} text="Neptuno · 30 UA = 4.500 M km" color="#8fb4ff" start={Z1} />}
      <div style={{ position: "absolute", left: 1180, top: 300, fontFamily: F.mono, fontSize: 30, color: C.muted }}>
        tiempo de viaje de la luz
        <div style={{ fontSize: 96, color: C.gold, fontWeight: 700, lineHeight: 1.1, textShadow: `0 0 30px ${C.gold}66`, whiteSpace: "nowrap" }}>{clock}</div>
      </div>
      <DataRow left={1080} bottom={100}>
        <DataCard value="300.000 km/s" label="velocidad de la luz" color={C.gold} delay={10} width={330} />
        <DataCard value="8 min 20 s" label="Sol → Tierra" delay={T1_END} width={260} />
        <DataCard value="4 h 10 min" label="Sol → Neptuno" color="#8fb4ff" delay={T2_END - 20} width={260} />
      </DataRow>
      <Vignette />
    </AbsoluteFill>
  );
};
