import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Space, Vignette, SceneTitle, DataCard, DataRow, Tag } from "../ui";
import { C, F } from "../theme";

const Clock: React.FC<{ x: number; y: number; r: number; speed: number; color: string; label: string; frame: number }> = ({ x, y, r, speed, color, label, frame }) => {
  const a = (frame * speed - 90) * (Math.PI / 180);
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="rgba(11,16,32,0.8)" stroke={color} strokeWidth={3} style={{ filter: `drop-shadow(0 0 14px ${color}66)` }} />
      {new Array(60).fill(0).map((_, i) => {
        const t = (i / 60) * Math.PI * 2, big = i % 5 === 0;
        return <line key={i} x1={x + Math.cos(t) * (r - (big ? 18 : 10))} y1={y + Math.sin(t) * (r - (big ? 18 : 10))} x2={x + Math.cos(t) * (r - 4)} y2={y + Math.sin(t) * (r - 4)} stroke={big ? C.text : C.muted} strokeWidth={big ? 3 : 1.5} />;
      })}
      <line x1={x} y1={y} x2={x + Math.cos(a) * (r - 30)} y2={y + Math.sin(a) * (r - 30)} stroke={color} strokeWidth={4} strokeLinecap="round" />
      <line x1={x} y1={y} x2={x + Math.cos(a / 12) * (r * 0.5)} y2={y + Math.sin(a / 12) * (r * 0.5)} stroke={C.text} strokeWidth={6} strokeLinecap="round" />
      <circle cx={x} cy={y} r={6} fill={color} />
      <text x={x} y={y + r + 44} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={26} fill={color}>{label}</text>
    </g>
  );
};

export const Relativity: React.FC = () => {
  const frame = useCurrentFrame();
  const sa = frame * 0.9 * (Math.PI / 180);
  const ex = 960, ey = 1330, er = 560;
  return (
    <AbsoluteFill>
      <Space />
      <SceneTitle index={9} kicker="Relatividad" title="El tiempo no corre igual para todos" color={C.green} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <circle cx={ex} cy={ey} r={er} fill="#0f3d7a" stroke={C.cyan} strokeWidth={2} opacity={0.9} />
        <circle cx={ex} cy={ey} r={er + 160} fill="none" stroke={`${C.muted}66`} strokeWidth={2} strokeDasharray="8 10" />
        <g transform={`translate(${ex + Math.cos(sa - Math.PI) * (er + 160)} ${ey + Math.sin(sa - Math.PI) * (er + 160)})`}>
          <rect x={-14} y={-10} width={28} height={20} fill="#cfd8e3" />
          <rect x={-50} y={-6} width={32} height={12} fill={C.cyan} /><rect x={18} y={-6} width={32} height={12} fill={C.cyan} />
        </g>
        <Clock x={560} y={470} r={150} speed={6} color={C.cyan} label="reloj en la Tierra" frame={frame} />
        <Clock x={1360} y={470} r={150} speed={6.6} color={C.green} label="reloj en un satélite GPS" frame={frame} />
      </svg>
      <Tag x={1170} y={690} text="20.200 km de altura · 14.000 km/h" color={C.green} start={20} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 760, textAlign: "center", fontFamily: F.display, fontSize: 30, color: C.muted, opacity: interpolate(frame, [40, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        Menos gravedad lo adelanta, la velocidad lo atrasa. El balance neto: el reloj del satélite corre más rápido.
      </div>
      <DataRow left={90} bottom={90}>
        <DataCard value="+38 µs / día" label="adelanta cada reloj GPS respecto a la Tierra" color={C.green} delay={70} width={440} />
        <DataCard value="~10 km / día" label="de error acumularía tu mapa sin la corrección" color={C.red} delay={95} width={440} />
        <DataCard value="Einstein, 1915" label="relatividad general: la gravedad curva el tiempo" delay={120} width={440} />
      </DataRow>
      <Vignette />
    </AbsoluteFill>
  );
};
