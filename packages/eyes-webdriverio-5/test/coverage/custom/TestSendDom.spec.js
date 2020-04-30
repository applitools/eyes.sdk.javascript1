'use strict'
const {assertImage} = require('./util/ApiAssertions')
const {getDriver, getEyes, getBatch} = require('./util/TestSetup')
const {Target, By} = require('../../../index')
const appName = 'Test Send Dom'
const batch = getBatch()

describe(appName, () => {
  describe(`TestSendDom`, () => {
    let browser, eyes
    beforeEach(async () => {
      browser = await getDriver('CHROME')
      ;({eyes} = await getEyes('classic', 'CSS'))
      eyes.setBatch(batch)
    })

    afterEach(async () => {
      await eyes.abortIfNotClosed()
      await browser.deleteSession()
    })

    it(`TestSendDOM_Selector`, async () => {
      await browser.url('https://applitools.github.io/demo/TestPages/DomTest/dom_capture.html')
      await eyes.open(browser, 'Test SendDom', `Test SendDom`, {
        width: 1000,
        height: 700,
      })
      await eyes.check('region', Target.region(By.css('#scroll1')))
      let results = await eyes.close(false)
      await assertImage(results, {
        hasDom: true,
      })
    })
    it(`TestNotSendDOM`, async () => {
      await browser.url('https://applitools.com/helloworld')
      await eyes.open(browser, 'Test NOT SendDom', `Test NOT SendDom`, {
        width: 1000,
        height: 700,
      })
      await eyes.check('region', Target.window().sendDom(false))
      let results = await eyes.close(false)
      await assertImage(results, {
        hasDom: false,
      })
    })

    let domCases = [
      {
        url: `https://applitools.github.io/demo/TestPages/DomTest/dom_capture.html`,
        title: `TestSendDOM_1`,
      },
      {
        url: `https://applitools.github.io/demo/TestPages/DomTest/dom_capture_2.html`,
        title: `TestSendDOM_2`,
      },
    ]

    domCases.forEach(domCase => {
      it(`${domCase.title}`, async () => {
        await browser.url(domCase.url)
        await eyes.open(browser, 'Test Send DOM', `${domCase.title}`)
        await eyes.checkWindow()
        let results = await eyes.close(false)
        await assertImage(results, {hasDom: true})
      })
    })
  })
})
