import { defineConfig } from 'astro/config';
import dotenv from 'dotenv';
import netlify from '@astrojs/netlify/functions';

dotenv.config();

export default defineConfig({
  vite: {
    define: {
      'import.meta.env.API_KEY': JSON.stringify(process.env.API_KEY),
    },
  },
  output: 'server',
  adapter: netlify()
  // your existing configuration
});
