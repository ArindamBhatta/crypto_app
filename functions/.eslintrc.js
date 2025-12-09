module.exports = {
  root: true,
  env: {
    es2017: true,
    node: true,
  },
  extends: ["eslint:recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    quotes: ["error", "double"],
    "no-unused-vars": "off",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files
  ],
};
