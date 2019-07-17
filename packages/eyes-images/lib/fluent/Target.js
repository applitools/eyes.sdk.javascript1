'use strict';

const { MutableImage, TypeUtils, ArgumentGuard } = require('@applitools/eyes-common');
const { ImageProvider } = require('@applitools/eyes-sdk-core');

const { ImagesCheckSettings } = require('./ImagesCheckSettings');

class Target {
  /**
   * @signature `image(Base64OrUrlorFilepath)`
   * @sigparam {string} Base64OrUrlorPath - If the string is a Base64 image then it is used as the checkpoint image 
   *       If the string matches the format of a URL then checkpoint image is taken from the URL
   *       Otherwise the string is treated as the path to a file that contains an in image in png format.
   *
   * @signature `image(imageBuffer)`
   * @sigparam {Buffer} imageBuffer - A Buffer object that contains an image that is used as the checkpoint image.
   *
   * @signature `image(imageProvider)`
   * @sigparam {ImageProvider} imageProvider - An object provided by the user, it must provide a 
   *  getImage() method that returns a MutableImage object (TBD or a Promise with a MutableImage ?)
   *
   * @signature `image(image)`
   * @sigparam {MutableImage} mutableImage - An in memory image that is used as the checkpoint image
   *      TBD - IS THIS FOR THE USER ?
   *
   * @param {string|Buffer|ImageProvider|MutableImage} varArg
   * @return {ImagesCheckSettings}
   */
  static image(varArg) {
    if (varArg instanceof MutableImage) {
      return new ImagesCheckSettings(varArg);
    }

    if (varArg instanceof ImageProvider) {
      return Target.imageProvider(varArg);
    }

    if (TypeUtils.isBuffer(varArg)) {
      return Target.buffer(varArg);
    }

    if (TypeUtils.isBase64(varArg)) {
      return Target.base64(varArg);
    }

    if (TypeUtils.isUrl(varArg)) {
      return Target.url(varArg);
    }

    if (TypeUtils.isString(varArg)) {
      return Target.path(varArg);
    }

    throw new TypeError('IllegalType: unsupported type of image!');
  }

  /**
   * @param {Buffer} imageBuffer
   * @return {ImagesCheckSettings}
   */
  static buffer(imageBuffer) {
    ArgumentGuard.isBuffer(imageBuffer, 'buffer');

    const checkSettings = new ImagesCheckSettings();
    checkSettings.setImageBuffer(imageBuffer);
    return checkSettings;
  }

  /**
   * @param {string} imageBase64
   * @return {ImagesCheckSettings}
   */
  static base64(imageBase64) {
    ArgumentGuard.isBase64(imageBase64);

    const checkSettings = new ImagesCheckSettings();
    checkSettings.setImageString(imageBase64);
    return checkSettings;
  }

  /**
   * @param {string} imagePath
   * @return {ImagesCheckSettings}
   */
  static path(imagePath) {
    ArgumentGuard.isString(imagePath, 'path');

    const checkSettings = new ImagesCheckSettings();
    checkSettings.setImagePath(imagePath);
    return checkSettings;
  }

  /**
   * @param {string} imageUrl
   * @param {RectangleSize} [imageSize]
   * @return {ImagesCheckSettings}
   */
  static url(imageUrl, imageSize) {
    ArgumentGuard.isString(imageUrl, 'url');

    const checkSettings = new ImagesCheckSettings();
    checkSettings.setImageUrl(imageUrl, imageSize);
    return checkSettings;
  }

  /**
   * @param {ImageProvider} imageProvider
   * @return {ImagesCheckSettings}
   */
  static imageProvider(imageProvider) {
    ArgumentGuard.isValidType(imageProvider, ImageProvider);

    const checkSettings = new ImagesCheckSettings();
    checkSettings.setImageProvider(imageProvider);
    return checkSettings;
  }

  /**
   * @signature `image(Base64OrUrlorFilepath, rect)`
   * @sigparam {string} Base64OrUrlorPath - If the string is a Base64 image then it is used as the checkpoint image 
   *       If the string matches the format of a URL then checkpoint image is taken from the URL
   *       Otherwise the string is treated as the path to a file that contains an in image in png format.
   * @sigparam {Region} rect - A region within the image to be checked
   *
   * @signature `image(imageBuffer, rect)`
   * @sigparam {Buffer} imageBuffer - A Buffer object that contains an image that is used as the checkpoint image.
   * @sigparam {Region} rect - A region within the image to be checked
   *
   * @signature `image(image, rect)`
   * @sigparam {MutableImage} mutableImage - An in memory image that is used as the checkpoint image
   *      TBD - IS THIS FOR THE USER ?
   * @sigparam {Region} rect - A region within the image to be checked
   *
   * @param {string|Buffer|MutableImage} image
   * @param {Region|RegionObject} rect
   * @return {ImagesCheckSettings}
   */
  static region(image, rect) {
    const checkSettings = Target.image(image);
    // noinspection JSAccessibilityCheck
    checkSettings.region(rect);
    return checkSettings;
  }
}

exports.Target = Target;
