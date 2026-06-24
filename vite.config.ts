import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import loadVersion from 'vite-plugin-package-version';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// Pastikan semua nama vendor di sini benar-benar cocok dengan nama folder di node_modules.
const vendors = ['highlight', 'katex', 'pdfjs', 'radix-ui', 'react-icons'];

export default defineConfig({
  define: {
    __DEFINES__: JSON.stringify({}),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    react(),
    loadVersion(),
    VitePWA({
      registerType: 'prompt',
      manifest: {
        id: 'Omnichat',
        name: 'Omnichat - Minimal AI chat interface',
        short_name: 'Omnichat',
        description:
          'A minimal Interface for AI Companion that runs entirely in your browser.',
        display: 'standalone',
        theme_color: '#EEEEEE',
        background_color: '#EEEEEE',
        start_url: 'https://omnichat.js.org',
        scope: 'https://omnichat.js.org',
        orientation: 'any',
        lang: 'en',
        icons: [
          {
            purpose: 'maskable',
            sizes: '512x512',
            src: 'assets/manifest-icon-512.maskable.png',
            type: 'image/png',
          },
          {
            purpose: 'any',
            sizes: '512x512',
            src: 'assets/manifest-icon-512.maskable.png',
            type: 'image/png',
          },
          {
            purpose: 'any',
            sizes: '192x192',
            src: 'assets/manifest-icon-192.maskable.png',
            type: 'image/png',
          },
          {
            purpose: 'maskable',
            sizes: '192x192',
            src: 'assets/manifest-icon-192.maskable.png',
            type: 'image/png',
          },
        ],
        screenshots: [
          {
            src: 'screenshots/desktop.png',
            sizes: '1366x1024',
            type: 'image/png',
            form_factor: 'wide',
          },
          {
            src: 'screenshots/mobile.png',
            sizes: '390x844',
            type: 'image/png',
            form_factor: 'narrow',
          },
        ],
        shortcuts: [
          {
            name: 'New Chat',
            url: '/',
            description: 'Start a new chat.',
          },
        ],
        categories: ['ai', 'llm', 'webui', 'llm-ui', 'llm-webui'],
        launch_handler: {
          client_mode: ['navigate-existing', 'auto'],
        },
      },
      workbox: {
        globPatterns: ['**/*.{js,mjs,css,html,woff2,woff}'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              request.destination === 'document' ||
              request.destination === 'script' ||
              request.destination === 'style',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === 'font',
            handler: 'CacheFirst',
            options: {
              cacheName: 'font-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 90, // 90 days
              },
            },
          },
        ],
      },
    }),
  ],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: function (file) {
          if (file.name && file.name.includes('css')) {
            return 'css/[name]-[hash].[ext]';
          }
          if (
            file.name &&
            (file.name.includes('woff') ||
              file.name.includes('woff2') ||
              file.name.includes('ttf'))
          ) {
            return 'fonts/[name].[ext]';
          }
          return 'assets/[name].[ext]';
        },
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const vendorMatch = vendors.find((vendor) =>
              id.includes(`node_modules/${vendor}`)
            );
            if (vendorMatch) {
              return vendorMatch;
            }
            return 'vendor';
          }
        },
      },
    },
  },
  server: {
    // MENYEMBUHKAN ERROR "Blocked request":
    // Mengizinkan domain sandbox vercel atau sub-domain vercel apa pun untuk mengakses server development Vite
    allowedHosts: ['.vercel.run', 'sb-7fk18t8uepts.vercel.run'],
    proxy: {
      '/v1': 'http://localhost:8080',
      '/props': 'http://localhost:8080',
    },
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
});
