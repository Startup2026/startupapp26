// C:\Users\Sanchit\Desktop\backend_startup\startupapp26\vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // This is what is failing to load
import path from 'path';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // This alias is used in your imports
    },
  },
});