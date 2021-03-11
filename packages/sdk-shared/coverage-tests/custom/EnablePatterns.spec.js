// https://trello.com/c/QCK2xDlS
const {testSetup, getTestInfo} = require('../..')
const assert = require('assert')
const path = require('path')
const cwd = process.cwd()
const spec = require(path.resolve(cwd, 'src/spec-driver'))

describe('EnablePatterns', () => {
  let driver, destroyDriver, eyes
  before(async () => {
    ;[driver, destroyDriver] = await spec.build({browser: 'chrome'})
    eyes = testSetup.getEyes({vg: true})
  })
  after(async () => {
    await destroyDriver()
  })
  it('gets passed to Eyes', async () => {
    await spec.visit(driver, 'https://applitools.com/helloworld/')
    await eyes.open(driver, 'eyes-testcafe', 'enablePatterns')
    const config = eyes.getConfiguration()
    config.setEnablePatterns(true)
    eyes.setConfiguration(config)
    await eyes.checkWindow('asdf')
    const result = await eyes.close(false)
    const testInfo = await getTestInfo(result)
    console.log(testInfo['actualAppOutput']['0'])
    assert.ok(testInfo['actualAppOutput']['0']['imageMatchSettings']['enablePatterns'])
  })
})
