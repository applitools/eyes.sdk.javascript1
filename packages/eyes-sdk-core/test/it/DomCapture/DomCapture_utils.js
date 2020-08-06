'use strict'

const fs = require('fs')
const path = require('path')
const {By} = require('selenium-webdriver')
const {DomCapture, PerformanceUtils} = require('../../..')

/**
 * @param {Logger} logger
 * @param {WebDriver} driver
 * @param {string} url
 * @param {string} testName
 * @return {Promise<string>}
 */
async function captureDom(logger, driver, url, testName) {
  try {
    await driver.get(url)

    const timeStart = PerformanceUtils.start()
    const capabilities = await driver.getCapabilities()
    const actualDomJsonString = await DomCapture.getFullWindowDom(logger, {
      browserName: capabilities.get('browserName'),
      browserVersion: capabilities.get('browserVersion'),
      execute: driver.executeScript.bind(driver),
      element: driver.findElement.bind(driver),
      getUrl: driver.getCurrentUrl.bind(driver),
      switchToChildContext: driver.switchTo().frame.bind(driver.switchTo()),
      switchTopParentContext: driver.switchTo().parentFrame.bind(driver.switchTo()),
      specs: {
        toSupportedSelector({type, selector}) {
          return By[type](selector)
        },
      },
    })
    logger.log(`Capturing actual dom took ${timeStart.end().summary}`)

    if (process.env.APPLITOOLS_UPDATE_FIXTURES) {
      fs.writeFileSync(
        path.resolve(__dirname, '../../fixtures', `${testName}.json`),
        JSON.stringify(JSON.parse(actualDomJsonString), null, 2),
      )
    }

    return actualDomJsonString
  } catch (err) {
    logger.log(`Error: ${err}`)
    throw err
  }
}

/**
 * @param {string} testName
 * @return {Promise<object>}
 */
async function getExpectedDom(testName) {
  const expectedDomBuffer = await fs.readFileSync(
    path.join(__dirname, `../../fixtures/${testName}.json`),
  )
  return JSON.parse(expectedDomBuffer)
}

module.exports = {
  captureDom,
  getExpectedDom,
}
