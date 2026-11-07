import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    proxy: {
      '/off-api': {
        target: 'https://world.openfoodfacts.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/off-api/, ''),
        headers: {
          'User-Agent': 'BeConsciousApp/1.0 (https://github.com/Aarnaaa22/Be-Concious)',
        },
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          zxing: ['@zxing/browser', '@zxing/library'],
          charts: ['recharts'],
          motion: ['framer-motion'],
          vendor: ['react', 'react-dom', 'react-router-dom', 'lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
});
