const supportedTests = require('./supported-tests')
const {makeEmitTracker} = require('@applitools/sdk-test-kit').coverageTests
const uuidv4 = require('uuid/v4')
const sdkName = 'eyes-selenium'
const branchId = uuidv4()

function initialize() {
  const result = makeEmitTracker()
  result.storeHook('deps', `const {Builder, By} = require('selenium-webdriver')`)
  result.storeHook('deps', `const {Options: ChromeOptions} = require('selenium-webdriver/chrome')`)
  result.storeHook(
    'deps',
    `const {
  Eyes,
  BatchInfo,
  RectangleSize,
  Target,
  StitchMode,
  VisualGridRunner,
  Region,
} = require('../../../index')`,
  )
  result.storeHook('vars', 'let eyes')
  result.storeHook('vars', 'let driver')
  result.storeHook('vars', 'let runner')
  result.storeHook('vars', 'let baselineTestName')

  function _setup(options) {
    result.storeHook('beforeEach', `baselineTestName = '${options.baselineTestName}'`)
    result.storeHook(
      'beforeEach',
      `driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new ChromeOptions().headless())
      .usingServer(${options.host ? "'" + options.host + "'" : undefined})
      .build()`,
    )
    result.storeHook(
      'beforeEach',
      `runner = ${options.executionMode.isVisualGrid ? 'new VisualGridRunner(10)' : 'undefined'}`,
    )
    result.storeHook(
      'beforeEach',
      `eyes = ${options.executionMode.isVisualGrid ? 'new Eyes(runner)' : 'new Eyes()'}`,
    )
    if (options.executionMode.isCssStitching)
      result.storeHook('beforeEach', 'eyes.setStitchMode(StitchMode.CSS)')
    if (options.executionMode.isScrollStitching)
      result.storeHook('beforeEach', 'eyes.setStitchMode(StitchMode.SCROLL)')
    result.storeHook('beforeEach', `eyes.setBranchName('${options.branchName}')`)
    if (process.env.APPLITOOLS_API_KEY_SDK) {
      result.storeHook('beforeEach', `eyes.setApiKey(process.env.APPLITOOLS_API_KEY_SDK)`)
    }
    result.storeHook('beforeEach', `eyes.setBatch('JS Coverage Tests - ${sdkName}', '${branchId}')`)
    result.storeHook('beforeEach', `eyes.setMatchTimeout(0)`)
  }

  function _cleanup() {
    result.storeHook('afterEach', 'await driver.quit()')
    result.storeHook('afterEach', 'await eyes.abort()')
  }

  function abort() {
    result.storeCommand('eyes ? await eyes.abortIfNotClosed() : undefined')
  }

  function makeRegionLocator(target) {
    return typeof target === 'string'
      ? `By.css('${target}')`
      : `new Region(${JSON.stringify(target)})`
  }

  function checkFrame(
    target,
    {isClassicApi = false, isFully = false, tag, matchTimeout, isLayout, floatingRegion} = {},
  ) {
    if (isClassicApi) {
      result.storeCommand(
        `await eyes.checkFrame(By.css('${target}'), ${matchTimeout}, ${
          tag ? '"' + tag + '"' : undefined
        })`,
      )
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
        result.storeCommand(`_checkSettings = Target.frame(By.css('${target}'))`)
      }
      if (floatingRegion) {
        result.storeCommand(`_checkSettings.floatingRegion(
          ${makeRegionLocator(floatingRegion.target)},
          ${floatingRegion.maxUp},
          ${floatingRegion.maxDown},
          ${floatingRegion.maxLeft},
          ${floatingRegion.maxRight},
        )`)
      }
      if (isLayout) {
        result.storeCommand(`_checkSettings.layout()`)
      }
      result.storeCommand(`_checkSettings.fully(${isFully})`)
      result.storeCommand(`await eyes.check(${tag ? '"' + tag + '"' : undefined}, _checkSettings)`)
      result.storeCommand(`}`)
    }
  }

  function checkRegion(
    target,
    {
      floatingRegion,
      isClassicApi = false,
      isFully = false,
      inFrame,
      ignoreRegion,
      isLayout,
      matchTimeout,
      tag,
    } = {},
  ) {
    if (isClassicApi) {
      inFrame
        ? result.storeCommand(
            `await eyes.checkRegionInFrame(By.css('${inFrame}'), By.css('${target}'), ${matchTimeout}, ${
              tag ? '"' + tag + '"' : undefined
            }, ${isFully})`,
          )
        : result.storeCommand(
            `await eyes.checkRegionBy(By.css('${target}'), ${
              tag ? '"' + tag + '"' : undefined
            }, ${matchTimeout}, ${isFully})`,
          )
    } else {
      result.storeCommand(`{`)
      result.storeCommand(`let _checkSettings`)
      if (inFrame) {
        result.storeCommand(`_checkSettings = Target.frame(By.css('${inFrame}'))`)
      } else {
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
      }
      if (ignoreRegion) {
        result.storeCommand(`_checkSettings.ignoreRegions(${makeRegionLocator(ignoreRegion)})`)
      }
      if (floatingRegion) {
        result.storeCommand(
          `_checkSettings.floatingRegion(
            ${makeRegionLocator(floatingRegion.target)},
            ${floatingRegion.maxUp},
            ${floatingRegion.maxDown},
            ${floatingRegion.maxLeft},
            ${floatingRegion.maxRight},
          )`,
        )
      }
      if (isLayout) {
        result.storeCommand(`_checkSettings.layout()`)
      }
      result.storeCommand(`_checkSettings.fully(${isFully})`)
      result.storeCommand(`await eyes.check(${tag ? '"' + tag + '"' : undefined}, _checkSettings)`)
      result.storeCommand(`}`)
    }
  }

  function checkWindow({
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

  function close(options) {
    result.storeCommand(`await eyes.close(${options})`)
  }

  function getAllTestResults() {
    result.storeCommand(`{`)
    result.storeCommand(`const resultsSummary = await runner.getAllTestResults()`)
    result.storeCommand(`resultsSummary = resultsSummary.getAllResults()`)
    result.storeCommand(`}`)
  }

  function open(options) {
    result.storeCommand(`driver = await eyes.open(
      driver,
      '${options.appName}',
      baselineTestName,
      RectangleSize.parse('${options.viewportSize}'),
    )`)
  }

  function scrollDown(pixels) {
    result.storeCommand(`await driver.executeScript('window.scrollBy(0,${pixels})')`)
  }

  function switchToFrame(selector) {
    result.storeCommand(`{`)
    result.storeCommand(`const element = await driver.findElement(By.css('${selector}'))`)
    result.storeCommand(`await driver.switchTo().frame(element)`)
    result.storeCommand(`}`)
  }

  function type(locator, inputText) {
    result.storeCommand(`await driver.findElement(By.css('${locator}')).sendKeys('${inputText}')`)
  }

  function visit(url) {
    result.storeCommand(`await driver.get('${url}')`)
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
  //options: {needsChromeDriver: true, chromeDriverOptions: ['--silent']},
}
