import { defineConfig } from 'astro/config';
import dotenv from 'dotenv';
import cloudflare from '@astrojs/cloudflare';

dotenv.config();

export default defineConfig({
  vite: {
    define: {
      'import.meta.env.API_KEY': JSON.stringify(process.env.API_KEY),
    },
  },
  output: 'server',
  adapter: cloudflare()
  // your existing configuration
});
