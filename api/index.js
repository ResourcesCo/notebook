import express from 'express'
import asyncHandler from 'express-async-handler'
import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const app = express()

const __dirname = dirname(fileURLToPath(import.meta.url))

const content = {}

async function getContent(mode) {
  if (typeof content[mode] === 'string') {
    return content[mode]
  } else {
    if (mode === 'edit' || mode === 'view') {
      const paths = [
        resolve(__dirname, `../dist/app/${mode}/index.html`),
        resolve(__dirname, `../app/${mode}/index.html`),
      ]
      for (const path of paths) {
        try {
          const html = await readFile(path, 'utf8')
          content[mode] = html
          return html
        } catch (e) {
          console.error('Cannot read file', e)
        }
      }
    }
  }
}

app.get('/api/frame', asyncHandler(async (req, res, next) => {
  const csp = Buffer.from(req.query.csp, 'base64').toString()
  let html = ''
  if (typeof req.query.html === 'string') {
    html = Buffer.from(req.query.html, 'base64').toString()
  } else {
    html = await getContent(req.query.mode)
  }
  res.set('Content-Type', 'text/html')
  res.set('Content-Security-Policy', csp)
  res.send(html)
}))

export default app