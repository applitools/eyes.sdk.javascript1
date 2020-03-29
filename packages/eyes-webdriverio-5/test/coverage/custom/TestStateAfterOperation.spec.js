'use strict'

const chromedriver = require('chromedriver')
const {remote} = require('webdriverio')
const assert = require('assert')
const {Eyes, Target, By} = require('../../../index')

const Common = require('../../Common')

describe('TestStateAfterOperation', () => {
  let browser, eyes

  before(async () => {
    await chromedriver.start([], true)
  })

  beforeEach(async () => {
    browser = await remote({
      port: 9515,
      path: '/',
      logLevel: 'error',
      ...Common.CHROME,
    })
    eyes = new Eyes()
  })

  afterEach(async () => {
    await browser.deleteSession()
    await eyes.abort()
  })

  after(async () => {
    chromedriver.stop()
  })

  it('should clear target region after check', async function() {
    await browser.url('https://applitools.github.io/demo/TestPages/MinionsTestPage/index.html')

    await eyes.open(browser, this.test.parent.title, this.test.title)
    await eyes.check('check region', Target.region(By.css('img')))

    assert.strictEqual(eyes._targetElement, null)

    return eyes.close(false)
  })
})
