'use strict'
const {getDriver, getEyes} = require('./util/TestSetup')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const expect = chai.expect
const {Target, StitchMode} = require('../../../index')
const appName = 'Test abort'
const testedUrl = 'https://applitools.com/docs/topics/overview.html'
const testName = `test URL : ${testedUrl}`

describe(appName, () => {
  let webDriver, eyes

  async function afterEach() {
    if (eyes.getIsOpen()) {
      await eyes.close(false)
    } else {
      await eyes.abort()
    }
    await webDriver.quit()
  }
  describe(`TestAbort`, () => {
    async function beforeEach() {
      eyes = await getEyes(StitchMode.CSS)
      webDriver = await getDriver('CHROME')
    }

    it(`Test_GetAllResults`, async () => {
      await beforeEach()
      expect(Test_ThrowBeforeOpen).to.throw('Before Open')
      await afterEach()
      await beforeEach()
      await expect(Test_ThrowAfterOpen()).to.be.rejectedWith(Error, 'After Open')
      await afterEach()
      await beforeEach()
      await expect(Test_ThrowDuringCheck()).to.be.rejectedWith(Error)
      await afterEach()
      await beforeEach()
      await expect(Test_ThrowAfterCheck()).to.be.rejectedWith(Error, 'After Check')
      await afterEach()
    })
  })

  function Test_ThrowBeforeOpen() {
    throw new Error('Before Open')
  }
  async function Test_ThrowAfterOpen() {
    await eyes.open(webDriver, appName, testName)
    throw new Error('After Open')
  }
  async function Test_ThrowDuringCheck() {
    let driver = await eyes.open(webDriver, appName, testName)
    await driver.get(testedUrl)
    await eyes.check(`Step 1 Content - ${testedUrl}`, Target.frame('non-existing frame'))
  }
  async function Test_ThrowAfterCheck() {
    let driver = await eyes.open(webDriver, appName, testName)
    await driver.get(testedUrl)
    await eyes.check(`Step 1 Content - ${testedUrl}`, Target.window())
    throw new Error('After Check')
  }
})
