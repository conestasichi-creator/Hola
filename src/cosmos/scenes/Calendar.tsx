import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Space, Vignette, SceneTitle, Caption } from "../ui";
import { C, F } from "../theme";

const months = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
// posición 0..1 dentro del año (calendario cósmico de Sagan, 13.800 M de años = 1 año)
const events = [
  { at: 0.0, label: "Big Bang", sub: "1 de enero", color: C.red, up: true, dx: 130 },
  { at: 0.2, label: "Nace la Vía Láctea", sub: "~15 de marzo", color: C.cyan, up: false, dx: 0 },
  { at: 0.663, label: "Nace el Sol", sub: "31 de agosto", color: C.gold, up: true, dx: -150 },
  { at: 0.672, label: "Se forma la Tierra", sub: "2 de septiembre", color: C.green, up: false, dx: 0 },
  { at: 0.72, label: "Primera vida", sub: "21 de septiembre", color: C.green, up: true, dx: 150 },
  { at: 0.983, label: "Dinosaurios", sub: "25 → 30 de diciembre", color: C.orange, up: false, dx: -60 },
  { at: 0.9994, label: "Humanos", sub: "31 dic, 23:52", color: "#ffffff", up: true, dx: -70 },
];

export const Calendar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const x0 = 110, w = 1700, y = 330, h = 120;
  const dayZoom = interpolate(frame, [250, 275], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Space drift={0.05} />
      <SceneTitle index={8} kicker="Si el universo fuera un año" title="El calendario cósmico" color={C.gold} />
      <div style={{ position: "absolute", left: x0, top: y, width: w, height: h, display: "flex", border: `1px solid ${C.muted}66`, borderRadius: 10, overflow: "hidden" }}>
        {months.map((m, i) => (
          <div key={m} style={{ flex: 1, borderRight: i < 11 ? `1px solid ${C.muted}44` : "none", background: i % 2 ? "rgba(255,255,255,0.03)" : "transparent", fontFamily: F.mono, fontSize: 20, color: C.muted, padding: 10 }}>{m}</div>
        ))}
      </div>
      {events.map((e, i) => {
        const p = spring({ frame: frame - 20 - i * 24, fps, config: { damping: 14, stiffness: 120 } });
        const x = x0 + e.at * w;
        const up = e.up;
        return (
          <div key={e.label} style={{ position: "absolute", left: x, top: y, opacity: p }}>
            <div style={{ position: "absolute", left: -1, top: up ? -70 * p : h, width: 3, height: 70 * p, background: e.color, boxShadow: `0 0 10px ${e.color}` }} />
            <div style={{ position: "absolute", left: -120 + e.dx, top: up ? -130 : h + 78, width: 240, textAlign: "center", transform: `scale(${0.7 + 0.3 * p})` }}>
              <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 26, color: e.color, whiteSpace: "nowrap" }}>{e.label}</div>
              <div style={{ fontFamily: F.mono, fontSize: 20, color: C.muted, whiteSpace: "nowrap" }}>{e.sub}</div>
            </div>
          </div>
        );
      })}
      {/* zoom al 31 de diciembre */}
      <div style={{ position: "absolute", left: x0, top: 640, width: w, opacity: dayZoom }}>
        <div style={{ fontFamily: F.mono, fontSize: 24, color: C.muted, marginBottom: 10 }}>31 DE DICIEMBRE · las 24 horas del último día</div>
        <div style={{ position: "relative", height: 70, border: `1px solid ${C.muted}66`, borderRadius: 10, background: "linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,200,87,0.08))" }}>
          {[0, 6, 12, 18, 24].map((hh) => (
            <div key={hh} style={{ position: "absolute", left: `${(hh / 24) * 100}%`, top: 0, bottom: 0, borderLeft: `1px solid ${C.muted}44`, fontFamily: F.mono, fontSize: 18, color: C.muted, paddingLeft: 6, paddingTop: 6 }}>{hh}:00</div>
          ))}
          <div style={{ position: "absolute", left: `${(23.87 / 24) * 100}%`, top: -8, bottom: -8, width: 4, background: "#fff", boxShadow: "0 0 14px #fff" }} />
          <div style={{ position: "absolute", left: `${(23.9995 / 24) * 100}%`, top: -8, bottom: -8, width: 3, background: C.red, boxShadow: `0 0 14px ${C.red}` }} />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 60, marginTop: 14, fontFamily: F.mono, fontSize: 24 }}>
          <span style={{ color: "#fff" }}>23:52 → aparecen los humanos</span>
          <span style={{ color: C.red }}>23:59:46 → toda la historia escrita (14 segundos)</span>
        </div>
      </div>
      <Vignette />
    </AbsoluteFill>
  );
};
