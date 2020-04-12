const supportedTests = require('./supported-tests')
const {makeEmitTracker} = require('@applitools/sdk-test-kit').coverageTests
const sdkName = 'eyes-selenium'
//const batch = new BatchInfo(`JS Coverage Tests - ${sdkName}`)

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
  result.storeHook(
    'vars',
    `const _makeRegionLocator = target => {
      return typeof target === 'string' ? By.css(target) : new Region(target)
    }`,
  )

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
    debugger
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
      result.storeHook('beforeEach', `eyes.setApiKey(${process.env.APPLITOOLS_API_KEY_SDK})`)
    }
    //eyes.setBatch(batch)
  }

  function _cleanup() {
    result.storeHook('afterEach', 'await driver.close()')
    result.storeHook('afterEach', 'await eyes.abort()')
  }

  function abort() {
    result.storeCommand('eyes ? await eyes.abortIfNotClosed() : undefined')
  }

  function checkFrame() {
    //target,
    //{isClassicApi = false, isFully = false, tag, matchTimeout, isLayout, floatingRegion} = {},
    result.storeCommand('checkFrame')
    //if (isClassicApi) {
    //  await eyes.checkFrame(By.css(target), matchTimeout, tag)
    //} else {
    //  let _checkSettings
    //  if (Array.isArray(target)) {
    //    target.forEach((entry, index) => {
    //      index === 0
    //        ? (_checkSettings = Target.frame(By.css(entry)))
    //        : _checkSettings.frame(By.css(entry))
    //    })
    //  } else {
    //    _checkSettings = Target.frame(By.css(target))
    //  }
    //  if (floatingRegion) {
    //    _checkSettings.floatingRegion(
    //      _makeRegionLocator(floatingRegion.target),
    //      floatingRegion.maxUp,
    //      floatingRegion.maxDown,
    //      floatingRegion.maxLeft,
    //      floatingRegion.maxRight,
    //    )
    //  }
    //  if (isLayout) {
    //    _checkSettings.layout()
    //  }
    //  _checkSettings.fully(isFully)
    //  await eyes.check(tag, _checkSettings)
    //}
  }

  function checkRegion() {
    //target,
    //{
    //  floatingRegion,
    //  isClassicApi = false,
    //  isFully = false,
    //  inFrame,
    //  ignoreRegion,
    //  isLayout,
    //  matchTimeout,
    //  tag,
    //} = {},
    result.storeCommand('checkRegion')
    //if (isClassicApi) {
    //  inFrame
    //    ? await eyes.checkRegionInFrame(By.css(inFrame), By.css(target), matchTimeout, tag, isFully)
    //    : await eyes.checkRegionBy(By.css(target), tag, matchTimeout, isFully)
    //} else {
    //  let _checkSettings
    //  if (inFrame) {
    //    _checkSettings = Target.frame(By.css(inFrame))
    //  } else {
    //    if (Array.isArray(target)) {
    //      target.forEach((entry, index) => {
    //        index === 0 && _checkSettings === undefined
    //          ? (_checkSettings = Target.region(_makeRegionLocator(entry)))
    //          : _checkSettings.region(_makeRegionLocator(entry))
    //      })
    //    } else {
    //      _checkSettings
    //        ? _checkSettings.region(_makeRegionLocator(target))
    //        : (_checkSettings = Target.region(_makeRegionLocator(target)))
    //    }
    //  }
    //  if (ignoreRegion) {
    //    _checkSettings.ignoreRegions(_makeRegionLocator(ignoreRegion))
    //  }
    //  if (floatingRegion) {
    //    _checkSettings.floatingRegion(
    //      _makeRegionLocator(floatingRegion.target),
    //      floatingRegion.maxUp,
    //      floatingRegion.maxDown,
    //      floatingRegion.maxLeft,
    //      floatingRegion.maxRight,
    //    )
    //  }
    //  if (isLayout) {
    //    _checkSettings.layout()
    //  }
    //  _checkSettings.fully(isFully)
    //  await eyes.check(tag, _checkSettings)
    //}
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
      result.storeCommand(`await eyes.checkWindow(${tag}, ${matchTimeout}, ${isFully})`)
    } else {
      result.storeCommand(
        `let _checkSettings = Target.window()
        .fully(${isFully})
        .ignoreCaret()`,
      )
      if (scrollRootElement) {
        result.storeCommand(`_checkSettings.scrollRootElement(By.css(${scrollRootElement}))`)
      }
      if (ignoreRegion) {
        result.storeCommand(`_checkSettings.ignoreRegions(_makeRegionLocator(${ignoreRegion}))`)
      }
      if (floatingRegion) {
        result.storeCommand(`
        _checkSettings.floatingRegion(
          _makeRegionLocator(${floatingRegion.target}),
          ${floatingRegion.maxUp},
          ${floatingRegion.maxDown},
          ${floatingRegion.maxLeft},
          ${floatingRegion.maxRight},
        )`)
      }
      result.storeCommand(`await eyes.check(undefined, _checkSettings)`)
    }
  }

  function close(options) {
    result.storeCommand(`await eyes.close(${options})`)
  }

  function getAllTestResults() {
    result.storeCommand('getAllTestResults')
    //const resultsSummary = await runner.getAllTestResults()
    //return resultsSummary.getAllResults()
  }

  function _makeRegionLocator(_target) {
    //return typeof target === 'string' ? By.css(target) : new Region(target)
  }

  function open(options) {
    result.storeCommand(`driver = await eyes.open(
      driver,
      '${options.appName}',
      baselineTestName,
      RectangleSize.parse('${options.viewportSize}'),
    )`)
  }

  function scrollDown(_pixels) {
    result.storeCommand('scrollDown')
    //await driver.executeScript(`window.scrollBy(0,${pixels})`)
  }

  function switchToFrame(_selector) {
    result.storeCommand('switchToFrame')
    //const element = await driver.findElement(By.css(selector))
    //await driver.switchTo().frame(element)
  }

  function type(_locator, _inputText) {
    result.storeCommand('type')
    //await driver.findElement(By.css(locator)).sendKeys(inputText)
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
  options: {needsChromeDriver: true, chromeDriverOptions: ['--silent']},
}
