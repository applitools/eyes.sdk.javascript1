;(function() {
  'use strict'

  var ArgumentGuard = require('@applitools/eyes-common-legacy').ArgumentGuard

  /**
   * @constructor
   * @param {Logger} logger A Logger instance.
   * @param {WebElement} reference The web element for the frame, used as a reference to switch into the frame.
   * @param {string} frameId The id of the frame. Can be used later for comparing two frames.
   * @param {{x: number, y: number}} location The location of the frame within the current frame.
   * @param {{width: number, height: number}} size The frame element size (i.e., the size of the frame on the screen, not the internal document size).
   * @param {{x: number, y: number}} parentScrollPosition The scroll position the frame's parent was in when the frame was switched to.
   */
  function Frame(logger, reference, frameId, location, size, parentScrollPosition) {
    ArgumentGuard.notNull(logger, 'logger')
    ArgumentGuard.notNull(reference, 'reference')
    ArgumentGuard.notNull(frameId, 'frameId')
    ArgumentGuard.notNull(location, 'location')
    ArgumentGuard.notNull(size, 'size')
    ArgumentGuard.notNull(parentScrollPosition, 'parentScrollPosition')

    logger.verbose(
      'Frame(logger, reference, ' + frameId + ', ',
      location,
      ', ',
      size,
      ', ',
      parentScrollPosition,
      ')',
    )

    this._logger = logger
    this._reference = reference
    this._id = frameId
    this._parentScrollPosition = parentScrollPosition
    this._size = size
    this._location = location
  }

  /**
   * @return {WebElement}
   */
  Frame.prototype.getReference = function() {
    return this._reference
  }

  /**
   * @return {string}
   */
  Frame.prototype.getId = function() {
    return this._id
  }

  /**
   * @return {{x: number, y: number}}
   */
  Frame.prototype.getLocation = function() {
    return this._location
  }

  /**
   * @return {{width: number, height: number}}
   */
  Frame.prototype.getSize = function() {
    return this._size
  }

  /**
   * @return {{x: number, y: number}}
   */
  Frame.prototype.getParentScrollPosition = function() {
    return this._parentScrollPosition
  }

  exports.Frame = Frame
})()
