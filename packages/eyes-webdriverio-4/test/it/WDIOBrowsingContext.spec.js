'use strict'
const chromedriver = require('chromedriver')
const {remote} = require('webdriverio')
const assert = require('assert')
const WDIODriver = require('../../src/wrappers/WDIODriver')
const WDIOBrowsingContext = require('../../src/wrappers/WDIOBrowsingContext')
const {Logger} = require('../../index')

describe('WDIOBrowsingContext', function() {
  let logger, browser, driver, context

  async function getDocument(browser) {
    const {value: element} = await browser.execute('return window.document')
    return element
  }

  async function getFrameElement(browser) {
    const {value: element} = await browser.execute('return window.frameElement')
    return element
  }

  function elementId(element) {
    return element.ELEMENT || element['element-6066-11e4-a52e-4f735466cecf']
  }

  before(async () => {
    logger = new Logger(false)
    await chromedriver.start([], true)
    browser = remote({
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          args: ['disable-infobars', 'headless'],
        },
      },
      logLevel: 'error',
      port: 9515,
      path: '/',
    })
    await browser.init()
    await browser.url('https://applitools.github.io/demo/TestPages/FramesAndRegionsPage/')
  })

  beforeEach(async () => {
    await browser.frame(null)
    driver = new WDIODriver(logger, browser)
    context = new WDIOBrowsingContext(logger, driver)
  })

  after(async () => {
    await browser.end()
    chromedriver.stop()
  })

  it('frame(frameIndex)', async () => {
    const frameIndex = 1
    const {value: frameElements} = await browser.elements('frame, iframe')
    await context.frame(frameIndex)
    assert.strictEqual(context.frameChain.size, 1)
    const currentFrameElement = await getFrameElement(browser)
    assert.deepStrictEqual(elementId(currentFrameElement), elementId(frameElements[frameIndex]))
  })

  it('frame(frameId)', async () => {
    const frameId = 'frame_aside'
    const {value: frameElement} = await browser.element(`iframe#${frameId}`)
    await context.frame(frameId)
    assert.strictEqual(context.frameChain.size, 1)
    const currentFrameElement = await getFrameElement(browser)
    assert.deepStrictEqual(elementId(currentFrameElement), elementId(frameElement))
  })

  it('frame(element)', async () => {
    const {value: frameElement} = await browser.element('iframe#frame_main')
    await context.frame(frameElement)
    assert.strictEqual(context.frameChain.size, 1)
    const currentFrameElement = await getFrameElement(browser)
    assert.deepStrictEqual(elementId(currentFrameElement), elementId(frameElement))
  })

  it('frame(elementWrapper)', async () => {
    const frameElement = await driver.finder.findElement('iframe#frame_main')
    await context.frame(frameElement)
    assert.strictEqual(context.frameChain.size, 1)
    const currentFrameElement = await getFrameElement(browser)
    assert.deepStrictEqual(elementId(currentFrameElement), frameElement.elementId)
  })

  it('frame(null)', async () => {
    const topContextDocument = await getDocument(browser)
    await context.frame(0)
    await context.frame()
    assert.strictEqual(context.frameChain.size, 0)
    const currentContextDocument = await getDocument(browser)
    assert.deepStrictEqual(elementId(currentContextDocument), elementId(topContextDocument))
  })

  it('frameParent()', async () => {
    const topContextDocument = await getDocument(browser)
    await context.frame(1)
    const nestedContextDocument = await getDocument(browser)
    await context.frame(1)
    assert.strictEqual(context.frameChain.size, 2)

    await context.frameParent()
    assert.strictEqual(context.frameChain.size, 1)
    const parentContextDocument = await getDocument(browser)
    assert.deepStrictEqual(elementId(parentContextDocument), elementId(nestedContextDocument))

    await context.frameParent()
    assert.strictEqual(context.frameChain.size, 0)
    const grandparentContextDocument = await getDocument(browser)
    assert.deepStrictEqual(elementId(grandparentContextDocument), elementId(topContextDocument))
  })

  it('frames()', async () => {
    const frameIdPath = ['frame_main', 'frame_comb']
    const frameDocuments = []
    frameDocuments.push(await getDocument(browser))
    for (const frameId of frameIdPath) {
      await context.frame(frameId)
      frameDocuments.unshift(await getDocument(browser))
    }
    assert.strictEqual(context.frameChain.size, frameIdPath.length)

    await context.frameDefault()
    assert.strictEqual(context.frameChain.size, 0)

    await context.frames(frameIdPath)
    assert.strictEqual(context.frameChain.size, frameIdPath.length)

    for (const frameDocument of frameDocuments) {
      assert.deepStrictEqual(elementId(await getDocument(browser)), elementId(frameDocument))
      await context.frameParent()
    }
  })
})
