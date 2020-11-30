const EyesSDK = require('./EyesSDK')
const ClassicRunner = require('../runner/ClassicRunner')
const VisualGridRunner = require('../runner/VisualGridRunner')
const closeBatch = require('../close/closeBatch')

function makeSDK({name, version, spec, VisualGridClient}) {
  const sdk = EyesSDK({name, version, spec, VisualGridClient})

  return {openEyes, setViewportSize, closeBatch}

  async function openEyes(driver, config) {
    const runner = config.vg ? new VisualGridRunner(/* concurrency */) : new ClassicRunner()
    const eyes = new sdk.EyesFactory(runner)
    await eyes.open(driver, config.appName, config.testName, config.viewportSize)

    return {check, close, abort}

    async function check(settings) {
      return eyes.check(settings)
    }

    async function close() {
      return eyes.close(false)
    }

    async function abort() {
      return eyes.abort()
    }
  }

  async function setViewportSize(driver, size) {
    await sdk.EyesFactory.setViewportSize(driver, size)
  }
}

module.exports = makeSDK
