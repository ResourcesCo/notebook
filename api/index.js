import express from 'express'
import asyncHandler from 'express-async-handler'
import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const app = express()

const __dirname = dirname(fileURLToPath(import.meta.url))

const content = {}

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
            window.parent.postMessage(e.data, '*')
          }
        })
      })()
    </script>    
  </body>
</html>
`

app.get('/api/frame', asyncHandler(async (req, res, next) => {
  const csp = Buffer.from(req.query.csp, 'base64').toString()
  res.set('Content-Type', 'text/html')
  res.set('Content-Security-Policy', csp)
  res.send(html)
}))

export default app