import * as utils from '@applitools/utils'
import type * as Playwright from 'playwright'

export type Driver = Playwright.Page
export type Element = Playwright.ElementHandle
export type Context = Playwright.Frame
export type Selector = string | {type: string; selector: string}

// #region HELPERS

async function handleToObject(handle: Playwright.JSHandle): Promise<any> {
  const [, type] = handle.toString().split('@')
  if (type === 'array') {
    const map = await handle.getProperties()
    return Promise.all(Array.from(map.values(), handleToObject))
  } else if (type === 'object') {
    const map = await handle.getProperties()
    const chunks = await Promise.all(Array.from(map, async ([key, handle]) => ({[key]: await handleToObject(handle)})))
    return chunks.length > 0 ? Object.assign(...(chunks as [any])) : {}
  } else if (type === 'node') {
    return handle.asElement()
  } else {
    return handle.jsonValue()
  }
}
function transformSelector(selector: any): string {
  if (utils.types.has(selector, ['type', 'selector'])) {
    if (selector.type === 'css') return `css=${selector.selector}`
    else if (selector.type === 'xpath') return `xpath=${selector.selector}`
  }
  return selector
}

// #endregion

// #region UTILITY

export function isDriver(page: any): page is Driver {
  return page.constructor.name === 'Page'
}
export function isElement(element: any): element is Element {
  if (!element) return false
  return element.constructor.name === 'ElementHandle'
}
export function isSelector(selector: any): selector is Selector {
  return utils.types.isString(selector) || utils.types.has(selector, ['type', 'selector'])
}
export function extractContext(page: Driver | Context): Context {
  return isDriver(page) ? page.mainFrame() : page
}
export function isStaleElementError(err: any): boolean {
  return err && err.message && err.message.includes('Protocol error (DOM.describeNode)')
}
export async function isEqualElements(frame: Context, element1: Element, element2: Element): Promise<boolean> {
  return frame.evaluate(([element1, element2]) => element1 === element2, [element1, element2]).catch(() => false)
}

// #endregion

// #region COMMANDS

export async function executeScript(frame: Context, script: ((arg: any) => any) | string, arg: any): Promise<any> {
  script = utils.types.isString(script) ? (new Function(script) as (arg: any) => any) : script
  const result = await frame.evaluateHandle(script, arg)
  return handleToObject(result)
}
export async function mainContext(frame: Context): Promise<Context> {
  frame = extractContext(frame)
  let mainFrame = frame
  while (mainFrame.parentFrame()) {
    mainFrame = mainFrame.parentFrame()
  }
  return mainFrame
}
export async function parentContext(frame: Context): Promise<Context> {
  frame = extractContext(frame)
  return frame.parentFrame()
}
export async function childContext(_frame: Context, element: Element): Promise<Context> {
  return element.contentFrame()
}
export async function findElement(frame: Context, selector: Selector): Promise<Element> {
  return frame.$(transformSelector(selector))
}
export async function findElements(frame: Context, selector: Selector): Promise<Element[]> {
  return frame.$$(transformSelector(selector))
}
export async function getViewportSize(page: Driver): Promise<{width: number; height: number}> {
  return page.viewportSize()
}
export async function setViewportSize(page: Driver, size: {width: number; height: number}): Promise<void> {
  return page.setViewportSize(size)
}
export async function getTitle(page: Driver): Promise<string> {
  return page.title()
}
export async function getUrl(page: Driver): Promise<string> {
  return page.url()
}
export async function visit(page: Driver, url: string): Promise<void> {
  await page.goto(url)
}
export async function takeScreenshot(page: Driver): Promise<Buffer> {
  return page.screenshot()
}
export async function click(frame: Context, element: Element | Selector): Promise<void> {
  if (isSelector(element)) element = await findElement(frame, element)
  await element.click()
}
export async function type(frame: Context, element: Element | Selector, keys: string): Promise<void> {
  if (isSelector(element)) element = await findElement(frame, element)
  await element.type(keys)
}
export async function hover(frame: Context, element: Element | Selector): Promise<void> {
  if (isSelector(element)) element = await findElement(frame, element)
  await element.hover()
}
export async function scrollIntoView(frame: Context, element: Element | Selector, align = false): Promise<void> {
  if (isSelector(element)) element = await findElement(frame, element)
  // @ts-ignore
  await frame.evaluate(([element, align]) => element.scrollIntoView(align), [element, align])
}
export async function waitUntilDisplayed(frame: Context, selector: Selector): Promise<void> {
  await frame.waitForSelector(transformSelector(selector))
}

// #endregion

// #region BUILD

const browserNames: Record<string, string> = {
  chrome: 'chromium',
  safari: 'webkit',
  firefox: 'firefox',
}
export async function build(env: any): Promise<[Driver, () => Promise<void>]> {
  const playwright = require('playwright')
  const parseEnv = require('@applitools/test-utils/src/parse-env')
  const {browser, device, url, attach, proxy, args = [], headless} = parseEnv(env, 'cdp')
  const launcher = playwright[browserNames[browser] || browser]
  if (!launcher) throw new Error(`Browser "${browser}" is not supported.`)
  if (attach) throw new Error(`Attaching to the existed browser doesn't supported by playwright`)
  const options: any = {
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
  let driver: any
  if (url) {
    if (utils.types.isArray(options.ignoreDefaultArgs)) {
      url.searchParams.set('ignoreDefaultArgs', options.ignoreDefaultArgs.join(','))
    }
    url.searchParams.set('headless', options.headless)
    options.args.forEach((arg: string) => url.searchParams.set(...arg.split('=')))
    driver = await launcher.connect({wsEndpoint: url.href})
  } else {
    driver = await launcher.launch(options)
  }
  const context = await driver.newContext(device ? playwright.devices[device] : {})
  const page = await context.newPage()
  return [page, () => driver.close()]
}

// #endregion
