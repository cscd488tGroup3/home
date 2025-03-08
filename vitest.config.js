import { getViteConfig } from 'astro/config';
export default getViteConfig({
  test: {
    environment: 'happy-dom',
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'], // ensure this pattern is correct for your test files
  },
});
