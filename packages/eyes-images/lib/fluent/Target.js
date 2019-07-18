'use strict';

const { MutableImage, TypeUtils, ArgumentGuard } = require('@applitools/eyes-common');
const { ImageProvider } = require('@applitools/eyes-sdk-core');

const { ImagesCheckSettings } = require('./ImagesCheckSettings');

class Target {
  /**
   * @signature `image(base64String)`
   * @sigparam {string} base64String - A base64 encoded image to use as the checkpoint image
   *
   * @signature `image(url)`
   * @sigparam {string} url - A URL of the PNG image to download and use as the checkpoint image
   *
   * @signature `image(filePath)`
   * @sigparam {string} filePath - Path to a local PNG file to use as the checkpoint image
   *
   * @signature `image(imageBuffer)`
   * @sigparam {Buffer} imageBuffer - A Buffer object that contains an image to use as checkpoint image
   *
   * @signature `image(image)`
   * @sigparam {MutableImage} mutableImage - An in memory image to use as the checkpoint image
   *
   * @signature `image(imageProvider)`
   * @sigparam {ImageProvider} imageProvider - An instance of class (object) which implements {@link ImageProvider}
   *  (has a method called {@code getImage} which returns {@code Promise<MutableImage>})
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
   * @signature `image(base64String, rect)`
   * @sigparam {string} base64String - A base64 encoded image to use as the checkpoint image
   * @sigparam {Region|RegionObject} rect - A region within the image to be checked
   *
   * @signature `image(url, rect)`
   * @sigparam {string} url - A URL of the PNG image to download and use as the checkpoint image
   * @sigparam {Region|RegionObject} rect - A region within the image to be checked
   *
   * @signature `image(filePath, rect)`
   * @sigparam {string} filePath - Path to a local PNG file to use as the checkpoint image
   * @sigparam {Region|RegionObject} rect - A region within the image to be checked
   *
   * @signature `image(imageBuffer, rect)`
   * @sigparam {Buffer} imageBuffer - A Buffer object that contains an image to use as checkpoint image
   * @sigparam {Region|RegionObject} rect - A region within the image to be checked
   *
   * @signature `image(image, rect)`
   * @sigparam {MutableImage} mutableImage - An in memory image to use as the checkpoint image
   * @sigparam {Region|RegionObject} rect - A region within the image to be checked
   *
   * @signature `image(imageProvider, rect)`
   * @sigparam {ImageProvider} imageProvider - An instance of class (object) which implements {@link ImageProvider}
   *  (has a method called {@code getImage} which returns {@code Promise<MutableImage>})
   * @sigparam {Region|RegionObject} rect - A region within the image to be checked
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
