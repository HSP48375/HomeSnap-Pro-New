
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3300,
    strictPort: false,
    hmr: {
      clientPort: 443,
      host: '0.0.0.0',
    },
    watch: {
      usePolling: true,
    }
  }
});
