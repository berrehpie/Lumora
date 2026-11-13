import React from "react";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Backdrop } from "./Backdrop";
import { Bottle } from "./Bottle";
import { colors, grad, sans, serif } from "./theme";

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const OfferScene: React.FC<{ withBackdrop?: boolean }> = ({
  withBackdrop = true,
}) => {
  const frame = useCurrentFrame();
  const set = [
    { shape: "tube", color: "#e9d8c8", size: 340, y: 0 },
    { shape: "dropper", color: "#d6e2f0", size: 420, y: -40 },
    { shape: "tube", color: "#f6e7c1", size: 340, y: 0 },
  ] as const;

  return (
    <AbsoluteFill name="Offer">
      {withBackdrop && <Backdrop />}
      <AbsoluteFill
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: "0 160px",
          gap: 40,
        }}
      >
        <div
          style={{
            width: 920,
            flexShrink: 0,
            whiteSpace: "nowrap",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <Interactive.Div
            name="Tag"
            style={{
              fontFamily: sans,
              fontWeight: 600,
              fontSize: 40,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: colors.accent,
              opacity: interpolate(frame, [0, 16], [0, 1], {
                ...clamp,
                easing: ease,
              }),
            }}
          >
            New · Bundle &amp; save
          </Interactive.Div>
          <Interactive.Div
            name="Title"
            style={{
              fontFamily: serif,
              fontWeight: 600,
              fontSize: 150,
              lineHeight: 1.02,
              color: colors.ink,
              opacity: interpolate(frame, [4, 24], [0, 1], {
                ...clamp,
                easing: ease,
              }),
              translate: `${interpolate(frame, [4, 30], [-80, 0], { ...clamp, easing: ease })}px 0px`,
            }}
          >
            The Daily
            <br />
            Glow Set
          </Interactive.Div>
          <Interactive.Div
            name="Contents"
            style={{
              fontFamily: sans,
              fontSize: 48,
              color: colors.muted,
              opacity: interpolate(frame, [14, 32], [0, 1], {
                ...clamp,
                easing: ease,
              }),
            }}
          >
            Cleanser · Serum · SPF 50
          </Interactive.Div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 32,
              marginTop: 20,
            }}
          >
            <Interactive.Div
              name="Price"
              style={{
                fontFamily: serif,
                fontWeight: 600,
                fontSize: 170,
                lineHeight: 1,
                backgroundImage: grad,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                opacity: interpolate(frame, [34, 48], [0, 1], clamp),
                scale: interpolate(frame, [34, 56], [0.6, 1], {
                  ...clamp,
                  easing: Easing.spring({ damping: 12 }),
                  output: "perceptual-scale",
                }),
                transformOrigin: "left bottom",
              }}
            >
              FJ$79
            </Interactive.Div>
            <Interactive.Div
              name="Was"
              style={{
                position: "relative",
                fontFamily: serif,
                fontSize: 90,
                color: colors.muted,
                opacity: interpolate(frame, [26, 38], [0, 1], clamp),
              }}
            >
              FJ$92
              <div
                style={{
                  position: "absolute",
                  left: -6,
                  top: "52%",
                  height: 6,
                  borderRadius: 3,
                  background: colors.accent,
                  width: `${interpolate(frame, [30, 42], [0, 110], { ...clamp, easing: ease })}%`,
                }}
              />
            </Interactive.Div>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          {set.map((b, i) => {
            const start = 8 + i * 7;
            return (
              <div
                key={i}
                style={{
                  marginLeft: i ? -150 : 0,
                  opacity: interpolate(
                    frame,
                    [start, start + 14],
                    [0, 1],
                    clamp,
                  ),
                  translate: `0px ${interpolate(frame, [start, start + 30], [300, b.y], { ...clamp, easing: Easing.spring({ damping: 14 }) }) + Math.sin((frame + i * 20) / 16) * 8}px`,
                }}
              >
                <Bottle
                  shape={b.shape}
                  color={b.color}
                  size={b.size}
                  style={{
                    filter: `drop-shadow(0 40px 50px ${colors.purple}44)`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
