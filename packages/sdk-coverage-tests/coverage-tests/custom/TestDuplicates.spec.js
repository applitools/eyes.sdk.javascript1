'use strict'
const cwd = process.cwd()
const path = require('path')
const spec = require(path.resolve(cwd, 'src/SpecWrappedDriver'))
const {getEyes, Browsers} = require('../util/TestSetup')
const appName = 'Eyes Selenium SDK - Duplicates'

describe(appName, async () => {
  let driver, eyes
  afterEach(async () => {
    await spec.cleanup(driver)
    await eyes.abortIfNotClosed()
  })
  describe('CSS', async () => {
    beforeEach(async () => {
      driver = await spec.build({capabilities: Browsers.chrome()})
      eyes = await getEyes({isCssStitching: true})
    })
    it('TestDuplicatedIFrames', TestDuplicatedIFrames('TestDuplicatedIFrames'))
  })

  describe('SCROLL', async () => {
    beforeEach(async () => {
      driver = await spec.build({capabilities: Browsers.chrome()})
      eyes = await getEyes()
    })
    it('TestDuplicatedIFrames', TestDuplicatedIFrames('TestDuplicatedIFrames_Scroll'))
  })

  describe.skip('VG', async () => {
    beforeEach(async () => {
      driver = await spec.build({capabilities: Browsers.chrome()})
      eyes = await getEyes({isVisualGrid: true})
    })
    it('TestDuplicatedIFrames', TestDuplicatedIFrames('TestDuplicatedIFrames_VG'))
  })

  function TestDuplicatedIFrames(testName) {
    return async function() {
      await eyes.open(driver, appName, testName, {width: 700, height: 460})
      await spec.visit(
        driver,
        'https://applitools.github.io/demo/TestPages/VisualGridTestPage/duplicates.html',
      )
      await spec.switchToFrame(driver, 2)
      await spec.waitUntilDisplayed(driver, '#p2', 20000)
      await spec.switchToFrame(driver, null)
      await eyes.checkWindow('Duplicated Iframes')
      await eyes.close()
    }
  }
})
