import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [astro()],
  test: {
    environment: 'happy-dom',
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'], // ensure this pattern is correct for your test files
  },
});
