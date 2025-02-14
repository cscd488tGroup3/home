import { defineConfig } from 'astro/config';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  vite: {
    define: {
      'import.meta.env.API_KEY': JSON.stringify(process.env.API_KEY),
    },
  },
  // your existing configuration
});
