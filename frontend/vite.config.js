import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss()
  ],
    server: {
    host: true, // important for external access
    port: 5173,
    allowedHosts: ['.ngrok-free.dev', '.ngrok-free.app'],
  },
})