import React from "react";
import { Composition } from "remotion";
import { Promo, TOTAL } from "./Promo";

export const RemotionRoot: React.FC = () => (
  <>
    {/* Horizontal 16:9 — YouTube, web, presentaciones */}
    <Composition
      id="Promo"
      component={Promo}
      durationInFrames={TOTAL}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ withMusic: false }}
    />
    {/* Vertical 9:16 — Reels, TikTok, Shorts (misma escena, escalada) */}
    <Composition
      id="PromoVertical"
      component={Promo}
      durationInFrames={TOTAL}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{ withMusic: false }}
    />
  </>
);
