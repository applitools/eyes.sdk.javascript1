import * as utils from '@applitools/utils'
import * as legacy from './legacy'
import type * as types from '@applitools/types'

export type Driver = Applitools.WebdriverIO.Browser
export type Element =
  | Applitools.WebdriverIO.Element
  | {ELEMENT: string}
  | {'element-6066-11e4-a52e-4f735466cecf': string}
export type Selector = Applitools.WebdriverIO.Selector | string | legacy.By | {type: string; selector: string}
// #region HELPERS

const LEGACY_ELEMENT_ID = 'ELEMENT'
const ELEMENT_ID = 'element-6066-11e4-a52e-4f735466cecf'

function extractElementId(element: Element): string {
  if (utils.types.has(element, 'elementId')) return element.elementId as string
  else if (utils.types.has(element, ELEMENT_ID)) return element[ELEMENT_ID] as string
  else if (utils.types.has(element, LEGACY_ELEMENT_ID)) return element[LEGACY_ELEMENT_ID] as string
}
function transformSelector(
  selector: Selector,
): string | ((element: HTMLElement) => HTMLElement) | ((element: HTMLElement) => HTMLElement[]) {
  if (selector instanceof legacy.By) {
    return selector.toString()
  } else if (utils.types.has(selector, ['type', 'selector'])) {
    if (selector.type === 'css') return `css selector:${selector.selector}`
    else if (selector.type === 'xpath') return `xpath:${selector.selector}`
    else return `${selector.type}:${selector.selector}`
  }
  return selector
}
function transformArgument(arg: any): [any?, ...Element[]] {
  if (!arg) return []
  const elements: Element[] = []
  const argWithElementMarkers = transform(arg)

  return [argWithElementMarkers, ...elements]

  function transform(arg: any): any {
    if (isElement(arg)) {
      elements.push(arg)
      return {isElement: true}
    } else if (utils.types.isArray(arg)) {
      return arg.map(transform)
    } else if (utils.types.isObject(arg)) {
      return Object.entries(arg).reduce((object, [key, value]) => {
        return Object.assign(object, {[key]: transform(value)})
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
function scriptRunner(script: string, arg: any, ...elements: Element[]) {
  const func = new Function(script.startsWith('function') ? `return (${script}).apply(null, arguments)` : script)
  return func(transform(arg))

  function transform(arg: any): any {
    if (!arg) {
      return arg
    } else if (arg.isElement) {
      return elements.shift()
    } else if (Array.isArray(arg)) {
      return arg.map(transform)
    } else if (typeof arg === 'object') {
      return Object.entries(arg).reduce((object, [key, value]) => {
        return Object.assign(object, {[key]: transform(value)})
      }, {})
    } else {
      return arg
    }
  }
}

// #endregion

// #region UTILITY

export function isDriver(browser: any): browser is Driver {
  return browser.constructor.name === 'Browser'
}
export function isElement(element: any): element is Element {
  if (!element) return false
  return Boolean(element.elementId || element[ELEMENT_ID] || element[LEGACY_ELEMENT_ID])
}
export function isSelector(selector: any): selector is Selector {
  return (
    utils.types.isString(selector) ||
    utils.types.isFunction(selector) ||
    utils.types.has(selector, ['type', 'selector']) ||
    selector instanceof legacy.By
  )
}
export function transformElement(element: Element): Element {
  const elementId = extractElementId(element)
  return {[ELEMENT_ID]: elementId, [LEGACY_ELEMENT_ID]: elementId}
}
export function extractSelector(element: Element): Selector {
  return (element as any).selector
}
export function isStaleElementError(error: any): boolean {
  if (!error) return false
  const errOrResult = error.originalError || error
  return errOrResult instanceof Error && errOrResult.name === 'stale element reference'
}
export async function isEqualElements(browser: Driver, element1: Element, element2: Element): Promise<boolean> {
  // NOTE: wdio wraps puppeteer and generate ids by itself just incrementing a counter
  // NOTE: appium for ios could return different ids for same element
  if (browser.isDevTools || browser.isIOS) {
    try {
      return await browser.execute((element1, element2) => element1 === element2, element1, element2)
    } catch (err) {
      return false
    }
  }
  if (!element1 || !element2) return false
  const elementId1 = extractElementId(element1)
  const elementId2 = extractElementId(element2)
  return elementId1 === elementId2
}

// #endregion

// #region COMMANDS

export async function executeScript(browser: Driver, script: ((arg: any) => any) | string, arg?: any): Promise<any> {
  if (browser.isDevTools) {
    script = utils.types.isString(script) ? script : script.toString()
    return browser.execute(scriptRunner, script, ...transformArgument(arg))
  } else {
    return browser.execute(script, arg)
  }
}
export async function mainContext(browser: Driver): Promise<Driver> {
  await browser.switchToFrame(null)
  return browser
}
export async function parentContext(browser: Driver): Promise<Driver> {
  await browser.switchToParentFrame()
  return browser
}
export async function childContext(browser: Driver, element: Element): Promise<Driver> {
  await browser.switchToFrame(element)
  return browser
}
export async function findElement(browser: Driver, selector: Selector): Promise<Applitools.WebdriverIO.Element> {
  const element = await browser.$(transformSelector(selector))
  return !utils.types.has(element, 'error') ? element : null
}
export async function findElements(browser: Driver, selector: Selector): Promise<Applitools.WebdriverIO.Element[]> {
  const elements = await browser.$$(transformSelector(selector))
  return Array.from(elements)
}
export async function getElementRect(
  browser: Driver,
  element: Element,
): Promise<{x: number; y: number; width: number; height: number}> {
  const extendedElement = await browser.$(element as any)
  if (utils.types.isFunction(extendedElement, 'getRect')) {
    return extendedElement.getRect()
  } else {
    const rect = {x: 0, y: 0, width: 0, height: 0}
    if (utils.types.isFunction(extendedElement.getLocation)) {
      const location = await extendedElement.getLocation()
      rect.x = location.x
      rect.y = location.y
    }
    if (utils.types.isFunction(extendedElement.getSize)) {
      const size = await extendedElement.getSize()
      rect.width = size.width
      rect.height = size.height
    }
    return rect
  }
}
export async function getWindowSize(browser: Driver): Promise<{width: number; height: number}> {
  if (utils.types.isFunction(browser.getWindowRect)) {
    const rect = await browser.getWindowRect()
    return {width: rect.width, height: rect.height}
  } else {
    return browser.getWindowSize()
  }
}
export async function setWindowSize(browser: Driver, size: {width: number; height: number}): Promise<void> {
  if (utils.types.isFunction(browser.setWindowRect)) {
    await browser.setWindowRect(0, 0, size.width, size.height)
  } else {
    await browser.setWindowPosition(0, 0)
    await browser.setWindowSize(size.width, size.height)
  }
}
export async function getOrientation(browser: Driver): Promise<'portrait' | 'landscape'> {
  const orientation = await browser.getOrientation()
  return orientation.toLowerCase() as 'portrait' | 'landscape'
}
export async function getDriverInfo(browser: Driver): Promise<any> {
  const capabilities = browser.capabilities as any
  return {
    sessionId: browser.sessionId,
    isMobile: browser.isMobile,
    isNative: browser.isMobile && !capabilities.browserName,
    deviceName: capabilities.desired ? capabilities.desired.deviceName : capabilities.deviceName,
    platformName: capabilities.platformName ?? capabilities.platform,
    platformVersion: capabilities.platformVersion,
    browserName: capabilities.browserName ?? capabilities.desired.browserName,
    browserVersion: capabilities.browserVersion ?? capabilities.version,
  }
}
export async function getTitle(browser: Driver): Promise<string> {
  return browser.getTitle()
}
export async function getUrl(browser: Driver): Promise<string> {
  return browser.getUrl()
}
export async function visit(browser: Driver, url: string): Promise<void> {
  await browser.url(url)
}
export async function takeScreenshot(browser: Driver): Promise<string | Buffer> {
  if (browser.isDevTools) {
    const puppeteer = await browser.getPuppeteer()
    const [page] = await puppeteer.pages()
    const scr = await (page as any)._client.send('Page.captureScreenshot')
    return scr.data
  }
  return browser.takeScreenshot()
}
export async function click(browser: Driver, element: Element | Selector): Promise<void> {
  if (isSelector(element)) element = await findElement(browser, element)
  const extendedElement = await browser.$(element as any)
  await extendedElement.click()
}
export async function type(browser: Driver, element: Element | Selector, keys: string): Promise<void> {
  if (isSelector(element)) element = await findElement(browser, element)
  const extendedElement = await browser.$(element as any)
  await extendedElement.setValue(keys)
}
export async function hover(browser: Driver, element: Element | Selector): Promise<any> {
  if (isSelector(element)) element = await findElement(browser, element)

  if (browser.isDevTools) {
    const {x, y, width, height} = await browser.execute((element: any) => {
      const rect = element.getBoundingClientRect()
      return {x: rect.x, y: rect.y, width: rect.width, height: rect.height}
    }, element)
    const puppeteer = await browser.getPuppeteer()
    const [page] = await puppeteer.pages()
    await page.mouse.move(x + width / 2, y + height / 2)
  } else {
    const extendedElement = await browser.$(element as any)
    await extendedElement.moveTo()
  }
}
export async function scrollIntoView(browser: Driver, element: Element | Selector, align = false): Promise<void> {
  if (isSelector(element)) element = await findElement(browser, element)
  const extendedElement = await browser.$(element as any)
  await extendedElement.scrollIntoView(align)
}
export async function waitUntilDisplayed(browser: Driver, selector: Selector, timeout: number): Promise<void> {
  const element = await findElement(browser, selector)
  if (process.env.APPLITOOLS_WEBDRIVERIO_MAJOR_VERSION === '5') {
    // @ts-ignore
    await element.waitForDisplayed(timeout)
  } else {
    // @ts-ignore
    await element.waitForDisplayed({timeout})
  }
}

export async function getCookies(browser: Driver): Promise<types.CookiesObject> {
  const capabilities = browser.capabilities as any
  let allCookies
  if (browser.isDevTools) {
    const puppeteer = await browser.getPuppeteer()
    const [page] = await puppeteer.pages()
    const {cookies} = await (page as any)._client.send('Network.getAllCookies')
    allCookies = {cookies, all: true}
  } else if (capabilities.browserName.search(/chrome/i) !== -1) {
    const {cookies} = await browser.sendCommandAndGetResult('Network.getAllCookies', {})
    allCookies = {cookies, all: true}
  } else {
    allCookies = {cookies: await browser.getCookies(), all: false}
  }

  return {
    cookies: allCookies.cookies.map((cookie: any) => ({
      name: cookie.name,
      value: cookie.value,
      domain: cookie.domain,
      path: cookie.path,
      expiry: cookie.expires ?? cookie.expiry,
      sameSite: cookie.sameSite,
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
    })),
    all: allCookies.all,
  }
}

// #endregion

// #region TESTING

const browserOptionsNames: Record<string, string> = {
  chrome: 'goog:chromeOptions',
  firefox: 'moz:firefoxOptions',
}
export async function build(env: any): Promise<[Driver, () => Promise<void>]> {
  const webdriverio = require('webdriverio')
  const chromedriver = require('chromedriver')
  const parseEnv = require('@applitools/test-utils/src/parse-env')
  const {
    protocol,
    browser = '',
    capabilities,
    url,
    attach,
    proxy,
    configurable = true,
    args = [],
    headless,
    logLevel = 'silent',
  } = parseEnv(env, process.env.APPLITOOLS_WEBDRIVERIO_PROTOCOL)

  const options: any = {
    capabilities: {browserName: browser, ...capabilities},
    logLevel,
  }
  if (browser === 'chrome' && protocol === 'cdp') {
    options.automationProtocol = 'devtools'
    options.capabilities[browserOptionsNames.chrome] = {args}
    options.capabilities['wdio:devtoolsOptions'] = {
      headless,
      ignoreDefaultArgs: ['--hide-scrollbars'],
    }
  } else if (protocol === 'wd') {
    options.automationProtocol = 'webdriver'
    options.protocol = url.protocol ? url.protocol.replace(/:$/, '') : undefined
    options.hostname = url.hostname
    if (url.port) options.port = Number(url.port)
    else if (options.protocol === 'http') options.port = 80
    else if (options.protocol === 'https') options.port = 443
    options.path = url.pathname
    if (configurable) {
      if (browser === 'chrome' && attach) {
        await chromedriver.start(['--port=9515'], true)
        options.protocol = 'http'
        options.hostname = 'localhost'
        options.port = 9515
        options.path = '/'
      }
      const browserOptionsName = browserOptionsNames[browser || options.capabilities.browserName]
      if (browserOptionsName) {
        const browserOptions = options.capabilities[browserOptionsName] || {}
        browserOptions.args = [...(browserOptions.args || []), ...args]
        if (headless) browserOptions.args.push('headless')
        if (attach) {
          browserOptions.debuggerAddress = attach === true ? 'localhost:9222' : attach
          if (browser !== 'firefox') browserOptions.w3c = false
        }
        options.capabilities[browserOptionsName] = browserOptions
      }
    }
  }
  if (proxy) {
    options.capabilities.proxy = {
      proxyType: 'manual',
      httpProxy: proxy.http || proxy.server,
      sslProxy: proxy.https || proxy.server,
      ftpProxy: proxy.ftp,
      noProxy: proxy.bypass.join(','),
    }
  }
  const driver = await webdriverio.remote(options)
  return [driver, () => driver.deleteSession().then(() => chromedriver.stop())]
}

// #endregion

// #region LEGACY API

export const wrapDriver = legacy.wrapDriver

// #endregion
