import React, { useMemo } from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../config";

export const Particles: React.FC<{ count?: number; color?: string }> = ({ count = 60, color = colors.cyan }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const ps = useMemo(
    () =>
      new Array(count).fill(0).map((_, i) => ({
        x: random(`px-${i}`) * width,
        y: random(`py-${i}`) * height,
        s: 2 + random(`ps-${i}`) * 4,
        vy: 0.3 + random(`pv-${i}`) * 1.2,
        ph: random(`pp-${i}`) * Math.PI * 2,
      })),
    [count, width, height],
  );
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {ps.map((p, i) => {
        const y = ((p.y - frame * p.vy) % height + height) % height;
        const x = p.x + Math.sin(frame / 30 + p.ph) * 20;
        const o = 0.3 + 0.5 * Math.abs(Math.sin(frame / 20 + p.ph));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: p.s,
              height: p.s,
              borderRadius: p.s,
              background: color,
              opacity: o,
              boxShadow: `0 0 ${p.s * 3}px ${color}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
