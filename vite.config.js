import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cesium from 'vite-plugin-cesium';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), cesium()],
  build: {
    assetsInlineLimit: 0, // Prevent inlining large assets
  },
  server: {
    headers: {
      'Access-Control-Allow-Origin': '*', // Ensure assets are served correctly
    },
  },
});
