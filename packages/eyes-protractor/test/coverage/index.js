const supportedTests = require('./supported-tests')
const {makeEmitTracker} = require('@applitools/sdk-coverage-tests')
const sdkName = 'eyes-protractor'

function initialize() {
  const result = makeEmitTracker()
  result.storeHook('deps', `const cwd = process.cwd()`)
  result.storeHook('deps', `const path = require('path')`)
  result.storeHook('deps', `const specs = require(path.resolve(cwd, 'src/SpecWrappedDriver'))`)
  result.storeHook(
    'deps',
    `const {
      getEyes,
      Browsers
    } = require('@applitools/sdk-coverage-tests/coverage-tests/util/TestSetup')`,
  )
  result.storeHook('deps', `const {Target, RectangleSize, Region} = require(cwd)`)
  result.storeHook('vars', 'let eyes')
  result.storeHook('vars', 'let driver')
  result.storeHook('vars', 'let runner')
  result.storeHook('vars', 'let baselineTestName')

  function _setup(options) {
    result.storeHook('beforeEach', `baselineTestName = '${options.baselineTestName}'`)
    result.storeHook(
      'beforeEach',
      `driver = await specs.build({
        capabilities: Browsers.chrome(),
        serverUrl: ${options.host ? `'${options.host}'` : undefined},
        logLevel: 'error',
      })`,
    )
    result.storeHook(
      'beforeEach',
      `eyes = getEyes({
        isVisualGrid: ${options.executionMode.isVisualGrid},
        isCssStitching: ${options.executionMode.isCssStitching},
        branchName: '${options.branchName}',
      })`,
    )
    result.storeHook('beforeEach', `eyes.setMatchTimeout(0)`)
  }

  function _cleanup() {
    result.storeHook('afterEach', 'await specs.cleanup(driver)')
  }

  function abort() {
    result.storeCommand('eyes ? await eyes.abortIfNotClosed() : undefined')
  }

  function makeRegionLocator(target) {
    return typeof target === 'string'
      ? `specs.toSupportedSelector({type: 'css', selector: '${target}'})`
      : `new Region(${JSON.stringify(target)})`
  }

  function checkFrame(
    target,
    {isClassicApi = false, isFully = false, tag, matchTimeout = 0, isLayout, floatingRegion} = {},
  ) {
    if (isClassicApi) {
      result.storeCommand(
        `await eyes.checkFrame(
          ${makeRegionLocator(target)},
          ${matchTimeout},
          ${tag ? `'${tag}` : undefined},
        )`,
      )
    } else {
      result.storeCommand(`{`)
      result.storeCommand(`let checkSettings = new Target()`)
      if (Array.isArray(target)) {
        target.forEach(entry => {
          result.storeCommand(`checkSettings.frame(${makeRegionLocator(entry)})`)
        })
      } else {
        result.storeCommand(`checkSettings.frame(${makeRegionLocator(target)})`)
      }
      if (floatingRegion) {
        result.storeCommand(`checkSettings.floatingRegion(
          ${makeRegionLocator(floatingRegion.target)},
          ${floatingRegion.maxUp},
          ${floatingRegion.maxDown},
          ${floatingRegion.maxLeft},
          ${floatingRegion.maxRight},
        )`)
      }
      if (isLayout) {
        result.storeCommand(`checkSettings.layout()`)
      }
      result.storeCommand(`checkSettings.fully(${isFully}).timeout(${matchTimeout})`)
      result.storeCommand(`await eyes.check(${tag ? `'${tag}` : undefined}, checkSettings)`)
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
      matchTimeout = 0,
      tag,
    } = {},
  ) {
    if (isClassicApi) {
      inFrame
        ? result.storeCommand(
            `await eyes.checkRegionInFrame(
              ${makeRegionLocator(inFrame)},
              ${makeRegionLocator(target)},
              ${matchTimeout},
              ${tag ? `'${tag}'` : undefined},
              ${isFully}
            )`,
          )
        : result.storeCommand(
            `await eyes.checkRegionBy(
              ${makeRegionLocator(target)},
              ${tag ? `'${tag}'` : undefined},
              ${matchTimeout},
              ${isFully}
            )`,
          )
    } else {
      result.storeCommand(`{`)
      result.storeCommand(`const checkSettings = new Target()`)
      if (Array.isArray(inFrame)) {
        inFrame.forEach(entry => {
          result.storeCommand(`checkSettings.frame(${makeRegionLocator(entry)})`)
        })
      } else if (inFrame) {
        result.storeCommand(`checkSettings.frame(${makeRegionLocator(inFrame)})`)
      }
      result.storeCommand(`checkSettings.region(${makeRegionLocator(target)})`)
      if (ignoreRegion) {
        result.storeCommand(`checkSettings.ignoreRegions(${makeRegionLocator(ignoreRegion)})`)
      }
      if (floatingRegion) {
        result.storeCommand(
          `checkSettings.floatingRegion(
            ${makeRegionLocator(floatingRegion.target)},
            ${floatingRegion.maxUp},
            ${floatingRegion.maxDown},
            ${floatingRegion.maxLeft},
            ${floatingRegion.maxRight},
          )`,
        )
      }
      if (isLayout) {
        result.storeCommand(`checkSettings.layout()`)
      }
      result.storeCommand(`checkSettings.fully(${isFully}).timeout(${matchTimeout})`)
      result.storeCommand(`await eyes.check(${tag ? `'${tag}'` : undefined}, checkSettings)`)
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
    matchTimeout = 0,
  } = {}) {
    if (isClassicApi) {
      result.storeCommand(
        `await eyes.checkWindow(${tag ? `'${tag}'` : undefined}, ${matchTimeout}, ${isFully})`,
      )
    } else {
      result.storeCommand(`{`)
      result.storeCommand(
        `const checkSettings = Target.window()
        .fully(${isFully})
        .ignoreCaret()
        .timeout(${matchTimeout})`,
      )
      if (scrollRootElement) {
        result.storeCommand(
          `checkSettings.scrollRootElement(${makeRegionLocator(scrollRootElement)})`,
        )
      }
      if (ignoreRegion) {
        result.storeCommand(`checkSettings.ignoreRegions(${makeRegionLocator(ignoreRegion)})`)
      }
      if (floatingRegion) {
        result.storeCommand(`
        checkSettings.floatingRegion(
          ${makeRegionLocator(floatingRegion.target)},
          ${floatingRegion.maxUp},
          ${floatingRegion.maxDown},
          ${floatingRegion.maxLeft},
          ${floatingRegion.maxRight},
        )`)
      }
      result.storeCommand(`await eyes.check(${tag ? `'${tag}'` : undefined}, checkSettings)`)
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
    result.storeCommand(`await eyes.open(
      driver,
      '${options.appName}',
      baselineTestName,
      RectangleSize.parse('${options.viewportSize}'),
    )`)
  }

  function scrollDown(pixels) {
    result.storeCommand(`await specs.executeScript(driver, 'window.scrollBy(0,${pixels})')`)
  }

  function switchToFrame(selector) {
    result.storeCommand(`{`)
    result.storeCommand(
      `const element = await specs.findElement(driver, ${makeRegionLocator(selector)})`,
    )
    result.storeCommand(`await specs.switchToFrame(driver, element)`)
    result.storeCommand(`}`)
  }

  function type(selector, keys) {
    result.storeCommand(`{`)
    result.storeCommand(
      `const element = await specs.findElement(driver, ${makeRegionLocator(selector)})`,
    )
    result.storeCommand(`await specs.type(driver, element, '${keys}')`)
    result.storeCommand(`}`)
  }

  function visit(url) {
    result.storeCommand(`await specs.visit(driver, '${url}')`)
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
