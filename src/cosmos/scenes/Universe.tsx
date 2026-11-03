import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Space, Vignette, SceneTitle, DataCard, DataRow, Counter } from "../ui";
import { C, F } from "../theme";

const rings = [
  { r: 34, label: "Sistema solar", sub: "~1 día luz hasta el borde", color: C.gold },
  { r: 110, label: "Vía Láctea", sub: "100.000 años luz", color: C.cyan },
  { r: 200, label: "Grupo Local · Andrómeda a 2,5 M años luz", sub: "10 millones de años luz", color: C.green },
  { r: 300, label: "Supercúmulo de Laniakea", sub: "500 millones de años luz", color: C.orange },
  { r: 420, label: "Universo observable", sub: "93.000 millones de años luz", color: C.red },
];

export const Universe: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cx = 640, cy = 560;
  return (
    <AbsoluteFill>
      <Space drift={0.3} />
      <SceneTitle index={7} kicker="Más y más lejos" title="El universo observable" color={C.red} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {rings.map((rg, i) => {
          const p = spring({ frame: frame - 15 - i * 22, fps, config: { damping: 16, stiffness: 90 } });
          return (
            <g key={i} opacity={p}>
              <circle cx={cx} cy={cy} r={rg.r * p} fill={`${rg.color}0d`} stroke={rg.color} strokeWidth={2} style={{ filter: `drop-shadow(0 0 8px ${rg.color}88)` }} />
              <line x1={cx + rg.r * 0.7} y1={cy - rg.r * 0.7} x2={cx + 470} y2={cy - 420 + i * 110} stroke={`${rg.color}88`} strokeWidth={1.5} />
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r={5} fill="#fff" />
      </svg>
      {rings.map((rg, i) => {
        const p = spring({ frame: frame - 15 - i * 22, fps, config: { damping: 16, stiffness: 90 } });
        return (
          <div key={i} style={{ position: "absolute", left: cx + 480, top: cy - 440 + i * 110, opacity: p, transform: `translateX(${(1 - p) * 30}px)` }}>
            <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 30, color: rg.color }}>{rg.label}</div>
            <div style={{ fontFamily: F.mono, fontSize: 24, color: C.muted }}>{rg.sub}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 60, top: cy + 440, fontFamily: F.mono, fontSize: 22, color: C.muted, opacity: interpolate(frame, [120, 140], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        * escala no lineal: cada anillo es miles de veces más grande que el anterior
      </div>
      <DataRow left={1130} bottom={90}>
        <DataCard value={<><Counter to={13800} start={130} dur={55} /> M de años</>} label="edad del universo" color={C.red} delay={130} width={400} size={38} />
        <DataCard value={<><Counter to={2} start={155} dur={40} /> billones</>} label="de galaxias, aprox." delay={155} width={300} size={38} />
      </DataRow>
      <Vignette />
    </AbsoluteFill>
  );
};
