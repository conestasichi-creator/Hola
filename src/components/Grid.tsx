import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors } from "../config";

export const Grid: React.FC<{ color?: string; opacity?: number }> = ({ color = colors.cyan, opacity = 0.25 }) => {
  const frame = useCurrentFrame();
  const shift = (frame * 3) % 80;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity }}>
      <div
        style={{
          position: "absolute",
          left: "-50%",
          width: "200%",
          top: "55%",
          height: "100%",
          transform: "perspective(600px) rotateX(62deg)",
          transformOrigin: "top center",
          backgroundImage: `linear-gradient(${color} 2px, transparent 2px), linear-gradient(90deg, ${color} 2px, transparent 2px)`,
          backgroundSize: "80px 80px",
          backgroundPosition: `0 ${shift}px, 0 0`,
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))",
        }}
      />
    </AbsoluteFill>
  );
};
