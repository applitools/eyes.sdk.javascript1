'use strict'

const {ArgumentGuard, Location} = require('@applitools/eyes-common')
const {Frame} = require('./Frame')
const {NoFramesError} = require('../errors/NoFramesError')
/**
 * @typedef {import('@applitools/eyes-common').Logger} Logger
 * @typedef {import('@applitools/eyes-common').Location} Location
 * @typedef {import('@applitools/eyes-common').RectangleSize} RectangleSize
 */

class FrameChain {
  /**
   * Creates a new frame chain.
   * @param {Logger} logger A Logger instance.
   * @param {FrameChain} other A frame chain from which the current frame chain will be created.
   */
  constructor(logger, other) {
    ArgumentGuard.notNull(logger, 'logger')

    this._logger = logger
    this._frames = []

    if (other) {
      this._logger.verbose(`FrameChain copy constructor (size ${other.size})`)
      this._frames = Array.from(other, frame => new Frame(this._logger, frame))
    }
  }
  /**
   * Compares two frame chains.
   * @param {FrameChain} c1 Frame chain to be compared against c2.
   * @param {FrameChain} c2 Frame chain to be compared against c1.
   * @return {boolean} True if both frame chains represent the same frame, false otherwise.
   */
  static equals(c1, c2) {
    if (c1.size !== c2.size) {
      return false
    }
    for (let index = 0; index < c1.size; ++index) {
      if (c1.frameAt(index).element !== c2.frameAt(index).element) {
        return false
      }
    }
    return true
  }
  /**
   * @return {Frame[]} frames stored in chain
   */
  toArray() {
    return Array.from(this._frames)
  }
  /**
   * @param {number} index Index of needed frame
   * @return {Frame} frame by index in array
   */
  frameAt(index) {
    if (this._frames.length > index) {
      return this._frames[index]
    }
    throw new Error('No frames for given index')
  }
  /**
   * @return {number} the number of frames in the chain.
   */
  get size() {
    return this._frames.length
  }
  /**
   * @return {Frame} get current frame context (the last frame in the chain)
   */
  get current() {
    return this._frames[this._frames.length - 1]
  }
  /**
   * Removes all current frames in the frame chain.
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
   */
  pop() {
    return this._frames.pop()
  }
  /**
   * Appends a frame to the frame chain.
   * @param {Frame} frame The frame to be added.
   */
  push(frame) {
    return this._frames.push(frame)
  }
  /**
   * @return {Location} The location of the current frame in the page.
   */
  getCurrentFrameOffset() {
    return this._frames.reduce((location, frame) => {
      return location.offsetByLocation(frame.location)
    }, Location.ZERO)
  }

  getCurrentFrameLocationInViewport() {
    return this._frames.reduce((location, frame) => {
      return location.offset(
        frame.location.getX() - frame.originalLocation.getX(),
        frame.location.getY() - frame.originalLocation.getY(),
      )
    }, Location.ZERO)
  }
  /**
   * @return {Location} The outermost frame's location, or NoFramesException.
   */
  getTopFrameScrollLocation() {
    if (this._frames.length === 0) {
      throw new NoFramesError('No frames in frame chain')
    }
    return new Location(this._frames[0].originalLocation)
  }
  /**
   * @return {RectangleSize} The size of the current frame.
   */
  getCurrentFrameSize() {
    if (this._frames.length === 0) {
      throw new NoFramesError('No frames in frame chain')
    }
    const result = this._frames[this._frames.length - 1].size
    return result
  }
  /**
   * @return {RectangleSize} The inner size of the current frame.
   */
  getCurrentFrameInnerSize() {
    if (this._frames.length === 0) {
      throw new NoFramesError('No frames in frame chain')
    }
    const result = this._frames[this._frames.length - 1].innerSize
    return result
  }

  [Symbol.iterator]() {
    return this._frames[Symbol.iterator]()
  }
}

exports.FrameChain = FrameChain
