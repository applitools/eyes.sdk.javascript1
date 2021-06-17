import * as utils from '@applitools/utils'
import * as legacy from './legacy'
import type * as Selenium from 'selenium-webdriver'

export type Driver = Selenium.WebDriver
export type Element = Selenium.WebElement
export type Selector = Selenium.Locator | {using: string; value: string} | string | {type: string; selector: string}

// #region HELPERS

const byHash = ['className', 'css', 'id', 'js', 'linkText', 'name', 'partialLinkText', 'tagName', 'xpath']

function extractElementId(element: Element): Promise<string> {
  return element.getId()
}

function transformSelector(selector: Selector): Selenium.Locator {
  if (utils.types.isString(selector)) {
    return {css: selector}
  } else if (utils.types.has(selector, ['type', 'selector'])) {
    if (selector.type === 'css') return {css: selector.selector}
    else if (selector.type === 'xpath') return {xpath: selector.selector}
    else return {using: selector.type, value: selector.selector}
  }
  return selector
}

// #endregion

// #region UTILITY

export function isDriver(driver: any): driver is Driver {
  return utils.types.instanceOf(driver, 'WebDriver')
}
export function isElement(element: any): element is Element {
  return utils.types.instanceOf(element, 'WebElement')
}
export function isSelector(selector: any): selector is Selector {
  if (!selector) return false
  return (
    utils.types.has(selector, ['type', 'selector']) ||
    utils.types.has(selector, ['using', 'value']) ||
    Object.keys(selector).some(key => byHash.includes(key)) ||
    utils.types.isString(selector)
  )
}
export function transformDriver(driver: Driver): Driver {
  if (process.env.APPLITOOLS_SELENIUM_MAJOR_VERSION === '3') {
    const cmd = require('selenium-webdriver/lib/command')
    cmd.Name.SWITCH_TO_PARENT_FRAME = 'switchToParentFrame'
    driver.getExecutor().defineCommand(cmd.Name.SWITCH_TO_PARENT_FRAME, 'POST', '/session/:sessionId/frame/parent')
  }
  return driver
}
export function isStaleElementError(error: any): boolean {
  if (!error) return false
  error = error.originalError || error
  return error instanceof Error && error.name === 'StaleElementReferenceError'
}
export async function isEqualElements(_driver: Driver, element1: Element, element2: Element): Promise<boolean> {
  if (!element1 || !element2) return false
  const elementId1 = await extractElementId(element1)
  const elementId2 = await extractElementId(element2)
  return elementId1 === elementId2
}

// #endregion

// #region COMMANDS

export async function executeScript(driver: Driver, script: ((arg: any) => any) | string, arg: any): Promise<any> {
  return driver.executeScript(script, arg)
}
export async function mainContext(driver: Driver): Promise<Driver> {
  await driver.switchTo().defaultContent()
  return driver
}
export async function parentContext(driver: Driver): Promise<Driver> {
  if (process.env.APPLITOOLS_SELENIUM_MAJOR_VERSION === '3') {
    const cmd = require('selenium-webdriver/lib/command')
    await (driver as any).schedule(new cmd.Command(cmd.Name.SWITCH_TO_PARENT_FRAME))
    return driver
  }
  await driver.switchTo().parentFrame()
  return driver
}
export async function childContext(driver: Driver, element: Element): Promise<Driver> {
  await driver.switchTo().frame(element)
  return driver
}
export async function findElement(driver: Driver, selector: Selector): Promise<Element> {
  try {
    return await driver.findElement(transformSelector(selector))
  } catch (err) {
    if (err.name === 'NoSuchElementError') return null
    else throw err
  }
}
export async function findElements(driver: Driver, selector: Selector): Promise<Element[]> {
  return driver.findElements(transformSelector(selector))
}
export async function getElementRect(
  _driver: Driver,
  element: Element,
): Promise<{x: number; y: number; width: number; height: number}> {
  return element.getRect()
}
export async function getWindowSize(driver: Driver): Promise<{width: number; height: number}> {
  try {
    const window = driver.manage().window()
    if (utils.types.isFunction(window.getRect)) {
      const rect = await window.getRect()
      return {width: rect.width, height: rect.height}
    } else if (utils.types.isFunction(window.getSize)) {
      return await window.getSize()
    }
  } catch (err) {
    // workaround for Appium
    const cmd = require('selenium-webdriver/lib/command')
    return driver.execute(new cmd.Command(cmd.Name.GET_WINDOW_SIZE).setParameter('windowHandle', 'current'))
  }
}
export async function setWindowSize(driver: Driver, size: {width: number; height: number}) {
  const window = driver.manage().window()
  if (utils.types.isFunction(window.setRect)) {
    await window.setRect({x: 0, y: 0, width: size.width, height: size.height})
  } else {
    await window.setPosition(0, 0)
    await window.setSize(size.width, size.height)
  }
}
export async function getOrientation(driver: Driver): Promise<'landscape' | 'portrait'> {
  const capabilities = await driver.getCapabilities()
  const orientation = capabilities.get('orientation') || capabilities.get('deviceOrientation')
  return orientation.toLowerCase()
}
export async function getDriverInfo(driver: Driver): Promise<any> {
  const capabilities = await driver.getCapabilities()
  const desiredCapabilities = capabilities.get('desired') ?? {}
  const session = await driver.getSession()
  const sessionId = session.getId()
  const deviceName = desiredCapabilities.deviceName ?? capabilities.get('deviceName')
  const platformName =
    capabilities.get('platformName') ?? capabilities.get('platform') ?? desiredCapabilities.platformName
  const platformVersion = capabilities.get('platformVersion')
  const browserName = capabilities.get('browserName') ?? desiredCapabilities.browserName
  const browserVersion = capabilities.get('browserVersion') ?? capabilities.get('version')
  const isMobile = ['android', 'ios'].includes(platformName?.toLowerCase())

  return {
    sessionId,
    isMobile,
    isNative: isMobile && !browserName,
    deviceName,
    platformName,
    platformVersion,
    browserName,
    browserVersion,
  }
}
export async function getTitle(driver: Driver): Promise<string> {
  return driver.getTitle()
}
export async function getUrl(driver: Driver): Promise<string> {
  return driver.getCurrentUrl()
}
export async function visit(driver: Driver, url: string): Promise<void> {
  await driver.get(url)
}
export async function takeScreenshot(driver: Driver): Promise<string> {
  return driver.takeScreenshot()
}
export async function click(driver: Driver, element: Element | Selector): Promise<void> {
  if (isSelector(element)) element = await findElement(driver, element)
  await element.click()
}
export async function hover(driver: Driver, element: Element | Selector) {
  if (isSelector(element)) element = await findElement(driver, element)
  if (process.env.APPLITOOLS_SELENIUM_MAJOR_VERSION === '3') {
    const {ActionSequence} = require('selenium-webdriver')
    const action = new ActionSequence(driver)
    await action.mouseMove(element).perform()
  } else {
    await driver.actions().move({origin: element}).perform()
  }
}
export async function type(driver: Driver, element: Element | Selector, keys: string): Promise<void> {
  if (isSelector(element)) element = await findElement(driver, element)
  await element.sendKeys(keys)
}
export async function scrollIntoView(driver: Driver, element: Element | Selector, align = false): Promise<void> {
  if (isSelector(element)) element = await findElement(driver, element)
  await driver.executeScript('arguments[0].scrollIntoView(arguments[1])', element, align)
}
export async function waitUntilDisplayed(driver: Driver, selector: Selector, timeout: number): Promise<void> {
  const {until} = require('selenium-webdriver')
  const element = await findElement(driver, selector)
  await driver.wait(until.elementIsVisible(element), timeout)
}

// #endregion

// #region TESTING

const browserOptionsNames: Record<string, string> = {
  chrome: 'goog:chromeOptions',
  firefox: 'moz:firefoxOptions',
}
export async function build(env: any): Promise<[Driver, () => Promise<void>]> {
  const {Builder} = require('selenium-webdriver')
  const parseEnv = require('@applitools/test-utils/src/parse-env')

  const {
    browser = '',
    capabilities,
    url,
    attach,
    proxy,
    configurable = true,
    appium = false,
    args = [],
    headless,
  } = parseEnv({...env, legacy: env.legacy ?? process.env.APPLITOOLS_SELENIUM_MAJOR_VERSION === '3'})
  const desiredCapabilities = {browserName: browser, ...capabilities}
  if (configurable) {
    const browserOptionsName = browserOptionsNames[browser || desiredCapabilities.browserName]
    if (browserOptionsName) {
      const browserOptions = desiredCapabilities[browserOptionsName] || {}
      browserOptions.args = [...(browserOptions.args || []), ...args]
      if (headless) browserOptions.args.push('headless')
      if (attach) {
        browserOptions.debuggerAddress = attach === true ? 'localhost:9222' : attach
        if (browser !== 'firefox') browserOptions.w3c = false
      }
      desiredCapabilities[browserOptionsName] = browserOptions
    }
  }
  if (appium && browser === 'chrome') {
    desiredCapabilities['appium:chromeOptions'] = {w3c: false}
  }
  const builder = new Builder().withCapabilities(desiredCapabilities)
  if (url && !attach) builder.usingServer(url.href)
  if (proxy) {
    builder.setProxy({
      proxyType: 'manual',
      httpProxy: proxy.http || proxy.server,
      sslProxy: proxy.https || proxy.server,
      ftpProxy: proxy.ftp,
      noProxy: proxy.bypass,
    })
  }
  const driver = await builder.build()
  return [driver, () => driver.quit()]
}

// #endregion

// #region LEGACY API

export const wrapDriver = legacy.wrapDriver

// #endregion
