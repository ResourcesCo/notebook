import { resolve } from "path"
/// <reference types="vitest" />
import { defineConfig } from "vite"
import Vue from "@vitejs/plugin-vue"
import Unocss from 'unocss/vite'
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
        "app/frame": resolve(packageDir, "app/frame/index.html"),
      },
    },
    manifest: true
  },
  optimizeDeps: {
    include: ["vue", "vue-router", "@vueuse/core"],
    exclude: ["vue-demi"],
  },
  test: {
    environment: 'happy-dom'
  }
})
