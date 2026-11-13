import React from "react";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Backdrop } from "./Backdrop";
import { colors, grad, sans, serif } from "./theme";

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const IntroScene: React.FC<{ withBackdrop?: boolean }> = ({
  withBackdrop = true,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Intro">
      {withBackdrop && <Backdrop />}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 36,
        }}
      >
        <Interactive.Div
          name="Logo"
          style={{
            fontFamily: serif,
            fontWeight: 600,
            fontSize: 210,
            color: colors.ink,
            whiteSpace: "nowrap",
            letterSpacing: `${interpolate(frame, [0, 50], [0.5, 0.14], { ...clamp, easing: ease })}em`,
            opacity: interpolate(frame, [0, 24], [0, 1], {
              ...clamp,
              easing: ease,
            }),
            filter: `blur(${interpolate(frame, [0, 30], [18, 0], { ...clamp, easing: ease })}px)`,
          }}
        >
          LUMORA{" "}
          <span
            style={{
              fontWeight: 500,
              backgroundImage: grad,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            SKIN
          </span>
        </Interactive.Div>
        <Interactive.Div
          name="Underline"
          style={{
            height: 4,
            borderRadius: 2,
            backgroundImage: grad,
            width: interpolate(frame, [20, 55], [0, 720], {
              ...clamp,
              easing: ease,
            }),
          }}
        />
        <Interactive.Div
          name="Eyebrow"
          style={{
            fontFamily: sans,
            fontWeight: 600,
            fontSize: 44,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: colors.muted,
            opacity: interpolate(frame, [38, 60], [0, 1], {
              ...clamp,
              easing: ease,
            }),
            translate: `0px ${interpolate(frame, [38, 60], [24, 0], { ...clamp, easing: ease })}px`,
          }}
        >
          Clean, gentle skincare
        </Interactive.Div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
