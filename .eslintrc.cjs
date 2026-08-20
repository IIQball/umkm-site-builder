module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  extends: [
    "eslint:recommended",
    "prettier",
  ],
  ignorePatterns: [
    "BuilderEditor.svelte",
    "ContentTab.svelte",
    "LayerPanel.svelte",
  ],
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
      ],
      plugins: ["@typescript-eslint"],
      rules: {
        "no-console": "warn",
        "@typescript-eslint/no-explicit-any": "warn",
      },
    },
    {
      files: ["*.astro"],
      parser: "astro-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
        sourceType: "module",
        extraFileExtensions: [".astro"],
      },
      extends: ["prettier"],
      rules: {
        "no-console": "warn",
      },
    },
    {
      files: ["*.svelte"],
      parser: "svelte-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
        sourceType: "module",
      },
      extends: ["prettier"],
      rules: {
        "no-console": "warn",
        "no-unused-vars": "off",
      },
    },
    {
      files: ["*.js", "*.jsx"],
      parser: "@babel/eslint-parser",
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      extends: ["eslint:recommended", "prettier"],
      rules: {
        "no-console": "warn",
      },
    },
  ],
};
