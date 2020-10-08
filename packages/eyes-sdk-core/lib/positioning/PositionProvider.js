'use strict'

/* eslint-disable no-unused-vars */

/**
 * Encapsulates page/element positioning.
 *
 * @abstract
 */
class PositionProvider {
  /**
   * @return {Promise<Location>} - The current position, or {@code null} if position is not available.
   */
  async getCurrentPosition() {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Go to the specified location.
   *
   * @param {Location} location - The position to set.
   * @return {Promise<Location>}
   */
  async setPosition(location) {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * @return {Promise<RectangleSize>} - The entire size of the container which the position is relative to.
   */
  async getEntireSize() {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Get the current state of the position provider. This is different from {@link #getCurrentPosition()} in
   * that the state of the position provider might include other model than just the coordinates.
   * For example a CSS translation based position provider (in WebDriver based SDKs), might save the
   * entire "transform" style value as its state.
   *
   * @return {Promise<PositionMemento>} The current state of the position provider, which can later be restored by
   *   passing it as a parameter to {@link #restoreState}.
   */
  async getState() {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Restores the state of the position provider to the state provided as a parameter.
   *
   * @param {PositionMemento} state - The state to restore to.
   * @return {Promise}
   */
  async restoreState(state) {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * @return {*}
   */
  async getScrolledElement() {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * @override
   */
  toString() {
    return this.constructor.name
  }
}

module.exports = PositionProvider
