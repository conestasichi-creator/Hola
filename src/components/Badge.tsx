import React from "react";
import { colors, fonts } from "../config";

export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = colors.green }) => (
  <span
    style={{
      fontFamily: fonts.mono,
      fontSize: 22,
      color,
      border: `1px solid ${color}`,
      padding: "6px 16px",
      borderRadius: 999,
      letterSpacing: 2,
      textTransform: "uppercase",
      boxShadow: `0 0 18px ${color}55, inset 0 0 12px ${color}22`,
      background: "rgba(0,0,0,0.35)",
    }}
  >
    {children}
  </span>
);
