'use strict';

const { ScrollPositionProvider } = require('./ScrollPositionProvider');
const { EyesSeleniumUtils } = require('../EyesSeleniumUtils');

class OverflowAwareScrollPositionProvider extends ScrollPositionProvider {
  /** @inheritDoc */
  async getEntireSize() {
    const result = await EyesSeleniumUtils.getOverflowAwareContentEntireSize(this._executor);
    this._logger.verbose(`OverflowAwareScrollPositionProvider - Entire size: ${result}`);
    return result;
  }
}

exports.OverflowAwareScrollPositionProvider = OverflowAwareScrollPositionProvider;
