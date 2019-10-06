'use strict';

const { DebugScreenshotsProvider } = require('./DebugScreenshotsProvider');

/**
 * TODO: rename to NullDebugScreenshotsProvider, should be renamed in other SDKs as well (come from Java)
 * A mock debug screenshot provider.
 */
class NullDebugScreenshotProvider extends DebugScreenshotsProvider {
  // noinspection JSMethodCanBeStatic
  /**
   * @inheritDoc
   */
  async save(image, suffix) { // eslint-disable-line no-unused-vars
    // Do nothing.
  }
}

exports.NullDebugScreenshotProvider = NullDebugScreenshotProvider;
