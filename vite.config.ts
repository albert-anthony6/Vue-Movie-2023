import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader';

let svgPrefixCounter = 0;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    svgLoader({
      svgoConfig: {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeViewBox: false,
              },
            },
          },
          { name: 'removeDimensions' },
          {
            name: 'prefixIds',
            params: {
              prefix: ({ name }: { name: string }) => {
                if (name === 'svg') svgPrefixCounter += 1;
                return `svg-id-${svgPrefixCounter}`;
              },
              prefixClassNames: false,
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use 'sass:math';
          @use 'sass:color';
          @use 'sass:map';
          @import './src/assets/scss/_variables.scss';
          @import './src/assets/scss/_mixins.scss';
          @import './src/assets/scss/_functions.scss';
          @import './src/assets/scss/_animations.scss';
        `,
      },
    },
  },
})
