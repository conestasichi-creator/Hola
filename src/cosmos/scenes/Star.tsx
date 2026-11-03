import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Space, Vignette, SceneTitle, DataCard, DataRow, Counter, Caption, Tag } from "../ui";
import { C, F } from "../theme";

export const Star: React.FC = () => {
  const frame = useCurrentFrame();
  const x0 = 260, x1 = 1660, y = 500;
  const bar = interpolate(frame, [15, 95], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const pulse = (frame * 4) % 1500;
  return (
    <AbsoluteFill>
      <Space drift={0.4} />
      <SceneTitle index={5} kicker="La estrella más cercana" title="Próxima Centauri" color={C.red} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <line x1={x0} y1={y} x2={x0 + (x1 - x0) * bar} y2={y} stroke={C.muted} strokeWidth={2} strokeDasharray="6 10" />
        {bar > 0.99 && new Array(4).fill(0).map((_, i) => <line key={i} x1={x0 + ((x1 - x0) * (i + 1)) / 4.24} y1={y - 14} x2={x0 + ((x1 - x0) * (i + 1)) / 4.24} y2={y + 14} stroke={C.muted} strokeWidth={2} />)}
        <circle cx={x0 + Math.min(pulse, x1 - x0)} cy={y} r={6} fill="#fff" opacity={bar > 0.99 ? 0.9 : 0} style={{ filter: `drop-shadow(0 0 8px ${C.gold})` }} />
        <circle cx={x0} cy={y} r={26} fill={C.gold} style={{ filter: `drop-shadow(0 0 30px ${C.gold})` }} />
        <circle cx={x1} cy={y} r={14} fill={C.red} opacity={bar > 0.98 ? 1 : 0} style={{ filter: `drop-shadow(0 0 24px ${C.red})` }} />
      </svg>
      <Tag x={x0 - 30} y={y + 50} text="Sol" color={C.gold} start={10} />
      <Tag x={x1 - 60} y={y + 50} text="Próxima Centauri" color={C.red} start={95} align="right" />
      {bar > 0.99 && [1, 2, 3, 4].map((n) => <Tag key={n} x={x0 + ((x1 - x0) * n) / 4.24 - 50} y={y - 70} text={`${n} año${n > 1 ? "s" : ""} luz`} color={C.muted} start={100 + n * 6} />)}
      <div style={{ position: "absolute", left: 0, right: 0, top: 610, textAlign: "center", fontFamily: F.mono, fontSize: 30, color: C.muted, opacity: interpolate(frame, [100, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        1 año luz = 9.460.000.000.000 km · la luz de Próxima que ves hoy salió hace 4 años
      </div>
      <DataRow left={90} bottom={90}>
        <DataCard value={<><Counter to={4.24} start={100} dur={40} decimals={2} /> años luz</>} label="distancia a Próxima" color={C.red} delay={100} width={340} size={38} />
        <DataCard value={<><Counter to={40} start={120} dur={40} /> billones de km</>} label="(40.000.000.000.000)" delay={120} width={440} size={38} />
        <DataCard value="~75.000 años" label="tardaría la Voyager 1, la nave más lejana, en llegar" color={C.gold} delay={140} width={520} size={38} />
      </DataRow>
      <Vignette />
    </AbsoluteFill>
  );
};
