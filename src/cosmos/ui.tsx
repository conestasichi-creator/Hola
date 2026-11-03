import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F, fmt } from "./theme";

/** Fondo espacial: gradiente, nebulosas y campo de estrellas con titileo */
export const Space: React.FC<{ drift?: number; nebula?: boolean }> = ({ drift = 0.15, nebula = true }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const stars = useMemo(
    () =>
      new Array(380).fill(0).map((_, i) => ({
        x: random(`sx${i}`) * width,
        y: random(`sy${i}`) * height,
        r: 0.6 + random(`sr${i}`) * 1.6,
        p: random(`sp${i}`) * Math.PI * 2,
        s: 0.02 + random(`ss${i}`) * 0.06,
        c: random(`sc${i}`) < 0.15 ? C.cyan : random(`sd${i}`) < 0.1 ? C.gold : "#ffffff",
      })),
    [width, height],
  );
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${C.bg2} 0%, ${C.bg} 70%)` }}>
      {nebula && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 40% 30% at 20% 30%, rgba(58,134,255,0.10), transparent 70%), radial-gradient(ellipse 35% 25% at 80% 70%, rgba(255,123,61,0.07), transparent 70%)`,
          }}
        />
      )}
      <svg width={width} height={height} style={{ position: "absolute", left: 0, top: 0 }}>
        {stars.map((s, i) => (
          <circle
            key={i}
            cx={(s.x + frame * drift * s.r) % width}
            cy={s.y}
            r={s.r}
            fill={s.c}
            opacity={0.45 + 0.55 * Math.abs(Math.sin(frame * s.s + s.p))}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 60%, rgba(0,0,0,0.65) 100%)", pointerEvents: "none" }} />
);

/** Título de escena arriba a la izquierda: "03 / EL SOL" + título grande */
export const SceneTitle: React.FC<{ index: number; kicker: string; title: string; color?: string }> = ({ index, kicker, title, color = C.cyan }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const y = interpolate(frame, [0, 18], [16, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: "absolute", left: 90, top: 64, opacity: op, transform: `translateY(${y}px)` }}>
      <div style={{ fontFamily: F.mono, fontSize: 24, color, letterSpacing: 4 }}>
        {String(index).padStart(2, "0")} / {kicker.toUpperCase()}
      </div>
      <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 62, color: C.text, marginTop: 6, letterSpacing: -1 }}>{title}</div>
    </div>
  );
};

/** Número que cuenta hasta `to` con easing */
export const Counter: React.FC<{ to: number; start?: number; dur?: number; prefix?: string; suffix?: string; decimals?: number }> = ({
  to, start = 0, dur = 50, prefix = "", suffix = "", decimals = 0,
}) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [start, start + dur], [0, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const txt = decimals > 0 ? v.toFixed(decimals).replace(".", ",") : fmt(v);
  return <>{prefix}{txt}{suffix}</>;
};

/** Tarjeta de dato: valor grande + etiqueta, entra con spring */
export const DataCard: React.FC<{ value: React.ReactNode; label: string; color?: string; delay?: number; width?: number; size?: number }> = ({
  value, label, color = C.cyan, delay = 0, width = 330, size = 44,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 110 } });
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px)`,
        width,
        padding: "20px 24px",
        borderRadius: 16,
        background: "rgba(11,16,32,0.75)",
        border: `1px solid ${color}55`,
        boxShadow: `0 0 30px ${color}22`,
        backdropFilter: "blur(4px)",
      }}
    >
      <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: size, color, textShadow: `0 0 18px ${color}66`, lineHeight: 1.1, whiteSpace: "nowrap" }}>{value}</div>
      <div style={{ fontFamily: F.display, fontSize: 22, color: C.muted, marginTop: 8, lineHeight: 1.25 }}>{label}</div>
    </div>
  );
};

/** Fila de tarjetas abajo */
export const DataRow: React.FC<{ children: React.ReactNode; bottom?: number; left?: number }> = ({ children, bottom = 70, left = 90 }) => (
  <div style={{ position: "absolute", left, bottom, display: "flex", gap: 22, alignItems: "flex-end" }}>{children}</div>
);

/** Frase destacada centrada (aparece con fade) */
export const Caption: React.FC<{ text: string; start?: number; color?: string; size?: number; bottom?: number }> = ({ text, start = 0, color = C.text, size = 40, bottom = 90 }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [start, start + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom, textAlign: "center", opacity: op, fontFamily: F.display, fontWeight: 500, fontSize: size, color, textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}>
      {text}
    </div>
  );
};

/** Etiqueta mono pequeña con línea, para señalar cosas en los gráficos */
export const Tag: React.FC<{ x: number; y: number; text: string; color?: string; start?: number; align?: "left" | "right" }> = ({ x, y, text, color = C.cyan, start = 0, align = "left" }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [start, start + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: align === "left" ? x : undefined, right: align === "right" ? 1920 - x : undefined, top: y, opacity: op, fontFamily: F.mono, fontSize: 22, color, background: "rgba(4,6,13,0.7)", padding: "6px 12px", borderRadius: 8, border: `1px solid ${color}66`, whiteSpace: "nowrap" }}>
      {text}
    </div>
  );
};
