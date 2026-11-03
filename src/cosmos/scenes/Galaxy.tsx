import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { Space, Vignette, SceneTitle, DataCard, DataRow, Counter, Tag } from "../ui";
import { C, F } from "../theme";

export const Galaxy: React.FC = () => {
  const frame = useCurrentFrame();
  const cx = 620, cy = 580, R = 460;
  const pts = useMemo(() => {
    const out: { x: number; y: number; r: number; c: string; o: number }[] = [];
    for (let i = 0; i < 4200; i++) {
      const arm = i % 2, t = random(`t${i}`) * 3.6 + 0.3;
      const rad = R * 0.14 * Math.exp(0.5 * t) * (0.85 + random(`j${i}`) * 0.3);
      if (rad > R) continue;
      const ang = t + arm * Math.PI + (random(`a${i}`) - 0.5) * 0.9;
      out.push({ x: Math.cos(ang) * rad, y: Math.sin(ang) * rad * 0.48, r: 0.7 + random(`r${i}`) * 1.9, c: random(`c${i}`) < 0.2 ? C.cyan : random(`d${i}`) < 0.1 ? "#ffd0a0" : "#dfe8ff", o: 0.35 + random(`o${i}`) * 0.6 });
    }
    for (let i = 0; i < 900; i++) {
      const rad = R * 0.2 * Math.sqrt(random(`br${i}`)), ang = random(`ba${i}`) * Math.PI * 2;
      out.push({ x: Math.cos(ang) * rad, y: Math.sin(ang) * rad * 0.55, r: 1 + random(`bs${i}`) * 2, c: "#ffe9b0", o: 0.6 + random(`bo${i}`) * 0.4 });
    }
    return out;
  }, []);
  const rot = frame * 0.06;
  // el Sol orbita a 0,55 R: una vuelta cada 300 frames (= 230 millones de años)
  const sa = (frame / 300) * Math.PI * 2;
  const sx = Math.cos(sa) * R * 0.55, sy = Math.sin(sa) * R * 0.55 * 0.48;
  const laps = Math.min(20, Math.floor((frame / 300) * 20));
  return (
    <AbsoluteFill>
      <Space drift={0.05} />
      <SceneTitle index={6} kicker="Nuestra galaxia" title="La Vía Láctea" />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <defs>
          <radialGradient id="disk"><stop offset="0%" stopColor="#9db4ff" stopOpacity={0.22} /><stop offset="60%" stopColor="#6f8bff" stopOpacity={0.08} /><stop offset="100%" stopColor="#6f8bff" stopOpacity={0} /></radialGradient>
          <radialGradient id="core"><stop offset="0%" stopColor="#fff4d6" stopOpacity={0.9} /><stop offset="40%" stopColor="#ffd089" stopOpacity={0.35} /><stop offset="100%" stopColor="#ffd089" stopOpacity={0} /></radialGradient>
        </defs>
        <g transform={`translate(${cx} ${cy}) rotate(${-8})`}>
          <ellipse cx={0} cy={0} rx={R} ry={R * 0.48} fill="url(#disk)" />
          <ellipse cx={0} cy={0} rx={R * 0.5} ry={R * 0.24} fill="url(#core)" />
          <g transform={`rotate(${rot})`}>
            {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={p.c} opacity={p.o} />)}
          </g>
          <ellipse cx={0} cy={0} rx={R * 0.55} ry={R * 0.55 * 0.48} fill="none" stroke={`${C.gold}77`} strokeWidth={2} strokeDasharray="6 8" />
          <circle cx={sx} cy={sy} r={7} fill={C.gold} style={{ filter: `drop-shadow(0 0 12px ${C.gold})` }} />
        </g>
      </svg>
      <Tag x={cx + sx + 20} y={cy + sy - 50} text="el Sol, a 27.000 años luz del centro" color={C.gold} start={20} />
      <Tag x={cx - 170} y={cy - R * 0.48 - 90} text="100.000 años luz de diámetro" color={C.muted} start={35} />
      <div style={{ position: "absolute", left: 1250, top: 190, fontFamily: F.mono, fontSize: 30, color: C.muted }}>
        vueltas del Sol a la galaxia
        <div style={{ fontSize: 120, color: C.gold, fontWeight: 700, lineHeight: 1.1, textShadow: `0 0 30px ${C.gold}66` }}>{laps}</div>
        <div style={{ fontSize: 26, color: C.muted }}>desde que nació, hace 4.600 millones de años</div>
      </div>
      <DataRow left={90} bottom={90}>
        <DataCard value={<><Counter to={200} start={20} dur={50} />–400 mil M</>} label="de estrellas" delay={20} width={380} size={38} />
        <DataCard value={<><Counter to={230} start={45} dur={45} /> km/s</>} label="velocidad del Sol alrededor del centro" color={C.gold} delay={45} width={360} size={38} />
        <DataCard value={<><Counter to={230} start={70} dur={45} /> M de años</>} label="dura un año galáctico" color={C.orange} delay={70} width={340} size={38} />
      </DataRow>
      <Vignette />
    </AbsoluteFill>
  );
};
