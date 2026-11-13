import React from "react";
import {
  AbsoluteFill,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors } from "./theme";

// Animated background: drifting aurora glows, a slowly turning light sweep,
// rising "serum" bubbles and twinkling sparkles. Rendered once behind the
// whole reel so the motion is continuous across scene cuts.

const orbs = [
  {
    color: colors.accent,
    size: 1100,
    x: 0.18,
    y: 0.2,
    ax: 260,
    ay: 160,
    speed: 0.011,
    phase: 0,
  },
  {
    color: colors.purple,
    size: 1000,
    x: 0.55,
    y: 0.55,
    ax: 320,
    ay: 200,
    speed: 0.008,
    phase: 2,
  },
  {
    color: colors.blue,
    size: 1150,
    x: 0.88,
    y: 0.8,
    ax: 240,
    ay: 180,
    speed: 0.01,
    phase: 4,
  },
  {
    color: "#ff7ac6",
    size: 700,
    x: 0.8,
    y: 0.12,
    ax: 200,
    ay: 120,
    speed: 0.013,
    phase: 1,
  },
];

const BUBBLES = 26;
const SPARKLES = 22;

export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, overflow: "hidden" }}>
      {/* Aurora orbs */}
      {orbs.map((o, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: o.size,
            height: o.size,
            left: o.x * width - o.size / 2,
            top: o.y * height - o.size / 2,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${o.color}66, ${o.color}00 62%)`,
            mixBlendMode: "screen",
            translate: `${Math.sin(frame * o.speed + o.phase) * o.ax}px ${Math.cos(frame * o.speed * 1.3 + o.phase) * o.ay}px`,
            scale: 1 + Math.sin(frame * o.speed * 2 + o.phase) * 0.12,
          }}
        />
      ))}

      {/* Rotating conic light sweep */}
      <div
        style={{
          position: "absolute",
          width: 2600,
          height: 2600,
          left: -1300 - 150,
          top: -1300 - 150,
          background: `conic-gradient(from 0deg, transparent 0deg, ${colors.accent}1f 40deg, transparent 90deg, ${colors.blue}1f 200deg, transparent 260deg, ${colors.purple}24 320deg, transparent 360deg)`,
          rotate: `${frame * 0.12}deg`,
          mixBlendMode: "screen",
        }}
      />

      {/* Rising serum bubbles */}
      {new Array(BUBBLES).fill(0).map((_, i) => {
        const size = 14 + random(`b-size-${i}`) * 70;
        const speed = 0.6 + random(`b-speed-${i}`) * 1.6;
        const travel = height + size * 2;
        const y =
          height +
          size -
          ((random(`b-y-${i}`) * travel + frame * speed) % travel);
        const x = random(`b-x-${i}`) * width + Math.sin(frame / 30 + i) * 24;
        const tint = [colors.accent, colors.purple, colors.blue][i % 3];
        return (
          <div
            key={`b${i}`}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: `radial-gradient(circle at 32% 30%, #ffffffcc, ${tint}55 28%, ${tint}14 62%, transparent 72%)`,
              boxShadow: `inset 0 0 ${size / 4}px ${tint}55, 0 0 ${size / 2}px ${tint}33`,
              opacity: 0.35 + random(`b-o-${i}`) * 0.45,
            }}
          />
        );
      })}

      {/* Twinkling sparkles */}
      {new Array(SPARKLES).fill(0).map((_, i) => {
        const twinkle = Math.max(
          0,
          Math.sin(frame / 9 + random(`s-p-${i}`) * 20),
        );
        const size = 18 + random(`s-size-${i}`) * 26;
        return (
          <div
            key={`s${i}`}
            style={{
              position: "absolute",
              left: random(`s-x-${i}`) * width,
              top: random(`s-y-${i}`) * height,
              fontSize: size,
              lineHeight: 1,
              color: "#fff",
              opacity: twinkle * 0.8,
              scale: 0.5 + twinkle * 0.6,
              rotate: `${frame * 1.5 + i * 30}deg`,
              textShadow: `0 0 12px ${colors.accent}, 0 0 24px ${colors.blue}`,
            }}
          >
            ✦
          </div>
        );
      })}

      {/* Vignette keeps text readable */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, transparent 35%, ${colors.bg}cc 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
