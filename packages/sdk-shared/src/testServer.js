'use strict'

const express = require('express')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const {resolve} = require('path')
const cors = require('cors')

module.exports = ({
  staticPath = resolve('./test/fixtures'),
  port = 0,
  allowCors = false,
  showLogs = false,
  middleWare = undefined,
} = {}) => {
  const app = express()
  app.use(cookieParser())
  if (allowCors) {
    app.use(cors())
  }
  if (middleWare) {
    app.use(middleWare)
  }
  if (showLogs) {
    app.use(morgan('tiny'))
  }
  app.use('/add-cookie', (req, res) => {
    const {name, value} = req.query
    res.cookie(name, value)
    res.sendStatus(200)
  })
  app.use('/auth', (req, res, next) => {
    if (req.cookies.auth === 'secret') {
      next()
    } else {
      res.status(401).send('need to be authorized')
    }
  })

  app.use('/auth', express.static(staticPath))
  app.use('/', express.static(staticPath))
  app.get('/err*', (_req, res) => res.sendStatus(500))

  const log = args => showLogs && console.log(...args)

  return new Promise((resolve, reject) => {
    const server = app.listen(port, err => {
      if (err) {
        log('error starting test server', err)
        reject(err)
      } else {
        const serverPort = server.address().port
        const close = server.close.bind(server)
        log(`test server running at port: ${port}`)
        resolve({port: serverPort, close})
      }

      server.on('error', err => {
        if (err.code === 'EADDRINUSE') {
          log(
            `error: test server could not start at port ${
              server.address().port
            }: port is already in use.`,
          )
        } else {
          log('error in test server:', err)
        }
        reject(err)
      })
    })
  })
}
