const supportedTests = require('./supported-tests')
const {makeEmitTracker} = require('@applitools/sdk-coverage-tests')
const uuidv4 = require('uuid/v4')
const sdkName = 'eyes.webdriverio.javascript4'
const branchId = uuidv4()

function initialize() {
  const result = makeEmitTracker()
  result.storeHook('deps', `const {remote} = require('webdriverio')`)
  result.storeHook(
    'deps',
    `const {
    By,
    Eyes,
    BatchInfo,
    RectangleSize,
    StitchMode,
    VisualGridRunner,
    Target,
    Region,
    FileLogHandler,
  } = require('../../index')`,
  )
  result.storeHook('deps', `const path = require('path')`)
  result.storeHook('vars', 'let eyes')
  result.storeHook('vars', 'let driver')
  result.storeHook('vars', 'let runner')
  let baselineTestName

  // TODO: add support --remote runner flag (e.g., options.host) to connect to a remote Selenium Grid
  // Right now, wdio implicitly connects to http://localhost:4444/wd/hub
  async function _setup(options) {
    baselineTestName = options.baselineTestName
    result.storeHook(
      'beforeEach',
      `const browserOptions = {
        logLevel: 'error',
        desiredCapabilities: {
          browserName: 'chrome',
          'goog:chromeOptions': {
            args: ['--headless'],
          },
        },
      }`,
    )
    result.storeHook('beforeEach', `driver = remote(browserOptions)`)
    result.storeHook('beforeEach', `await driver.init()`)
    result.storeHook(
      'beforeEach',
      `runner = ${
        options.executionMode.isVisualGrid ? 'runner = new VisualGridRunner(10)' : undefined
      }`,
    )
    result.storeHook(
      'beforeEach',
      `eyes = ${options.executionMode.isVisualGrid ? 'new Eyes(runner)' : 'new Eyes()'}`,
    )
    result.storeHook(
      'beforeEach',
      `${options.executionMode.isCssStitching ? 'eyes.setStitchMode(StitchMode.CSS)' : undefined}`,
    )
    result.storeHook(
      'beforeEach',
      `${
        options.executionMode.isScrollStitching
          ? 'eyes.setStitchMode(StitchMode.SCROLL)'
          : undefined
      }`,
    )
    result.storeHook('beforeEach', `eyes.setBranchName('${options.branchName}')`)
    result.storeHook('beforeEach', `eyes.setBatch('JS Coverage Tests - ${sdkName}', '${branchId}')`)
    if (!options.executionMode.isVisualGrid) {
      result.storeHook('beforeEach', `eyes.setHideScrollbars(true)`)
    }
    if (process.env.APPLITOOLS_SHOW_LOGS) {
      result.storeHook('beforeEach', `const logsFolder = path.resolve(__dirname, 'logs')`)
      result.storeHook(
        'beforeEach',
        `const logHandler = new FileLogHandler(
        true,
        path.resolve(logsFolder, '${baselineTestName}.log'),
        false,
      )`,
      )
      result.storeHook('beforeEach', `logHandler.open()`)
      result.storeHook('beforeEach', `eyes.setLogHandler(logHandler)`)
    }
    if (process.env.APPLITOOLS_API_KEY_SDK) {
      result.storeHook('beforeEach', 'eyes.setApiKey(process.env.APPLITOOLS_API_KEY_SDK)')
    }
  }

  async function _cleanup() {
    result.storeHook('afterEach', 'await driver.end()')
  }

  async function abort() {
    result.storeCommand('await eyes.abortIfNotClosed()')
  }

  async function checkFrame(
    target,
    {isClassicApi = false, isFully = false, tag, matchTimeout} = {},
  ) {
    if (isClassicApi) {
      result.storeCommand(`await eyes.checkFrame(By.css(${target}), ${matchTimeout}, ${tag})`)
    } else {
      result.storeCommand(`{`)
      result.storeCommand(`let _checkSettings`)
      if (Array.isArray(target)) {
        target.forEach((entry, index) => {
          index === 0
            ? result.storeCommand(`(_checkSettings = Target.frame(By.css('${entry}')))`)
            : result.storeCommand(`_checkSettings.frame(By.css('${entry}'))`)
        })
      } else {
        result.storeCommand(`_checkSettings = Target.frame(By.css(${target}))`)
      }
      result.storeCommand(`_checkSettings.fully(${isFully})`)
      result.storeCommand(`await eyes.check(${tag ? '"' + tag + '"' : undefined}, _checkSettings)`)
      result.storeCommand(`}`)
    }
  }

  function makeRegionLocator(target) {
    return typeof target === 'string'
      ? `By.css('${target}')`
      : `new Region(${JSON.stringify(target)})`
  }

  async function checkRegion(
    target,
    {isClassicApi = false, isFully = false, inFrame, ignoreRegion, tag, matchTimeout} = {},
  ) {
    if (isClassicApi) {
      inFrame
        ? result.storeCommand(
            `await eyes.checkRegionInFrame(By.css(${inFrame}), By.css(${target}), ${matchTimeout}, ${tag}, ${isFully})`,
          )
        : result.storeCommand(`await eyes.checkRegion(By.css(${target}), ${matchTimeout}, ${tag})`)
    } else {
      result.storeCommand(`{`)
      result.storeCommand(`let _checkSettings`)
      if (inFrame) result.storeCommand(`_checkSettings = Target.frame(By.css(${inFrame}))`)
      if (Array.isArray(target)) {
        target.forEach((entry, index) => {
          index === 0
            ? result.storeCommand(`(_checkSettings = Target.region(${makeRegionLocator(entry)}))`)
            : result.storeCommand(`_checkSettings.region(${makeRegionLocator(entry)})`)
        })
      } else {
        result.storeCommand(`_checkSettings
          ? _checkSettings.region(${makeRegionLocator(target)})
          : (_checkSettings = Target.region(${makeRegionLocator(target)}))`)
      }
      if (ignoreRegion) {
        result.storeCommand(`_checkSettings.ignoreRegions(${makeRegionLocator(ignoreRegion)})`)
      }
      result.storeCommand(`_checkSettings.fully(${isFully})`)
      result.storeCommand(`await eyes.check(${tag ? '"' + tag + '"' : undefined}, _checkSettings)`)
      result.storeCommand(`}`)
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
      result.storeCommand(
        `await eyes.checkWindow(${tag ? '"' + tag + '"' : undefined}, ${matchTimeout}, ${isFully})`,
      )
    } else {
      result.storeCommand(`{`)
      result.storeCommand(
        `let _checkSettings = Target.window()
        .fully(${isFully})
        .ignoreCaret()`,
      )
      if (scrollRootElement) {
        result.storeCommand(`_checkSettings.scrollRootElement(By.css('${scrollRootElement}'))`)
      }
      if (ignoreRegion) {
        result.storeCommand(`_checkSettings.ignoreRegions(${makeRegionLocator(ignoreRegion)})`)
      }
      if (floatingRegion) {
        result.storeCommand(`
        _checkSettings.floatingRegion(
          ${makeRegionLocator(floatingRegion.target)},
          ${floatingRegion.maxUp},
          ${floatingRegion.maxDown},
          ${floatingRegion.maxLeft},
          ${floatingRegion.maxRight},
        )`)
      }
      result.storeCommand(`await eyes.check(undefined, _checkSettings)`)
      result.storeCommand(`}`)
    }
  }

  async function close(options) {
    result.storeCommand(`await eyes.close(${options})`)
  }

  async function getAllTestResults() {
    result.storeCommand(`const resultsSummary = await runner.getAllTestResults()`)
    result.storeCommand(`const allResults = resultsSummary.getAllResults()`)
  }

  async function open({appName, viewportSize}) {
    result.storeCommand(
      `await eyes.open(driver, ${appName}, ${baselineTestName}, RectangleSize.parse(${viewportSize}))`,
    )
  }

  async function visit(url) {
    result.storeCommand(`await driver.url(${url})`)
  }

  async function scrollDown(pixels) {
    result.storeCommand(`await driver.execute('window.scrollBy(0,${pixels})')`)
  }

  async function switchToFrame(selector) {
    result.storeCommand(`await driver.frame(By.css(${selector}))`)
  }

  async function type(selector, text) {
    result.storeCommand(`await driver.setValue(${selector}, ${text})`)
  }

  return {
    hooks: {
      beforeEach: _setup,
      afterEach: _cleanup,
    },
    out: result,
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
}
