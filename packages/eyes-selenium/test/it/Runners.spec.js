'use strict'

require('chromedriver')
const assert = require('assert')
const {getDriver} = require('../coverage/custom/util/TestSetup')
const {
  Eyes,
  ClassicRunner,
  VisualGridRunner,
  Target,
  Configuration,
  BatchInfo,
  ConsoleLogHandler,
  BrowserType,
  DeviceName,
  ScreenOrientation,
} = require('../../index')

function makeInitializeEyes({runner, batchName, isVisualGrid = false}) {
  const batchInfo = new BatchInfo(batchName)

  return function initializeEyes({appName, testName}) {
    const eyes = new Eyes(runner)
    if (process.env.APPLITOOLS_SHOW_LOGS) {
      eyes.setLogHandler(new ConsoleLogHandler(true))
    }
    const configuration = new Configuration()
    configuration.setAppName(appName)
    configuration.setTestName(testName)
    configuration.setBatch(batchInfo)
    if (isVisualGrid) {
      configuration.addBrowser(800, 600, BrowserType.CHROME)
      configuration.addBrowser(700, 500, BrowserType.CHROME)
      configuration.addBrowser(1200, 800, BrowserType.FIREFOX)
      configuration.addBrowser(1600, 1200, BrowserType.FIREFOX)
      configuration.addDeviceEmulation(DeviceName.iPhone_4, ScreenOrientation.PORTRAIT)
    }
    eyes.setConfiguration(configuration)
    return eyes
  }
}

async function runTest({driver, eyes, url}) {
  await driver.get(url)
  await eyes.open(driver)
  await eyes.check(`Main Page ${url}`, Target.window())
  await eyes.close(false)
}

const urlsToTest = [
  'https://applitools.com/helloworld',
  'http://applitools-dom-capture-origin-1.surge.sh/testWithIframe.html',
  'http://applitools.github.io/demo/TestPages/FramesTestPage/',
]

async function runTests({initializeEyes, displayName}) {
  const driver = await getDriver('CHROME')
  try {
    for (const url of urlsToTest) {
      const testName = urlsToTest.indexOf(url).toString()
      const eyes = initializeEyes({appName: displayName, testName})
      await runTest({driver, eyes, url}).catch(console.error)
    }
  } finally {
    await driver.quit()
  }
}

describe('Runners', () => {
  it('ClassicRunner', async function() {
    const displayName = this.test.title
    const runner = new ClassicRunner()
    const initializeEyes = makeInitializeEyes({runner, batchName: displayName})

    await runTests({initializeEyes, displayName})

    const results = await runner.getAllTestResults(false)
    assert.strictEqual(results.getAllResults().length, 3)
  })

  it('VisualGridRunner', async function() {
    const displayName = this.test.title
    const runner = new VisualGridRunner(10)
    const initializeEyes = makeInitializeEyes({runner, batchName: displayName, isVisualGrid: true})

    await runTests({initializeEyes, displayName})

    const results = await runner.getAllTestResults(false)
    assert.strictEqual(results.getAllResults().length, 15)
  })
})
