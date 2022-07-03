import { defineConfig } from 'vite'
import Vue2 from '@vitejs/plugin-vue2'
import Components from 'unplugin-vue-components/vite'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  define: {
    'process.env.BABEL_TYPES_8_BREAKING': 'false',
  },
  plugins: [
    Vue2(),
    Components({
      dts: './src/components.d.ts',
    }),
    UnoCSS(),
  ],
})
