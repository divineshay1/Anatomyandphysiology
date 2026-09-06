import js from "@eslint/js";
import tseslint from "typescript-eslint";

// next/core-web-vitals currently crashes under this repo's pinned
// eslint-config-next + eslint-plugin-react versions (a circular-JSON error
// inside @eslint/eslintrc's FlatCompat bridge) — a known upstream
// incompatibility, not something specific to this project's code. Using
// typescript-eslint's own native flat config avoids that broken bridge
// entirely while still giving real TS/JS lint coverage.
export default [
  { ignores: [".next/**", "out/**", "node_modules/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
];
