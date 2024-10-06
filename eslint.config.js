import globals from "globals";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import pluginReact from "eslint-plugin-react";


export default [
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  {languageOptions: {
    globals: {
      ...globals.browser,
      process: true,
    },
  }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {settings: {react: {version: "detect"}}},
  {ignores: [".next/*", "*.cjs", "tailwind.config.ts", "*/components/ui/*"]},
  {rules:
    {
      "react/react-in-jsx-scope": "off",
    },
  },
];
