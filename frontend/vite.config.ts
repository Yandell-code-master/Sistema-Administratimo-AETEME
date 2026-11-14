/*Este archivo es la configuracion de vite*/

// Traemos la configuracion de vite y el plugin de react para vite
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// En el host, el backend expone el puerto 8080. Dentro de Docker Compose el
// servicio se llama "backend" y la variable API_PROXY_TARGET lo sobrescribe.
const apiTarget = process.env.API_PROXY_TARGET ?? 'http://localhost:8080';

export default defineConfig({
  plugins: [react()], // Esto es para darle mas funcionalidades a Vite con React
  server: {
    host: true,
    port: 8000,
    strictPort: true,
    // El proxy hace que el navegador solo hable con :8000, así el frontend y la
    // API comparten origen y no hace falta CORS ni credentials:'include'.
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
      },
    },
    watch: {
      // Útil con bind mounts de Windows; se activa solo si se pide por entorno.
      usePolling: process.env.VITE_USE_POLLING === 'true',
    },
  },
});
