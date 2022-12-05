import { resolve } from "path"
import { defineConfig } from "vite"
import Vue from "@vitejs/plugin-vue"
import Unocss from 'unocss/vite'
import { presetAttributify, presetWind } from 'unocss'
import { presetTypography } from '@unocss/preset-typography'

const packageDir = './'

export default defineConfig({
  resolve: {
    alias: {
      "@/": `${resolve(packageDir, "src")}/`,
    },
  },
  plugins: [
    Vue({
      include: [/\.vue$/],
    }),
    Unocss(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(packageDir, "index.html"),
        app: resolve(packageDir, "app/index.html"),
        "app/edit": resolve(packageDir, "app/edit/index.html"),
        "app/view": resolve(packageDir, "app/view/index.html"),
      },
      output: {
        manualChunks: {
          'codemirror-web': ['@codemirror/lang-javascript', '@codemirror/lang-html', '@codemirror/lang-css'],
          'codemirror-py': ['@codemirror/lang-python'],
          'codemirror-sql': ['@codemirror/lang-sql'],
        }
      }
    },
  },
  optimizeDeps: {
    include: ["vue", "vue-router", "@vueuse/core"],
    exclude: ["vue-demi"],
  },
  test: {
    environment: 'happy-dom'
  }
})
