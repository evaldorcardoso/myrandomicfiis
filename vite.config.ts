import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'
import VercelAPI from 'vite-plugin-vercel-api'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    VercelAPI({ apiDir: 'api' }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'icons/192x192.png',
        'icons/512x512.png',
      ],
      manifest: {
        name: 'My Randomic Fiis',
        short_name: 'Randomic Fiis',
        description: 'Índice global de fundos imobiliários com dados atualizados',
        theme_color: '#0d1b2a',
        background_color: '#0d1b2a',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait-primary',
        lang: 'pt-BR',
        icons: [
          {
            src: 'icons/192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        navigateFallback: '/offline.html',
        runtimeCaching: [
          {
            urlPattern: /\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24,
              },
              networkTimeoutSeconds: 10,
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|ico|woff2)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-assets',
              expiration: {
                maxEntries: 64,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
      },

    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
