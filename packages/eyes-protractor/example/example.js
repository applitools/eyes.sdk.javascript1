/* global browser, beforeAll, element, by */
'use strict'

const {Target, ConsoleLogHandler, Eyes, VisualGridRunner} = require('..')

let eyes = null
describe('Eyes.Protractor.JavaScript - check region', function() {
  beforeAll(function() {
    eyes = new Eyes(new VisualGridRunner())
    // eyes = new Eyes()
    if (process.env.APPLITOOLS_SHOW_LOGS) {
      eyes.setLogHandler(new ConsoleLogHandler(true))
    }
  })

  it('test check region methods', async function() {
    await browser.get('https://applitools.github.io/demo/TestPages/FramesTestPage/')
    await eyes.open(browser, 'protractor-testkit', 'test check region methods')
    await eyes.check('Region by rect', Target.region(element(by.css('#overflowing-div'))))
    const results = await eyes.close()
    console.log(results.toString())
  })

  afterEach(async function() {
    await eyes.abort()
  })
})
