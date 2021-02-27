const {GeneralUtils, TypeUtils} = require('@applitools/eyes-sdk-core')
const {ClientFunction, Selector} = require('testcafe')
const path = require('path')
const fs = require('fs')
const rmrf = require('rimraf')

// helpers
//
async function XPathSelector(selector, opts = {}) {
  const getElementsByXPath = Selector(xpath => {
    /* eslint-disable no-undef */
    const iterator = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
      null,
    )
    /* eslint-enable */
    const items = []

    let item = iterator.iterateNext()

    while (item) {
      items.push(item)
      item = iterator.iterateNext()
    }

    return items
  }, opts)
  return Selector(getElementsByXPath(selector), opts)
}

function isEyesSelector(selector) {
  return TypeUtils.has(selector, ['type', 'selector'])
}
function isTestCafeSelector(selector) {
  return !!(selector && selector.addCustomMethods && selector.find && selector.parent)
}
function prepareArrayArgsString(arg, indexPath) {
  let result = ''
  arg.forEach((argValue, innerIndex) => {
    const currentPath = [...indexPath, innerIndex]
    if (Array.isArray(argValue)) result += prepareArrayArgsString(argValue, currentPath)
    if (isTestCafeSelector(argValue)) {
      const indicesString = currentPath.map(i => `[${i}]`).join('')
      result += `args${indicesString} = args${indicesString}()\n`
    }
  })
  return result
}
// NOTE:
// Objects/functions passed into a ClientFunction get transpiled into something
// that is difficult to understand. We have significantly more knowledge of
// what's passed in before sending it into the ClientFunction. We use this
// information to create a static function that will return a modified set of
// arguments (to be run inside of the ClientFunction). It detects if a provided
// argument is a Selector function and calls it (so it is initialized for use
// in the ClientFunction. Otherwise, it will return the argument unchanged.
function prepareArgsFunctionString(args) {
  let entry = ''
  entry += 'let args = [...arguments]\n'
  args.forEach((arg, index) => {
    if (Array.isArray(arg)) {
      entry += prepareArrayArgsString(arg, [index])
    } else if (typeof arg === 'object') {
      for (const [key, value] of Object.entries(args[index])) {
        if (isTestCafeSelector(value)) entry += `args[${index}].${key} = args[${index}].${key}()\n`
      }
    } else {
      if (isTestCafeSelector(arg)) entry += `args[${index}] = args[${index}]()\n`
    }
  })
  entry += `return args`
  return entry
}
// NOTE:
// The function passed to the clientFunction runs inside of the browser
// There are constraints about what can be returned from the clientFunction
// depending on the executor type used. Which is why we store nodes on window
// for retrieval on an additional round-trip.
function prepareClientFunction({clientFunction, dependencies, driver}) {
  const prepareArgs = new Function(prepareArgsFunctionString(dependencies.args))
  const executor = clientFunction(
    () => {
      /* eslint-disable no-undef */
      const EYES_NAME_SPACE = '__EYES__APPLITOOLS__'
      if (retrieveDomNodes) return window[EYES_NAME_SPACE].nodes
      const result = script(...prepareArgs(...args))
      const nodes = []
      let filteredResult
      const isDOMNode = obj => {
        return obj instanceof window.Node
      }
      if (isDOMNode(result)) {
        nodes.push(result)
      } else if (window.Array.isArray(result) || result instanceof window.NodeList) {
        const _result = result instanceof window.NodeList ? window.Array.from(result) : result
        filteredResult = _result.map(entry => {
          if (isDOMNode(entry)) {
            nodes.push(entry)
            return {isDomNode: true}
          } else return entry
        })
      } else if (typeof result === 'object') {
        filteredResult = {}
        for (const [key, value] of window.Object.entries(result)) {
          if (isDOMNode(value)) {
            nodes.push(value)
            filteredResult[key] = {isDomNode: true}
          } else filteredResult[key] = value
        }
      }
      if (nodes && nodes.length) {
        if (!window[EYES_NAME_SPACE]) {
          window[EYES_NAME_SPACE] = {}
        }
        window[EYES_NAME_SPACE].nodes = nodes
        return {
          result: filteredResult,
          hasDomNodes: true,
        }
      }
      return {result, hasDomNodes: false}
      /* eslint-enable */
    },
    {dependencies: {prepareArgs, ...dependencies}, boundTestRun: driver},
  )
  return executor
}
async function transformSelector({driver, selector}) {
  if (isEyesSelector(selector)) {
    if (selector.type === 'xpath') return XPathSelector(selector.selector, {boundTestRun: driver})
    return Selector(selector.selector, {boundTestRun: driver})
  }
  return Selector(selector, {boundTestRun: driver})
}
//
// end helpers

function isDriver(driver) {
  return driver.constructor.name === 'TestController'
}
function isSelector(selector) {
  return (
    TypeUtils.has(selector, ['type', 'selector']) ||
    TypeUtils.isString(selector) ||
    isTestCafeSelector(selector)
  )
}
function isElement(element) {
  return isTestCafeSelector(element)
}
// NOTE:
// It's unclear of a better way to determine element identity.
// Also, when looking up the same element twice, the second lookup does not
// contain the `propType` property -- presumably a caching optimization.
// To compensate we create normalized copies of the elements and do a
// stringified comparison.
function isEqualElements(_driver, element1, element2) {
  if (!element1 || !element2) return false
  const elements = [{...element1}, {...element2}].map(el => {
    delete el.propType
    return el
  })
  return JSON.stringify(elements[0]) === JSON.stringify(elements[1])
}
async function executeScript(driver, script, ...args) {
  try {
    script = TypeUtils.isString(script) ? new Function(script) : script
    const dependencies = {script, args}
    let executor

    // first pass (covers most cases)
    executor = prepareClientFunction({
      clientFunction: ClientFunction,
      dependencies: {retrieveDomNodes: false, ...dependencies},
      driver,
    })
    const {result, hasDomNodes} = await executor()
    if (!hasDomNodes) return result

    // second pass (if a DOM Node element was found, need to retrieve it with a different executor)
    executor = prepareClientFunction({
      clientFunction: Selector,
      dependencies: {retrieveDomNodes: true, ...dependencies},
      driver,
    })
    const domNodes = await executor()

    // stitch the two results together, preserving the indended result from the provided script
    if (!result || !Object.keys(result).length) return domNodes.selector
    if (Array.isArray(result)) {
      return result.map((entry, index) => {
        if (entry && entry.isDomNode) {
          return domNodes.length ? domNodes[index].selector : domNodes.selector
        } else return entry
      })
    }
    if (typeof result === 'object') {
      const r = {}
      Object.entries(result).forEach((entry, index) => {
        const key = entry[0]
        const value = entry[1]
        if (value && value.isDomNode)
          r[key] = domNodes.length ? domNodes[index].selector : domNodes.selector
        else r[key] = value
      })
      return r
    }
  } catch (error) {
    debugger // in order to hit this breakpoint, run testcafe with --inspect-brk
    throw error
  }
}
async function mainContext(driver) {
  await driver.switchToMainWindow()
}
// NOTE:
// Switching from the current browsing context up one-level is not built into
// TestCafe (yet). See the following for reference:
// - https://github.com/DevExpress/testcafe/issues/5429
// - https://stackoverflow.com/questions/63453228/how-to-traverse-a-nested-frame-tree-by-its-hierarchy-in-testcafe
// A workaround was implemented in core to minimize on the performance overhead
// needed to construct and walk through the frame tree with DFS.
// See `findPathToChildContext` in core/lib/sdk/EyesDriver.js for details.
async function _parentContext(_driver) {}
async function childContext(driver, element) {
  return await driver.switchToIframe(element)
}
async function findElement(driver, selector) {
  selector = await transformSelector({driver, selector})
  const elSnapshot = await selector()
  return elSnapshot ? elSnapshot.selector : undefined
}
// NOTE:
// Adapted from https://testcafe-discuss.devexpress.com/t/how-to-get-a-nodelist-from-selector/778
async function findElements(driver, selector) {
  const transformedSelector = await transformSelector({driver, selector})
  const elements = transformedSelector
  const elementCount = await elements.count
  return Array.from({length: elementCount}, (_entry, index) => {
    return elements.nth(index)
  })
}
async function getElementRect(driver, element) {
  const elSnapshot = isSelector(element)
    ? await transformSelector({driver, selector: element})
    : element
  return elSnapshot.boundingClientRect
}
async function getTitle(driver) {
  try {
    return await Selector('title', {boundTestRun: driver}).innerText
  } catch (error) {
    return ''
  }
}
async function getUrl(driver) {
  return await executeScript(driver, 'return document.location.href')
}
async function visit(driver, url) {
  await driver.navigateTo(url)
}
// NOTE:
// Since we are constrained to saving screenshots to disk, we place each screenshot in its own
// dot-folder which has a GUID prefix (e.g., .applitools-guide/screenshot.png).
// We then read the file from disk, return the buffer, and delete the folder.
async function takeScreenshot(driver, opts = {}) {
  const SCREENSHOTS_PREFIX = '/.applitools'
  const SCREENSHOTS_FILENAME = 'screenshot.png'
  const filepath = path.resolve(
    `${SCREENSHOTS_PREFIX}-${GeneralUtils.guid()}`,
    SCREENSHOTS_FILENAME,
  )
  const screenshotPath = await driver.takeScreenshot(filepath)
  if (!screenshotPath) throw new Error('Unable to take screenshot')
  try {
    const screenshot = fs.readFileSync(screenshotPath)
    return opts.withMetadata ? {screenshot, screenshotPath} : screenshot
  } finally {
    const screenshotFolder = path.dirname(screenshotPath)
    rmrf.sync(screenshotFolder)
  }
}
// NOTE:
// This supposedly works with all options, e.g.,:
// 1. selector string
// 2. Selector object
// 3. resolved Selector object (e.g., DOM Node snapshot/state)
// https://devexpress.github.io/testcafe/documentation/reference/test-api/testcontroller/click.html#select-target-elements
async function click(driver, element) {
  const selector = await transformSelector({driver, selector: element})
  await driver.click(selector)
}
// NOTE:
// There are additionall options if we want them:
// https://devexpress.github.io/testcafe/documentation/reference/test-api/testcontroller/typetext.html
async function type(driver, element, keys) {
  await driver.typeText(element, keys)
}
// NOTE:
// Documented here:
// https://devexpress.github.io/testcafe/documentation/guides/concepts/built-in-wait-mechanisms.html#wait-mechanism-for-selectors
async function waitUntilDisplayed(_driver, element, timeout) {
  await element.with({visibilityCheck: true, timeout})
}
async function setViewportSize(driver, {width, height}) {
  await driver.resizeWindow(width, height)
}
async function getDriverInfo(_driver) {
  return {}
}
async function hover(driver, selector) {
  await driver.hover(selector)
}

exports.getDriverInfo = getDriverInfo
exports.isDriver = isDriver
exports.isSelector = isSelector
exports.isElement = isElement
exports.isEqualElements = isEqualElements
exports.executeScript = executeScript
exports.mainContext = mainContext
//exports.parentContext = parentContext
exports.childContext = childContext
exports.findElement = findElement
exports.findElements = findElements
exports.getElementRect = getElementRect
exports.getTitle = getTitle
exports.getUrl = getUrl
exports.visit = visit
exports.takeScreenshot = takeScreenshot
exports.click = click
exports.type = type
exports.waitUntilDisplayed = waitUntilDisplayed
exports.setViewportSize = setViewportSize
exports.hover = hover
// no-op for coverage-tests
exports.build = () => {
  return [undefined, () => {}]
}
exports.scrollIntoView = () => {} // TestCafe does this implicitly
exports.isStaleElementError = () => {} // TestCafe doesn't have a stale element error
// for unit testing
exports.prepareArgsFunctionString = prepareArgsFunctionString
