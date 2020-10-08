const assert = require('assert')
const {getElementStyleProperties} = require('../dist/index')

describe('getElementStyleProperties', () => {
  const url = 'https://applitools.github.io/demo/TestPages/SnippetsTestPage/'

  describe('chrome', () => {
    let page

    before(async function() {
      page = await global.getDriver('chrome')
      if (!page) {
        this.skip()
      }
    })

    it('return element style properties', async () => {
      await page.goto(url)
      const element = await page.$('#static')
      await page.evaluate(element => (element.style.backgroundColor = 'red'), element)
      const styles = await page.evaluate(getElementStyleProperties, [element, ['background-color']])
      assert.deepStrictEqual(styles['background-color'], {value: 'red', important: false})
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

      it('return element style properties', async () => {
        await driver.url(url)
        const element = await driver.$('#static')
        await driver.execute(function(element) {
          element.style.backgroundColor = 'red'
        }, element)
        const styles = await driver.execute(getElementStyleProperties, [
          element,
          ['background-color'],
        ])
        assert.deepStrictEqual(styles['background-color'], {value: 'red', important: false})
      })
    })
  }
})
