const Location = require('../geometry/Location')

/**
 * Encapsulates state for {@link PositionProvider} instances
 */
class PositionMemento {
  /**
   * @param {Object} state
   * @param {Object} state.transforms - current transforms to be saved.
   *  The keys are the style keys from which each of the transforms were taken
   * @param {Location} state.position - current location to be saved
   */
  constructor({transforms, position} = {}) {
    if (transforms) this._transforms = transforms
    if (position) this._position = new Location(position)
  }

  /**
   * @return {Object} saved transforms.
   *  The keys are the style keys from which each of the transforms were taken
   */
  get transforms() {
    return this._transforms
  }

  /**
   * @return {Location} saved position
   */
  get position() {
    return this._position
  }
}

module.exports = PositionMemento
