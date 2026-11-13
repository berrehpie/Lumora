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

const perks = [
  { icon: "📍", text: "Free pickup · Laucala Beach" },
  { icon: "📦", text: "$5 flat-rate postage" },
];

export const CtaScene: React.FC<{ withBackdrop?: boolean }> = ({
  withBackdrop = true,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="CTA">
      {withBackdrop && <Backdrop />}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 44,
        }}
      >
        <Interactive.Div
          name="Headline"
          style={{
            fontFamily: serif,
            fontWeight: 600,
            fontSize: 136,
            lineHeight: 1.05,
            textAlign: "center",
            color: colors.ink,
            opacity: interpolate(frame, [0, 18], [0, 1], {
              ...clamp,
              easing: ease,
            }),
            translate: `0px ${interpolate(frame, [0, 24], [40, 0], { ...clamp, easing: ease })}px`,
          }}
        >
          Calmer, happier skin
          <br />
          starts today.
        </Interactive.Div>

        <div style={{ display: "flex", gap: 28 }}>
          {perks.map((p, i) => {
            const start = 14 + i * 8;
            return (
              <div
                key={p.text}
                style={{
                  fontFamily: sans,
                  fontWeight: 500,
                  fontSize: 44,
                  color: colors.ink,
                  padding: "18px 38px",
                  borderRadius: 999,
                  border: `2px solid ${colors.line}`,
                  background: `${colors.surface}cc`,
                  opacity: interpolate(frame, [start, start + 14], [0, 1], {
                    ...clamp,
                    easing: ease,
                  }),
                  translate: `0px ${interpolate(frame, [start, start + 20], [30, 0], { ...clamp, easing: ease })}px`,
                }}
              >
                {p.icon} {p.text}
              </div>
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 56,
            marginTop: 20,
          }}
        >
          <Interactive.Div
            name="Logo"
            style={{
              fontFamily: serif,
              fontWeight: 600,
              fontSize: 84,
              letterSpacing: "0.14em",
              color: colors.ink,
              opacity: interpolate(frame, [30, 46], [0, 1], {
                ...clamp,
                easing: ease,
              }),
            }}
          >
            LUMORA{" "}
            <span style={{ fontWeight: 500, color: colors.accent }}>SKIN</span>
          </Interactive.Div>
          <Interactive.Div
            name="Button"
            style={{
              fontFamily: sans,
              fontWeight: 600,
              fontSize: 48,
              color: "#fff",
              padding: "24px 64px",
              borderRadius: 999,
              backgroundImage: grad,
              boxShadow: `0 20px 60px ${colors.accent}55`,
              opacity: interpolate(frame, [36, 48], [0, 1], clamp),
              scale: interpolate(frame, [36, 58, 70, 78], [0.7, 1, 1, 1.06], {
                ...clamp,
                easing: [
                  Easing.spring({ damping: 12 }),
                  Easing.linear,
                  Easing.inOut(Easing.ease),
                ],
                output: "perceptual-scale",
              }),
            }}
          >
            Shop now →
          </Interactive.Div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
