;(function() {
  'use strict'

  var fs = require('fs'),
    ImageUtils = require('@applitools/eyes-common-legacy').ImageUtils

  var disabled = !fs.open

  /**
   * Parses the image if possible - meaning dimensions and BMP are extracted and available
   *
   * @private
   * @param {MutableImage} that The context of the current instance of MutableImage
   */
  function _parseImage(that) {
    return that._promiseFactory.makePromise(function(resolve) {
      if (that._isParsed || disabled) {
        return resolve()
      }

      return ImageUtils.parseImage(that._imageBuffer, that._promiseFactory).then(function(
        imageData,
      ) {
        that._imageBmp = imageData
        that._width = imageData.width
        that._height = imageData.height
        that._isParsed = true
        resolve()
      })
    })
  }

  /**
   * Packs the image if possible - meaning the buffer is updated according to the edited BMP
   *
   * @private
   * @param {MutableImage} that The context of the current instance of MutableImage
   */
  function _packImage(that) {
    return that._promiseFactory.makePromise(function(resolve) {
      if (!that._isParsed || that._imageBuffer || disabled) {
        return resolve()
      }

      return ImageUtils.packImage(that._imageBmp, that._promiseFactory).then(function(buffer) {
        that._imageBuffer = buffer
        resolve()
      })
    })
  }

  /**
   * Retrieve image size - if image is not parsed, get image size from buffer
   *
   * @private
   * @param {MutableImage} that The context of the current instance of MutableImage
   */
  function _retrieveImageSize(that) {
    if (that._isParsed || (that._width && that._height)) {
      return
    }

    const imageSize = ImageUtils.getImageSizeFromBuffer(that._imageBuffer)
    that._width = imageSize.width
    that._height = imageSize.height
  }

  /**
   * A wrapper for image buffer that parses it to BMP to allow editing and extracting its dimensions
   *
   * @constructor
   * @param {Buffer} image Encoded bytes of image
   * @param {PromiseFactory} promiseFactory An object which will be used for creating deferreds/promises.
   **/
  function MutableImage(image, promiseFactory) {
    this._imageBuffer = image
    this._promiseFactory = promiseFactory
    this._isParsed = false
    this._imageBmp = undefined
    this._width = 0
    this._height = 0
    this._top = 0
    this._left = 0
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Coordinates represent the image's position in a larger context (if any).
   * E.g., A screenshot of the browser's viewport of a web page.
   *
   * @return {Promise<{x: number, y: number}>} The coordinates of the image in the larger context (if any)
   */
  MutableImage.prototype.getCoordinates = function() {
    var that = this
    return that._promiseFactory.makePromise(function(resolve) {
      resolve({
        x: that._left,
        y: that._top,
      })
    })
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Coordinates represent the image's position in a larger context (if any).
   * E.g., A screenshot of the browser's viewport of a web page.
   *
   * @param {{x: number, y: number}} coordinates
   * @return {Promise<void>}
   */
  MutableImage.prototype.setCoordinates = function(coordinates) {
    var that = this
    return that._promiseFactory.makePromise(function(resolve) {
      that._left = coordinates.x
      that._top = coordinates.y
      resolve()
    })
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Size of the image. Parses the image if necessary
   *
   * @return {{width: number, height: number}}
   */
  MutableImage.prototype.getSize = function() {
    _retrieveImageSize(this)
    return {
      width: this._width,
      height: this._height,
    }
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @return {number}
   */
  MutableImage.prototype.getWidth = function() {
    _retrieveImageSize(this)
    return this._width
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @return {number}
   */
  MutableImage.prototype.getHeight = function() {
    _retrieveImageSize(this)
    return this._height
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Return the image as buffer and image width and height.
   *
   * @return {Promise<{imageBuffer: Buffer, width: number, height: number}>}
   */
  MutableImage.prototype.asObject = function() {
    var that = this
    return _packImage(that).then(function() {
      _retrieveImageSize(that)
      return {
        imageBuffer: that._imageBuffer,
        width: that._width,
        height: that._height,
      }
    })
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Scales the image in place (used to downsize by 2 for retina display chrome bug - and tested accordingly).
   *
   * @param {number} scaleRatio
   * @return {Promise<MutableImage>}
   */
  MutableImage.prototype.scaleImage = function(scaleRatio) {
    var that = this
    if (scaleRatio === 1) {
      return that._promiseFactory.makePromise(function(resolve) {
        resolve(that)
      })
    }

    return _parseImage(that).then(function() {
      if (that._isParsed) {
        return ImageUtils.scaleImage(that._imageBmp, scaleRatio, that._promiseFactory).then(
          function() {
            that._imageBuffer = null
            that._width = that._imageBmp.width
            that._height = that._imageBmp.height
            return that
          },
        )
      }
      return that
    })
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Crops the image according to the given region.
   *
   * @param {{left: number, top: number, width: number, height: number, relative: boolean=}} region
   * @return {Promise<MutableImage>}
   */
  MutableImage.prototype.cropImage = function(region) {
    var that = this
    return _parseImage(that).then(function() {
      if (that._isParsed) {
        return ImageUtils.cropImage(that._imageBmp, region, that._promiseFactory).then(function() {
          that._imageBuffer = null
          that._width = that._imageBmp.width
          that._height = that._imageBmp.height
          return that
        })
      }
      return that
    })
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Rotates the image according to the given degrees.
   *
   * @param {number} degrees
   * @return {Promise<MutableImage>}
   */
  MutableImage.prototype.rotateImage = function(degrees) {
    var that = this
    if (degrees === 0) {
      return that._promiseFactory.makePromise(function(resolve) {
        resolve(that)
      })
    }

    return _parseImage(that).then(function() {
      if (that._isParsed) {
        // If the region's coordinates are relative to the image, we convert them to absolute coordinates.
        return ImageUtils.rotateImage(that._imageBmp, degrees, that._promiseFactory).then(
          function() {
            that._imageBuffer = null
            that._width = that._imageBmp.width
            that._height = that._imageBmp.height
            return that
          },
        )
      }
      return that
    })
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Write image to local directory
   *
   * @param {string} filename
   * @return {Promise<void>}
   */
  MutableImage.prototype.saveImage = function(filename) {
    var that = this
    return that.getImageBuffer().then(function(imageBuffer) {
      return ImageUtils.saveImage(imageBuffer, filename, that._promiseFactory)
    })
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @return {?Promise<Buffer>}
   */
  MutableImage.prototype.getImageBuffer = function() {
    var that = this
    return _packImage(that).then(function() {
      return that._imageBuffer
    })
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @return {?Promise<png.Image>}
   */
  MutableImage.prototype.getImageData = function() {
    var that = this
    return _parseImage(that).then(function() {
      return that._imageBmp
    })
  }

  /**
   * @param {string} image64 base64 encoded bytes of image
   * @param {PromiseFactory} promiseFactory An object which will be used for creating deferreds/promises.
   * @return {MutableImage}
   * @constructor
   */
  MutableImage.fromBase64 = function(image64, promiseFactory) {
    return new MutableImage(Buffer.from(image64, 'base64'), promiseFactory)
  }

  exports.MutableImage = MutableImage
})()
