import { defineConfig } from "eslint/config";
import expoConfig from "eslint-config-expo/flat.js";

export default defineConfig([
  {
    ignores: ["android/**", "coverage/**", "dist/**", "node_modules/**", "scripts/**"],
  },
  expoConfig,
  {
    rules: {
      // Las comillas rectas son contenido visible validado por diseño; no se reescribe la UI.
      "react/no-unescaped-entities": "off",
    },
  },
]);
