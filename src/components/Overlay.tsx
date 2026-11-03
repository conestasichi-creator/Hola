import React from "react";
import { AbsoluteFill } from "remotion";

// Scanlines + viñeta estilo monitor CRT
export const Overlay: React.FC = () => (
  <>
    <AbsoluteFill
      style={{
        backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 2px, transparent 2px, transparent 4px)",
        pointerEvents: "none",
      }}
    />
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.75) 100%)",
        pointerEvents: "none",
      }}
    />
  </>
);
