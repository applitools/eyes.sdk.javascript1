// https://trello.com/c/QCK2xDlS
const {testSetup, getTestInfo} = require('../..')
const assert = require('assert')
const path = require('path')
const cwd = process.cwd()
const spec = require(path.resolve(cwd, 'src/spec-driver'))

describe('EnablePatterns', () => {
  let driver, destroyDriver
  before(async () => {
    ;[driver, destroyDriver] = await spec.build({browser: 'chrome'})
  })
  after(async () => {
    await destroyDriver()
  })
  it('in config', async () => {
    await spec.visit(driver, 'https://applitools.com/helloworld/')
    const eyes = testSetup.getEyes({vg: true})
    const config = eyes.getConfiguration()
    config.setEnablePatterns(true)
    eyes.setConfiguration(config)
    await eyes.open(driver, 'eyes-testcafe', 'enablePatterns')
    await eyes.checkWindow('asdf')
    const result = await eyes.close(false)
    const testInfo = await getTestInfo(result)
    assert.ok(testInfo['actualAppOutput']['0']['imageMatchSettings']['enablePatterns'])
  })
  it('in check settings', async () => {
    await spec.visit(driver, 'https://applitools.com/helloworld/')
    const eyes = testSetup.getEyes({vg: true})
    await eyes.open(driver, 'eyes-testcafe', 'enablePatterns')
    await eyes.check({enablePatterns: true})
    const result = await eyes.close(false)
    const testInfo = await getTestInfo(result)
    console.log(testInfo['actualAppOutput']['0'])
    assert.ok(testInfo['actualAppOutput']['0']['imageMatchSettings']['enablePatterns'])
  })
})
