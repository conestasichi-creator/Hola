import React from "react";
import { random, useCurrentFrame } from "remotion";
import { colors } from "../config";

type Props = {
  text: string;
  style?: React.CSSProperties;
  intensity?: number; // 0..1
  accent?: string;
};

export const GlitchText: React.FC<Props> = ({ text, style, intensity = 0.6, accent }) => {
  const frame = useCurrentFrame();
  const burst = random(`burst-${Math.floor(frame / 3)}`) < intensity * 0.5;
  const dx = burst ? (random(`dx-${frame}`) - 0.5) * 24 * intensity : 0;
  const dy = burst ? (random(`dy-${frame}`) - 0.5) * 8 * intensity : 0;
  const slice1 = random(`s1-${frame}`) * 100;
  const slice2 = random(`s2-${frame}`) * 100;

  const base: React.CSSProperties = { position: "relative", display: "inline-block", ...style };
  const layer = (color: string, x: number, y: number, clip: string): React.CSSProperties => ({
    ...style,
    position: "absolute",
    left: 0,
    top: 0,
    color,
    transform: `translate(${x}px, ${y}px)`,
    clipPath: clip,
    mixBlendMode: "screen",
    pointerEvents: "none",
  });

  return (
    <span style={base}>
      <span style={{ ...style, position: "relative" }}>{text}</span>
      {burst && (
        <>
          <span style={layer(accent ?? colors.cyan, -dx, dy, `inset(${slice1}% 0 ${100 - slice1 - 12}% 0)`)}>{text}</span>
          <span style={layer(colors.magenta, dx, -dy, `inset(${slice2}% 0 ${100 - slice2 - 8}% 0)`)}>{text}</span>
        </>
      )}
    </span>
  );
};
