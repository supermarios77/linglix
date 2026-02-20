import { nextJsConfig } from "@workspace/eslint-config/next-js"

export default [
  {
    ignores: [".next/**", "node_modules/**", "dist/**"],
  },
  ...nextJsConfig,
  {
    languageOptions: {
      globals: {
        process: "readonly",
      },
    },
  },
]
