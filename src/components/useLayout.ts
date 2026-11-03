import { useVideoConfig } from "remotion";

// Devuelve true si la composición es vertical (9:16) para adaptar el layout
export const useLayout = () => {
  const { width, height } = useVideoConfig();
  return { vertical: height > width, width, height };
};
