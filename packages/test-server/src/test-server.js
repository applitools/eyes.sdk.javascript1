'use strict'

const express = require('express')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const {resolve} = require('path')
const fs = require('fs');
const cors = require('cors')
const https = require('https');

function testServer(argv = {}) {
  const {staticPath = resolve('./test/fixtures'), port = 0, allowCors, showLogs, middlewareFile, key, cert} = argv

  const app = express()
  app.use(cookieParser())
  if (allowCors) {
    app.use(cors())
  }

  if (middlewareFile) {
    const middleware = require(middlewareFile)
    app.use(middleware.generateMiddleware ? middleware.generateMiddleware(argv) : middleware)
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
  app.get('/predefined-status/hangup', req => {
    req.socket.destroy()
  })
  app.get('/predefined-status/:status', (req, res) => {
    res.status(req.params.status).send('http status route')
  })

  const log = args => showLogs && console.log(args)

  return new Promise((resolve, reject) => {
    if (key && cert) {
      const server = https.createServer({
        key: fs.readFileSync(key),
        cert: fs.readFileSync(cert)
      }, app).listen(port, (err) => {
        if (err) {
          log('error starting test server', err)
          reject(err)
        } else {
          const close = server.close.bind(server)
          log(`test server running at port: ${port}`)
          resolve({port, close})
        }
      })
    } else {
      const server = app.listen(port, err => {
        if (err) {
          log('error starting test server', err)
          reject(err)
        } else {
          const serverPort = server.address().port
          const close = server.close.bind(server)
          log(`test server running at port: ${serverPort}`)
          resolve({port: serverPort, close})
        }
      })
    }
    
    server.on('error', err => {
      if (err.code === 'EADDRINUSE') {
        log(`error: test server could not start at port ${server.address().port}: port is already in use.`)
      } else {
        log('error in test server:', err)
      }
      reject(err)
    })
  })
}

module.exports = testServer
