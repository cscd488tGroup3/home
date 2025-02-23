















import dotenv from 'dotenv';
import cloudflare from '@astrojs/cloudflare';
import { defineConfig } from 'astro/config';

dotenv.config();

export default defineConfig({
  adapter: cloudflare(),
  output: 'server',
  vite: {
	define: {
	  'import.meta.env.API_KEY': JSON.stringify(process.env.API_KEY),
	},
  },
});