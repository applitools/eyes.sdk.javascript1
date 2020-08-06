'use strict'
const cwd = process.cwd()
const path = require('path')
const {getEyes, batch} = require('../../src/test-setup')
const spec = require(path.resolve(cwd, 'src/SpecDriver'))
const {Eyes, Target} = require(cwd)
const {assertImage} = require('../util/ApiAssertions')
const {expect} = require('chai')
const appName = 'Test Send Dom'

class DomInterceptingEyes extends Eyes {
  async tryCaptureDom() {
    this.domJSON = await super.tryCaptureDom()
    return this.domJSON
  }
}

describe(appName, () => {
  describe(`TestSendDom Intercepted`, () => {
    let driver
    beforeEach(async () => {
      driver = await spec.build({browser: 'chrome'})
    })

    afterEach(async () => {
      await spec.cleanup(driver)
    })
    // There differences between fixture and domJson which cause enormous console output
    it.skip('TestSendDOM_FullWindow', async () => {
      spec.visit(driver, 'https://applitools.github.io/demo/TestPages/FramesTestPage/')
      let eyes = new DomInterceptingEyes()
      eyes.setBatch(batch)
      eyes.setBranchName('master')
      if (process.env['APPLITOOLS_API_KEY_SDK']) {
        eyes.setApiKey(process.env['APPLITOOLS_API_KEY_SDK'])
      }
      await eyes.open(driver, 'Test Send DOM', 'Full Window', {
        width: 1024,
        height: 768,
      })
      try {
        await eyes.check('Window', Target.window().fully())
        let actual = eyes.domJSON
        let results = await eyes.close(false)
        await assertImage(results, {hasDom: true})
        let expected = require('../fixtures/expected_dom1.json')
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
      webDriver = await spec.build({browser: 'chrome'})
      eyes = await getEyes('classic', 'CSS')
    })

    afterEach(async () => {
      await eyes.abortIfNotClosed()
      await spec.cleanup(webDriver)
    })

    it(`TestSendDOM_Selector`, async () => {
      await spec.visit(
        webDriver,
        'https://applitools.github.io/demo/TestPages/DomTest/dom_capture.html',
      )
      await eyes.open(webDriver, 'Test SendDom', `Test SendDom`, {
        width: 1000,
        height: 700,
      })
      await eyes.check('region', Target.region('#scroll1'))
      let results = await eyes.close(false)
      await assertImage(results, {
        hasDom: true,
      })
    })
    it(`TestNotSendDOM`, async () => {
      await spec.visit(webDriver, 'https://applitools.com/helloworld')
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
        await spec.visit(webDriver, domCase.url)
        await eyes.open(webDriver, 'Test Send DOM', `${domCase.title}`)
        await eyes.checkWindow()
        let results = await eyes.close(false)
        await assertImage(results, {hasDom: true})
      })
    })
  })
})
