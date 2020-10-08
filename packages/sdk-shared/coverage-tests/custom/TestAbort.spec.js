'use strict'
const cwd = process.cwd()
const path = require('path')
const {batch} = require('../../src/test-setup')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const expect = chai.expect
const {
  Configuration,
  Target,
  BrowserType,
  DeviceName,
  ScreenOrientation,
  ClassicRunner,
  VisualGridRunner,
  Eyes,
  StitchMode,
} = require(cwd)
const spec = require(path.resolve(cwd, 'src/spec-driver'))

const appName = 'Test abort'
const testedUrl = 'https://applitools.com/docs/topics/overview.html'

describe(appName, () => {
  let webDriver, destroyDriver, eyes, config, runner
  after(async () => {
    await displayRunInfo(runner)
  })

  async function afterEach() {
    if (eyes.getIsOpen()) {
      await eyes.close(false)
    }
    await destroyDriver()
  }

  describe(`TestAbort`, () => {
    before(async () => {
      config = getConfig()
      config.setStitchMode(StitchMode.CSS)
      runner = new ClassicRunner()
    })

    async function beforeEach() {
      eyes = new Eyes(runner)
      eyes.setConfiguration(config)
      ;[webDriver, destroyDriver] = await spec.build({browser: 'chrome'})
    }

    it(`Test_GetAllResults`, async () => {
      await beforeEach()
      expect(Test_ThrowBeforeOpen).to.throw('Before Open')
      await afterEach()
      await beforeEach()
      await expect(Test_ThrowAfterOpen()).to.be.rejectedWith(Error, 'After Open')
      await afterEach()
      await beforeEach()
      await expect(Test_ThrowDuringCheck()).to.be.rejectedWith(Error)
      await afterEach()
      await beforeEach()
      await expect(Test_ThrowAfterCheck()).to.be.rejectedWith(Error, 'After Check')
      await afterEach()
    })
  })

  describe(`TestAbort_VG`, () => {
    before(async () => {
      config = getConfig()
      runner = new VisualGridRunner()
    })

    async function beforeEach() {
      eyes = new Eyes(runner)
      eyes.setConfiguration(config)
      ;[webDriver, destroyDriver] = await spec.build({browser: 'chrome'})
    }

    it.skip(`Test_GetAllResults_VG`, async () => {
      await beforeEach()
      expect(Test_ThrowBeforeOpen).to.throw('Before Open')
      await afterEach()
      await beforeEach()
      await expect(Test_ThrowAfterOpen()).to.be.rejectedWith(Error, 'After Open')
      await afterEach()
      await beforeEach()
      await expect(Test_ThrowDuringCheck()).to.be.rejectedWith(Error)
      await afterEach()
      await beforeEach()
      await expect(Test_ThrowAfterCheck()).to.be.rejectedWith(Error, 'After Check')
      await afterEach()
    })
  })
  function Test_ThrowBeforeOpen() {
    let testConfig = eyes.getConfiguration()
    testConfig.setTestName(`test URL : ${testedUrl}`)
    eyes.setConfiguration(testConfig)
    throw new Error('Before Open')
  }
  async function Test_ThrowAfterOpen() {
    let testConfig = eyes.getConfiguration()
    testConfig.setTestName(`test URL : ${testedUrl}`)
    eyes.setConfiguration(testConfig)
    await eyes.open(webDriver)
    throw new Error('After Open')
  }
  async function Test_ThrowDuringCheck() {
    let testConfig = eyes.getConfiguration()
    testConfig.setTestName(`test URL : ${testedUrl}`)
    eyes.setConfiguration(testConfig)
    let driver = await eyes.open(webDriver)
    await spec.visit(driver, testedUrl)
    await eyes.check(`Step 1 Content - ${testedUrl}`, Target.frame('non-existing frame'))
  }
  async function Test_ThrowAfterCheck() {
    let testConfig = eyes.getConfiguration()
    testConfig.setTestName(`test URL : ${testedUrl}`)
    eyes.setConfiguration(testConfig)
    let driver = await eyes.open(webDriver)
    await spec.visit(driver, testedUrl)
    await eyes.check(`Step 1 Content - ${testedUrl}`, Target.window())
    throw new Error('After Check')
  }
})

function getConfig() {
  let config = new Configuration()
  config.setAppName(appName)
  config.setBatch(batch)
  if (process.env['APPLITOOLS_API_KEY_SDK']) {
    config.setApiKey(process.env['APPLITOOLS_API_KEY_SDK'])
  }
  config.setViewportSize({width: 800, height: 600})
  config.addBrowser(900, 600, BrowserType.CHROME)
  config.addBrowser(1024, 786, BrowserType.CHROME)
  config.addBrowser(900, 600, BrowserType.FIREFOX)
  config.addBrowser(900, 600, BrowserType.IE_10)
  config.addBrowser(900, 600, BrowserType.IE_11)
  config.addBrowser(900, 600, BrowserType.EDGE)
  config.addDeviceEmulation(DeviceName.iPhone_4, ScreenOrientation.PORTRAIT)
  config.addDeviceEmulation(DeviceName.Galaxy_S5, ScreenOrientation.LANDSCAPE)
  return config
}

async function displayRunInfo(runner) {
  let testResultSummary = await runner.getAllTestResults(false)
  let containers = testResultSummary.getAllResults()
  containers.forEach(container => {
    let ex = container.getException()
    if (ex) console.log(`System error occured while checking target: ${ex}`)
    let result = container.getTestResults()
    result
      ? console.log(
          `AppName = ${result.getAppName()},
                 testname = ${result.getName()},
                 Browser = ${result.getHostApp()},
                 OS = ${result.getHostOS()},
                 viewport = ${result.getHostDisplaySize()},
                 matched = ${result.getMatches()},
                 mismatched = ${result.getMismatches()},
                 missing = ${result.getMissing()},
                 aborted = ${result.getIsAborted()}\\n`,
        )
      : console.log(`No test results information available`)
  })
}
