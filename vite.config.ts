import { resolve } from "path";
import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import WindiCSS from "vite-plugin-windicss";
import VueI18n from "@intlify/vite-plugin-vue-i18n";

export default defineConfig({
  resolve: {
    alias: {
      "~/": `${resolve(__dirname, "src")}/`,
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
      include: [resolve(__dirname, "locales/**")],
    }),
  ],

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        app: resolve(__dirname, "app/index.html"),
        "app/edit": resolve(__dirname, "app/edit/index.html"),
        "app/view": resolve(__dirname, "app/view/index.html"),
        "app/sandbox": resolve(__dirname, "app/sandbox/index.html"),
      },
      output: {
        manualChunks: {
          'codemirror-web': ['@codemirror/lang-javascript', '@codemirror/lang-html', '@codemirror/lang-css'],
          'codemirror-py': ['@codemirror/lang-python'],
          'codemirror-sql': ['@codemirror/lang-sql'],
        }
      },
    },
  },

  optimizeDeps: {
    include: ["vue", "vue-router", "@vueuse/core"],
    exclude: ["vue-demi"],
  },
});
