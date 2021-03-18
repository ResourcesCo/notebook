import { resolve } from "path";
import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import WindiCSS from "vite-plugin-windicss";
import VueI18n from "@intlify/vite-plugin-vue-i18n";

const packageDir = './';

export default defineConfig({
  resolve: {
    alias: {
      "~/": `${resolve(packageDir, "src")}/`,
    },
  },
  plugins: [
    Vue({
      include: [/\.vue$/],
    }),

    // https://github.com/antfu/vite-plugin-windicss
    WindiCSS({
      safelist: "prose prose-sm m-auto text-left",
    }),

    // https://github.com/intlify/vite-plugin-vue-i18n
    VueI18n({
      include: [resolve(packageDir, "locales/**")],
    }),
  ],

  build: {
    rollupOptions: {
      input: {
        main: resolve(packageDir, "index.html"),
        app: resolve(packageDir, "app/index.html"),
        "app/edit": resolve(packageDir, "app/edit/index.html"),
        "app/view": resolve(packageDir, "app/view/index.html"),
        "app/sandbox": resolve(packageDir, "app/sandbox/index.html"),
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
});
