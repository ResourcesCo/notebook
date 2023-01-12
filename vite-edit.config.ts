import { resolve } from "path"
import { defineConfig } from "vite"
import Vue from "@vitejs/plugin-vue"
import Unocss from 'unocss/vite'
import { viteSingleFile } from "vite-plugin-singlefile"
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
    viteSingleFile(),
  ],
  build: {
    rollupOptions: {
      input: "app/edit/index.html",
    },
    outDir: "./dist-edit"
  },
})
