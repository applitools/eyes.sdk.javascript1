const {spawn} = require('child_process')
const makeAPI = require('./api')
const makeRefer = require('./refer')
const makeSocket = require('./socket')
const makeSpec = require('./spec-driver')

function makeSDK() {
  const socket = makeSocket()
  const refer = makeRefer()
  const spec = makeSpec(refer)

  const server = spawn('./node_modules/.bin/eyes-universal-macos', {
    detached: true,
    stdio: ['ignore', 'pipe', 'ignore'],
  })
  server.unref()
  server.stdout.once('data', data => {
    server.stdout.destroy()
    const [port] = String(data).split('\n', 1)
    console.log(port)
    socket.connect(`http://localhost:${port}/eyes`)
    socket.unref()
    socket.emit('Session.init', {commands: Object.keys(spec)})
  })

  socket.command('Driver.isEqualElements', ({context, element1, element2}) => {
    return spec.isEqualElements(context, element1, element2)
  })
  socket.command('Driver.executeScript', ({context, script, args}) => {
    return spec.executeScript(context, script, ...args)
  })
  socket.command('Driver.mainContext', ({context}) => {
    return spec.mainContext(context)
  })
  socket.command('Driver.parentContext', ({context}) => {
    return spec.parentContext(context)
  })
  socket.command('Driver.childContext', ({context, element}) => {
    return spec.mainContext(context, element)
  })
  socket.command('Driver.findElement', ({context, selector}) => {
    return spec.findElement(context, selector)
  })
  socket.command('Driver.findElements', ({context, selector}) => {
    return spec.findElements(context, selector)
  })
  socket.command('Driver.getViewportSize', ({driver}) => {
    return spec.getViewportSize(driver)
  })
  socket.command('Driver.setViewportSize', ({driver, size}) => {
    return spec.setViewportSize(driver, size)
  })
  socket.command('Driver.getTitle', ({driver}) => {
    return spec.getTitle(driver)
  })
  socket.command('Driver.getUrl', ({driver}) => {
    return spec.getUrl(driver)
  })
  socket.command('Driver.getDriverInfo', ({driver}) => {
    return spec.getDriverInfo(driver)
  })
  socket.command('Driver.takeScreenshot', async ({driver}) => {
    return spec.takeScreenshot(driver)
  })

  async function openEyes(driver, config) {
    console.log('open.eyes')
    const driverRef = refer.ref(driver)
    const eyes = await socket.request('Eyes.open', {driver: driverRef, config})

    // socket.subscribe('Logger.log', eyes, ({level, message}) => {
    //   console.log(`[${level}] ${message}`)
    // })

    return {check, close, abort}

    async function check(checkSettings) {
      return socket.request('Eyes.check', {eyes, checkSettings})
    }
    async function close() {
      const result = await socket.request('Eyes.close', {eyes})
      refer.destroy(driverRef)
      return result
    }
    async function abort() {
      const result = await socket.request('Eyes.abort', {eyes})
      refer.destroy(driverRef)
      return result
    }
  }

  return makeAPI({...spec, openEyes})
}

module.exports = makeSDK
