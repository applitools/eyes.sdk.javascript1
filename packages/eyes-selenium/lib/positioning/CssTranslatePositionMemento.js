'use strict';

const { PositionMemento } = require('@applitools/eyes-sdk-core');

/**
 * Encapsulates state for {@link CssTranslatePositionProvider} instances.
 *
 * @ignore
 */
class CssTranslatePositionMemento extends PositionMemento {
  /**
   * @param {String} transforms - The current transforms. The keys are the style keys from which each of the transforms
   *   were taken.
   * @param {Location} position
   */
  constructor(transforms, position) {
    super();

    this._transforms = transforms;
    this._position = position;
  }

  /**
   * @return {String} - The current transforms. The keys are the style keys from which each of the transforms
   *  were taken.
   */
  getTransform() {
    return this._transforms;
  }

  /**
   * @return {Location}
   */
  getPosition() {
    return this._position;
  }
}

exports.CssTranslatePositionMemento = CssTranslatePositionMemento;
