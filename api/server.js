import express from 'express'

const app = express()

app.get('/api/echo', (req, res) => {
  res.set('Content-Type', 'text/html')
  res.set('Content-Security-Policy', Buffer.from(req.query.csp, 'base64').toString())
  res.send(Buffer.from(req.query.html, 'base64').toString())
})

app.listen(process.env.PORT)