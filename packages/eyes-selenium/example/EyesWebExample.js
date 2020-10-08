'use strict'

const {Builder, By} = require('selenium-webdriver')
const {Eyes, Target, ConsoleLogHandler} = require('../index') // should be replaced to '@applitools/eyes-selenium'

;(async () => {
  // Open a Chrome browser.
  const driver = new Builder()
    .withCapabilities({
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: ['headless'],
      },
    })
    .build()

  // Initialize the eyes SDK and set your private API key.
  const eyes = new Eyes()
  eyes.setLogHandler(new ConsoleLogHandler(false))

  try {
    // Start the test and set the browser's viewport size to 800x600.
    await eyes.open(driver, 'Eyes Examples', 'My first Javascript test!', {
      width: 1200,
      height: 800,
    })

    // Navigate the browser to the "hello world!" web-site.
    await driver.get('https://applitools.github.io/demo/TestPages/FramesTestPage/index.html')

    // find frame for future check
    const frame1 = await driver.findElement(By.name('frame1'))

    // Visual checkpoints
    await eyes.check('Viewport', Target.window())
    await eyes.check('Full page', Target.window().fully())
    await eyes.check('element', Target.region('#overflowing-div'))
    await eyes.check('element fully', Target.region('#overflowing-div').fully())
    await eyes.check('frame', Target.frame(frame1))
    await driver.switchTo().defaultContent()
    await eyes.check('frame fully', Target.frame('frame1').fully())

    // End the test.
    await eyes.close()
  } catch (ex) {
    console.log('Error in example script', ex)
  } finally {
    // Close the browser.
    await driver.quit()

    // If the test was aborted before eyes.close was called ends the test as aborted.
    await eyes.abort()
  }
})()
