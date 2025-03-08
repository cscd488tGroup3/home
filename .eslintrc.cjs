module.exports = {
    extends: ["eslint:recommended", "plugin:astro/recommended", "plugin:prettier/recommended"],
    overrides: [
      {
        files: ["*.astro"],
        parser: "astro-eslint-parser",
        parserOptions: {
          parser: "@typescript-eslint/parser",
          extraFileExtensions: [".astro"]
        },
        rules: {
          "prettier/prettier": "error"
        }
      }
    ],
    env: {
      node: true,
      es2022: true
    }
  };
  