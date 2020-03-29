const {remote} = require('webdriverio')
const {By} = require('selenium-webdriver')
const {
  Eyes,
  BatchInfo,
  RectangleSize,
  StitchMode,
  VisualGridRunner,
  Target,
  Region,
} = require('../../index')

const sdkName = 'eyes.webdriverio.javascript5'
const batch = new BatchInfo(`JS Coverage Tests - ${sdkName}`)
const supportedTests = require('./supported-tests')

function initialize() {
  let eyes
  let driver
  let runner
  let baselineTestName

  // TODO: add support --remote runner flag (e.g., options.host) to connect to a remote Selenium Grid
  // Right now, wdio implicitly connects to http://localhost:4444/wd/hub
  async function _setup(options) {
    baselineTestName = options.baselineTestName
    const browserOptions = {
      logLevel: 'error',
      capabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          args: ['--headless'],
        },
      },
    }
    driver = await remote(browserOptions)
    runner = options.executionMode.isVisualGrid ? (runner = new VisualGridRunner(10)) : undefined
    eyes = options.executionMode.isVisualGrid ? new Eyes(runner) : new Eyes()
    options.executionMode.isCssStitching ? eyes.setStitchMode(StitchMode.CSS) : undefined
    options.executionMode.isScrollStitching ? eyes.setStitchMode(StitchMode.SCROLL) : undefined
    eyes.setBranchName(options.branchName)
    eyes.setBatch(batch)
    if (process.env.APPLITOOLS_API_KEY_SDK) {
      eyes.setApiKey(process.env.APPLITOOLS_API_KEY_SDK)
    }
  }

  async function _cleanup() {
    await driver.deleteSession()
  }

  async function abort() {
    await eyes.abortIfNotClosed()
  }

  async function checkFrame(
    target,
    {isClassicApi = false, isFully = false, tag, matchTimeout} = {},
  ) {
    if (isClassicApi) {
      await eyes.checkFrame(By.css(target), matchTimeout, tag)
    } else {
      let _checkSettings
      if (Array.isArray(target)) {
        target.forEach((entry, index) => {
          index === 0
            ? (_checkSettings = Target.frame(By.css(entry)))
            : _checkSettings.frame(By.css(entry))
        })
      } else {
        _checkSettings = Target.frame(By.css(target))
      }
      _checkSettings.fully(isFully)
      await eyes.check(tag, _checkSettings)
    }
  }

  async function checkRegion(
    target,
    {isClassicApi = false, isFully = false, inFrame, ignoreRegion, tag, matchTimeout} = {},
  ) {
    if (isClassicApi) {
      inFrame
        ? await eyes.checkRegionInFrame(By.css(inFrame), By.css(target), matchTimeout, tag, isFully)
        : await eyes.checkRegion(By.css(target), matchTimeout, tag)
    } else {
      let _checkSettings
      if (inFrame) _checkSettings = Target.frame(By.css(inFrame))
      if (Array.isArray(target)) {
        target.forEach((entry, index) => {
          index === 0 && _checkSettings === undefined
            ? (_checkSettings = Target.region(_makeRegionLocator(entry)))
            : _checkSettings.region(_makeRegionLocator(entry))
        })
      } else {
        _checkSettings
          ? _checkSettings.region(_makeRegionLocator(target))
          : (_checkSettings = Target.region(_makeRegionLocator(target)))
      }
      if (ignoreRegion) {
        _checkSettings.ignoreRegions(_makeRegionLocator(ignoreRegion))
      }
      _checkSettings.fully(isFully)
      await eyes.check(tag, _checkSettings)
    }
  }

  async function checkWindow({
    isClassicApi = false,
    isFully = false,
    ignoreRegion,
    floatingRegion,
    scrollRootElement,
    tag,
    matchTimeout,
  } = {}) {
    if (isClassicApi) {
      await eyes.checkWindow(tag, matchTimeout, isFully)
    } else {
      let _checkSettings = Target.window()
        .fully(isFully)
        .ignoreCaret()
      if (scrollRootElement) {
        _checkSettings.scrollRootElement(By.css(scrollRootElement))
      }
      if (ignoreRegion) {
        _checkSettings.ignoreRegions(_makeRegionLocator(ignoreRegion))
      }
      if (floatingRegion) {
        _checkSettings.floatingRegion(
          _makeRegionLocator(floatingRegion.target),
          floatingRegion.maxUp,
          floatingRegion.maxDown,
          floatingRegion.maxLeft,
          floatingRegion.maxRight,
        )
      }
      await eyes.check(tag, _checkSettings)
    }
  }

  async function close(options) {
    await eyes.close(options)
  }

  async function getAllTestResults() {
    const resultsSummary = await runner.getAllTestResults()
    return resultsSummary.getAllResults()
  }

  const _makeRegionLocator = target => {
    if (typeof target === 'string') return By.css(target)
    else if (typeof target === 'number') return target
    else return new Region(target)
  }

  async function open({appName, viewportSize}) {
    driver = await eyes.open(driver, appName, baselineTestName, RectangleSize.parse(viewportSize))
  }

  async function visit(url) {
    await driver.url(url)
  }

  async function scrollDown(pixels) {
    await driver.executeScript(`window.scrollBy(0,${pixels})`)
  }

  async function switchToFrame(selector) {
    await driver.switchToFrame(By.css(selector))
  }

  async function type(selector, text) {
    await driver.elementSendKeys(selector, text)
  }

  return {
    _setup,
    _cleanup,
    abort,
    visit,
    open,
    checkFrame,
    checkRegion,
    checkWindow,
    close,
    getAllTestResults,
    scrollDown,
    switchToFrame,
    type,
  }
}

module.exports = {
  name: sdkName,
  initialize,
  supportedTests,
  options: {
    needsChromeDriver: true,
    chromeDriverOptions: ['--port=4444', '--url-base=wd/hub', '--silent'],
  },
}
