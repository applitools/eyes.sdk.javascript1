const assert = require('assert')
const {getContextInfo} = require('../dist/index')

describe('getContextInfo', () => {
  const url = 'https://applitools.github.io/demo/TestPages/SnippetsTestPage/'

  describe('chrome', () => {
    let page

    async function isEqualElements(frame, element1, element2) {
      return frame.evaluate(([element1, element2]) => element1 === element2, [element1, element2])
    }

    async function mapResult(result) {
      const properties = Array.from(await result.getProperties(), ([_, value]) =>
        value._objectType === 'node' ? value.asElement() : value.jsonValue(),
      )
      return Promise.all(properties)
    }

    before(async function() {
      page = await global.getDriver('chrome')
      if (!page) {
        this.skip()
      }
    })

    it('return context info', async () => {
      await page.goto(url)
      const frame = await page.frame('frame')
      const expectedDocumentElement = await frame.evaluateHandle('document.documentElement')
      const [documentElement, selector, isRoot, isCORS] = await frame
        .evaluateHandle(getContextInfo)
        .then(mapResult)
      assert.strictEqual(isRoot, false)
      assert.strictEqual(isCORS, false)
      assert.strictEqual(selector, '/HTML[1]/BODY[1]/DIV[1]/IFRAME[1]')
      assert.ok(await isEqualElements(page, documentElement, expectedDocumentElement))
    })

    it('return top context info', async () => {
      await page.goto(url)
      const expectedDocumentElement = await page.evaluateHandle('document.documentElement')
      const [documentElement, selector, isRoot, isCORS] = await page
        .evaluateHandle(getContextInfo)
        .then(mapResult)
      assert.strictEqual(isRoot, true)
      assert.strictEqual(isCORS, false)
      assert.strictEqual(selector, null)
      assert.ok(await isEqualElements(page, documentElement, expectedDocumentElement))
    })
  })

  for (const name of ['internet explorer', 'ios safari']) {
    describe(name, () => {
      let driver

      async function isEqualElements(element1, element2) {
        return driver.execute(
          function(element1, element2) {
            return element1 === element2
          },
          element1,
          element2,
        )
      }

      before(async function() {
        driver = await global.getDriver(name)
        if (!driver) {
          this.skip()
        }
      })

      it('return context info', async () => {
        await driver.url(url)
        await driver.switchToFrame(await driver.$('iframe[name="frame"]'))
        const expectedDocumentElement = await driver.execute('return document.documentElement')
        const [documentElement, selector, isRoot, isCORS] = await driver.execute(getContextInfo)
        assert.strictEqual(isRoot, false)
        assert.strictEqual(isCORS, false)
        assert.strictEqual(selector, '/HTML[1]/BODY[1]/DIV[1]/IFRAME[1]')
        assert.ok(await isEqualElements(documentElement, expectedDocumentElement))
      })

      it('return top context info', async () => {
        await driver.url(url)
        const expectedDocumentElement = await driver.execute('return document.documentElement')
        const [documentElement, selector, isRoot, isCORS] = await driver.execute(getContextInfo)
        assert.strictEqual(isRoot, true)
        assert.strictEqual(isCORS, false)
        assert.strictEqual(selector, null)
        assert.ok(await isEqualElements(documentElement, expectedDocumentElement))
      })
    })
  }
})
