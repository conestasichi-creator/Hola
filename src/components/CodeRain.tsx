import React, { useMemo } from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../config";

const CHARS = "01<>/{}[]();=+-*$#@%&λπΣ∂ABCDEF789";

type Props = { opacity?: number; columns?: number; color?: string };

export const CodeRain: React.FC<Props> = ({ opacity = 0.35, columns = 48, color = colors.green }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const colW = width / columns;
  const fontSize = Math.round(colW * 0.75);
  const rows = Math.ceil(height / fontSize) + 2;

  const cols = useMemo(
    () =>
      new Array(columns).fill(0).map((_, i) => ({
        speed: 0.25 + random(`speed-${i}`) * 0.6,
        offset: random(`off-${i}`) * rows,
        len: 6 + Math.floor(random(`len-${i}`) * 14),
        seed: random(`seed-${i}`) * 1000,
      })),
    [columns, rows],
  );

  return (
    <AbsoluteFill style={{ opacity, overflow: "hidden", fontFamily: fonts.mono, fontSize }}>
      {cols.map((c, i) => {
        const head = (c.offset + frame * c.speed) % (rows + c.len);
        return (
          <div key={i} style={{ position: "absolute", left: i * colW, top: 0, width: colW, textAlign: "center" }}>
            {new Array(rows).fill(0).map((_, r) => {
              const dist = head - r;
              if (dist < 0 || dist > c.len) return <div key={r} style={{ height: fontSize }} />;
              const a = 1 - dist / c.len;
              const ch = CHARS[Math.floor(random(`ch-${i}-${r}-${Math.floor(frame / 4 + c.seed)}`) * CHARS.length)];
              return (
                <div
                  key={r}
                  style={{
                    height: fontSize,
                    lineHeight: `${fontSize}px`,
                    color: dist < 1 ? "#ffffff" : color,
                    opacity: a,
                    textShadow: dist < 1 ? `0 0 12px ${color}` : "none",
                  }}
                >
                  {ch}
                </div>
              );
            })}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
