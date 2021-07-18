import * as utils from '@applitools/utils'
import * as legacy from './legacy'
import type * as types from '@applitools/types'

export type Driver = WebdriverIO.Client<void>
export type Element =
  | WebdriverIO.Element
  | {ELEMENT: string}
  | {'element-6066-11e4-a52e-4f735466cecf': string}
  | WebdriverIO.RawResult<WebdriverIO.Element | {ELEMENT: string} | {'element-6066-11e4-a52e-4f735466cecf': string}>
export type Selector = string | legacy.By

// #region HELPERS

const LEGACY_ELEMENT_ID = 'ELEMENT'
const ELEMENT_ID = 'element-6066-11e4-a52e-4f735466cecf'

function extractElementId(element: Element): string {
  if (utils.types.has(element, 'elementId')) return element.elementId as string
  else if (utils.types.has(element, ELEMENT_ID)) return element[ELEMENT_ID]
  else if (utils.types.has(element, LEGACY_ELEMENT_ID)) return element[LEGACY_ELEMENT_ID]
}

function transformSelector(selector: Selector): string {
  if (selector instanceof legacy.By) {
    return selector.toString()
  } else if (utils.types.has(selector, ['type', 'selector'])) {
    if (selector.type === 'css') return `css selector:${selector.selector}`
    else if (selector.type === 'xpath') return `xpath:${selector.selector}`
    else return `${selector.type}:${selector.selector}`
  }
  return selector
}

// #endregion

// #region UTILITY

export function isDriver(browser: any): browser is Driver {
  return Boolean(browser.getPrototype && browser.desiredCapabilities && browser.requestHandler)
}
export function isElement(element: any): element is Element {
  if (!element) return false
  return element.value
    ? Boolean(element.value[ELEMENT_ID] || element.value[LEGACY_ELEMENT_ID])
    : Boolean(element[ELEMENT_ID] || element[LEGACY_ELEMENT_ID])
}
export function isSelector(selector: any): selector is Selector {
  return (
    utils.types.isString(selector) || utils.types.has(selector, ['type', 'selector']) || selector instanceof legacy.By
  )
}
export function transformElement(element: Element): Element {
  const elementId = extractElementId(utils.types.has(element, 'value') ? element.value : element)
  return {[ELEMENT_ID]: elementId, [LEGACY_ELEMENT_ID]: elementId}
}
export function extractSelector(element: Element): Selector {
  return utils.types.has(element, 'selector') ? (element.selector as string) : undefined
}
export function isStaleElementError(error: any): boolean {
  if (!error) return false
  const errOrResult = error.originalError || error
  return errOrResult instanceof Error
    ? (errOrResult as any).seleniumStack && (errOrResult as any).seleniumStack.type === 'StaleElementReference'
    : errOrResult.value && errOrResult.selector
}
export async function isEqualElements(_browser: Driver, element1: Element, element2: Element): Promise<boolean> {
  if (!element1 || !element2) return false
  const elementId1 = extractElementId(element1)
  const elementId2 = extractElementId(element2)
  return elementId1 === elementId2
}

// #endregion

// #region COMMANDS

export async function executeScript(browser: Driver, script: ((arg: any) => any) | string, arg: any): Promise<any> {
  const {value} = await browser.execute(script, arg)
  return value
}
export async function mainContext(browser: Driver): Promise<void> {
  await browser.frame(null)
}
export async function parentContext(browser: Driver): Promise<void> {
  await browser.frameParent()
}
export async function childContext(browser: Driver, element: Element): Promise<any> {
  await browser.frame(element)
}
export async function findElement(browser: Driver, selector: Selector): Promise<Element> {
  const {value} = await browser.element(transformSelector(selector))
  return value
}
export async function findElements(browser: Driver, selector: Selector): Promise<Element[]> {
  const {value} = await browser.elements(transformSelector(selector))
  return value
}
export async function getElementRect(
  browser: Driver,
  element: Element,
): Promise<{x: number; y: number; width: number; height: number}> {
  const {value} = await browser.elementIdRect(extractElementId(element))
  return value
}
export async function getWindowSize(browser: Driver): Promise<{width: number; height: number}> {
  const {value: size} = (await browser.windowHandleSize()) as {value: {width: number; height: number}}
  return {width: size.width, height: size.height}
}
export async function setWindowSize(browser: Driver, size: {width: number; height: number}): Promise<void> {
  await browser.windowHandlePosition({x: 0, y: 0})
  await browser.windowHandleSize(size)
}
export async function getOrientation(browser: Driver): Promise<'landscape' | 'portrait'> {
  const orientation = (await (browser as any).getOrientation())
  return orientation.toLowerCase()
}
export async function getDriverInfo(browser: Driver): Promise<any> {
  return {
    sessionId: (browser as any).requestHandler.sessionID || browser.sessionId,
    isMobile: browser.isMobile,
    isNative: browser.isMobile && !browser.desiredCapabilities.browserName,
    deviceName: browser.desiredCapabilities.deviceName,
    platformName:
      (browser.isIOS && 'iOS') ||
      (browser.isAndroid && 'Android') ||
      browser.desiredCapabilities.platformName ||
      browser.desiredCapabilities.platform,
    platformVersion: browser.desiredCapabilities.platformVersion,
    browserName: browser.desiredCapabilities.browserName ?? (browser.desiredCapabilities as any).name,
    browserVersion: browser.desiredCapabilities.browserVersion ?? browser.desiredCapabilities.version,
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
export async function takeScreenshot(driver: Driver): Promise<Buffer> {
  return driver.saveScreenshot()
}
export async function click(browser: Driver, element: Element | Selector): Promise<void> {
  if (isSelector(element)) element = await findElement(browser, element)
  await browser.elementIdClick(extractElementId(element))
}
export async function hover(
  browser: Driver,
  element: Element | Selector,
  offset?: {x: number; y: number},
): Promise<void> {
  if (isSelector(element)) element = await findElement(browser, element)
  await browser.moveTo(extractElementId(element), offset?.x, offset?.y)
}
export async function type(browser: Driver, element: Element | Selector, keys: string): Promise<void> {
  if (isSelector(element)) browser.setValue(transformSelector(element), keys)
  else browser.elementIdValue(extractElementId(element), keys)
}
export async function scrollIntoView(browser: Driver, element: Element | Selector, align = false): Promise<void> {
  if (isSelector(element)) element = await findElement(browser, element)
  await browser.execute('arguments[0].scrollIntoView(arguments[1])', element, align)
}
export async function waitUntilDisplayed(browser: Driver, selector: Selector, timeout: number): Promise<void> {
  await browser.waitForVisible(selector as string, timeout)
}

export async function getCookies(browser: Driver): Promise<types.CookiesObject> {
  const {isMobile, browserName} = await getDriverInfo(browser);
  let allCookies
  if (!isMobile && browserName.search(/chrome/i) !== -1) {
    const {cookies} = await (browser as any).sendCommandAndGetResult('Network.getAllCookies', {})
    allCookies = {cookies, all: true}
  } else {
    const cookies = await browser.getCookie()
    allCookies = {cookies, all: false}
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
    browser = '',
    capabilities,
    url,
    attach,
    proxy,
    configurable = true,
    args = [],
    headless,
    logLevel = 'silent',
  } = parseEnv({...env, legacy: true})

  const options = {
    desiredCapabilities: {browserName: browser, ...capabilities},
    logLevel,
    protocol: url.protocol ? url.protocol.replace(/:$/, '') : undefined,
    host: url.hostname,
    port: url.port,
    path: url.pathname,
  }
  if (configurable) {
    if (browser === 'chrome' && attach) {
      await chromedriver.start(['--port=9515'], true)
      options.protocol = 'http'
      options.host = 'localhost'
      options.port = '9515'
      options.path = '/'
    }
    const browserOptionsName = browserOptionsNames[browser || options.desiredCapabilities.browserName]
    if (browserOptionsName) {
      const browserOptions = options.desiredCapabilities[browserOptionsName] || {}
      browserOptions.args = [...(browserOptions.args || []), ...args]
      if (headless) browserOptions.args.push('headless')
      if (attach) {
        browserOptions.debuggerAddress = attach === true ? 'localhost:9222' : attach
      }
      options.desiredCapabilities[browserOptionsName] = browserOptions
    }
  }
  if (proxy) {
    options.desiredCapabilities.proxy = {
      proxyType: 'manual',
      httpProxy: proxy.http || proxy.server,
      sslProxy: proxy.https || proxy.server,
      ftpProxy: proxy.ftp,
      noProxy: proxy.bypass.join(','),
    }
  }
  const driver = webdriverio.remote(options)
  await driver.init()

  return [driver, () => driver.end().then(() => chromedriver.stop())]
}

// #endregion

// #region LEGACY API

export const wrapDriver = legacy.wrapDriver

// #endregion
