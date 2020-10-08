'use strict'

const FixedScaleProvider = require('./FixedScaleProvider')

/**
 * A scale provider which does nothing.
 */
class NullScaleProvider extends FixedScaleProvider {
  constructor() {
    super(1)
  }
}

module.exports = NullScaleProvider
