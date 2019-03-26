'use strict';

const { ArgumentGuard } = require('@applitools/eyes-common');

const { ScaleProvider } = require('./ScaleProvider');

class FixedScaleProvider extends ScaleProvider {
  /**
   * @param {number} scaleRatio - The scale ratio to use.
   */
  constructor(scaleRatio) {
    super();

    ArgumentGuard.greaterThanZero(scaleRatio, 'scaleRatio');
    this._scaleRatio = scaleRatio;
  }

  /**
   * @return {number} - The ratio by which an image will be scaled.
   */
  getScaleRatio() {
    return this._scaleRatio;
  }
}

exports.FixedScaleProvider = FixedScaleProvider;
