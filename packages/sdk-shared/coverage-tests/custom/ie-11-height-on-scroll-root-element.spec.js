// re: https://trello.com/c/Y0Q6QAHK
const cwd = process.cwd()
const path = require('path')
const spec = require(path.resolve(cwd, 'src/spec-driver'))
const {getEyes} = require('../../src/test-setup')
const {Target} = require(cwd)

describe('calculating scrollRootElement offset errors on IE11', async () => {
  let eyes
  let browser

  before(async () => {
    browser = await spec.build({browser: 'ie-11', remote: 'sauce'})
    eyes = getEyes()
  })

  after(async () => {
    await eyes.abortIfNotClosed()
    await spec.cleanup(browser)
  })

  it('checkWindow.fully on IE11', async function() {
    await spec.visit(browser, 'https://www.asos.com/search/?q=jeans')
    await eyes.open(browser, this.test.parent.title, 'checkWindow.fully on IE11')
    await spec.waitUntilDisplayed(browser, '#chrome-app-container', 5000)

    await spec.click(browser, '#chrome-welcome-mat > div > div > button')

    await eyes.check(
      'Search landing page',
      Target.region('#chrome-app-container')
        .fully()
        .timeout(0),
    )
    await eyes.close(false)
  })
})
