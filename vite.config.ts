import { defineConfig } from 'vite'
import Vue2 from '@vitejs/plugin-vue2'

export default defineConfig({
  define: {
    'process.env.BABEL_TYPES_8_BREAKING': 'false',
  },
  plugins: [Vue2()],
})
