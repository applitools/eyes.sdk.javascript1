'use strict'

const assert = require('assert')
const {Console} = require('console')
const {Writable} = require('stream')
const chalk = require('chalk')
const {startFakeEyesServer} = require('@applitools/sdk-fake-eyes-server')
const {EyesVisualGrid} = require('../../utils/FakeSDK')
const MockDriver = require('../../utils/MockDriver')
const {Logger, Configuration} = require('../../../index')

describe('EyesVisualGrid', () => {
  describe('getBrowserInfo(browser)', () => {
    let eyes

    before(async () => {
      eyes = new EyesVisualGrid()
      eyes._serverConnector.getEmulatedDevicesSizes = async () => {
        return {
          emulated1: {portrait: {width: 1, height: 11}, landscape: {width: 11, height: 1}},
          emulated2: {portrait: {width: 2, height: 22}, landscape: {width: 22, height: 2}},
        }
      }
      eyes._serverConnector.getIosDevicesSizes = async () => {
        return {
          ios1: {portrait: {width: 10, height: 110}, landscape: {width: 110, height: 10}},
        }
      }
    })

    it('works with desktop browser', async () => {
      const browser = {name: 'browser1', width: 3, height: 33}
      assert.deepStrictEqual(await eyes.getBrowserInfo(browser), {
        type: 'browser',
        name: 'browser1',
        width: 3,
        height: 33,
      })
    })

    it('works with emulated device syntax', async () => {
      const device1 = {deviceName: 'emulated1'}
      assert.deepStrictEqual(await eyes.getBrowserInfo(device1), {
        type: 'emulation',
        name: 'emulated1',
        screenOrientation: 'portrait',
        width: 1,
        height: 11,
      })
      const device1Portrait = {deviceName: 'emulated1', screenOrientation: 'portrait'}
      assert.deepStrictEqual(await eyes.getBrowserInfo(device1Portrait), {
        type: 'emulation',
        name: 'emulated1',
        screenOrientation: 'portrait',
        width: 1,
        height: 11,
      })
      const device1Landscape = {deviceName: 'emulated1', screenOrientation: 'landscape'}
      assert.deepStrictEqual(await eyes.getBrowserInfo(device1Landscape), {
        type: 'emulation',
        name: 'emulated1',
        screenOrientation: 'landscape',
        width: 11,
        height: 1,
      })
      const device2 = {chromeEmulationInfo: {deviceName: 'emulated2'}}
      assert.deepStrictEqual(await eyes.getBrowserInfo(device2), {
        type: 'emulation',
        name: 'emulated2',
        screenOrientation: 'portrait',
        width: 2,
        height: 22,
      })
      const device2Portrait = {
        chromeEmulationInfo: {deviceName: 'emulated2', screenOrientation: 'portrait'},
      }
      assert.deepStrictEqual(await eyes.getBrowserInfo(device2Portrait), {
        type: 'emulation',
        name: 'emulated2',
        screenOrientation: 'portrait',
        width: 2,
        height: 22,
      })
      const device2Landscape = {
        chromeEmulationInfo: {deviceName: 'emulated2', screenOrientation: 'landscape'},
      }
      assert.deepStrictEqual(await eyes.getBrowserInfo(device2Landscape), {
        type: 'emulation',
        name: 'emulated2',
        screenOrientation: 'landscape',
        width: 22,
        height: 2,
      })
    })

    it('works with ios device syntax', async () => {
      const device1 = {iosDeviceInfo: {deviceName: 'ios1'}}
      assert.deepStrictEqual(await eyes.getBrowserInfo(device1), {
        type: 'ios',
        name: 'ios1',
        screenOrientation: 'portrait',
        width: 10,
        height: 110,
      })
      const device1Portrait = {
        iosDeviceInfo: {deviceName: 'ios1', screenOrientation: 'portrait'},
      }
      assert.deepStrictEqual(await eyes.getBrowserInfo(device1Portrait), {
        type: 'ios',
        name: 'ios1',
        screenOrientation: 'portrait',
        width: 10,
        height: 110,
      })
      const device1Landscape = {
        iosDeviceInfo: {deviceName: 'ios1', screenOrientation: 'landscape'},
      }
      assert.deepStrictEqual(await eyes.getBrowserInfo(device1Landscape), {
        type: 'ios',
        name: 'ios1',
        screenOrientation: 'landscape',
        width: 110,
        height: 10,
      })
    })
  })

  describe('_takeDomSnapshot({breakpoints})', () => {
    let driver, server, eyes, output

    before(async () => {
      server = await startFakeEyesServer({
        logger: new Logger(process.env.APPLITOOLS_SHOW_LOGS),
        matchMode: 'always',
      })

      driver = new MockDriver({viewport: {width: 600, height: 700}})
      driver.wrapMethod('setWindowRect', (method, driver, [rect]) => {
        if (!Number.isNaN(Number(rect.width))) {
          rect.width = Math.min(Math.max(rect.width, 300), 800)
        }
        if (!Number.isNaN(Number(rect.height))) {
          rect.height = Math.min(Math.max(rect.height, 500), 1000)
        }
        return method.call(driver, rect)
      })
    })

    after(async () => {
      await server.close()
    })

    beforeEach(async () => {
      eyes = new EyesVisualGrid()
      eyes.setServerUrl(`http://localhost:${server.port}`)

      output = []
      const stdout = new Writable({
        write(chunk, _encoding, callback) {
          output.push(chunk.toString())
          callback(null)
        },
      })
      global.originalConsole = global.console
      global.console = new Console({stdout})
    })

    afterEach(async () => {
      global.console = global.originalConsole
    })

    it('should warn if not able to resize to the configuration width', async () => {
      const config = new Configuration()
        .setAppName('appName')
        .setTestName('testName')
        .setViewportSize({width: 600, height: 700})
        .addBrowser({width: 200, height: 400, name: 'chrome'})
        .addBrowser({width: 700, height: 900, name: 'chrome'})
        .addBrowser({width: 1000, height: 1200, name: 'chrome'})

      await eyes.open(driver, config)
      await eyes.check({layoutBreakpoints: true})
      await eyes.close(false)
      const warns = [
        `The following configurations [(chrome)] have a viewport-width of 200 pixels, while your local browser has a limit of 300 pixels, so the SDK couldn't resize it to the desired size. As a fallback, the resources that will be used for these checkpoints have been captured on the browser's limit (300 pixels). To resolve this, you may use a headless browser as it can be resized to any size.`,
        `The following configurations [(chrome)] have a viewport-width of 1000 pixels, while your local browser has a limit of 800 pixels, so the SDK couldn't resize it to the desired size. As a fallback, the resources that will be used for these checkpoints have been captured on the browser's limit (800 pixels). To resolve this, you may use a headless browser as it can be resized to any size.`,
      ]
      warns.forEach((warn, index) => {
        assert.strictEqual(output[index], chalk.yellow(warn) + '\n')
      })
    })

    it('should warn if not able to resize to the breakpoint width', async () => {
      const config = new Configuration()
        .setAppName('appName')
        .setTestName('testName')
        .setViewportSize({width: 600, height: 700})
        .addBrowser({width: 200, height: 400, name: 'chrome'})
        .addBrowser({width: 700, height: 900, name: 'chrome'})
        .addBrowser({width: 1000, height: 1200, name: 'chrome'})
      await eyes.open(driver, config)
      await eyes.check({layoutBreakpoints: [200, 700, 1000]})
      await eyes.close(false)
      const warns = [
        `One of the configured layout breakpoints is 200 pixels, while your local browser has a limit of 300, so the SDK couldn't resize it to the desired size. As a fallback, the resources that will be used for the following configurations: [(chrome, 200)] have been captured on the browser's limit (300 pixels). To resolve this, you may use a headless browser as it can be resized to any size.`,
        `One of the configured layout breakpoints is 1000 pixels, while your local browser has a limit of 800, so the SDK couldn't resize it to the desired size. As a fallback, the resources that will be used for the following configurations: [(chrome, 1000)] have been captured on the browser's limit (800 pixels). To resolve this, you may use a headless browser as it can be resized to any size.`,
      ]
      warns.forEach((warn, index) => {
        assert.strictEqual(output[index], chalk.yellow(warn) + '\n')
      })
    })

    it('warn if device is smaller than the smallest breakpoint', async () => {
      const config = new Configuration()
        .setAppName('appName')
        .setTestName('testName')
        .setViewportSize({width: 600, height: 700})
        .addBrowser({width: 300, height: 400, name: 'chrome'})
        .addBrowser({width: 350, height: 400, name: 'chrome'})
        .addBrowser({width: 700, height: 900, name: 'chrome'})
      await eyes.open(driver, config)
      await eyes.check({layoutBreakpoints: [400, 500]})
      await eyes.close(false)
      const warns = [
        `The following configuration's viewport-widths are smaller than the smallest configured layout breakpoint (400 pixels): [(chrome, 300), (chrome, 350)]. As a fallback, the resources that will be used for these configurations have been captured on a viewport-width of 400 - 1 pixels. If an additional layout breakpoint is needed for you to achieve better results - please add it to your configuration.`,
      ]
      warns.forEach((warn, index) => {
        assert.strictEqual(output[index], chalk.yellow(warn) + '\n')
      })
    })
  })
})
