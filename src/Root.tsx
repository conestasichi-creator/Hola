import React from "react";
import { Composition } from "remotion";
import { Promo, TOTAL } from "./Promo";
import { Cosmos, COSMOS_TOTAL } from "./cosmos/Cosmos";

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
      defaultProps={{ withMusic: true, withVoice: true }}
    />
    {/* Vertical 9:16 — Reels, TikTok, Shorts (misma escena, escalada) */}
    <Composition
      id="PromoVertical"
      component={Promo}
      durationInFrames={TOTAL}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{ withMusic: true, withVoice: true }}
    />
    {/* Explainer: ¿Qué es el tiempo? — de la rotación de la Tierra al universo observable */}
    <Composition
      id="Cosmos"
      component={Cosmos}
      durationInFrames={COSMOS_TOTAL}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ withMusic: true, withVoice: true }}
    />
  </>
);
