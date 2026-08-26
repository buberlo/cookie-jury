import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const API_PORT = process.env.API_PORT || 4000;
const API_TARGET = process.env.API_TARGET || `http://localhost:${API_PORT}`;

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
        ws: true
      }
    }
  },
  build: {
    outDir: 'dist'
  }
});