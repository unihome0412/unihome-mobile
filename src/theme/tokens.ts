import { Platform } from "react-native";

/**
 * Tokens de diseño extraídos fielmente de la maqueta vigente (index.css y App.tsx)
 * Regla CM-16 y FT-05: Respetar colores, radios, sombras y tipografía de la maqueta.
 */
export const colors = {
  ink: "#0f172a",
  inkSoft: "#334155",
  slate700: "#334155",
  slate600: "#475569",
  slate500: "#64748b",
  slate: "#64748b",
  slate400: "#94a3b8",
  muted: "#94a3b8",
  slate200: "#e2e8f0",
  slate100: "#f1f5f9",
  slate50: "#f8fafc",
  line: "#e7edf3",
  soft: "#f8fafc",
  paper: "#ffffff",
  warmBg: "#fbf7f2",
  coral: "#f07666",
  coralDark: "#d9544a",
  coralDeep: "#b54138",
  coralHover: "#c7473e",
  coralSoft: "#fff0ed",
  coralBadgeBg: "#fdecea",
  mint: "#70b0a6",
  mintDark: "#285e55",
  mintIcon: "#397b70",
  mintSoft: "#e5f4f1",
  gold: "#e9bc56",
  goldDark: "#77560c",
  goldSoft: "#fff7df",
  danger: "#b54138",
  white: "#ffffff",
  canvasBg: "#eaf0ef",
} as const;

export const fonts = {
  display: Platform.select({ android: "sans-serif-medium", default: "System" }),
  sans: Platform.select({ android: "sans-serif", default: "System" }),
} as const;
