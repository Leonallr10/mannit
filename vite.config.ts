import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: "/mannit/", // If this doesn't work, try "./"
  plugins: [react()],
  build: {
    outDir: 'build' // Change the output directory to "build"
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
