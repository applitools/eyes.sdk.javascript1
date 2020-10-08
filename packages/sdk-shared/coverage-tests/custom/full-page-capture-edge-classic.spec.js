// re: https://trello.com/c/IRsmmbK5
const cwd = process.cwd()
const path = require('path')
const {getEyes} = require('../../src/test-setup')
const spec = require(path.resolve(cwd, 'src/spec-driver'))
const {By, Target} = require(cwd)

// unable to get Edge Classic from Sauce, skipping until resolved
describe.skip('Coverage Tests', async () => {
  describe('full page capture edge classic (@edge)', () => {
    let eyes
    let driver, destroyDriver

    before(async () => {
      ;[driver, destroyDriver] = await spec.build({browser: 'edge-18', remote: 'sauce'})
      eyes = getEyes({isCssStitching: true})
      eyes.setMatchTimeout(0)
    })

    after(async () => {
      await destroyDriver()
      await eyes.abortIfNotClosed()
    })

    it('works', async function() {
      eyes.setMatchTimeout(0)
      await spec.visit(driver, 'https://www.softwareadvice.com/medical/?automated=true')
      await eyes.open(driver, this.test.parent.title, 'full-page-capture-edge-classic')
      await eyes.check(
        undefined,
        Target.window()
          .fully()
          .scrollRootElement(By.css('body')),
      )
      await eyes.close(true)
    })
  })
})
