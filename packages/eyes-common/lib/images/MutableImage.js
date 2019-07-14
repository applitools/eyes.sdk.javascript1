'use strict';

const { Location } = require('../geometry/Location');
const { RectangleSize } = require('../geometry/RectangleSize');
const { TypeUtils } = require('../utils/TypeUtils');
const { ImageUtils } = require('../utils/ImageUtils');

/**
 * Parses the image if possible - meaning dimensions and BMP are extracted and available
 *
 * @param {MutableImage} mutableImage - The context of the current instance of MutableImage
 * @return {Promise}
 */
async function parseImage(mutableImage) {
  if (mutableImage._isParsed) {
    return;
  }

  const imageData = await ImageUtils.parseImage(mutableImage._imageBuffer);
  mutableImage._imageBmp = imageData;
  mutableImage._width = imageData.width;
  mutableImage._height = imageData.height;
  mutableImage._isParsed = true;
}

/**
 * Packs the image if possible - meaning the buffer is updated according to the edited BMP
 *
 * @param {MutableImage} mutableImage - The context of the current instance of MutableImage
 * @return {Promise}
 */
async function packImage(mutableImage) {
  if (!mutableImage._isParsed || mutableImage._imageBuffer) {
    return;
  }

  mutableImage._imageBuffer = await ImageUtils.packImage(mutableImage._imageBmp);
}

/**
 * Retrieve image size - if image is not parsed, get image size from buffer
 *
 * @private
 * @param {MutableImage} that - The context of the current instance of MutableImage
 */
const retrieveImageSize = (that) => {
  if (that._isParsed || (that._width && that._height)) {
    return;
  }

  const imageSize = ImageUtils.getImageSizeFromBuffer(that._imageBuffer);
  that._width = imageSize.width;
  that._height = imageSize.height;
};

/**
 * A wrapper for image buffer that parses it to BMP to allow editing and extracting its dimensions
 */
class MutableImage {
  /**
   * @param {Buffer|string} image - Encoded bytes of image (buffer or base64 string)
   */
  constructor(image) {
    if (TypeUtils.isString(image)) {
      image = Buffer.from(image, 'base64');
    }

    /** @type {Buffer} */
    this._imageBuffer = image;
    /** @type {boolean} */
    this._isParsed = false;
    /** @type {png.Image|Image} */
    this._imageBmp = undefined;
    /** @type {number} */
    this._width = 0;
    /** @type {number} */
    this._height = 0;
    /** @type {number} */
    this._top = 0;
    /** @type {number} */
    this._left = 0;
  }

  /**
   * @param {number} width
   * @param {number} height
   * @return {MutableImage}
   */
  static newImage(width, height) {
    const result = new MutableImage(null);
    result._isParsed = true;
    result._imageBmp = ImageUtils.createImage(width, height);
    result._width = width;
    result._height = height;
    return result;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Coordinates represent the image's position in a larger context (if any).
   * E.g., A screenshot of the browser's viewport of a web page.
   *
   * @return {Location} - The coordinates of the image in the larger context (if any)
   */
  getCoordinates() {
    return new Location({ x: this._left, y: this._top });
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Coordinates represent the image's position in a larger context (if any).
   * E.g., A screenshot of the browser's viewport of a web page.
   *
   * @param {Location} coordinates
   */
  setCoordinates(coordinates) {
    this._left = coordinates.getX();
    this._top = coordinates.getY();
  }

  /**
   * Size of the image. Parses the image if necessary
   *
   * @return {RectangleSize}
   */
  getSize() {
    retrieveImageSize(this);
    return new RectangleSize({ width: this._width, height: this._height });
  }

  /**
   * @return {number}
   */
  getWidth() {
    retrieveImageSize(this);
    return this._width;
  }

  /**
   * @return {number}
   */
  getHeight() {
    retrieveImageSize(this);
    return this._height;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Return the image as buffer and image width and height.
   *
   * @return {Promise<{imageBuffer: Buffer, width: number, height: number}>}
   */
  async asObject() {
    await packImage(this);
    retrieveImageSize(this);

    return {
      imageBuffer: this._imageBuffer,
      width: this._width,
      height: this._height,
    };
  }

  /**
   * Scales the image in place (used to downsize by 2 for retina display chrome bug - and tested accordingly).
   *
   * @param {number} scaleRatio
   * @return {Promise<MutableImage>}
   */
  async scale(scaleRatio) {
    if (scaleRatio === 1) {
      return this;
    }

    await parseImage(this);

    if (this._isParsed) {
      await ImageUtils.scaleImage(this._imageBmp, scaleRatio);
      this._imageBuffer = null;
      this._width = this._imageBmp.width;
      this._height = this._imageBmp.height;
    }

    return this;
  }

  /**
   * Crops the image according to the given region.
   *
   * @param {Region} region
   * @return {Promise<MutableImage>}
   */
  async crop(region) {
    await parseImage(this);

    if (this._isParsed) {
      await ImageUtils.cropImage(this._imageBmp, region);
      this._imageBuffer = null;
      this._width = this._imageBmp.width;
      this._height = this._imageBmp.height;
    }

    return this;
  }

  /**
   * Crops the image according to the given region and return new image, do not override existing
   * !WARNING this method copy image and crop it. Use image.crop() when it is possible
   *
   * @param {Region} region
   * @return {Promise<MutableImage>}
   */
  async getImagePart(region) {
    await packImage(this);
    const newImage = new MutableImage(Buffer.from(this._imageBuffer));
    return newImage.crop(region);
  }

  /**
   * Rotates an image clockwise by a number of degrees rounded to the nearest 90 degrees.
   *
   * @param {number} degrees - The number of degrees to rotate the image by
   * @return {Promise<MutableImage>}
   */
  async rotate(degrees) {
    // noinspection MagicNumberJS
    if (degrees % 360 === 0) {
      return this;
    }

    await parseImage(this);

    if (this._isParsed) {
      // If the region's coordinates are relative to the image, we convert them to absolute coordinates.
      await ImageUtils.rotateImage(this._imageBmp, degrees);
      this._imageBuffer = null;
      this._width = this._imageBmp.width;
      this._height = this._imageBmp.height;
    }

    return this;
  }

  /**
   * @param {number} dx
   * @param {number} dy
   * @param {MutableImage} srcImage
   * @return {Promise}
   */
  async copyRasterData(dx, dy, srcImage) {
    await parseImage(this);

    const srcImageBmp = await srcImage.getImageData();
    let width = srcImage.getWidth();
    let height = srcImage.getHeight();
    const maxWidth = this.getWidth() - dx;
    const maxHeight = this.getHeight() - dy;

    if (maxWidth < width) {
      width = maxWidth;
    }

    if (maxHeight < height) {
      height = maxHeight;
    }

    ImageUtils.copyPixels(this._imageBmp, { x: dx, y: dy }, srcImageBmp, { x: 0, y: 0 }, { width, height });
  }

  /**
   * @return {?Promise<Buffer>}
   */
  async getImageBuffer() {
    await packImage(this);
    return this._imageBuffer;
  }

  /**
   * @return {?Promise<string>}
   */
  async getImageBase64() {
    await packImage(this);
    return this._imageBuffer.toString('base64');
  }

  /**
   * @return {?Promise<png.Image|Image>}
   */
  async getImageData() {
    await parseImage(this);
    return this._imageBmp;
  }
}

exports.MutableImage = MutableImage;
