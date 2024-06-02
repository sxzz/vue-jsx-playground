import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import UnoCSS from 'unocss/vite'
import VueMacros from 'unplugin-vue-macros/vite'

export default defineConfig({
  resolve: {
    alias: {
      assert: 'browser-assert',
      path: 'pathe',
      '@babel/highlight': 'unenv/runtime/mock/noop',
    },
  },
  define: {
    'process.env.BABEL_TYPES_8_BREAKING': 'false',
    'process.platform': '"darwin"',
    'Buffer.isBuffer': 'undefined',
  },
  build: {
    minify: 'terser',
  },
  plugins: [
    VueMacros({
      plugins: {
        vue: Vue(),
      },
    }),
    Components({
      dts: './src/components.d.ts',
    }),
    AutoImport({
      imports: ['vue', '@vueuse/core'],
      dirs: ['./src/composables'],
      vueTemplate: true,
      dts: './src/auto-imports.d.ts',
    }),
    UnoCSS(),
  ],
  optimizeDeps: {
    exclude: ['@swc/wasm-web'],
  },
})
