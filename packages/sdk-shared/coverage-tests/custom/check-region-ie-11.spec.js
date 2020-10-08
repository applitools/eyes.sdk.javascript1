// Trello 211
// https://trello.com/c/jRumCWJp/211-wdio4-the-checkregion-for-ie11-is-not-captured-correctly

const cwd = process.cwd()
const path = require('path')
const spec = require(path.resolve(cwd, 'src/spec-driver'))
const {Target} = require(cwd)
const {getEyes} = require('../../src/test-setup')

describe('Check Region IE11 (@ie)', () => {
  let eyes
  let driver, destroyDriver

  beforeEach(async () => {
    ;[driver, destroyDriver] = await spec.build({browser: 'ie-11', remote: 'sauce'})
    eyes = getEyes()
  })

  afterEach(async () => {
    await destroyDriver()
    await eyes.abortIfNotClosed()
  })

  it('captures an image of the element', async function() {
    await spec.visit(driver, 'https://applitools.com/helloworld')
    await eyes.open(driver, this.test.parent.title, this.test.title)
    await eyes.check(undefined, Target.region('.section:nth-of-type(2)'))
    await eyes.close()
  })
})
