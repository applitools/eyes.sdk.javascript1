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
      return value !== undefined ? data.concat(`${key}: ${serialize(value)}`) : data
    }, [])
    return `{${properties.join(', ')}}`
  } else {
    return JSON.stringify(data)
  }
}

module.exports = function(tracker, test) {
  const {addSyntax, addCommand, addHook, withScope} = tracker

  addSyntax('var', ({constant, name, value}) => `${constant ? 'const' : 'let'} ${name} = ${value}`)
  addSyntax('getter', ({target, key}) => `${target}['${key}']`)
  addSyntax('call', ({target, args}) => `${target}(${js`...${args}`})`)
  addSyntax('return', ({value}) => `return ${value}`)

  addHook('deps', `const cwd = process.cwd()`)
  addHook('deps', `const path = require('path')`)
  addHook('deps', `const assert = require('assert')`)
  addHook('deps', `const spec = require(path.resolve(cwd, 'src/spec-driver'))`)
  addHook('deps', `const {testSetup, getTestInfo} = require('@applitools/sdk-shared')`)

  addHook('vars', `let driver, destroyDriver, eyes`)

  addHook(
    'beforeEach',
    js`[driver, destroyDriver] = await spec.build(${test.env} || {browser: 'chrome'})`,
  )
  addHook(
    'beforeEach',
    js`eyes = testSetup.getEyes(${{vg: test.vg, displayName: test.name, ...test.config}})`,
  )

  addHook('afterEach', js`await destroyDriver(driver)`)

  const driver = {
    constructor: {
      isStaleElementError(error) {
        return addCommand(js`spec.isStaleElementError(${error})`)
      },
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
      return addCommand(js`await spec.findElement(driver, ${selector})`).type('Element')
    },
    findElements(selector) {
      return addCommand(js`await spec.findElements(driver, ${selector})`).type('Array<Element>')
    },
    click(element) {
      addCommand(js`await spec.click(driver, ${element})`)
    },
    type(element, keys) {
      addCommand(js`await spec.type(driver, ${element}, ${keys})`)
    },
    scrollIntoView(element, align) {
      addCommand(js`await spec.scrollIntoView(driver, ${element}, ${align})`)
    },
    hover(element, offset) {
      addCommand(js`await spec.hover(driver, ${element}, ${offset})`)
    },
  }

  const eyes = {
    constructor: {
      setViewportSize(viewportSize) {
        addCommand(js`await eyes.constructor.setViewportSize(driver, ${viewportSize})`)
      },
    },
    setConfiguration(config) {
      addCommand(js`await eyes.setConfiguration(new Configuration(${config}))`)
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
            ${test.config.baselineName},
            ${viewportSize},
          )`,
      )
    },
    check(checkSettings = {}) {
      if (test.api !== 'classic') {
        return addCommand(js`await eyes.check(${checkSettings})`)
      } else if (checkSettings.region) {
        if (checkSettings.frames && checkSettings.frames.length > 0) {
          const [frameReference] = checkSettings.frames
          return addCommand(js`await eyes.checkRegionInFrame(
            ${frameReference.frame || frameReference},
            ${checkSettings.region},
            ${checkSettings.timeout},
            ${checkSettings.name},
            ${checkSettings.isFully},
          )`)
        }
        return addCommand(js`await eyes.checkRegionBy(
          ${checkSettings.region},
          ${checkSettings.name},
          ${checkSettings.timeout},
          ${checkSettings.isFully},
        )`)
      } else if (checkSettings.frames && checkSettings.frames.length > 0) {
        const [frameReference] = checkSettings.frames
        return addCommand(js`await eyes.checkFrame(
          ${frameReference.frame || frameReference},
          ${checkSettings.timeout},
          ${checkSettings.name},
        )`)
      } else {
        return addCommand(js`await eyes.checkWindow(
          ${checkSettings.name},
          ${checkSettings.timeout},
          ${checkSettings.isFully}
        )`)
      }
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
    instanceOf(object, className, message) {
      addCommand(js`assert.ok(${object}.constructor.name === ${className}, ${message})`)
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

  const helpers = {
    getTestInfo(result) {
      return addCommand(js`await getTestInfo(${result})`).type('TestInfo')
    },
  }

  return {driver, eyes, assert, helpers}
}
