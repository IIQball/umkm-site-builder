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
        "no-console": ["warn", { "allow": ["warn", "error"] }],
        "@typescript-eslint/no-explicit-any": "error",
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
        "no-console": ["warn", { "allow": ["warn", "error"] }],
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
        "no-console": ["warn", { "allow": ["warn", "error"] }],
        "no-unused-vars": "off",
        "no-inner-declarations": "off",
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
        "no-console": ["warn", { "allow": ["warn", "error"] }],
      },
    },
  ],
};
