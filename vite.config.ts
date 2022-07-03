import { defineConfig } from 'vite'
import Vue2 from '@vitejs/plugin-vue2'
import Components from 'unplugin-vue-components/vite'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  resolve: {
    alias: {
      assert: 'browser-assert',
    },
  },
  define: {
    'process.env.BABEL_TYPES_8_BREAKING': 'false',
    'process.platform': '"darwin"',
  },
  plugins: [
    Vue2(),
    Components({
      dts: './src/components.d.ts',
    }),
    UnoCSS(),
  ],
})
