/* global browser */
'use strict'

const {Eyes, Target} = require('@applitools/eyes.webdriverio')
const VERSION = require('../package.json').version

const DEFAULT_VIEWPORT = {
  width: 800,
  height: 600,
}

class EyesService {
  /**
   *
   * @param {Configuration} [config]
   */
  constructor(_config) {
    this._eyes = new Eyes()
    this._eyes.getBaseAgentId = () => `eyes.webdriverio-service/${VERSION}`

    this._appName = null
  }

  beforeSession(config, _caps) {
    const eyesConfig = config.eyes
    if (eyesConfig) {
      this._eyes.setConfiguration(eyesConfig)
      this._appName = this._eyes.getConfiguration().getAppName()

      if (!process.env.APPLITOOLS_API_KEY) {
        process.env.APPLITOOLS_API_KEY = eyesConfig.apiKey
      }
    }
    this._eyes.setHideScrollbars(true)
  }

  before(_caps) {
    browser.addCommand('eyesCheck', (title, checkSettings = Target.window().fully()) => {
      return this._eyes.check(title, checkSettings)
    })

    browser.addCommand('eyesCheckWindow', (title, checkSettings) => {
      return this._eyes.check(title, checkSettings)
    })

    browser.addCommand('eyesGetConfiguration', () => {
      return this._eyes.getConfiguration()
    })

    browser.addCommand('eyesSetConfiguration', configuration => {
      return this._eyes.setConfiguration(configuration)
    })
  }

  async beforeTest(test) {
    const configuration = this._eyes.getConfiguration()
    if (!this._appName) {
      configuration.setAppName(test.parent)
    }

    configuration.setTestName(test.title)

    if (!configuration.getViewportSize()) {
      configuration.setViewportSize(DEFAULT_VIEWPORT)
    }

    this._eyes.setConfiguration(configuration)

    await global.browser.call(() => this._eyes.open(global.browser))
  }

  // -disable-next-line
  async afterTest(_exitCode, _config, _capabilities) {
    try {
      await browser.call(() => this._eyes.close(false))
    } catch (e) {
      await browser.call(() => this._eyes.abortIfNotClosed())
    }
  }

  after() {
    // browser.call(() => this.eyes.abortIfNotClosed());
  }

  toJSON() {
    return {}
  }
}

module.exports = EyesService
