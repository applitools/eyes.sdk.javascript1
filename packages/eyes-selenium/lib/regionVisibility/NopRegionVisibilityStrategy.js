'use strict';

const { RegionVisibilityStrategy } = require('./RegionVisibilityStrategy');

/**
 * @ignore
 */
class NopRegionVisibilityStrategy extends RegionVisibilityStrategy {
  /**
   * @param {Logger} logger
   */
  constructor(logger) {
    super();

    this._logger = logger;
  }

  /**
   * @inheritDoc
   */
  async moveToRegion(positionProvider, location) { // eslint-disable-line no-unused-vars
    this._logger.verbose('Ignored (no op).');
  }

  /**
   * @inheritDoc
   */
  async returnToOriginalPosition(positionProvider) { // eslint-disable-line no-unused-vars
    this._logger.verbose('Ignored (no op).');
  }
}

exports.NopRegionVisibilityStrategy = NopRegionVisibilityStrategy;
