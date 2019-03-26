'use strict';

const { Location } = require('@applitools/eyes-common');
const { PositionMemento } = require('@applitools/eyes-sdk-core');

/**
 * Encapsulates state for {@link ElementPositionProvider} instances.
 *
 * @ignore
 */
class ElementPositionMemento extends PositionMemento {
  /**
   * @param {Location} position - The current location to be saved.
   */
  constructor(position) {
    super();

    this._position = new Location(position);
  }

  /**
   * @return {number}
   */
  getX() {
    return this._position.getX();
  }

  /**
   * @return {number}
   */
  getY() {
    return this._position.getY();
  }
}

exports.ElementPositionMemento = ElementPositionMemento;
