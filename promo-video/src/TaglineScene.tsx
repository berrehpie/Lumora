import React from "react";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Backdrop } from "./Backdrop";
import { colors, serif, serifItalic } from "./theme";

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const TaglineScene: React.FC<{ withBackdrop?: boolean }> = ({
  withBackdrop = true,
}) => {
  const frame = useCurrentFrame();
  const line: React.CSSProperties = {
    fontFamily: serif,
    fontWeight: 600,
    fontSize: 168,
    lineHeight: 1.08,
    color: colors.ink,
    textAlign: "center",
  };
  return (
    <AbsoluteFill name="Tagline">
      {withBackdrop && <Backdrop />}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: "0 160px",
        }}
      >
        <Interactive.Div
          name="Line 1"
          style={{
            ...line,
            opacity: interpolate(frame, [4, 26], [0, 1], {
              ...clamp,
              easing: ease,
            }),
            translate: `0px ${interpolate(frame, [4, 30], [60, 0], { ...clamp, easing: ease })}px`,
          }}
        >
          Every Skin
        </Interactive.Div>
        <Interactive.Div
          name="Line 2"
          style={{
            ...line,
            opacity: interpolate(frame, [18, 40], [0, 1], {
              ...clamp,
              easing: ease,
            }),
            translate: `0px ${interpolate(frame, [18, 44], [60, 0], { ...clamp, easing: ease })}px`,
          }}
        >
          Deserves a Little
        </Interactive.Div>
        <Interactive.Div
          name="Line 3"
          style={{
            ...line,
            fontFamily: serifItalic,
            fontStyle: "italic",
            color: colors.accent,
            textShadow: `0 0 60px ${colors.accent}66`,
            opacity: interpolate(frame, [34, 56], [0, 1], {
              ...clamp,
              easing: ease,
            }),
            translate: `0px ${interpolate(frame, [34, 60], [60, 0], { ...clamp, easing: ease })}px`,
          }}
        >
          Love
        </Interactive.Div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
