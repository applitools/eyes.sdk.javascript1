const core = require('@applitools/eyes-sdk-core')
const VisualGridClient = require('@applitools/visual-grid-client')
const makeServer = require('./server')
const makeSocket = require('./socket')
const makeSpec = require('./spec-driver')
const makeRefer = require('./refer')
const {version} = require('../package.json')

const IDLE_TIMEOUT = 900000 // 15min

async function makeSDK({idleTimeout = IDLE_TIMEOUT, ...serverConfig} = {}) {
  const {server, port} = await makeServer(serverConfig)
  console.log(port) // NOTE: this is a part of the protocol
  if (!server) {
    console.log(
      `You trying to spawn a duplicated server, please use server on port ${port} instead`,
    )
    return null
  }
  server.idle = setTimeout(() => server.close(), idleTimeout)

  server.on('connection', client => {
    clearTimeout(server.idle)
    const socket = makeSocket(client)
    const refer = makeRefer()

    socket.on('close', () => {
      if (server.clients.size === 0) {
        server.idle = setTimeout(() => server.close(), idleTimeout)
      }
    })

    socket.once('Session.init', config => {
      const spec = makeSpec(socket)
      const commands = [
        'isDriver',
        'isElement',
        'isSelector',
        'extractSelector',
        'isStaleElementError',
        ...config.commands,
      ]

      socket.sdk = core.makeSDK({
        name: `eyes-universal/${config.name}`,
        version: `${version}/${config.version}`,
        spec: commands.reduce((commands, name) => {
          return Object.assign(commands, {[name]: spec[name]})
        }, {}),
        VisualGridClient,
      })
    })

    socket.on('Logger.log', ({publisher, subscription}) => {
      socket.emit({name: 'Logger.log', key: subscription})
    })

    socket.command('Util.setViewportSize', async ({driver, viewportSize}) => {
      return socket.sdk.setViewportSize(driver, viewportSize)
    })
    socket.command('Util.closeBatch', config => {
      return socket.sdk.closeBatch(config)
    })
    socket.command('Util.deleteResults', config => {
      return socket.sdk.deleteResults(config)
    })
    socket.command('Runner.new', async () => {
      const runner = new Set()
      return refer.ref(runner)
    })
    socket.command('Runner.close', async ({runner}) => {
      const commands = Array.from(refer.deref(runner))
      const results = await Promise.all(commands.map(commands => commands.close()))
      refer.destroy(runner)
      return results.flat()
    })
    socket.command('Eyes.open', async ({driver, config, runner}) => {
      const commands = await socket.sdk.openEyes(driver, config)
      if (runner) {
        socket.runners.get(runner)
      }
      return refer.ref(commands, runner)
    })
    socket.command('Eyes.locate', async ({eyes}) => {
      // TODO
    })
    socket.command('Eyes.check', async ({eyes, checkSettings}) => {
      const commands = refer.deref(eyes)
      return commands.check(checkSettings)
    })
    socket.command('Eyes.close', ({eyes}) => {
      const commands = refer.deref(eyes)
      refer.destroy(eyes)
      return commands.close()
    })
    socket.command('Eyes.abort', ({eyes}) => {
      const commands = refer.deref(eyes)
      refer.destroy(eyes)
      return commands.abort()
    })
  })

  return {port, close: () => server.close()}
}

module.exports = makeSDK
