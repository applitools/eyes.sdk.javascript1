'use strict'
const UnscaledFixedCutProvider = require('./UnscaledFixedCutProvider')

class NullCutProvider extends UnscaledFixedCutProvider {
  constructor() {
    super(0, 0, 0, 0)
  }

  /**
   * @inheritDoc
   */
  scale(_scaleRatio) {
    // eslint-disable-line no-unused-vars
    return this
  }
}

module.exports = NullCutProvider
