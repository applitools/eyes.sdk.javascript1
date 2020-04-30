'use strict'

const chromedriver = require('chromedriver')
const {remote} = require('webdriverio')
const assert = require('assert')
const {Eyes, Target, By, BatchInfo} = require('../../../index')

describe('PreserveTargetFrameAfterCheck', () => {
  let browser, eyes, batch

  async function getDocumentElement() {
    const {value: element} = await browser.execute('return window.document')
    return element
  }

  before(async () => {
    await chromedriver.start([], true)
    batch = new BatchInfo('PreserveTargetFrameAfterCheck')
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
    eyes = new Eyes()
    eyes.setHideScrollbars(true)
    eyes.setBatch(batch)
  })

  afterEach(async () => {
    await eyes.abort()
  })

  after(async () => {
    await browser.end()
    chromedriver.stop()
  })

  it('CheckWindow_WrappedDriver', async function() {
    const driver = await eyes.open(browser, this.test.parent.title, this.test.title)
    await driver.frame('frame-main')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('window', Target.window())
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckWindow_UnwrappedDriver', async function() {
    await eyes.open(browser, this.test.parent.title, this.test.title)
    await browser.frame('frame-main')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('window', Target.window())
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckNestedFrame_WrappedDriver', async function() {
    const driver = await eyes.open(browser, this.test.parent.title, this.test.title)
    await driver.frame('frame-main')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('nested frame', Target.frame('frame-comb').frame('frame-image'))
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckNestedFrame_UnwrappedDriver', async function() {
    await eyes.open(browser, this.test.parent.title, this.test.title)
    await browser.frame('frame-main')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('nested frame', Target.frame('frame-comb').frame('frame-image'))
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckRegionInsideFrameBySelector_WrappedDriver', async function() {
    const driver = await eyes.open(browser, this.test.parent.title, this.test.title)
    await driver.frame('frame-main')
    await driver.frame('frame-comb')
    await driver.frame('frame-image')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('region', Target.region(By.id('image')))
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckRegionInsideFrameBySelector_UnwrappedDriver', async function() {
    await eyes.open(browser, this.test.parent.title, this.test.title)
    await browser.frame('frame-main')
    await browser.frame('frame-comb')
    await browser.frame('frame-image')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('region', Target.region(By.id('image')))
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckRegionInsideFrameByElement_WrappedDriver', async function() {
    const driver = await eyes.open(browser, this.test.parent.title, this.test.title)
    await driver.frame('frame-main')
    await driver.frame('frame-comb')
    await driver.frame('frame-image')

    const element = await driver.element('#image')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('region', Target.region(element))
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckRegionInsideFrameByElement_UnwrappedDriver', async function() {
    await eyes.open(browser, this.test.parent.title, this.test.title)
    await browser.frame('frame-main')
    await browser.frame('frame-comb')
    await browser.frame('frame-image')

    const element = await browser.element('#image')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('region', Target.region(element))
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckFrameFully_WrappedDriver', async function() {
    const driver = await eyes.open(browser, this.test.parent.title, this.test.title)
    await driver.frame('frame-main')
    await driver.frame('frame-comb')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('nested frame fully', Target.frame('frame-image').fully())
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckFrameFully_UnwrappedDriver', async function() {
    await eyes.open(browser, this.test.parent.title, this.test.title)
    await browser.frame('frame-main')
    await browser.frame('frame-comb')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('nested frame fully', Target.frame('frame-image').fully())
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckCORSFrameRegionBySelector_WrappedDriver', async function() {
    const driver = await eyes.open(browser, this.test.parent.title, this.test.title)
    await driver.frame('frame-main')
    await driver.frame('frame-cors')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('region in cors frame', Target.region(By.id('login-form')))
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckCORSFrameRegionBySelector_UnwrappedDriver', async function() {
    await eyes.open(browser, this.test.parent.title, this.test.title)
    await browser.frame('frame-main')
    await browser.frame('frame-cors')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('region in cors frame', Target.region(By.id('login-form')))
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckCORSFrameRegionByElement_WrappedDriver', async function() {
    const driver = await eyes.open(browser, this.test.parent.title, this.test.title)
    await driver.frame('frame-main')
    await driver.frame('frame-cors')

    const element = await driver.element('#login-form')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('region in cors frame', Target.region(element))
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckCORSFrameRegionByElement_UnwrappedDriver', async function() {
    await eyes.open(browser, this.test.parent.title, this.test.title)
    await browser.frame('frame-main')
    await browser.frame('frame-cors')

    const element = await browser.element('#login-form')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('region in cors frame', Target.region(element))
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })
})
