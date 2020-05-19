const path = require('path')
const express = require('express')
const cors = require('cors')

module.exports = ({port = 0, allowCORS, middleWare} = {port: 0}) => {
  const app = express()
  if (allowCORS) {
    app.use(cors())
  }
  if (middleWare) {
    app.use(middleWare)
  }
  app.use('/', express.static(path.resolve(__dirname, '../fixtures')))

  return new Promise((resolve, reject) => {
    const server = app.listen(port, err => {
      if (err) {
        console.log('error starting test server', err)
        reject(err)
      } else {
        const serverPort = server.address().port
        const close = server.close.bind(server)
        console.log(`test server running at port: ${port}`)
        resolve({port: serverPort, close})
      }

      server.on('error', err => {
        if (err.code === 'EADDRINUSE') {
          console.log(
            `error: test server could not start at port ${
              server.address().port
            }: port is already in use.`,
          )
        } else {
          console.log('error in test server:', err)
        }
        reject(err)
      })
    })
  })
}
