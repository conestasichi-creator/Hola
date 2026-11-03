import React from "react";
import { useCurrentFrame } from "remotion";

type Props = {
  text: string;
  startFrame?: number;
  charsPerFrame?: number;
  cursor?: boolean;
  style?: React.CSSProperties;
};

export const Typewriter: React.FC<Props> = ({ text, startFrame = 0, charsPerFrame = 0.8, cursor = true, style }) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor((frame - startFrame) * charsPerFrame)));
  const done = n >= text.length;
  const blink = Math.floor(frame / 8) % 2 === 0;
  if (frame < startFrame) return null;
  return (
    <span style={style}>
      {text.slice(0, n)}
      {cursor && (!done || blink) && <span style={{ opacity: done && !blink ? 0 : 1 }}>▌</span>}
    </span>
  );
};
