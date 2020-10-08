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
  if (TypeUtils.has(selector, ['type', 'selector'])) {
    if (selector.type === 'css') return `css=${selector.selector}`
    else if (selector.type === 'xpath') return `xpath=${selector.selector}`
  }
  return selector
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
  return err && err.message && err.message.includes('Protocol error (DOM.describeNode)')
}
async function isEqualElements(frame, element1, element2) {
  return frame
    .evaluate(([element1, element2]) => element1 === element2, [element1, element2])
    .catch(() => false)
}

// #endregion

// #region COMMANDS

async function executeScript(frame, script, arg) {
  script = TypeUtils.isString(script) ? new Function(script) : script
  const result = await frame.evaluateHandle(script, arg)
  return handleToObject(result)
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
  return frame.$(transformSelector(selector))
}
async function findElements(frame, selector) {
  return frame.$$(transformSelector(selector))
}
async function getElementRect(_frame, element) {
  const {x, y, width, height} = await element.boundingBox()
  return {x: Math.round(x), y: Math.round(y), width: Math.round(width), height: Math.round(height)}
}
async function getViewportSize(page) {
  return page.viewportSize()
}
async function setViewportSize(page, size = {}) {
  return page.setViewportSize(size)
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
  await frame.click(selector)
}
async function type(_frame, element, keys) {
  return element.type(keys)
}
async function waitUntilDisplayed(frame, selector) {
  return frame.waitForSelector(selector)
}
async function scrollIntoView(frame, element, align = false) {
  if (isSelector(element)) {
    element = await findElement(frame, element)
  }
  await frame.evaluate(([element, align]) => element.scrollIntoView(align), [element, align])
}
async function hover(frame, element, {x = 0, y = 0} = {}) {
  if (isSelector(element)) {
    element = await findElement(frame, element)
  }
  await element.hover({position: {x, y}})
}

// #endregion

// #region BUILD

const browserNames = {
  chrome: 'chromium',
  safari: 'webkit',
  firefox: 'firefox',
}
async function build(env) {
  const playwright = require('playwright')
  const {testSetup} = require('@applitools/sdk-shared')
  const {browser, device, url, attach, proxy, args = [], headless} = testSetup.Env(env, 'cdp')
  const launcher = playwright[browserNames[browser] || browser]
  if (!launcher) throw new Error(`Browser "${browser}" is not supported.`)
  if (attach) throw new Error(`Attaching to the existed browser doesn't supported by playwright`)
  const options = {
    args,
    headless,
    ignoreDefaultArgs: ['--hide-scrollbars'],
  }
  if (proxy) {
    options.proxy = {
      server: proxy.https || proxy.http || proxy.server,
      bypass: proxy.bypass.join(','),
    }
  }
  let driver
  if (url) {
    url.searchParams.set('ignoreDefaultArgs', options.ignoreDefaultArgs.join(','))
    url.searchParams.set('headless', options.headless)
    options.args.forEach(arg => url.searchParams.set(...arg.split('=')))
    driver = await launcher.connect({wsEndpoint: url.href})
  } else {
    driver = await launcher.launch(options)
  }
  const context = await driver.newContext(device ? playwright.devices[device] : {})
  const page = await context.newPage()
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
