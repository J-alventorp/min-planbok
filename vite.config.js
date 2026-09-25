import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/min-planbok/',
  server: {
    port: Number(process.env.PORT) || 5173,
    strictPort: true,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Min Plånbok',
        short_name: 'Plånbok',
        description: 'Koll på pengarna, utan tråkigheten.',
        start_url: '/min-planbok/',
        scope: '/min-planbok/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0E1F22',
        theme_color: '#FFB833',
        lang: 'sv',
        icons: [
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        ],
        shortcuts: [
          {
            name: 'Logga utgift',
            short_name: 'Logga',
            url: '/min-planbok/?quicklog=1',
            icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml' }],
          },
        ],
      },
    }),
  ],
});
