import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
  },
  server: {
    headers: {
      // Configure CSP headers for development
      'Content-Security-Policy': [
        "default-src 'self'",
        // Allow scripts from our origin and inline scripts needed for HMR
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        // Allow styles from our origin and inline styles
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        // Allow fonts from Google Fonts
        "font-src 'self' https://fonts.gstatic.com",
        // Allow images from our origin and trusted sources
        "img-src 'self' data: blob: https://*.unsplash.com https://*.githubusercontent.com",
        // Allow media from our origin
        "media-src 'self' blob:",
        // Allow connections to our API, Supabase, and other services
        "connect-src 'self' ws: wss: https://*.supabase.co https://api.stripe.com https://fonts.googleapis.com https://fonts.gstatic.com",
        // Allow WebAssembly
        "script-src-elem 'self' 'unsafe-inline' 'wasm-unsafe-eval'",
        // Frame ancestors for development
        "frame-ancestors 'self'",
        // Form actions
        "form-action 'self'",
        // Base URI restriction
        "base-uri 'self'",
      ].join('; ')
    }
  }
});