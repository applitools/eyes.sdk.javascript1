'use strict'

const DebugScreenshotsProvider = require('./DebugScreenshotsProvider')

/**
 * TODO: rename to NullDebugScreenshotsProvider, should be renamed in other SDKs as well (come from Java)
 * A mock debug screenshot provider.
 */
class NullDebugScreenshotProvider extends DebugScreenshotsProvider {
  /**
   * @inheritDoc
   */
  async save(_image, _suffix) {
    // eslint-disable-line no-unused-vars
    // Do nothing.
  }
}

module.exports = NullDebugScreenshotProvider
