'use strict';

const { ArgumentGuard, Location } = require('@applitools/eyes-common');

const { NoFramesError } = require('../errors/NoFramesError');

/**
 * @implements {Iterable<Frame>}
 */
class FrameChain {
  /**
   * Creates a new frame chain.
   *
   * @param {Logger} logger - A Logger instance.
   * @param {FrameChain} [other] - A frame chain from which the current frame chain will be created.
   */
  constructor(logger, other) {
    ArgumentGuard.notNull(logger, 'logger');

    this._logger = logger;
    this._frames = [];

    if (other) {
      this._frames = other.getFrames().slice(0);
    }
  }

  /**
   * Compares two frame chains.
   *
   * @param {FrameChain} c1 - Frame chain to be compared against c2.
   * @param {FrameChain} c2 - Frame chain to be compared against c1.
   * @return {boolean} - True if both frame chains represent the same frame, false otherwise.
   */
  static isSameFrameChain(c1, c2) {
    const lc1 = c1.size();
    const lc2 = c2.size();

    // different chains size means different frames
    if (lc1 !== lc2) {
      return false;
    }

    for (let i = 0; i < lc1; i += 1) {
      if (c1.getFrame(i).getReference() !== c2.getFrame(i).getReference()) {
        return false;
      }
    }

    return true;
  }

  /**
   * @return {number} - The number of frames in the chain.
   */
  size() {
    return this._frames.length;
  }

  /**
   * Removes all current frames in the frame chain.
   */
  clear() {
    this._frames = [];
  }

  /**
   * Removes the last inserted frame element. Practically means we switched back to the parent of the current frame
   *
   * @return {Frame}
   */
  pop() {
    return this._frames.pop();
  }

  /**
   * @return {?Frame} - Returns the top frame in the chain.
   */
  peek() {
    if (this._frames.length === 0) {
      return null;
    }

    return this._frames[this._frames.length - 1];
  }

  /**
   * Appends a frame to the frame chain.
   *
   * @param {Frame} frame - The frame to be added.
   */
  push(frame) {
    return this._frames.push(frame);
  }

  /**
   * @return {Location} - The location of the current frame in the page.
   */
  getCurrentFrameOffset() {
    let result = new Location(Location.ZERO);

    this._frames.forEach(frame => {
      result = result.offsetByLocation(frame.getLocation());
    });

    return result;
  }

  /**
   * @return {Location} - The outermost frame's location, or NoFramesException.
   */
  getDefaultContentScrollPosition() {
    if (this._frames.length === 0) {
      throw new NoFramesError('No frames in frame chain');
    }
    return new Location(this._frames[0].getOriginalLocation());
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {RectangleSize} - The size of the current frame.
   */
  getCurrentFrameSize() {
    this._logger.verbose('getCurrentFrameSize()');
    const result = this._frames[this._frames.length - 1].getOuterSize();
    this._logger.verbose('Done!');
    return result;
  }

  /**
   * @return {RectangleSize} - The inner size of the current frame.
   */
  getCurrentFrameInnerSize() {
    this._logger.verbose('getCurrentFrameInnerSize()');
    const result = this._frames[this._frames.length - 1].getInnerSize();
    this._logger.verbose('Done!');
    return result;
  }

  /**
   * @return Iterator<Frame> iterator to go over the frames in the chain.
   */
  [Symbol.iterator]() {
    // noinspection JSValidateTypes
    return this._frames.values();
  }

  /**
   * @return {Frame[]} - All frames stored in chain
   */
  getFrames() {
    return this._frames;
  }

  /**
   * @param {number} index - Index of needed frame
   * @return {Frame} - Frame by index in array
   */
  getFrame(index) {
    if (this._frames.length > index) {
      return this._frames[index];
    }

    throw new Error('No frames for given index');
  }

  /**
   * @return {FrameChain}
   */
  clone() {
    return new FrameChain(this._logger, this);
  }
}

exports.FrameChain = FrameChain;
