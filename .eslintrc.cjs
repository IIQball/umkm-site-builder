module.exports = {
  root: true,
  // Build output and generated files are not ours to lint. `bun run lint` only targets
  // `src tests` so the CLI never saw them, but editor ESLint integrations lint whatever
  // file you open — without this, opening a bundled chunk in dist/ reports dozens of
  // errors from minified vendor code.
  ignorePatterns: [
    "dist/",
    "node_modules/",
    ".astro/",
    ".wrangler/",
    "coverage/",
    "drizzle/",
  ],
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
