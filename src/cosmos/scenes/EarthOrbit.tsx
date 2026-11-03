import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Space, Vignette, SceneTitle, DataCard, DataRow, Counter, Tag } from "../ui";
import { C, F } from "../theme";

export const Sun: React.FC<{ d: number; x: number; y: number; glow?: number }> = ({ d, x, y, glow = 1 }) => (
  <div style={{ position: "absolute", left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: "50%", background: `radial-gradient(circle at 45% 45%, #fff6c7 0%, ${C.gold} 35%, ${C.orange} 75%, #c2410c 100%)`, boxShadow: `0 0 ${d * 0.6 * glow}px ${C.gold}88, 0 0 ${d * 1.4 * glow}px ${C.orange}44` }} />
);

export const EarthOrbit: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const cx = 760, cy = 560, rx = 560, ry = 230;
  const laps = interpolate(frame, [0, durationInFrames - 50], [0, 1.0], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const a = laps * Math.PI * 2 - Math.PI / 2;
  const ex = cx + Math.cos(a) * rx, ey = cy + Math.sin(a) * ry;
  const day = Math.min(365, Math.floor(laps * 365.25));
  const trail = new Array(60).fill(0).map((_, i) => {
    const t = a - i * 0.025;
    return [cx + Math.cos(t) * rx, cy + Math.sin(t) * ry, 1 - i / 60] as const;
  });
  const behind = Math.sin(a) < 0;
  return (
    <AbsoluteFill>
      <Space />
      <SceneTitle index={2} kicker="La Tierra orbita" title="Un año = una órbita" color={C.gold} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={`${C.cyan}44`} strokeWidth={2} strokeDasharray="8 10" />
        {trail.map(([x, y, o], i) => <circle key={i} cx={x} cy={y} r={5 * o} fill={C.cyan} opacity={o * 0.7} />)}
      </svg>
      {behind && <div style={{ position: "absolute", left: ex - 22, top: ey - 22, width: 44, height: 44, borderRadius: 22, background: `radial-gradient(circle at 35% 35%, #7fd3ff, #1b5fb8 60%, #0b2a5c)`, boxShadow: `0 0 20px ${C.cyan}` }} />}
      <Sun d={150} x={cx} y={cy} />
      {!behind && <div style={{ position: "absolute", left: ex - 22, top: ey - 22, width: 44, height: 44, borderRadius: 22, background: `radial-gradient(circle at 35% 35%, #7fd3ff, #1b5fb8 60%, #0b2a5c)`, boxShadow: `0 0 20px ${C.cyan}` }} />}
      <Tag x={cx + 90} y={cy - 40} text="Sol" color={C.gold} start={10} />
      <div style={{ position: "absolute", left: 1400, top: 300, fontFamily: F.mono, fontSize: 30, color: C.muted }}>
        día
        <div style={{ fontSize: 120, color: C.cyan, fontWeight: 700, lineHeight: 1.1, textShadow: `0 0 30px ${C.cyan}66` }}>{day}</div>
        <div style={{ fontSize: 26, color: C.muted }}>de 365</div>
      </div>
      <DataRow left={1080} bottom={100}>
        <DataCard value={<><Counter to={150} start={20} dur={45} /> M km</>} label="distancia al Sol (1 UA)" color={C.gold} delay={20} width={290} />
        <DataCard value={<><Counter to={30} start={40} dur={45} /> km/s</>} label="velocidad orbital" delay={40} width={230} />
        <DataCard value={<><Counter to={940} start={60} dur={50} /> M km</>} label="recorridos por año" color={C.green} delay={60} width={280} />
      </DataRow>
      <Vignette />
    </AbsoluteFill>
  );
};
