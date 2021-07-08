import * as utils from '@applitools/utils'
import * as testcafe from 'testcafe'
import * as fs from 'fs'

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace TestCafe {
  export type TestController = globalThis.TestController
  export type NodeSnapshot = globalThis.NodeSnapshot
  export type Selector = globalThis.Selector
  export type SelectorOptions = globalThis.SelectorOptions
}

export type Driver = TestCafe.TestController
export type Element = TestCafe.Selector | TestCafe.NodeSnapshot
export type Selector = TestCafe.Selector | {type: string; selector: string} | string

// #region HELPERS

function XPathSelector(selector: string, options?: TestCafe.SelectorOptions): TestCafe.Selector {
  const getElementsByXPath = testcafe.Selector(xpath => {
    /* eslint-disable no-undef */
    const iterator = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null)
    /* eslint-enable */
    const items = []

    let item = iterator.iterateNext()

    while (item) {
      items.push(item)
      item = iterator.iterateNext()
    }

    return items
  }, options)
  return testcafe.Selector(getElementsByXPath(selector), options)
}
function transformSelector(selector: Selector): TestCafe.Selector {
  if (utils.types.has(selector, ['type', 'selector'])) {
    if (selector.type === 'xpath') return XPathSelector(selector.selector)
    return testcafe.Selector(selector.selector)
  }
  return testcafe.Selector(selector)
}
function deserializeResult(result: any, elements: Element[]): any {
  if (!result) {
    return result
  } else if (result.isElement) {
    return elements.shift()
  } else if (utils.types.isArray(result)) {
    return result.map(result => deserializeResult(result, elements))
  } else if (utils.types.isObject(result)) {
    return Object.entries(result).reduce((object, [key, value]) => {
      return Object.assign(object, {[key]: deserializeResult(value, elements)})
    }, {})
  } else {
    return result
  }
}
const scriptRunner = testcafe.ClientFunction(() => {
  // @ts-ignore
  const {script, arg} = input as {script: string; arg: any}
  const func = new Function(script.startsWith('function') ? `return (${script}).apply(null, arguments)` : script)
  const elements: HTMLElement[] = []
  const result = serializeResult(func(deserializeArg(arg)))

  const resultId = elements.length > 0 ? String(Math.floor(Math.random() * 1000)) : null
  if (resultId) {
    const APPLITOOLS_NAMESPACE = '__TESTCAFE_EYES_APPLITOOLS__'
    const global = window as any
    if (!global[APPLITOOLS_NAMESPACE]) global[APPLITOOLS_NAMESPACE] = {}
    global[APPLITOOLS_NAMESPACE][resultId] = elements
  }
  return {result, resultId, elementsCount: elements.length}

  function deserializeArg(arg: any): any {
    if (!arg) {
      return arg
    } else if (typeof arg === 'function') {
      return arg()
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

  function serializeResult(result: any): any {
    if (!result) {
      return result
    } else if (result instanceof window.HTMLElement) {
      elements.push(result)
      return {isElement: true}
    } else if (Array.isArray(result)) {
      return result.map(serializeResult)
    } else if (typeof result === 'object') {
      return Object.entries(result).reduce((object, [key, value]) => {
        return Object.assign(object, {[key]: serializeResult(value)})
      }, {})
    } else {
      return result
    }
  }
})
const elementsExtractor = testcafe.Selector(() => {
  // @ts-ignore
  const {resultId} = input as {resultId: string}
  const APPLITOOLS_NAMESPACE = '__TESTCAFE_EYES_APPLITOOLS__'
  const global = window as any
  if (!global[APPLITOOLS_NAMESPACE] || !global[APPLITOOLS_NAMESPACE][resultId]) return []
  const elements = global[APPLITOOLS_NAMESPACE][resultId]
  return elements
})

// #endregion

// #region UTILITY

export function isDriver(t: any): t is Driver {
  return utils.types.instanceOf(t, 'TestController')
}
export function isElement(element: any): element is Element {
  if (!element) return false
  return Boolean(
    (element.addCustomMethods && element.find && element.parent) ||
      (element.nodeType && element.selector?.addCustomMethods && element.selector?.find && element.selector?.parent),
  )
}
export function isSelector(selector: any): selector is Selector {
  return (
    utils.types.has(selector, ['type', 'selector']) ||
    utils.types.isString(selector) ||
    Boolean(selector.addCustomMethods && selector.find && selector.parent)
  )
}
export function transformElement(element: Element): TestCafe.Selector {
  return utils.types.isFunction((element as any).selector) ? (element as any).selector : element
}
export function extractSelector(element: Element): Selector {
  return utils.types.isFunction((element as any).selector) ? (element as any).selector : element
}
export function isStaleElementError(_err: any): boolean {
  // NOTE:
  // TestCafe doesn't have a stale element error
  return false
}
export async function isEqualElements(t: Driver, element1: Element, element2: Element): Promise<boolean> {
  if (!element1 || !element2) return false
  // @ts-ignore
  const compareElements = testcafe.ClientFunction(() => element1() === element2(), {
    boundTestRun: t,
    dependencies: {element1, element2},
  })
  return compareElements()
}

// #endregion

// #region COMMANDS

export async function executeScript(t: Driver, script: ((arg: any) => any) | string, arg?: any): Promise<any> {
  script = utils.types.isFunction(script) ? script.toString() : script

  const {result, resultId, elementsCount} = await scriptRunner.with({
    boundTestRun: t,
    dependencies: {input: {script, arg}},
  })()

  if (!result || !resultId) return result

  const elements = elementsExtractor.with({
    boundTestRun: t,
    dependencies: {input: {resultId}},
  })

  return deserializeResult(
    result,
    Array.from({length: elementsCount}, (_, index) => elements.nth(index)),
  )
}
export async function mainContext(t: Driver): Promise<Driver> {
  await t.switchToMainWindow()
  return t
}
// NOTE:
// Switching from the current browsing context up one-level is not built into
// TestCafe (yet). See the following for reference:
// - https://github.com/DevExpress/testcafe/issues/5429
// - https://stackoverflow.com/questions/63453228/how-to-traverse-a-nested-frame-tree-by-its-hierarchy-in-testcafe
// A workaround was implemented in core to minimize on the performance overhead
// needed to construct and walk through the frame tree with DFS.
// See `findPathToChildContext` in core/lib/sdk/EyesDriver.js for details.
// export async function parentContext(t: Driver): Promise<void> {}
export async function childContext(t: Driver, element: Element): Promise<Driver> {
  await t.switchToIframe(element)
  return t
}
export async function findElement(t: Driver, selector: Selector): Promise<Element> {
  const element = await transformSelector(selector).with({boundTestRun: t})()
  return element ? (element as any).selector : null
}
export async function findElements(t: Driver, selector: Selector): Promise<Element[]> {
  // NOTE:
  // Adapted from https://testcafe-discuss.devexpress.com/t/how-to-get-a-nodelist-from-selector/778
  const elements = transformSelector(selector).with({boundTestRun: t})
  return Array.from({length: await elements.count}, (_, index) => elements.nth(index))
}
export async function getElementRect(
  _t: Driver,
  element: Element,
): Promise<{x: number; y: number; width: number; height: number}> {
  const {left: x, top: y, width, height} = await element.boundingClientRect
  return {x, y, width, height}
}
export async function setViewportSize(t: Driver, size: {width: number; height: number}): Promise<void> {
  await t.resizeWindow(size.width, size.height)
}
export async function getTitle(t: Driver): Promise<string> {
  try {
    return await testcafe.Selector('title', {boundTestRun: t}).innerText
  } catch (error) {
    return ''
  }
}
export async function getUrl(t: Driver): Promise<string> {
  const getUrl = testcafe.ClientFunction(() => document.location.href, {
    boundTestRun: t,
  })
  return getUrl()
}
export async function visit(t: Driver, url: string): Promise<void> {
  await t.navigateTo(url)
}
export async function takeScreenshot(t: Driver): Promise<Buffer> {
  // NOTE:
  // Since we are constrained to saving screenshots to disk, we place each screenshot in its own
  // dot-folder which has a GUID prefix (e.g., .applitools-guide/screenshot.png).
  // We then read the file from disk, return the buffer, and delete the folder.
  const screenshotPath = await t.takeScreenshot({
    // thumbnails: false,
    path: `.applitools/${utils.general.guid()}.png`,
  })
  try {
    return fs.readFileSync(screenshotPath)
  } finally {
    fs.unlinkSync(screenshotPath)
  }
}
export async function click(t: Driver, element: Element | Selector): Promise<void> {
  if (isSelector(element)) element = await findElement(t, element)
  await t.click(element)
}
export async function type(t: Driver, element: Element | Selector, keys: string): Promise<void> {
  if (isSelector(element)) element = await findElement(t, element)
  await t.typeText(element, keys)
}
export async function hover(t: Driver, element: Element | Selector): Promise<void> {
  if (isSelector(element)) element = await findElement(t, element)
  await t.hover(element)
}
export async function scrollIntoView(t: Driver, element: Element | Selector, align = false): Promise<void> {
  if (isSelector(element)) element = await findElement(t, element)
  // @ts-ignore
  const scrollIntoView = testcafe.ClientFunction(() => element().scrollIntoView(align), {
    boundTestRun: t,
    dependencies: {element, align},
  })
  await scrollIntoView()
}
export async function waitUntilDisplayed(t: Driver, selector: Selector): Promise<void> {
  await transformSelector(selector).with({boundTestRun: t, visibilityCheck: true})
}

// #endregion

// #region BUILD

export function build(): [Driver, () => Promise<void>] {
  // no-op for coverage-tests
  return [undefined, () => void 0]
}

// #endregion
