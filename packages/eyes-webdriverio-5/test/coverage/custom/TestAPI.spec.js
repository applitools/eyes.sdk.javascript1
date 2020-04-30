'use strict'
const {getDriver, getEyes} = require('./util/TestSetup')
const {Target, By} = require('../../../index')
describe('TestAPI', () => {
  let browser, eyes
  beforeEach(async () => {
    browser = await getDriver('CHROME')
    ;({eyes} = await getEyes('classic', 'CSS'))
  })
  afterEach(async () => {
    await eyes.abortIfNotClosed()
    await browser.deleteSession()
  })

  it('TestIsDisabled', async () => {
    eyes.setIsDisabled(true)
    await eyes.open(browser, 'Demo C# app', 'hello world', {width: 800, height: 600})
    await browser.url('https://applitools.com/helloworld?diff1')
    await eyes.check('', Target.window().fully())
    await eyes.check('Number test', Target.region(By.className('random-number')))
    await eyes.check('', Target.window().withName('1'))
    await eyes.check('', Target.region(By.id('someId')).withName('2'))
    await eyes.checkFrame('ab', 'ab')
    await eyes.close()
  })
})
