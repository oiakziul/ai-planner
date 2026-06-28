import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite"; 
import { fileURLToPath, URL } from "node:url"; // [ESM COMPATÍVEL]: Evita erros de __dirname no Vite moderno

export default defineConfig({
  plugins: [
    tailwindcss(), 
    react({
      babel: {
        plugins: [
          ["babel-plugin-react-compiler", {}], 
        ],
      },
    }),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "inline", // Força a ativação do Service Worker no HTML de produção
      includeAssets: ["favicon.ico", "apple-touch-icon.png"],
      manifest: {
        name: "AI Planner - Inteligência Financeira",
        short_name: "AI-PLANNER",
        description: "Planejador Financeiro Inteligente com IA Generativa",
        theme_color: "#15080E",       // Nova cor Obsidiana
        background_color: "#15080E",  // Nova cor Obsidiana
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          // Mantemos APENAS os ícones reais que você possui fisicamente na pasta public!
          {
            src: "favicon.ico",
            sizes: "64x64 32x32 24x24 16x16",
            type: "image/x-icon",
          },
          {
            src: "logo192.png",
            type: "image/png",
            sizes: "192x192",
          },
          {
            src: "logo512.png",
            type: "image/png",
            sizes: "512x512",
          },
          {
            src: "logo512.png",
            type: "image/png",
            sizes: "512x512",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        navigateFallbackDenylist: [/^\/sitemap\.xml$/, /^\/robots\.txt$/],
        maximumFileSizeToCacheInBytes: 20 * 1024 * 1024,
        globPatterns: [
          "**/*.{js,css,html,woff,woff2,png,gif,jpg,jpeg,svg,webp,mp4,webm}",
        ],
        globIgnores: ["**/manifest*.json", "**/manifest*.webmanifest"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /\.(?:png|gif|jpg|jpeg|svg|webp)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: "module",
      },
    }),
  ],
  resolve: {
    alias: {
      // Resolve caminhos em projetos modernos com "type: module" no package.json
      "@": fileURLToPath(new URL("./src", import.meta.url)), 
    },
  },
  base: "/",
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
  },
});