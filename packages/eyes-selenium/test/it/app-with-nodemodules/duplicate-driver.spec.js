'use strict'

const fs = require('fs')
const path = require('path')
const {expect} = require('chai')
const {Target} = require('../../..')
const {
  testSetup: {getEyes},
} = require('@applitools/sdk-shared')
const ncp = require('ncp')
const {promisify} = require('util')
const pncp = promisify(ncp)
const spec = require('../../../src/spec-driver')

describe('JS Coverage tests', () => {
  it('works in a project with duplicate protractor', async () => {
    // create node_modules folder inside this folder
    const otherNodeModules = path.resolve(__dirname, 'node_modules')
    fs.rmdirSync(otherNodeModules, {recursive: true})
    fs.mkdirSync(otherNodeModules)

    const targetSeleniumFolder = path.resolve(otherNodeModules, 'selenium-webdriver')

    // copy selenium-webdriver into the new node_modules
    await pncp(
      path.resolve(require.resolve('selenium-webdriver'), '..'), // eslint-disable-line node/no-extraneous-require
      targetSeleniumFolder,
    )

    // make Node take protractor from new node_modules location (I don't really know what I'm doing here, I found what to do through debugging)
    module.constructor._pathCache = {}

    // IMPORTANT: we can't use spec.build because the driver needs to be require'd from this module
    const driver = await buildDriver({
      capabilities: {browserName: 'chrome', 'goog:chromeOptions': {args: ['headless']}},
    })

    try {
      await driver.get('https://example.org')

      // verify that the specific API that this test was written to fix is working
      const {By: By2} = require(targetSeleniumFolder)
      const el = await driver.findElement(By2.css('html'))
      expect(spec.isElement(el)).to.be.true

      // verify that overall everything is working
      const eyes = getEyes()
      await eyes.open(driver, 'Coverage tests', 'duplicate driver', {width: 800, height: 600})
      await eyes.check('', Target.window())
      await eyes.close(false)
    } finally {
      await driver.quit()
      fs.rmdirSync(otherNodeModules, {recursive: true})
    }
  })
})

async function buildDriver({capabilities, url = process.env.CVG_TESTS_REMOTE}) {
  const {Builder} = require('selenium-webdriver')
  return new Builder()
    .withCapabilities(capabilities)
    .usingServer(url)
    .build()
}
