'use strict';

const { RegionVisibilityStrategy } = require('./RegionVisibilityStrategy');

class NopRegionVisibilityStrategy extends RegionVisibilityStrategy {
  /**
   * @param {Logger} logger
   */
  constructor(logger) {
    super();

    this._logger = logger;
  }

  /** @inheritDoc */
  async moveToRegion(positionProvider, location) {
    this._logger.verbose('Ignored (no op).');
  }

  /** @inheritDoc */
  async returnToOriginalPosition(positionProvider) {
    this._logger.verbose('Ignored (no op).');
  }
}

exports.NopRegionVisibilityStrategy = NopRegionVisibilityStrategy;
