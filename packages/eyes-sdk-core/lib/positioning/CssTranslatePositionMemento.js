'use strict'

const PositionMemento = require('./PositionMemento')

/**
 * Encapsulates state for {@link CssTranslatePositionProvider} instances.
 */
class CssTranslatePositionMemento extends PositionMemento {
  /**
   * @param {Object.<String, String>} transforms The current transforms. The keys are the style keys from which each of the transforms were taken.
   * @param {Location} position
   */
  constructor(transforms, position) {
    super()

    this._transforms = transforms
    this._position = position
  }

  /**
   * @return {Object.<String, String>} The current transforms. The keys are the style keys from which each of the transforms were taken.
   */
  get transform() {
    return this._transforms
  }

  /**
   * @return {Location}
   */
  get position() {
    return this._position
  }
}

module.exports = CssTranslatePositionMemento
