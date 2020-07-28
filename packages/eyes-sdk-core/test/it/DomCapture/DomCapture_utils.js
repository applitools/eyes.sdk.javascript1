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
    const actualDomJsonString = await DomCapture.getFullWindowDom(logger, {
      specs: {
        toSupportedSelector({type, selector}) {
          return By[type](selector)
        },
      },
      controller: {
        async getBrowserName() {
          const capabilities = await driver.getCapabilities()
          return capabilities.get('browserName')
        },
        async getBrowserVersion() {
          const capabilities = await driver.getCapabilities()
          return capabilities.get('browserVersion')
        },
        async getSource() {
          return driver.getCurrentUrl()
        },
      },
      executor: {
        executeScript: driver.executeScript.bind(driver),
      },
      finder: {
        findElement: driver.findElement.bind(driver),
      },
      context: {
        frame(reference) {
          return driver.switchTo().frame(reference)
        },
        frameParent() {
          return driver.switchTo().parentFrame()
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
