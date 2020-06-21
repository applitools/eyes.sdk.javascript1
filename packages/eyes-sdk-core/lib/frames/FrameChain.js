'use strict'

const {ArgumentGuard} = require('../utils/ArgumentGuard')
const {Region} = require('../geometry/Region')
const {Location} = require('../geometry/Location')
const {RectangleSize} = require('../geometry/RectangleSize')

/**
 * @typedef {import('../..').Logger} Logger
 * @typedef {import('../..').Location} Location
 * @typedef {import('../..').RectangleSize} RectangleSize
 */

class FrameChain {
  /**
   * @param {Logger} logger - logger instance
   * @param {FrameChain} other - frame chain from which the current frame chain will be created
   */
  constructor(logger, other) {
    ArgumentGuard.notNull(logger, 'logger')

    this._logger = logger
    this._frames = []

    if (other) {
      this._frames = Array.from(other)
    }
  }

  /**
   * Equality check for two frame chains
   * @param {FrameChain} leftFrameChain - frame chain to be compared
   * @param {FrameChain} rightFrameChain - frame chain to be compared
   * @return {Promise<boolean>} true if both objects represent the same frame chain, false otherwise
   */
  static async equals(leftFrameChain, rightFrameChain) {
    if (leftFrameChain.size !== rightFrameChain.size) return false
    for (let index = 0; index < leftFrameChain.size; ++index) {
      const leftFrame = leftFrameChain.frameAt(index)
      const rightFrame = rightFrameChain.frameAt(index)
      if (!(await leftFrame.equals(rightFrame))) return false
    }
    return true
  }

  /**
   * @return {number} number of frames in the chain
   */
  get size() {
    return this._frames.length
  }

  /**
   * @return {boolean} true if frame chain is empty, false otherwise
   */
  get isEmpty() {
    return this._frames.length === 0
  }

  /**
   * @return {Frame} first frame context (the first frame in the chain)
   */
  get first() {
    return this._frames[0]
  }

  /**
   * @return {Frame} current frame context (the last frame in the chain)
   */
  get current() {
    return this._frames[this._frames.length - 1]
  }

  /**
   * @param {number} index - index of needed frame
   * @return {Frame} frame by index in array
   */
  frameAt(index) {
    return this._frames[index]
  }

  /**
   * Removes all frames in the frame chain
   */
  clear() {
    this._frames = []
  }

  /**
   * @return {FrameChain} cloned frame chain
   */
  clone() {
    return new FrameChain(this._logger, this)
  }

  /**
   * Removes the last inserted frame element. Practically means we switched
   * back to the parent of the current frame
   * @return {?Frame} removed frame
   */
  pop() {
    return this._frames.pop()
  }

  /**
   * Appends a frame to the frame chain
   * @param {Frame} frame - frame to be added
   */
  push(frame) {
    return this._frames.push(frame)
  }

  /**
   * @return {Location} location of the current frame in the page
   */
  getCurrentFrameOffset() {
    return this._frames.reduce((location, frame) => {
      return location.offsetByLocation(frame.location)
    }, Location.ZERO)
  }

  /**
   * @return {Location} location of the current frame related to the viewport
   */
  getCurrentFrameLocationInViewport() {
    return this._frames.reduce((location, frame) => {
      return location.offset(
        frame.location.getX() - frame.parentScrollLocation.getX(),
        frame.location.getY() - frame.parentScrollLocation.getY(),
      )
    }, Location.ZERO)
  }

  /**
   * @return {RectangleSize} effective size of current frame
   */
  getCurrentFrameEffectiveSize() {
    if (!this.isEmpty) {
      const effectiveRect = new Region(Location.ZERO, this.first.innerSize)
      this._frames.forEach(frame => {
        effectiveRect.intersect(new Region(Location.ZERO, frame.innerSize))
      })
      return effectiveRect.getSize()
    } else {
      return RectangleSize.EMPTY
    }
  }

  getCurrentFrameEffectiveRect() {
    if (!this.isEmpty) {
      const effectiveRect = new Region(this.first.location, this.first.innerSize)
      this._frames.forEach(frame => {
        effectiveRect.intersect(new Region(frame.location, frame.innerSize))
      })
      return effectiveRect
    } else {
      return Region.EMPTY
    }
  }

  [Symbol.iterator]() {
    return this._frames[Symbol.iterator]()
  }
}

module.exports = FrameChain
