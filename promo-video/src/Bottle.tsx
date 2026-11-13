import React from "react";

export type BottleShape = "tube" | "pump" | "dropper" | "jar";

// Same product illustrations the website draws in app.js (bottleSVG).
export const Bottle: React.FC<{
  shape: BottleShape;
  color: string;
  size: number;
  style?: React.CSSProperties;
}> = ({ shape, color, size, style }) => {
  const cap = "#3b3330";
  const shapes: Record<BottleShape, React.ReactNode> = {
    tube: (
      <>
        <rect x="70" y="40" width="60" height="120" rx="14" fill={color} />
        <rect x="82" y="160" width="36" height="22" rx="4" fill={cap} />
      </>
    ),
    pump: (
      <>
        <rect x="68" y="70" width="64" height="112" rx="16" fill={color} />
        <rect x="88" y="48" width="24" height="22" fill={cap} />
        <rect x="88" y="40" width="40" height="10" rx="4" fill={cap} />
      </>
    ),
    dropper: (
      <>
        <rect x="72" y="80" width="56" height="100" rx="12" fill={color} />
        <rect x="84" y="58" width="32" height="22" rx="4" fill={cap} />
        <rect x="92" y="28" width="16" height="32" rx="8" fill={cap} />
      </>
    ),
    jar: (
      <>
        <rect x="58" y="98" width="84" height="74" rx="14" fill={color} />
        <rect x="54" y="80" width="92" height="24" rx="8" fill={cap} />
      </>
    ),
  };
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      style={{ overflow: "visible", ...style }}
    >
      <ellipse cx="100" cy="188" rx="60" ry="6" fill="#000" opacity=".35" />
      {shapes[shape]}
      <text
        x="100"
        y={shape === "jar" ? 140 : 125}
        textAnchor="middle"
        fontFamily="Cormorant Garamond, serif"
        fontSize="12"
        fill={cap}
        opacity=".75"
        letterSpacing="1"
      >
        LUMORA
      </text>
    </svg>
  );
};
