'use strict'
const {assertImage} = require('./util/ApiAssertions')
const {getDriver, getEyes, getBatch} = require('./util/TestSetup')
const {expect} = require('chai')
const {By} = require('selenium-webdriver')
const {EyesSelenium, Target} = require('../../../index')
const appName = 'Test Send Dom'
const batch = getBatch()

class DomInterceptingEyes extends EyesSelenium {
  async tryCaptureDom() {
    this.domJSON = await super.tryCaptureDom()
    return this.domJSON
  }
}

describe(appName, () => {
  describe(`TestSendDom Intercepted`, () => {
    let driver
    beforeEach(async () => {
      driver = await getDriver('CHROME')
    })

    afterEach(async () => {
      await driver.quit()
    })
    // There differences between fixture and domJson which cause enormous console output
    it.skip('TestSendDOM_FullWindow', async () => {
      driver.get('https://applitools.github.io/demo/TestPages/FramesTestPage/')
      let eyes = new DomInterceptingEyes()
      eyes.setBatch(batch)
      eyes.setBranchName('master')
      await eyes.open(driver, 'Test Send DOM', 'Full Window', {
        width: 1024,
        height: 768,
      })
      try {
        await eyes.check('Window', Target.window().fully())
        let actual = eyes.domJSON
        let results = await eyes.close(false)
        await assertImage(results, {hasDom: true})
        let expected = require('../../fixtures/expected_dom1.json')
        let json = JSON.stringify(expected)
        expect(actual).to.be.eql(json, 'There are differences in the dom json')
      } finally {
        await eyes.abortIfNotClosed()
      }
    })
  })

  describe(`TestSendDom`, () => {
    let webDriver, eyes
    beforeEach(async () => {
      webDriver = await getDriver('CHROME')
      ;({eyes} = await getEyes('classic', 'CSS'))
    })

    afterEach(async () => {
      await eyes.abortIfNotClosed()
      await webDriver.quit()
    })

    it(`TestSendDOM_Selector`, async () => {
      await webDriver.get('https://applitools.github.io/demo/TestPages/DomTest/dom_capture.html')
      await eyes.open(webDriver, 'Test SendDom', `Test SendDom`, {
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
      await webDriver.get('https://applitools.com/helloworld')
      await eyes.open(webDriver, 'Test NOT SendDom', `Test NOT SendDom`, {
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
        await webDriver.get(domCase.url)
        await eyes.open(webDriver, 'Test Send DOM', `${domCase.title}`)
        await eyes.checkWindow()
        let results = await eyes.close(false)
        await assertImage(results, {hasDom: true})
      })
    })
  })
})
