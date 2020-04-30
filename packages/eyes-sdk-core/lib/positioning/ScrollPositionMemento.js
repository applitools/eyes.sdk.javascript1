'use strict'

const {Location} = require('@applitools/eyes-common')
const PositionMemento = require('./PositionMemento')

/**
 * Encapsulates state for {@link ScrollPositionProvider} instances.
 */
class ScrollPositionMemento extends PositionMemento {
  /**
   * @param {Location} location The current location to be saved.
   */
  constructor(location) {
    super()
    this._location = new Location(location)
  }

  /**
   * @return {int}
   */
  getX() {
    return this._location.getX()
  }

  /**
   * @return {int}
   */
  getY() {
    return this._location.getY()
  }
}

module.exports = ScrollPositionMemento
