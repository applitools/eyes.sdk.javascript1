'use strict'
const {By, until} = require('selenium-webdriver')
const {getDriver, getEyes, getBatch} = require('./util/TestSetup')
const {Target} = require('../../../index')
const appName = 'TestRendersMatch'
const batch = getBatch()
describe.skip(appName, async () => {
  let driver, eyes, runner
  beforeEach(async () => {
    driver = await getDriver('CHROME')
    ;({eyes, runner} = await getEyes('VG'))
    eyes.setBatch(batch)
  })

  afterEach(async () => {
    await driver.quit()
    await eyes.abortIfNotClosed()
  })

  it('Test_VG_RCA_Config', async () => {
    await driver.get('https://applitools.github.io/demo/TestPages/VisualGridTestPage')
    await eyes.open(driver, 'Test Visual Grid', 'Test RCA Config')
    eyes.sendDom = true
    await eyes.check('check', Target.window())
    await eyes.close()
    await runner.getAllTestResults()
  })

  it('Test_VG_RCA_Fluent', async () => {
    await driver.get('https://applitools.github.io/demo/TestPages/VisualGridTestPage')
    let frame = await driver.findElement(By.css('iframe'))
    await driver.switchTo().frame(frame)
    let element = await driver.findElement(By.css('#p2'))
    await driver.wait(until.elementIsVisible(element))
    await driver.switchTo().defaultContent()
    eyes.sendDom = false
    await eyes.open(driver, 'Test Visual Grid', 'Test RCA Config')
    await eyes.check('check', Target.window())
    await eyes.close()
    await runner.getAllTestResults()
  })
})
