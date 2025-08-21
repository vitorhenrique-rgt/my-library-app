// eslint.config.js
import eslintPluginImport from "eslint-plugin-import";
import globals from "globals";

export default [
  {
    ignores: ["node_modules", "dist", "build"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node, // Ambiente Node.js
      },
    },

    plugins: {
      import: eslintPluginImport,
    },

    rules: {
      // Regras básicas
      "no-unused-vars": "warn",
      "no-console": "off",

      // Importações
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
        },
      ],
      "import/no-duplicates": "error",

      // Estilo de código (deixe o Prettier cuidar do resto)
      semi: false,
      quotes: ["error", "single"],
    },
  },

  // Se tiver TypeScript
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn"],
    },
  },
];
