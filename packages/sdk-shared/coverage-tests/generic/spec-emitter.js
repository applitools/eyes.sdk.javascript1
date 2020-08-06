const {makeEmitTracker} = require('@applitools/sdk-coverage-tests')

function js(chunks, ...values) {
  const commands = []
  let code = ''
  values.forEach((value, index) => {
    if (typeof value === 'function' && !value.isRef) {
      code += chunks[index]
      commands.push(code, value)
      code = ''
    } else {
      code += chunks[index] + serialize(value)
    }
  })
  code += chunks[chunks.length - 1]
  commands.push(code)
  return commands
}

function serialize(data) {
  if (data && data.isRef) {
    return data.ref()
  } else if (Array.isArray(data)) {
    return `[${data.map(serialize).join(', ')}]`
  } else if (typeof data === 'object' && data !== null) {
    const properties = Object.entries(data).reduce((data, [key, value]) => {
      return data.concat(`${key}: ${serialize(value)}`)
    }, [])
    return `{${properties.join(', ')}}`
  } else {
    return JSON.stringify(data)
  }
}

function makeSpecEmitter(options) {
  const {addSyntax, addCommand, addHook, withScope, getOutput} = makeEmitTracker()

  addSyntax('var', ({name, value}) => `const ${name} = ${value}`)
  addSyntax('getter', ({target, key}) => `${target}['${key}']`)
  addSyntax('call', ({target, args}) => `${target}(${js`...${args}`})`)
  addSyntax('return', ({value}) => `return ${value}`)

  addHook('deps', `const cwd = process.cwd()`)
  addHook('deps', `const path = require('path')`)
  addHook('deps', `const assert = require('assert')`)
  addHook('deps', `const spec = require(path.resolve(cwd, 'src/SpecDriver'))`)
  addHook('deps', `const {testSetup} = require('@applitools/sdk-shared')`)

  addHook('vars', `let driver`)
  addHook('vars', `let eyes`)
  addHook('vars', 'let baselineTestName')

  addHook('beforeEach', js`driver = await spec.build(${options.env} || {browser: 'chrome'})`)

  addHook(
    'beforeEach',
    js`eyes = testSetup.getEyes({
      isVisualGrid: ${options.executionMode.isVisualGrid},
      isCssStitching: ${options.executionMode.isCssStitching},
      branchName: ${options.branchName},
    })`,
  )

  addHook('afterEach', js`await spec.cleanup(driver)`)

  const driver = {
    constructor: {
      isStaleElementError(error) {
        return addCommand(js`spec.isStaleElementError(${error})`)
      },
    },
    build(options) {
      addCommand(js`await spec.build(${options})`)
    },
    cleanup() {
      addCommand(js`await spec.cleanup(driver)`)
    },
    visit(url) {
      addCommand(js`await spec.visit(driver, ${url})`)
    },
    executeScript(script, ...args) {
      return addCommand(js`await spec.executeScript(driver, ${script}, ...${args})`)
    },
    sleep(ms) {
      addCommand(js`await spec.sleep(driver, ${ms})`)
    },
    switchToFrame(selector) {
      addCommand(js`await spec.childContext(driver, ${selector})`)
    },
    switchToParentFrame() {
      addCommand(js`await spec.mainContext(driver)`)
    },
    findElement(selector) {
      return addCommand(
        js`await spec.findElement(driver, {type: 'css', selector: ${selector}})`,
      ).type('Element')
    },
    findElements(selector) {
      return addCommand(
        js`await spec.findElements(driver, {type: 'css', selector: ${selector}})`,
      ).type('Array<Element>')
    },
    click(element) {
      addCommand(js`await spec.click(driver, ${element})`)
    },
    type(element, keys) {
      addCommand(js`await spec.type(driver, ${element}, ${keys})`)
    },
  }

  const eyes = {
    constructor: {
      setViewportSize(viewportSize) {
        addCommand(js`await eyes.constructor.setViewportSize(driver, ${viewportSize})`)
      },
    },
    runner: {
      getAllTestResults(throwEx) {
        return addCommand(js`await eyes.getRunner().getAllTestResults(${throwEx})`)
      },
    },
    open({appName, viewportSize}) {
      return addCommand(
        js`await eyes.open(
            driver,
            ${appName},
            ${options.baselineTestName},
            ${viewportSize},
          )`,
      )
    },
    check(checkSettings) {
      return addCommand(js`await eyes.check(${checkSettings})`)
    },
    checkWindow(tag, matchTimeout, stitchContent) {
      return addCommand(js`await eyes.checkWindow(${tag}, ${matchTimeout}, ${stitchContent})`)
    },
    checkFrame(element, matchTimeout, tag) {
      return addCommand(js`await eyes.checkFrame(
        ${element},
        ${matchTimeout},
        ${tag},
      )`)
    },
    checkElement(element, matchTimeout, tag) {
      return addCommand(js`await eyes.checkElement(
        ${element},
        ${matchTimeout},
        ${tag},
      )`)
    },
    checkElementBy(selector, matchTimeout, tag) {
      return addCommand(js`await eyes.checkElementBy(
        ${selector},
        ${matchTimeout},
        ${tag},
      )`)
    },
    checkRegion(region, matchTimeout, tag) {
      return addCommand(js`await eyes.checkRegion(
        ${region},
        ${tag},
        ${matchTimeout},
      )`)
    },
    checkRegionByElement(element, matchTimeout, tag) {
      return addCommand(js`await eyes.checkRegionByElement(
        ${element},
        ${tag},
        ${matchTimeout},
      )`)
    },
    checkRegionBy(selector, tag, matchTimeout, stitchContent) {
      return addCommand(js`await eyes.checkRegionByElement(
        ${selector},
        ${tag},
        ${matchTimeout},
        ${stitchContent},
      )`)
    },
    checkRegionInFrame(frameReference, selector, matchTimeout, tag, stitchContent) {
      return addCommand(js`await eyes.checkRegionInFrame(
        ${frameReference},
        ${selector},
        ${matchTimeout},
        ${tag},
        ${stitchContent},
      )`)
    },
    close(throwEx) {
      return addCommand(js`await eyes.close(${throwEx})`)
    },
    abort() {
      return addCommand(js`await eyes.abort()`)
    },
    getViewportSize() {
      return addCommand(js`await eyes.getViewportSize()`).type('RectangleSize')
    },
    locate(visualLocatorSettings) {
      return addCommand(js`await eyes.locate(${visualLocatorSettings})`)
    },
  }

  const assert = {
    strictEqual(actual, expected, message) {
      addCommand(js`assert.strictEqual(${actual}, ${expected}, ${message})`)
    },
    notStrictEqual(actual, expected, message) {
      addCommand(js`assert.notStrictEqual(${actual}, ${expected}, ${message})`)
    },
    deepStrictEqual(actual, expected, message) {
      addCommand(js`assert.deepStrictEqual(${actual}, ${expected}, ${message})`)
    },
    notDeepStrictEqual(actual, expected, message) {
      addCommand(js`assert.notDeepStrictEqual(${actual}, ${expected}, ${message})`)
    },
    ok(value, message) {
      addCommand(js`assert.ok(${value}, ${message})`)
    },
    throws(func, check, message) {
      let command
      if (check) {
        command = js`await assert.rejects(
          async () => {${func}},
          error => {${withScope(check, ['error'])}},
          ${message},
        )`
      } else {
        command = js`await assert.rejects(
            async () => {${func}},
            undefined,
            ${message},
          )`
      }
      addCommand(command)
    },
  }

  return {driver, eyes, assert, tracker: {getOutput}}
}

module.exports = makeSpecEmitter
