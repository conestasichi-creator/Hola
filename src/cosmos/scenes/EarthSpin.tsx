import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Space, Vignette, SceneTitle, DataCard, DataRow, Counter, Tag } from "../ui";
import { C, F } from "../theme";

/** Esfera con "continentes" que se desplazan (textura repetida) + sombreado y terminador */
export const Planet: React.FC<{ d: number; frame: number; speed: number; x: number; y: number }> = ({ d, frame, speed, x, y }) => {
  const shift = -(frame * speed) % (d * 2);
  const land = `radial-gradient(ellipse 14% 20% at 18% 38%, #3fa75a 55%, transparent 58%), radial-gradient(ellipse 10% 26% at 30% 62%, #3b9a52 55%, transparent 58%), radial-gradient(ellipse 16% 14% at 55% 30%, #49b35f 55%, transparent 58%), radial-gradient(ellipse 12% 20% at 66% 58%, #3fa75a 55%, transparent 58%), radial-gradient(ellipse 9% 10% at 84% 44%, #49b35f 55%, transparent 58%), radial-gradient(ellipse 22% 7% at 50% 8%, #e8f4ff 55%, transparent 60%), radial-gradient(ellipse 22% 7% at 50% 93%, #e8f4ff 55%, transparent 60%)`;
  return (
    <div style={{ position: "absolute", left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: "50%", overflow: "hidden", background: "#1b5fb8", boxShadow: `0 0 ${d * 0.18}px rgba(76,201,240,0.45)` }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: land, backgroundSize: `${d * 2}px ${d}px`, backgroundRepeat: "repeat-x", backgroundPosition: `${shift}px 0` }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse 30% 12% at 40% 30%, rgba(255,255,255,0.35), transparent 70%), radial-gradient(ellipse 25% 10% at 70% 65%, rgba(255,255,255,0.3), transparent 70%)", backgroundSize: `${d * 2}px ${d}px`, backgroundRepeat: "repeat-x", backgroundPosition: `${shift * 1.3}px 0` }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 32% 32%, rgba(255,255,255,0.22), transparent 45%), linear-gradient(90deg, transparent 45%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.9) 100%)` }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", boxShadow: "inset 0 0 40px rgba(0,0,0,0.6)" }} />
    </div>
  );
};

export const EarthSpin: React.FC = () => {
  const frame = useCurrentFrame();
  const d = 560, cx = 620, cy = 560;
  // marcador sobre el ecuador que da una vuelta cada 120 frames (= 24 h)
  const a = (frame / 120) * Math.PI * 2;
  const mx = cx + Math.sin(a) * (d / 2) * 0.98, front = Math.cos(a) > 0;
  const hours = ((frame / 120) * 24) % 24;
  return (
    <AbsoluteFill>
      <Space />
      <SceneTitle index={1} kicker="La Tierra gira" title="Un día = una vuelta" />
      <Planet d={d} frame={frame} speed={d * 2 / 120} x={cx} y={cy} />
      {front && <div style={{ position: "absolute", left: mx - 9, top: cy - 9, width: 18, height: 18, borderRadius: 9, background: C.gold, boxShadow: `0 0 16px ${C.gold}` }} />}
      <svg width={1920} height={1080} style={{ position: "absolute", pointerEvents: "none" }}>
        <ellipse cx={cx} cy={cy} rx={d / 2 + 30} ry={60} fill="none" stroke={`${C.gold}88`} strokeWidth={2} strokeDasharray="10 10" />
        <line x1={cx} y1={cy - d / 2 - 70} x2={cx} y2={cy + d / 2 + 70} stroke={`${C.muted}88`} strokeWidth={2} strokeDasharray="6 8" transform={`rotate(-23.4 ${cx} ${cy})`} />
      </svg>
      <Tag x={cx + 150} y={cy - d / 2 - 90} text="eje inclinado 23,4°" color={C.muted} start={30} />
      <div style={{ position: "absolute", left: 1080, top: 300, fontFamily: F.mono, fontSize: 30, color: C.muted }}>
        hora local en el marcador
        <div style={{ fontSize: 120, color: C.gold, fontWeight: 700, lineHeight: 1.1, textShadow: `0 0 30px ${C.gold}66` }}>
          {String(Math.floor(hours)).padStart(2, "0")}:{String(Math.floor((hours % 1) * 60)).padStart(2, "0")}
        </div>
      </div>
      <DataRow left={1040} bottom={100}>
        <DataCard value={<><Counter to={24} start={20} dur={40} /> h</>} label="una rotación completa" color={C.gold} delay={20} width={230} size={40} />
        <DataCard value={<><Counter to={1670} start={40} dur={50} /> km/h</>} label="velocidad en el ecuador" delay={40} width={290} size={40} />
        <DataCard value={<><Counter to={12742} start={60} dur={50} /> km</>} label="diámetro" color={C.green} delay={60} width={260} size={40} />
      </DataRow>
      <Vignette />
    </AbsoluteFill>
  );
};
