import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fonts are self-hosted in public/fonts (OFL-licensed, from Fontsource) so
// renders don't depend on Google Fonts being reachable.
const faces: [string, string, string, string][] = [
  ["Cormorant Garamond", "500", "normal", "cormorant-garamond-latin-500-normal"],
  ["Cormorant Garamond", "600", "normal", "cormorant-garamond-latin-600-normal"],
  ["Cormorant Garamond", "600", "italic", "cormorant-garamond-latin-600-italic"],
  ["Inter", "400", "normal", "inter-latin-400-normal"],
  ["Inter", "500", "normal", "inter-latin-500-normal"],
  ["Inter", "600", "normal", "inter-latin-600-normal"],
];
for (const [family, weight, style, file] of faces) {
  loadFont({ family, weight, style, url: staticFile(`fonts/${file}.woff2`) });
}

// Mirrors the CSS variables in ../styles.css so the reel matches the website.
export const serif = '"Cormorant Garamond", Georgia, serif';
export const serifItalic = serif;
export const sans = '"Inter", system-ui, sans-serif';

export const colors = {
  bg: "#08080c",
  surface: "#13131b",
  ink: "#f6f6fa",
  muted: "#a6a6ba",
  accent: "#ff4fa3",
  purple: "#b25cff",
  blue: "#4d9fff",
  line: "#2a2a3a",
};

export const grad = `linear-gradient(120deg, ${colors.accent}, ${colors.purple} 50%, ${colors.blue})`;

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
