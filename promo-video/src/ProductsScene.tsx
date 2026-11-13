import React from "react";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Backdrop } from "./Backdrop";
import { Bottle, BottleShape } from "./Bottle";
import { colors, grad, sans, serif } from "./theme";

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// A selection of the catalog in products.js
const lineup: { name: string; shape: BottleShape; color: string }[] = [
  { name: "Cleanser", shape: "tube", color: "#e9d8c8" },
  { name: "Hyaluronic Serum", shape: "dropper", color: "#d6e2f0" },
  { name: "Moisturizer", shape: "jar", color: "#f0e2d6" },
  { name: "Vitamin C Serum", shape: "dropper", color: "#f3dcb5" },
  { name: "Retinal", shape: "pump", color: "#dcd2e8" },
];

const badges = ["Cruelty-free", "Vegan", "Fragrance-free"];

export const ProductsScene: React.FC<{ withBackdrop?: boolean }> = ({
  withBackdrop = true,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Products">
      {withBackdrop && <Backdrop />}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 30,
        }}
      >
        <Interactive.Div
          name="Headline"
          style={{
            fontFamily: serif,
            fontWeight: 600,
            fontSize: 132,
            color: colors.ink,
            opacity: interpolate(frame, [0, 20], [0, 1], {
              ...clamp,
              easing: ease,
            }),
            translate: `0px ${interpolate(frame, [0, 24], [40, 0], { ...clamp, easing: ease })}px`,
          }}
        >
          Less, but better.
        </Interactive.Div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            gap: 0,
            height: 400,
          }}
        >
          {lineup.map((p, i) => {
            const start = 10 + i * 6;
            const float = Math.sin((frame + i * 17) / 14) * 8;
            return (
              <div
                key={p.name}
                style={{
                  marginLeft: i ? -70 : 0,
                  opacity: interpolate(
                    frame,
                    [start, start + 16],
                    [0, 1],
                    clamp,
                  ),
                  translate: `0px ${interpolate(frame, [start, start + 28], [260, 0], { ...clamp, easing: Easing.spring({ damping: 14 }) }) + float}px`,
                  rotate: `${interpolate(frame, [start, start + 28], [i % 2 ? 8 : -8, 0], { ...clamp, easing: ease })}deg`,
                }}
              >
                <Bottle
                  shape={p.shape}
                  color={p.color}
                  size={i === 2 ? 380 : 320}
                  style={{
                    filter: `drop-shadow(0 30px 40px ${colors.accent}33)`,
                  }}
                />
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 28 }}>
          {badges.map((b, i) => {
            const start = 52 + i * 8;
            return (
              <div
                key={b}
                style={{
                  fontFamily: sans,
                  fontWeight: 500,
                  fontSize: 46,
                  color: colors.ink,
                  padding: "18px 40px",
                  borderRadius: 999,
                  border: `2px solid ${colors.line}`,
                  background: `${colors.surface}cc`,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  opacity: interpolate(frame, [start, start + 14], [0, 1], {
                    ...clamp,
                    easing: ease,
                  }),
                  scale: interpolate(frame, [start, start + 18], [0.8, 1], {
                    ...clamp,
                    easing: ease,
                  }),
                }}
              >
                <span
                  style={{
                    backgroundImage: grad,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    fontWeight: 600,
                  }}
                >
                  ✓
                </span>
                {b}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
