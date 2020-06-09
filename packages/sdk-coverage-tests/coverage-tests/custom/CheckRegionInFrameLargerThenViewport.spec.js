'use strict'

const cwd = process.cwd()
const path = require('path')
const spec = require(path.resolve(cwd, 'src/SpecWrappedDriver'))
const {Target} = require(cwd)
const {getEyes, Browsers} = require('../util/TestSetup')

describe('CheckRegionInFrameLargerThenViewport', () => {
  let driver, eyes

  before(async () => {
    driver = await spec.build({capabilities: Browsers.chrome()})
  })

  beforeEach(async () => {
    await spec.switchToFrame(driver, null)
  })

  afterEach(async () => {
    await eyes.abort()
  })

  after(async () => {
    await spec.cleanup(driver)
  })

  it('CheckRegionInFrameLargerThenViewport', async function() {
    eyes = new getEyes({isCssStitching: true})
    await spec.visit(driver, 'https://applitools.github.io/demo/TestPages/OutOfViewport/')
    await eyes.open(driver, this.test.parent.title, this.test.title, {width: 800, height: 600})
    await eyes.check(
      'region in frame fully',
      Target.frame('frame-list')
        .region('#list')
        .fully(),
    )
    return eyes.close()
  })

  it('CheckRegionInFrameLargerThenViewport_Scroll', async function() {
    eyes = new getEyes()
    await spec.visit(driver, 'https://applitools.github.io/demo/TestPages/OutOfViewport/')
    await eyes.open(driver, this.test.parent.title, this.test.title, {width: 800, height: 600})
    eyes.setScrollRootElement('body')
    await eyes.check(
      'region in frame fully',
      Target.frame('frame-list')
        .region('#list')
        .fully(),
    )
    return eyes.close()
  })
})
