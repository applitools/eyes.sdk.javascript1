'use strict'
/* eslint-disable no-unused-vars */

/**
 * @typedef {import('../frames/FrameChain').FrameChain} FrameChain
 * @typedef {import('../frames/Frame').Frame} Frame
 * @typedef {import('./EyesWrappedElement').EyesWrappedElement} EyesWrappedElement
 * @typedef {import('./EyesWrappedElement').UnwrappedElement} UnwrappedElement
 */
/**
 * Reference to the frame, index of the frame in the current context, name or id of the element,
 * framework element object, {@link EyesWrappedElement} implementation object or a {@link Frame} object
 * @typedef {number|string|UnwrappedElement|EyesWrappedElement|Frame} FrameReference
 */

/**
 * An interface for browsing context
 * @ignore
 * @interface
 */
class EyesBrowsingContext {
  /**
   * Returns current frame chain
   * @return {FrameChain} copy of the current frame chain
   */
  get frameChain() {
    throw new TypeError('The method is not implemented!')
  }
  /**
   * Clear current frame chain
   */
  reset() {
    throw new TypeError('The method is not implemented!')
  }
  /**
   * Switch to the child (frame) context by reference
   * @param {FrameReference} arg reference to the frame
   * @return {Promise<*>}
   */
  async frame(arg) {
    throw new TypeError('The method is not implemented!')
  }
  /**
   * Switch to the top level context
   * @return {Promise<*>}
   */
  async frameDefault() {
    throw new TypeError('The method is not implemented!')
  }
  /**
   * Switch to the parent context
   * @return {Promise<*>}
   */
  async frameParent() {
    throw new TypeError('The method is not implemented!')
  }
  /**
   * Switch to the specified frame path from the top level
   * @param {Iterable<FrameReference>} path
   * @return {Promise<*>}
   */
  async frames(path) {
    throw new TypeError('The method is not implemented!')
  }
  /**
   * Refresh frame chain from the real driver target context
   * @return {Promise<*>}
   */
  async framesRefresh() {
    throw new TypeError('The method is not implemented!')
  }
}

exports.EyesBrowsingContext = EyesBrowsingContext
