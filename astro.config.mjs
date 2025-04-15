import { defineConfig } from 'astro/config';
import dotenv from 'dotenv';
import netlify from '@astrojs/netlify/functions';
import tailwindcss from '@tailwindcss/vite';

dotenv.config();

export default defineConfig({
  // middleware: [
	// 	'./src/lib/authMiddleware.ts', // Adjust path as needed
	// ],
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'server',
  security: {
    checkOrigin: true
  },
  adapter: netlify(),
  server: {
    host: true
  },
  hooks: {
    'astro:config:setup': ({ addRuntimeVariable }) => {
      addRuntimeVariable('env', {
        USR_DB: process.env.USR_DB,
        USR_DB_W: process.env.USR_DB_W,
        USR_DB_W_ADMIN: process.env.USR_DB_W_ADMIN,
        USR_SESSION: process.env.USR_SESSION,
      });
    }
  }
});
