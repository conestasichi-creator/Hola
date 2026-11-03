import React from "react";
import { useCurrentFrame } from "remotion";
import { colors, fonts } from "../config";
import { Typewriter } from "./Typewriter";

type Props = { lines: string[]; startFrame?: number; width?: number; fontSize?: number; title?: string };

export const Terminal: React.FC<Props> = ({ lines, startFrame = 0, width = 1100, fontSize = 30, title = "bash — freshidev" }) => {
  const frame = useCurrentFrame();
  const cps = 1.1;
  const gap = 10;
  let cursor = startFrame;
  const starts = lines.map((l) => {
    const s = cursor;
    cursor += l.length / cps + gap;
    return s;
  });
  const lineColor = (l: string) =>
    l.startsWith("$") ? colors.text : l.startsWith("✔") ? colors.green : l.startsWith(">") ? colors.cyan : colors.muted;

  return (
    <div
      style={{
        width,
        borderRadius: 14,
        overflow: "hidden",
        background: "rgba(10,14,22,0.92)",
        border: `1px solid rgba(0,229,255,0.35)`,
        boxShadow: `0 0 40px rgba(0,229,255,0.25), 0 30px 80px rgba(0,0,0,0.6)`,
        fontFamily: fonts.mono,
      }}
    >
      <div style={{ height: 46, background: "#161c27", display: "flex", alignItems: "center", padding: "0 18px", gap: 10 }}>
        {["#ff5f56", "#ffbd2e", "#27c93f"].map((c) => (
          <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />
        ))}
        <div style={{ flex: 1, textAlign: "center", color: colors.muted, fontSize: 18, marginRight: 60 }}>{title}</div>
      </div>
      <div style={{ padding: "28px 34px", fontSize, lineHeight: 1.6, minHeight: lines.length * fontSize * 1.6 + 56 }}>
        {lines.map((l, i) => (
          <div key={i} style={{ color: lineColor(l), whiteSpace: "pre" }}>
            {frame >= starts[i] && (
              <Typewriter text={l} startFrame={starts[i]} charsPerFrame={cps} cursor={i === lines.length - 1 || frame < (starts[i + 1] ?? Infinity)} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
