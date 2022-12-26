import { resolve } from "path"
/// <reference types="vitest" />
import { defineConfig } from "vite"
import Vue from "@vitejs/plugin-vue"
import Unocss from 'unocss/vite'
import { VitePWA } from 'vite-plugin-pwa'
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
    VitePWA({ registerType: 'autoUpdate' }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3334',
        changeOrigin: true,
      }
    }
  },
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
