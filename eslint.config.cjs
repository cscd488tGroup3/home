const eslintPluginAstro = require('eslint-plugin-astro');
const js = require('@eslint/js');
const typescriptParser = require('@typescript-eslint/parser');

module.exports = [
  // Add more generic rule sets here, such as:
  // js.configs.recommended,
  ...eslintPluginAstro.configs['flat/recommended'], // In CommonJS, the `flat/` prefix is required.
  
  {
    files: ['**/*.ts', '**/*.d.ts'], // TypeScript files
    languageOptions: {
      parser: typescriptParser, // Use TypeScript parser here
    },
    rules: {
      // Add TypeScript-specific rules here
    },
    ignores: ['.*', '.wrangler/', 'tests/'], // Ignore hidden files and .wrangler directory
  }
];
