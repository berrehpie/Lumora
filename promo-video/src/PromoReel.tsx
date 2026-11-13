import React from "react";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { IntroScene } from "./IntroScene";
import { TaglineScene } from "./TaglineScene";
import { ProductsScene } from "./ProductsScene";
import { OfferScene } from "./OfferScene";
import { CtaScene } from "./CtaScene";

// 90 + 105 + 120 + 105 + 90 = 510 frames, minus 4 × 15-frame transitions = 450 frames (15 s @ 30 fps)
export const PromoReel: React.FC = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence name="Intro" durationInFrames={90}>
      <IntroScene />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
    <TransitionSeries.Sequence name="Tagline" durationInFrames={105}>
      <TaglineScene />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
    <TransitionSeries.Sequence name="Products" durationInFrames={120}>
      <ProductsScene />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={linearTiming({ durationInFrames: 15 })} />
    <TransitionSeries.Sequence name="Offer" durationInFrames={105}>
      <OfferScene />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
    <TransitionSeries.Sequence name="CTA" durationInFrames={90}>
      <CtaScene />
    </TransitionSeries.Sequence>
  </TransitionSeries>
);
