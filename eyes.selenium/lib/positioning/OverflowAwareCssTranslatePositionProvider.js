'use strict';

const { CssTranslatePositionProvider } = require('./CssTranslatePositionProvider');
const { EyesSeleniumUtils } = require('../EyesSeleniumUtils');

class OverflowAwareCssTranslatePositionProvider extends CssTranslatePositionProvider {
  /** @inheritDoc */
  async getEntireSize() {
    const result = await EyesSeleniumUtils.getOverflowAwareContentEntireSize(this._executor);
    this._logger.verbose(`OverflowAwareCssTranslatePositionProvider - Entire size: ${result}`);
    return result;
  }
}

exports.OverflowAwareCssTranslatePositionProvider = OverflowAwareCssTranslatePositionProvider;
