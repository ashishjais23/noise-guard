import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('leaflet')) {
            return 'leaflet';
          }
          if (id.includes('recharts') || id.includes('react-is')) {
            return 'recharts';
          }
          if (id.includes('lucide-react')) {
            return 'icons';
          }
        }
      }
    }
  }
});
