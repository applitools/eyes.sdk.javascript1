//const {Builder, By} = require('selenium-webdriver')
//const {Options: ChromeOptions} = require('selenium-webdriver/chrome')
//const {
//  Eyes,
//  BatchInfo,
//  RectangleSize,
//  Target,
//  StitchMode,
//  VisualGridRunner,
//  Region,
//} = require('../../index')
//
//const sdkName = 'eyes-selenium'
//const batch = new BatchInfo(`JS Coverage Tests - ${sdkName}`)
const supportedTests = require('./supported-tests')
const {makeEmitTracker} = require('@applitools/sdk-test-kit').coverageTests

function initialize() {
  const result = makeEmitTracker()
  //let eyes
  //let driver
  //let runner
  //let baselineTestName

  function _setup(options) {
    result.hooks.beforeEach.push('setup')
    //baselineTestName = options.baselineTestName
    //driver = await new Builder()
    //  .forBrowser('chrome')
    //  .setChromeOptions(new ChromeOptions().headless())
    //  .usingServer(options.host)
    //  .build()
    //runner = options.executionMode.isVisualGrid ? (runner = new VisualGridRunner(10)) : undefined
    //eyes = options.executionMode.isVisualGrid ? new Eyes(runner) : new Eyes()
    //options.executionMode.isCssStitching ? eyes.setStitchMode(StitchMode.CSS) : undefined
    //options.executionMode.isScrollStitching ? eyes.setStitchMode(StitchMode.SCROLL) : undefined
    //eyes.setBranchName(options.branchName)
    //eyes.setBatch(batch)
    //if (process.env.APPLITOOLS_API_KEY_SDK) {
    //  eyes.setApiKey(process.env.APPLITOOLS_API_KEY_SDK)
    //}
  }

  function _cleanup() {
    result.hooks.afterEach.push('cleanup')
    //await driver.close()
    //await abort()
  }

  function abort() {
    result.commands.push('abort')
    //eyes ? await eyes.abortIfNotClosed() : undefined
  }

  function checkFrame(
    target,
    {isClassicApi = false, isFully = false, tag, matchTimeout, isLayout, floatingRegion} = {},
  ) {
    result.commands.push('checkFrame')
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
    result.commands.push('checkRegion')
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
    result.commands.push('checkWindow')
    //if (isClassicApi) {
    //  await eyes.checkWindow(tag, matchTimeout, isFully)
    //} else {
    //  let _checkSettings = Target.window()
    //    .fully(isFully)
    //    .ignoreCaret()
    //  if (scrollRootElement) {
    //    _checkSettings.scrollRootElement(By.css(scrollRootElement))
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
    //  await eyes.check(undefined, _checkSettings)
    //}
  }

  function close(options) {
    result.commands.push('close')
    //await eyes.close(options)
  }

  function getAllTestResults() {
    result.commands.push('getAllTestResults')
    //const resultsSummary = await runner.getAllTestResults()
    //return resultsSummary.getAllResults()
  }

  function _makeRegionLocator(target) {
    //return typeof target === 'string' ? By.css(target) : new Region(target)
  }

  function open(options) {
    result.commands.push('open')
    //driver = await eyes.open(
    //  driver,
    //  options.appName,
    //  baselineTestName,
    //  RectangleSize.parse(options.viewportSize),
    //)
  }

  function scrollDown(pixels) {
    result.commands.push('scrollDown')
    //await driver.executeScript(`window.scrollBy(0,${pixels})`)
  }

  function switchToFrame(selector) {
    result.commands.push('switchToFrame')
    //const element = await driver.findElement(By.css(selector))
    //await driver.switchTo().frame(element)
  }

  function type(locator, inputText) {
    result.commands.push('type')
    //await driver.findElement(By.css(locator)).sendKeys(inputText)
  }

  function visit(url) {
    result.commands.push('visit')
    //await driver.get(url)
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
  //name: sdkName,
  initialize,
  supportedTests,
  options: {needsChromeDriver: true, chromeDriverOptions: ['--silent']},
}
