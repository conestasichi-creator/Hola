import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Space, Vignette, SceneTitle, DataCard, DataRow, Counter, Tag } from "../ui";
import { C, F } from "../theme";

const FPD = 2.6; // frames por día (25 días ≈ 65 frames por vuelta)
const spots = [
  { lat: 0, period: 25, phase: 0.2, s: 1.0 }, { lat: 12, period: 25.5, phase: 2.4, s: 0.7 }, { lat: -15, period: 26, phase: 4.1, s: 0.8 },
  { lat: 30, period: 27.5, phase: 1.1, s: 0.8 }, { lat: -32, period: 27.8, phase: 3.3, s: 0.6 },
  { lat: 55, period: 31, phase: 0.6, s: 0.6 }, { lat: -58, period: 31.5, phase: 2.9, s: 0.5 },
  { lat: 75, period: 35, phase: 1.8, s: 0.45 }, { lat: -76, period: 35, phase: 4.6, s: 0.45 },
];

export const SunSpin: React.FC = () => {
  const frame = useCurrentFrame();
  const R = 300, cx = 620, cy = 560;
  const rot = frame * 0.15;
  return (
    <AbsoluteFill>
      <Space nebula={false} />
      <SceneTitle index={3} kicker="El Sol gira" title="Rotación diferencial" color={C.orange} />
      <div style={{ position: "absolute", left: cx - R, top: cy - R, width: R * 2, height: R * 2, borderRadius: "50%", overflow: "hidden", background: `radial-gradient(circle at 45% 45%, #fff3b0 0%, ${C.gold} 40%, ${C.orange} 80%, #b8360f 100%)`, boxShadow: `0 0 160px ${C.gold}99, 0 0 400px ${C.orange}55` }}>
        <div style={{ position: "absolute", inset: -R, backgroundImage: `radial-gradient(ellipse 40% 30% at 30% 40%, rgba(255,255,255,0.16), transparent 70%), radial-gradient(ellipse 30% 45% at 70% 65%, rgba(255,255,255,0.12), transparent 70%), radial-gradient(ellipse 25% 25% at 55% 20%, rgba(200,60,0,0.18), transparent 70%)`, backgroundSize: "170px 150px", transform: `rotate(${rot}deg)` }} />
        <div style={{ position: "absolute", inset: -R, backgroundImage: `radial-gradient(ellipse 35% 35% at 40% 60%, rgba(190,50,0,0.16), transparent 70%), radial-gradient(ellipse 45% 30% at 75% 30%, rgba(255,240,200,0.12), transparent 70%)`, backgroundSize: "260px 230px", transform: `rotate(${-rot * 0.6}deg)` }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", boxShadow: "inset 0 0 90px rgba(190,60,0,0.55)" }} />
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {[60, 30, 0, -30, -60].map((lat) => {
          const y = cy - Math.sin((lat * Math.PI) / 180) * R, rx = Math.cos((lat * Math.PI) / 180) * R;
          return <ellipse key={lat} cx={cx} cy={y} rx={rx} ry={rx * 0.18} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={1.5} strokeDasharray="4 6" />;
        })}
        {spots.map((sp, i) => {
          const ang = (frame / (sp.period * FPD)) * Math.PI * 2 + sp.phase;
          const front = Math.cos(ang) > 0;
          if (!front) return null;
          const latR = (sp.lat * Math.PI) / 180;
          const x = cx + Math.cos(latR) * R * Math.sin(ang) * 0.97, y = cy - Math.sin(latR) * R * 0.97;
          const fore = Math.max(0.15, Math.cos(ang));
          return <ellipse key={i} cx={x} cy={y} rx={16 * sp.s * fore} ry={12 * sp.s} fill="#3a1200" opacity={0.85} />;
        })}
      </svg>
      <Tag x={cx + R + 40} y={cy - 16} text="ecuador: 1 vuelta cada 25 días" color={C.gold} start={20} />
      <Tag x={cx + R * 0.5 + 40} y={cy - R * 0.87 - 60} text="polos: ~35 días" color={C.orange} start={40} />
      <Tag x={cx + R * 0.5 + 40} y={cy + R * 0.87 + 30} text="polos: ~35 días" color={C.orange} start={40} />
      <div style={{ position: "absolute", left: 1120, top: 300, width: 700, fontFamily: F.display, fontSize: 30, color: C.muted, lineHeight: 1.4 }}>
        El Sol no es sólido: es plasma. Cada latitud gira a su propio ritmo. Las manchas del ecuador le sacan ventaja a las de los polos.
      </div>
      <DataRow left={1080} bottom={100}>
        <DataCard value={<><Counter to={1392000} start={20} dur={55} /> km</>} label="diámetro (109 Tierras)" color={C.gold} delay={20} width={360} />
        <DataCard value={<><Counter to={1300000} start={45} dur={55} /></>} label="Tierras entrarían adentro" color={C.orange} delay={45} width={330} />
      </DataRow>
      <Vignette />
    </AbsoluteFill>
  );
};
