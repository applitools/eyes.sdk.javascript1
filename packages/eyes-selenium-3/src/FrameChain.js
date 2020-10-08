;(function() {
  'use strict'

  var EyesUtils = require('@applitools/eyes-common-legacy'),
    Frame = require('./Frame').Frame
  var ArgumentGuard = EyesUtils.ArgumentGuard,
    GeometryUtils = EyesUtils.GeometryUtils

  /**
   * Creates a new frame chain.
   * @constructor
   * @param {Logger} logger A Logger instance.
   * @param {FrameChain} [other] A frame chain from which the current frame chain will be created.
   */
  function FrameChain(logger, other) {
    ArgumentGuard.notNull(logger, 'logger')

    this._logger = logger

    if (other && other instanceof FrameChain) {
      this._logger.verbose('Frame chain copy constructor (size ' + other.size() + ')')
      this._frames = []
      for (var i = 0, l = other.size(); i < l; i++) {
        this._frames.push(
          new Frame(
            logger,
            other.getFrames()[i].getReference(),
            other.getFrames()[i].getId(),
            other.getFrames()[i].getLocation(),
            other.getFrames()[i].getSize(),
            other.getFrames()[i].getParentScrollPosition(),
          ),
        )
      }
      this._logger.verbose('Done!')
    } else {
      this._frames = []
    }
  }

  /**
   * Compares two frame chains.
   * @param {FrameChain} c1 Frame chain to be compared against c2.
   * @param {FrameChain} c2 Frame chain to be compared against c1.
   * @return {boolean} True if both frame chains represent the same frame, false otherwise.
   */
  FrameChain.isSameFrameChain = function(c1, c2) {
    var lc1 = c1.size()
    var lc2 = c2.size()

    // different chains size means different frames
    if (lc1 !== lc2) {
      return false
    }

    for (var i = 0; i < lc1; ++i) {
      if (c1.getFrames()[i].getId() !== c2.getFrames()[i].getId()) {
        return false
      }
    }

    return true
  }

  /**
   * @return {Frame[]} frames stored in chain
   */
  FrameChain.prototype.getFrames = function() {
    return this._frames
  }

  /**
   * @param {number} index Index of needed frame
   * @return {Frame} frame by index in array
   */
  FrameChain.prototype.getFrame = function(index) {
    if (this._frames.length > index) {
      return this._frames[index]
    }

    throw new Error('No frames for given index')
  }

  /**
   *
   * @return {number} The number of frames in the chain.
   */
  FrameChain.prototype.size = function() {
    return this._frames.length
  }

  /**
   * Removes all current frames in the frame chain.
   */
  FrameChain.prototype.clear = function() {
    this._frames = []
  }

  /**
   * Removes the last inserted frame element. Practically means we switched
   * back to the parent of the current frame
   */
  FrameChain.prototype.pop = function() {
    return this._frames.pop()
  }

  /**
   * Appends a frame to the frame chain.
   * @param {Frame} frame The frame to be added.
   */
  FrameChain.prototype.push = function(frame) {
    return this._frames.push(frame)
  }

  /**
   * @return {{x: number, y: number}} The location of the current frame in the page.
   */
  FrameChain.prototype.getCurrentFrameOffset = function() {
    var result = {x: 0, y: 0}

    for (var i = 0, l = this._frames.length; i < l; i++) {
      result = GeometryUtils.locationOffset(result, this._frames[i].getLocation())
    }

    return result
  }

  /**
   * @return {{x: number, y: number}} The outermost frame's location, or NoFramesException.
   */
  FrameChain.prototype.getDefaultContentScrollPosition = function() {
    if (this._frames.length === 0) {
      throw new Error('No frames in frame chain')
    }
    return this._frames[0].getParentScrollPosition()
  }

  /**
   * @return {{width: number, height: number}} The size of the current frame.
   */
  FrameChain.prototype.getCurrentFrameSize = function() {
    this._logger.verbose('getCurrentFrameSize()')
    var result = this._frames[this._frames.length - 1].getSize()
    this._logger.verbose('Done!')
    return result
  }

  exports.FrameChain = FrameChain
})()
