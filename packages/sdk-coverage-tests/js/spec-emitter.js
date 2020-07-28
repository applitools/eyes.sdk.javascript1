const {makeEmitTracker} = require('../src/code-export')

function makeSpecEmitter(options) {
  const tracker = makeEmitTracker()
  function js(chunks, ...values) {
    let code = ''
    values.forEach((value, index) => {
      let stringified = ''
      if (value && value.isRef) {
        stringified = value.ref()
      } else if (typeof value === 'function') {
        stringified = value.toString()
      } else {
        stringified = JSON.stringify(value)
      }
      code += chunks[index] + stringified
    })
    return code + chunks[chunks.length - 1]
  }

  tracker.addSyntax('var', ({name, value}) => `const ${name} = ${value}`)
  tracker.addSyntax('getter', ({target, key}) => `${target}.${key}`)
  tracker.addSyntax('call', ({target, args}) => `${target}(${js`...${args}`})`)
  tracker.storeHook('deps', `const cwd = process.cwd()`)
  tracker.storeHook('deps', `const assert = require('assert')`)
  tracker.storeHook('deps', `const path = require('path')`)
  tracker.storeHook('deps', `const specs = require(path.resolve(cwd, 'src/SpecWrappedDriver'))`)
  tracker.storeHook('deps', `const {Eyes} = require(cwd)`)
  tracker.storeHook(
    'deps',
    `const {TestSetup} = require('@applitools/sdk-coverage-tests/coverage-tests')`,
  )

  tracker.storeHook('vars', `let driver`)
  tracker.storeHook('vars', `let eyes`)
  tracker.storeHook('vars', 'let baselineTestName')

  tracker.storeHook(
    'beforeEach',
    js`driver = await specs.build({
      capabilities: ${options.capabilities} || TestSetup.Browsers.chrome(),
      serverUrl: ${options.host},
      logLevel: 'error',
    })`,
  )

  tracker.storeHook(
    'beforeEach',
    js`eyes = TestSetup.getEyes({
      isVisualGrid: ${options.executionMode.isVisualGrid},
      isCssStitching: ${options.executionMode.isCssStitching},
      branchName: ${options.branchName},
    })`,
  )

  tracker.storeHook('afterEach', js`await specs.cleanup(driver)`)

  const driver = {
    build(options) {
      tracker.storeCommand(js`await specs.build(${options})`)
    },
    cleanup() {
      tracker.storeCommand(js`await specs.cleanup(driver)`)
    },
    visit(url) {
      tracker.storeCommand(js`await specs.visit(driver, ${url})`)
    },
    executeScript(script, ...args) {
      return tracker.storeCommand(js`await specs.executeScript(driver, ${script}, ...${args})`)
    },
    sleep(ms) {
      tracker.storeCommand(js`await specs.sleep(driver, ${ms})`)
    },
    switchToFrame(selector) {
      tracker.storeCommand(js`await specs.switchToFrame(driver, ${selector})`)
    },
    switchToParentFrame() {
      tracker.storeCommand(js`await specs.switchToParentFrame(driver)`)
    },
    findElement(selector) {
      return tracker
        .storeCommand(
          js`await specs.findElement(driver, specs.toSupportedSelector({type: 'css', selector: ${selector}}))`,
        )
        .type('Element')
    },
    findElements(selector) {
      return tracker
        .storeCommand(
          js`await specs.findElements(driver, specs.toSupportedSelector({type: 'css', selector: ${selector}}))`,
        )
        .type('Array<Element>')
    },
    getWindowLocation() {
      return tracker
        .storeCommand(js`await specs.getWindowLocation(driver)`)
        .type('Map<String, Number>')
    },
    setWindowLocation(location) {
      tracker.storeCommand(js`await specs.setWindowLocation(driver, ${location})`)
    },
    getWindowSize() {
      return tracker.storeCommand(js`await specs.getWindowSize(driver)`).type('Map<String, Number>')
    },
    setWindowSize(size) {
      tracker.storeCommand(js`await specs.setWindowSize(driver, ${size})`)
    },
    click(element) {
      tracker.storeCommand(js`await specs.click(driver, ${element})`)
    },
    type(element, keys) {
      tracker.storeCommand(js`await specs.type(driver, ${element}, ${keys})`)
    },
    waitUntilDisplayed() {
      // TODO: implement if needed
    },
    getElementRect() {
      // TODO: implement if needed
    },
    getOrientation() {
      // TODO: implement if needed
    },
    isMobile() {
      // TODO: implement if needed
    },
    isAndroid() {
      // TODO: implement if needed
    },
    isIOS() {
      // TODO: implement if needed
    },
    isNative() {
      // TODO: implement if needed
    },
    getPlatformVersion() {
      // TODO: implement if needed
    },
    getBrowserName() {
      // TODO: implement if needed
    },
    getBrowserVersion() {
      // TODO: implement if needed
    },
    getSessionId() {
      // TODO: implement if needed
    },
    takeScreenshot() {
      // TODO: implement if needed
    },
    getTitle() {
      // TODO: implement if needed
    },
    getUrl() {
      // TODO: implement if needed
    },
  }

  const eyes = {
    constructor: {
      setViewportSize(viewportSize) {
        tracker.storeCommand(js`await Eyes.setViewportSize(driver, ${viewportSize})`)
      },
    },
    open({appName, viewportSize}) {
      return tracker
        .storeCommand(
          js`await eyes.open(
            driver,
            ${appName},
            ${options.baselineTestName},
            ${viewportSize},
          )`,
        )
        .type('WrappedDriver')
    },
    check(checkSettings) {
      tracker.storeCommand(js`await eyes.check(${checkSettings})`)
    },
    checkWindow(tag, matchTimeout, stitchContent) {
      tracker.storeCommand(js`await eyes.checkWindow(${tag}, ${matchTimeout}, ${stitchContent})`)
    },
    checkFrame(element, matchTimeout, tag) {
      tracker.storeCommand(js`await eyes.checkFrame(
        ${element},
        ${matchTimeout},
        ${tag},
      )`)
    },
    checkElement(element, matchTimeout, tag) {
      tracker.storeCommand(js`await eyes.checkElement(
        ${element},
        ${matchTimeout},
        ${tag},
      )`)
    },
    checkElementBy(selector, matchTimeout, tag) {
      tracker.storeCommand(js`await eyes.checkElementBy(
        ${selector},
        ${matchTimeout},
        ${tag},
      )`)
    },
    checkRegion(region, matchTimeout, tag) {
      tracker.storeCommand(js`await eyes.checkRegion(
        ${region},
        ${tag},
        ${matchTimeout},
      )`)
    },
    checkRegionByElement(element, matchTimeout, tag) {
      tracker.storeCommand(js`await eyes.checkRegionByElement(
        ${element},
        ${tag},
        ${matchTimeout},
      )`)
    },
    checkRegionBy(selector, tag, matchTimeout, stitchContent) {
      tracker.storeCommand(js`await eyes.checkRegionByElement(
        ${selector},
        ${tag},
        ${matchTimeout},
        ${stitchContent},
      )`)
    },
    checkRegionInFrame(frameReference, selector, matchTimeout, tag, stitchContent) {
      tracker.storeCommand(js`await eyes.checkRegionInFrame(
        ${frameReference},
        ${selector},
        ${matchTimeout},
        ${tag},
        ${stitchContent},
      )`)
    },
    close(throwEx) {
      tracker.storeCommand(js`await eyes.close(${throwEx})`)
    },
    abort() {
      tracker.storeCommand(js`await eyes.abort()`)
    },
    getViewportSize() {
      return tracker.storeCommand(js`await eyes.getViewportSize()`).type('RectangleSize')
    },
    locate(visualLocatorSettings) {
      return tracker.storeCommand(js`await eyes.locate(${visualLocatorSettings})`)
    },
  }

  const assert = {
    strictEqual(actual, expected, message) {
      tracker.storeCommand(js`assert.strictEqual(${actual}, ${expected}, ${message})`)
    },
    notStrictEqual(actual, expected, message) {
      tracker.storeCommand(js`assert.notStrictEqual(${actual}, ${expected}, ${message})`)
    },
    deepStrictEqual(actual, expected, message) {
      tracker.storeCommand(js`assert.deepStrictEqual(${actual}, ${expected}, ${message})`)
    },
    notDeepStrictEqual(actual, expected, message) {
      tracker.storeCommand(js`assert.notDeepStrictEqual(${actual}, ${expected}, ${message})`)
    },
    ok(value, message) {
      tracker.storeCommand(js`assert.ok(${value}, ${message})`)
    },
  }

  return {tracker, driver, eyes, assert}
}

module.exports = makeSpecEmitter
