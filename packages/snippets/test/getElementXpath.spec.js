const assert = require('assert')
const {getElementXpath} = require('../dist/index')

describe('getElementXpath', () => {
  const url = 'https://applitools.github.io/demo/TestPages/SnippetsTestPage/'

  describe('chrome', () => {
    let page

    before(async function() {
      page = await global.getDriver('chrome')
      if (!page) {
        this.skip()
      }
    })

    it('return element xpath', async () => {
      await page.goto(url)
      const frame = await page.frame('frame')
      const element = await frame.$('.b4')
      const xpath = await frame.evaluate(getElementXpath, [element])
      assert.deepStrictEqual(xpath, '/HTML[1]/BODY[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]')
    })
  })

  for (const name of ['internet explorer', 'ios safari']) {
    describe(name, () => {
      let driver

      before(async function() {
        driver = await global.getDriver(name)
        if (!driver) {
          this.skip()
        }
      })

      it('return element xpath', async () => {
        await driver.url(url)
        await driver.switchToFrame(await driver.$('iframe[name="frame"]'))
        const element = await driver.$('.b4')
        const xpath = await driver.execute(getElementXpath, [element])
        assert.deepStrictEqual(xpath, '/HTML[1]/BODY[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]')
      })
    })
  }
})
