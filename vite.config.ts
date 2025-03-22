
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 8080,
    strictPort: false, // Try alternative port if 8080 is in use
    hmr: {
      clientPort: 443,
      host: '0.0.0.0',
    },
    watch: {
      usePolling: true,
    }
  }
});
