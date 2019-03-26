'use strict';

const { ArgumentGuard } = require('@applitools/eyes-common');

const { ScaleProvider } = require('./ScaleProvider');

// Allowed deviations for viewport size and default content entire size.
const ALLOWED_VS_DEVIATION = 1;
const ALLOWED_DCES_DEVIATION = 10;
const UNKNOWN_SCALE_RATIO = 0;

/**
 * @param {number} viewportWidth
 * @param {number} imageToScaleWidth
 * @param {number} currentScaleRatio
 * @return {number}
 */
function getScaleRatioToViewport(viewportWidth, imageToScaleWidth, currentScaleRatio) {
  const scaledImageWidth = Math.round(imageToScaleWidth * currentScaleRatio);
  const fromScaledToViewportRatio = viewportWidth / scaledImageWidth;
  return currentScaleRatio * fromScaledToViewportRatio;
}

/**
 * Scale provider which determines the scale ratio according to the context.
 */
class ContextBasedScaleProvider extends ScaleProvider {
  /**
   * @param {Logger} logger
   * @param {RectangleSize} topLevelContextEntireSize - The total size of the top level context. E.g., for selenium this
   *   would be the document size of the top level frame.
   * @param {RectangleSize} viewportSize - The viewport size.
   * @param {number} devicePixelRatio - The device pixel ratio of the platform on which the application is running.
   * @param {boolean} isMobileDevice
   */
  constructor(logger, topLevelContextEntireSize, viewportSize, devicePixelRatio, isMobileDevice) {
    super();

    /** @type {Logger} */
    this._logger = logger;
    /** @type {RectangleSize} */
    this._topLevelContextEntireSize = topLevelContextEntireSize;
    /** @type {RectangleSize} */
    this._viewportSize = viewportSize;
    /** @type {number} */
    this._devicePixelRatio = devicePixelRatio;
    /** @type {boolean} */
    this._isMobileDevice = isMobileDevice;

    // Since we need the image size to decide what the scale ratio is.
    /** @type {number} */
    this._scaleRatio = UNKNOWN_SCALE_RATIO;
  }

  /**
   * @inheritDoc
   * @return {number} - The ratio by which an image will be scaled.
   */
  getScaleRatio() {
    ArgumentGuard.isValidState(this._scaleRatio !== UNKNOWN_SCALE_RATIO, 'scaleRatio not defined yet');
    return this._scaleRatio;
  }

  /**
   * Set the scale ratio based on the given image.
   *
   * @param {number} imageToScaleWidth - The width of the image to scale, used for calculating the scale ratio.
   */
  updateScaleRatio(imageToScaleWidth) {
    const viewportWidth = this._viewportSize.getWidth();
    const dcesWidth = this._topLevelContextEntireSize.getWidth();

    // If the image's width is the same as the viewport's width or the
    // top level context's width, no scaling is necessary.
    if (
      (imageToScaleWidth >= viewportWidth - ALLOWED_VS_DEVIATION &&
        imageToScaleWidth <= viewportWidth + ALLOWED_VS_DEVIATION) ||
      (imageToScaleWidth >= dcesWidth - ALLOWED_DCES_DEVIATION &&
        imageToScaleWidth <= dcesWidth + ALLOWED_DCES_DEVIATION)
    ) {
      this._logger.verbose('Image is already scaled correctly.');
      this._scaleRatio = 1;
    } else {
      this._logger.verbose('Calculating the scale ratio...');
      this._scaleRatio = 1 / this._devicePixelRatio;
      if (this._isMobileDevice) {
        this._logger.verbose('Mobile device, so using 2 step calculation for scale ration...');
        this._logger.verbose(`Scale ratio based on DRP: ${this._scaleRatio}`);
        this._scaleRatio = getScaleRatioToViewport(viewportWidth, imageToScaleWidth, this._scaleRatio);
      }
      this._logger.verbose(`Final scale ratio: ${this._scaleRatio}`);
    }
  }
}

exports.ContextBasedScaleProvider = ContextBasedScaleProvider;
