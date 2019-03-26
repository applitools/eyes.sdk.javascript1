'use strict';

const { Location } = require('@applitools/eyes-common');

const { RegionVisibilityStrategy } = require('./RegionVisibilityStrategy');

const VISIBILITY_OFFSET = 100; // Pixels

/**
 * @ignore
 */
class MoveToRegionVisibilityStrategy extends RegionVisibilityStrategy {
  /**
   * @param {Logger} logger
   */
  constructor(logger) {
    super();

    this._logger = logger;
    /** @type {PositionMemento} */
    this._originalPosition = undefined;
  }

  /**
   * @inheritDoc
   */
  async moveToRegion(positionProvider, location) {
    this._logger.verbose('Getting current position state...');

    this._originalPosition = await positionProvider.getState();
    this._logger.verbose('Done! Setting position...');

    // We set the location to "almost" the location we were asked. This is because sometimes, moving the browser
    // to the specific pixel where the element begins, causes the element to be slightly out of the viewport.
    let dstX = location.getX() - VISIBILITY_OFFSET;
    dstX = dstX < 0 ? 0 : dstX;
    let dstY = location.getY() - VISIBILITY_OFFSET;
    dstY = dstY < 0 ? 0 : dstY;

    await positionProvider.setPosition(new Location(dstX, dstY));
    this._logger.verbose('Done!');
  }

  /**
   * @inheritDoc
   */
  async returnToOriginalPosition(positionProvider) {
    this._logger.verbose('Returning to original position...');

    await positionProvider.restoreState(this._originalPosition);
    this._logger.verbose('Done!');
  }
}

exports.MoveToRegionVisibilityStrategy = MoveToRegionVisibilityStrategy;
