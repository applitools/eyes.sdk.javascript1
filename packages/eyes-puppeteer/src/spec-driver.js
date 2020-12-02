const {TypeUtils} = require('@applitools/eyes-sdk-core')

// #region HELPERS

async function handleToObject(handle) {
  const [_, type] = handle.toString().split('@')
  if (type === 'array') {
    const map = await handle.getProperties()
    return Promise.all(Array.from(map.values(), handleToObject))
  } else if (type === 'object') {
    const map = await handle.getProperties()
    const chunks = await Promise.all(
      Array.from(map, async ([key, handle]) => ({[key]: await handleToObject(handle)})),
    )
    return Object.assign(...chunks)
  } else if (type === 'node') {
    return handle.asElement()
  } else {
    return handle.jsonValue()
  }
}
function transformSelector(selector) {
  if (TypeUtils.has(selector, ['type', 'selector'])) return `${selector.selector}`
  return selector
}
function serializeArgs(args) {
  const elements = []
  const argsWithElementMarkers = args.map(serializeArg)

  return {argsWithElementMarkers, elements}

  function serializeArg(arg) {
    if (isElement(arg)) {
      elements.push(arg)
      return {isElement: true}
    } else if (TypeUtils.isArray(arg)) {
      return arg.map(serializeArg)
    } else if (TypeUtils.isObject(arg)) {
      return Object.entries(arg).reduce((object, [key, value]) => {
        return Object.assign(object, {[key]: serializeArg(value)})
      }, {})
    } else {
      return arg
    }
  }
}
// NOTE:
// A few things to note:
//  - this function runs inside of the browser process
//  - evaluations in Puppeteer accept multiple arguments (not just one like in Playwright)
//  - an element reference (a.k.a. an ElementHandle) can only be sent as its
//    own argument. To account for this, we use a wrapper function to receive all
//    of the arguments in a serialized structure, deserialize them, and call the script,
//    and pass the arguments as originally intended
async function scriptRunner() {
  function deserializeArgs(args, elements = []) {
    return args.map(deserializeArg)

    function deserializeArg(arg) {
      if (!arg) {
        return arg
      } else if (arg.isElement) {
        return elements.shift()
      } else if (Array.isArray(arg)) {
        return arg.map(deserializeArg)
      } else if (typeof arg === 'object') {
        return Object.entries(arg).reduce((object, [key, value]) => {
          return Object.assign(object, {[key]: deserializeArg(value)})
        }, {})
      } else {
        return arg
      }
    }
  }
  const args = Array.from(arguments)
  let script = args[0].script
  script = new Function(
    script.startsWith('function') ? `return (${script}).apply(null, arguments)` : script,
  )
  const deserializedArgs = deserializeArgs(args[0].argsWithElementMarkers, args.slice(1))
  return script.apply(null, deserializedArgs)
}
async function findElementByXpath(frame, selector) {
  const result = await frame.$x(selector)
  return result[0]
}
function isXpath(selector) {
  return selector.startsWith('//') || selector.startsWith('..')
}

// #endregion

// #region UTILITY

function isDriver(page) {
  return page.constructor.name === 'Page'
}
function isElement(element) {
  if (!element) return false
  return element.constructor.name === 'ElementHandle'
}
function isSelector(selector) {
  return TypeUtils.has(selector, ['type', 'selector']) || TypeUtils.isString(selector)
}
function extractContext(page) {
  return page.constructor.name === 'Page' ? page.mainFrame() : page
}
function isStaleElementError(err) {
  return (
    err &&
    err.message &&
    (err.message.includes('Execution context was destroyed') ||
      err.message.includes('JSHandles can be evaluated only in the context they were created'))
  )
}
async function isEqualElements(frame, element1, element2) {
  return frame
    .evaluate((element1, element2) => element1 === element2, element1, element2)
    .catch(() => false)
}

// #endregion

// #region COMMANDS

async function executeScript(frame, script, ...args) {
  // a function is not serializable, so we pass it as a string instead
  script = TypeUtils.isString(script) ? script : script.toString()
  const {argsWithElementMarkers, elements} = serializeArgs(args)
  const result = await frame.evaluateHandle(
    scriptRunner,
    {script, argsWithElementMarkers},
    ...elements,
  )
  return await handleToObject(result)
}
async function mainContext(frame) {
  frame = extractContext(frame)
  let mainFrame = frame
  while (mainFrame.parentFrame()) {
    mainFrame = mainFrame.parentFrame()
  }
  return mainFrame
}
async function parentContext(frame) {
  frame = extractContext(frame)
  return frame.parentFrame()
}
async function childContext(_frame, element) {
  return element.contentFrame()
}
async function findElement(frame, selector) {
  selector = transformSelector(selector)
  return isXpath(selector) ? findElementByXpath(selector) : frame.$(selector)
}
async function findElements(frame, selector) {
  selector = transformSelector(selector)
  return isXpath(selector) ? frame.$x(selector) : frame.$$(selector)
}
async function getElementRect(_frame, element) {
  const {x, y, width, height} = await element.boundingBox()
  return {x: Math.round(x), y: Math.round(y), width: Math.round(width), height: Math.round(height)}
}
async function getViewportSize(page) {
  return page.viewport()
}
async function setViewportSize(page, size = {}) {
  return page.setViewport(size)
}
async function getTitle(page) {
  return page.title()
}
async function getUrl(page) {
  return page.url()
}
async function getDriverInfo(_page) {
  return {
    // isStateless: true,
  }
}
async function visit(page, url) {
  return page.goto(url)
}
async function takeScreenshot(page) {
  return page.screenshot()
}
async function click(frame, selector) {
  return frame.click(transformSelector(selector))
}
async function type(_frame, element, keys) {
  return element.type(keys)
}
async function waitUntilDisplayed(frame, selector) {
  return frame.waitForSelector(transformSelector(selector))
}
async function scrollIntoView(frame, element, align = false) {
  if (isSelector(element)) {
    element = await findElement(frame, element)
  }
  await frame.evaluate((element, align) => element.scrollIntoView(align), element, align)
}
async function hover(frame, element, {x = 0, y = 0} = {}) {
  if (isSelector(element)) {
    element = await findElement(frame, element)
  }
  await element.hover({position: {x, y}})
}

// #endregion

// #region BUILD

async function build(env) {
  const puppeteer = require('puppeteer')
  env = {
    ...env,
    ignoreDefaultArgs: ['--hide-scrollbars'],
    executablePath: 'google-chrome-stable',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  }
  // forcing headlesss since all funcitonality works headlessly
  // to re-enable, need to work out some performance issues with xvfb & coverage-tests
  delete env.headless
  if (process.env.APPLITOOLS_DEBUG) {
    env.headless = false
    env.devtools = true
    delete env.executablePath
  }
  const driver = await puppeteer.launch(env)
  const page = await driver.newPage()
  return [page, () => driver.close()]
}

// #endregion

// exports.isStateless = isStateless
exports.isDriver = isDriver
exports.isElement = isElement
exports.isSelector = isSelector
exports.extractContext = extractContext
exports.isStaleElementError = isStaleElementError
exports.isEqualElements = isEqualElements

exports.executeScript = executeScript
exports.mainContext = mainContext
exports.parentContext = parentContext
exports.childContext = childContext
exports.findElement = findElement
exports.findElements = findElements
exports.getElementRect = getElementRect
exports.getViewportSize = getViewportSize
exports.setViewportSize = setViewportSize
exports.getTitle = getTitle
exports.getUrl = getUrl
exports.getDriverInfo = getDriverInfo
exports.visit = visit
exports.takeScreenshot = takeScreenshot
exports.click = click
exports.type = type
exports.waitUntilDisplayed = waitUntilDisplayed
exports.scrollIntoView = scrollIntoView
exports.hover = hover

exports.build = build
