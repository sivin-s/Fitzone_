// eslint.config.mjs
import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default defineConfig(
  // Global ignores
  {
    ignores: ["dist/**", "node_modules/**"],
  },

  // Base JS recommended rules
  js.configs.recommended,

  // TypeScript recommended rules (syntactic only)
  ...tseslint.configs.recommended,

  // Type-aware linting (optional but recommended for catching real bugs)
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        projectService: true, // Enables type-aware rules using tsconfig.json
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Custom rules for your backend
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  // MUST be last — disables formatting rules that conflict with Prettier
  prettier
);