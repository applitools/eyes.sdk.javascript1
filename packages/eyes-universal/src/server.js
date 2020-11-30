const http = require('http')
const ws = require('ws')
const {name, version} = require('../package.json')

const TOKEN_HEADER = 'x-eyes-universal-token'
const TOKEN = `${name}@${version}`

async function isHandshakable(port) {
  return new Promise(resolve => {
    const request = http.get(`http://localhost:${port}/handshake`, {
      headers: {[TOKEN_HEADER]: TOKEN},
    })

    request.on('response', ({statusCode, headers}) => {
      resolve(statusCode === 200 && headers[TOKEN_HEADER] === TOKEN)
    })
    request.on('error', () => resolve(false))
  })
}

async function makeServer({port = 2107, singleton = true} = {}) {
  const server = new http.Server()
  server.on('request', (request, response) => {
    if (request.url === '/handshake') {
      if (request.headers[TOKEN_HEADER] === TOKEN) {
        response.writeHead(200, {[TOKEN_HEADER]: TOKEN})
      } else {
        response.writeHead(400)
      }
      response.end()
    }
  })

  server.listen(port, 'localhost')

  return new Promise((resolve, reject) => {
    server.on('listening', () => {
      const wss = new ws.Server({server, path: '/eyes'})
      wss.on('close', () => server.close())
      resolve({server: wss, port})
    })

    server.on('error', async err => {
      if (err.code === 'EADDRINUSE') {
        if (singleton && (await isHandshakable(port))) {
          return resolve({port})
        } else {
          return resolve(await makeServer({port: port + 1, singleton}))
        }
      }
      reject(err)
    })
  })
}

module.exports = makeServer
