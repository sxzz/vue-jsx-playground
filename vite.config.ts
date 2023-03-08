import path from 'node:path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  resolve: {
    alias: {
      assert: 'browser-assert',
      path: 'path-browserify',
      '@babel/highlight': path.resolve(__dirname, './empty-module.js'),
    },
  },
  define: {
    'process.env.BABEL_TYPES_8_BREAKING': 'false',
    'process.platform': '"darwin"',
    'Buffer.isBuffer': 'undefined',
  },
  plugins: [
    Vue({
      reactivityTransform: true,
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
