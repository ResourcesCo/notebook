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
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: null,
      srcDir: 'src',
      workbox: {
        navigateFallbackDenylist: [/\/api\/.*/],
        runtimeCaching: [
          {
            urlPattern: /\/api\/frame\b.*/,
            handler: async ({url, request, event, params}) => {
              const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Frame</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <base target="_blank">
    <style type="text/css">
      html {
        background-color: #f5f5f4;
      }
      html.dark {
        background-color: #121212;
      }
      * {
        margin: 0;
        padding: 0;
      }
      iframe {
        border: 0;
        width: 100vw;
        height: 100vh;
      }
    </style>
  </head>
  <body>
    <script>
      (function () {
        const prefersDark =
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
        function setColorMode(colorMode) {
          const dark = colorMode === 'auto' ? prefersDark : (colorMode === 'dark')
          document.documentElement.classList[dark ? 'add' : 'remove']("dark")
        }
        const params = new URLSearchParams(window.location.search)
        setColorMode(params.get("color-scheme") || "auto")
        let frame = undefined
        window.addEventListener('message', (e) => {
          if (e.source === window.parent) {
            if (Array.isArray(e.data) && e.data[0] === 'srcdoc') {
              const srcdoc = e.data[1].replace('__PARENT_LOCATION_SEARCH__', window.location.search)
              frame = document.createElement('iframe')
              frame.sandbox = 'allow-scripts allow-popups'
              frame.srcdoc = srcdoc
              frame.addEventListener('load', () => {
                window.parent.postMessage(['srcdoc-loaded'])
              })
              document.body.appendChild(frame)
            } else if (Array.isArray(e.data) && e.data[0] === 'color-scheme') {
              setColorMode(e.data[1])
              if (frame !== undefined) {
                frame.contentWindow.postMessage(e.data, '*')                
              }
            } else if (frame !== undefined) {
              frame.contentWindow.postMessage(e.data, '*')
            }
          } else if (e.source === frame.contentWindow) {
            if (e.ports.length > 0) {
              window.parent.postMessage(e.data, '*', [...e.ports])
            } else {
              window.parent.postMessage(e.data, '*')
            }
          }
        })
      })()
    </script>
  </body>
</html>
`
              const reqUrl: URL = new URL(url)
              const csp = reqUrl.searchParams.get('csp')
              return new Response(html, {
                headers: {
                  'Content-Security-Policy': csp ? atob(csp) : `default-src 'self' 'unsafe-inline' 'unsafe-eval';`,
                  'Content-Type': 'text/html',
                },
              })
            }
          }
        ]
      },
    })
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
