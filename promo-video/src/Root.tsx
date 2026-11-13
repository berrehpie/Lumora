import React from "react";
import { Composition, Folder } from "remotion";
import { PromoReel } from "./PromoReel";
import { IntroScene } from "./IntroScene";
import { TaglineScene } from "./TaglineScene";
import { ProductsScene } from "./ProductsScene";
import { OfferScene } from "./OfferScene";
import { CtaScene } from "./CtaScene";
import { FPS, HEIGHT, WIDTH } from "./theme";

const base = { fps: FPS, width: WIDTH, height: HEIGHT };

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="PromoReel"
      component={PromoReel}
      durationInFrames={450}
      {...base}
    />
    <Folder name="PromoReel-Scenes">
      <Composition
        id="Intro"
        component={IntroScene}
        durationInFrames={90}
        {...base}
      />
      <Composition
        id="Tagline"
        component={TaglineScene}
        durationInFrames={105}
        {...base}
      />
      <Composition
        id="Products"
        component={ProductsScene}
        durationInFrames={120}
        {...base}
      />
      <Composition
        id="Offer"
        component={OfferScene}
        durationInFrames={105}
        {...base}
      />
      <Composition
        id="CTA"
        component={CtaScene}
        durationInFrames={90}
        {...base}
      />
    </Folder>
  </>
);
