import { fonts } from "../config";

export const C = {
  bg: "#04060d",
  bg2: "#0b1020",
  cyan: "#4cc9f0",
  blue: "#3a86ff",
  gold: "#ffc857",
  orange: "#ff7b3d",
  red: "#ff4d6d",
  green: "#52d273",
  text: "#eef2ff",
  muted: "#8d97ad",
};
export const F = fonts;

// 12742 -> "12.742" (formato español)
export const fmt = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
