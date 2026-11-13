import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors } from "./theme";

// Slowly drifting gradient glows behind every scene.
export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          left: -300,
          top: -400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.accent}55, transparent 65%)`,
          translate: `${interpolate(frame, [0, 450], [0, 260])}px ${interpolate(frame, [0, 450], [0, 120])}px`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1200,
          height: 1200,
          right: -400,
          bottom: -500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.blue}44, transparent 65%)`,
          translate: `${interpolate(frame, [0, 450], [0, -220])}px ${interpolate(frame, [0, 450], [0, -100])}px`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          left: 600,
          top: 200,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.purple}2e, transparent 65%)`,
        }}
      />
    </AbsoluteFill>
  );
};
