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
    // 1. OPSI PALING CEPAT: Menyesuaikan batas peringatan chunk.
    // Peringatan akan muncul jika ukuran chunk melebihi 1000 KiB (1 MB).
    // Ubah sesuai kebutuhan Anda, misal: 1000, 1500, atau 2000.
    // PERHATIAN: Ini HANYA menyembunyikan peringatan, tidak mengurangi ukuran file sebenarnya.
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
        // 2. OPSI OPTIMASI: Meningkatkan manualChunks
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Coba mencocokkan nama vendor secara lebih ketat
            const vendorMatch = vendors.find((vendor) =>
              id.includes(`node_modules/${vendor}`)
            );

            // Jika modul adalah salah satu dari vendor yang ditentukan, beri nama chunk sesuai vendor.
            // Jika bukan vendor yang ditentukan, masukkan ke chunk 'vendor' umum.
            if (vendorMatch) {
              return vendorMatch;
            }

            // Jika bukan vendor yang ditentukan, bagi menjadi 'vendor' umum.
            // Anda juga bisa membaginya berdasarkan awal nama, misal:
            // return name; // Ini akan membuat chunk terpisah untuk setiap paket (Bisa jadi terlalu banyak!)
            return 'vendor'; // Mempertahankan chunk 'vendor' umum
          }
        },
      },
    },
  },
  server: {
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
