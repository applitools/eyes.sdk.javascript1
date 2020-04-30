'use strict'
const chromedriver = require('chromedriver')
const {remote} = require('webdriverio')
const assert = require('assert')
const WDIODriver = require('../../src/wrappers/WDIODriver')
const WDIOBrowsingContext = require('../../src/wrappers/WDIOBrowsingContext')
const {Logger} = require('../../index')

describe('refreshFrames', function() {
  let logger, browser, driver, context

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
    await browser.url('http://applitools-test-frames.surge.sh/')
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

  it('untracked same origin frame chain [(0-0)?]', async () => {
    const frameElements = []
    const {value: frameElement} = await browser.element('iframe[name="doc"]')
    frameElements.push(frameElement)
    await browser.frame(frameElement)
    assert.strictEqual(context.frameChain.size, 0)
    await context.framesRefresh()
    const frameChain = context.frameChain
    assert.strictEqual(frameChain.size, frameElements.length)
    for (const frameIndex in frameElements) {
      assert.strictEqual(
        elementId(frameElements[frameIndex]),
        frameChain.frameAt(frameIndex).element.elementId,
      )
    }
  })

  it('untracked cors frame chain [(0-1-2)?]', async () => {
    const frameElements = []
    const {value: frameElement1} = await browser.element('iframe[name="frame1"]')
    frameElements.push(frameElement1)
    await browser.frame(frameElement1)
    const {value: frameElement2} = await browser.element('iframe[name="frame2"]')
    frameElements.push(frameElement2)
    await browser.frame(frameElement2)
    assert.strictEqual(context.frameChain.size, 0)
    await context.framesRefresh()
    const frameChain = context.frameChain
    assert.strictEqual(frameChain.size, frameElements.length)
    for (const frameIndex in frameElements) {
      assert.strictEqual(
        elementId(frameElements[frameIndex]),
        frameChain.frameAt(frameIndex).element.elementId,
      )
    }
  })

  it('untracked mixed frame chain [(0-1-0)?]', async () => {
    const frameElements = []
    const {value: frameElement1} = await browser.element('iframe[name="frame1"]')
    frameElements.push(frameElement1)
    await browser.frame(frameElement1)
    const {value: frameElement0} = await browser.element('iframe[name="frame0"]')
    frameElements.push(frameElement0)
    await browser.frame(frameElement0)
    assert.strictEqual(context.frameChain.size, 0)
    await context.framesRefresh()
    const frameChain = context.frameChain
    assert.strictEqual(frameChain.size, frameElements.length)
    for (const frameIndex in frameElements) {
      assert.strictEqual(
        elementId(frameElements[frameIndex]),
        frameChain.frameAt(frameIndex).element.elementId,
      )
    }
  })

  it('untracked mixed frame chain [(0-1-1)?]', async () => {
    const frameElements = []
    const {value: frameElement1} = await browser.element('iframe[name="frame1"]')
    frameElements.push(frameElement1)
    await browser.frame(frameElement1)
    const {value: frameElement11} = await browser.element('iframe[name="frame1"]')
    frameElements.push(frameElement11)
    await browser.frame(frameElement11)
    assert.strictEqual(context.frameChain.size, 0)
    await context.framesRefresh()
    const frameChain = context.frameChain
    assert.strictEqual(frameChain.size, frameElements.length)
    for (const frameIndex in frameElements) {
      assert.strictEqual(
        elementId(frameElements[frameIndex]),
        frameChain.frameAt(frameIndex).element.elementId,
      )
    }
  })

  it('partially tracked frame chain [0-2-1-(2)?]', async () => {
    const frameElements = []
    const {value: frameElement2} = await browser.element('iframe[name="frame2"]')
    frameElements.push(frameElement2)
    await context.frame(frameElement2)
    const {value: frameElement1} = await browser.element('iframe[name="frame1"]')
    frameElements.push(frameElement1)
    await context.frame(frameElement1)
    const {value: frameElement22} = await browser.element('iframe[name="frame2"]')
    frameElements.push(frameElement22)
    await browser.frame(frameElement22)
    assert.strictEqual(context.frameChain.size, 2)
    await context.framesRefresh()
    const frameChain = context.frameChain
    assert.strictEqual(frameChain.size, frameElements.length)
    for (const frameIndex in frameElements) {
      assert.strictEqual(
        elementId(frameElements[frameIndex]),
        frameChain.frameAt(frameIndex).element.elementId,
      )
    }
  })

  it('partially tracked frame chain [(0-2)?-1-2]', async () => {
    const frameElements = []
    const {value: frameElement2} = await browser.element('iframe[name="frame2"]')
    frameElements.push(frameElement2)
    await browser.frame(frameElement2)
    const {value: frameElement1} = await browser.element('iframe[name="frame1"]')
    frameElements.push(frameElement1)
    await context.frame(frameElement1)
    const {value: frameElement22} = await browser.element('iframe[name="frame2"]')
    frameElements.push(frameElement22)
    await context.frame(frameElement22)
    assert.strictEqual(context.frameChain.size, 2)
    await context.framesRefresh()
    const frameChain = context.frameChain
    assert.strictEqual(frameChain.size, frameElements.length)
    for (const frameIndex in frameElements) {
      assert.strictEqual(
        elementId(frameElements[frameIndex]),
        frameChain.frameAt(frameIndex).element.elementId,
      )
    }
  })

  it('tracked frame chain [0-2-1-2]', async () => {
    const frameElements = []
    const {value: frameElement2} = await browser.element('iframe[name="frame2"]')
    frameElements.push(frameElement2)
    await context.frame(frameElement2)
    const {value: frameElement1} = await browser.element('iframe[name="frame1"]')
    frameElements.push(frameElement1)
    await context.frame(frameElement1)
    const {value: frameElement22} = await browser.element('iframe[name="frame2"]')
    frameElements.push(frameElement22)
    await context.frame(frameElement22)
    assert.strictEqual(context.frameChain.size, frameElements.length)
    await context.framesRefresh()
    const frameChain = context.frameChain
    assert.strictEqual(frameChain.size, frameElements.length)
    for (const frameIndex in frameElements) {
      assert.strictEqual(
        elementId(frameElements[frameIndex]),
        frameChain.frameAt(frameIndex).element.elementId,
      )
    }
  })
})
