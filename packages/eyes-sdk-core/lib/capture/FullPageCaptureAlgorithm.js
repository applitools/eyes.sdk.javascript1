'use strict';

const { GeneralUtils, ArgumentGuard, CoordinatesType, Location, RectangleSize, Region, MutableImage } = require('@applitools/eyes-common');

const { NullCutProvider } = require('../cropping/NullCutProvider');
const { NullRegionPositionCompensation } = require('../positioning/NullRegionPositionCompensation');

const MIN_SCREENSHOT_PART_HEIGHT = 10;
const MIN_SCREENSHOT_PART_WIDTH = 10;

/**
 * @ignore
 */
class FullPageCaptureAlgorithm {
  /**
   * @param {Logger} logger
   * @param {RegionPositionCompensation} regionPositionCompensation
   * @param {number} waitBeforeScreenshots
   * @param {DebugScreenshotsProvider} debugScreenshotsProvider
   * @param {EyesScreenshotFactory} screenshotFactory
   * @param {PositionProvider} originProvider
   * @param {ScaleProviderFactory} scaleProviderFactory
   * @param {CutProvider} cutProvider
   * @param {number} stitchingOverlap
   * @param {ImageProvider} imageProvider
   */
  constructor(logger, regionPositionCompensation, waitBeforeScreenshots, debugScreenshotsProvider, screenshotFactory, originProvider, scaleProviderFactory, cutProvider, stitchingOverlap, imageProvider) {
    ArgumentGuard.notNull(logger, 'logger');

    this._logger = logger;
    this._waitBeforeScreenshots = waitBeforeScreenshots;
    this._debugScreenshotsProvider = debugScreenshotsProvider;
    this._screenshotFactory = screenshotFactory;
    this._originProvider = originProvider;
    this._scaleProviderFactory = scaleProviderFactory;
    this._cutProvider = cutProvider;
    this._stitchingOverlap = stitchingOverlap;
    this._imageProvider = imageProvider;
    this._regionPositionCompensation = regionPositionCompensation || new NullRegionPositionCompensation();
  }

  /**
   * @private
   * @param {MutableImage} image
   * @param {Region} region
   * @param {string} name
   * @return {Promise}
   */
  async _saveDebugScreenshotPart(image, region, name) {
    const suffix = `part-${name}-${region.getLeft()}_${region.getTop()}_${region.getWidth()}x${region.getHeight()}`;

    await this._debugScreenshotsProvider.save(image, suffix);
  }

  // noinspection FunctionWithMoreThanThreeNegationsJS
  /**
   * Returns a stitching of a region.
   *
   * @param {Region} region - The region to stitch. If {@code Region.EMPTY}, the entire image will be stitched.
   * @param {Region} fullArea - The wanted area of the resulting image. If unknown, pass in {@code null} or {@code RectangleSize.EMPTY}.
   * @param {PositionProvider} positionProvider - A provider of the scrolling implementation.
   * @return {Promise<MutableImage>} - An image which represents the stitched region.
   */
  async getStitchedRegion(region, fullArea, positionProvider) {
    this._logger.verbose('getStitchedRegion()');

    ArgumentGuard.notNull(region, 'region');
    ArgumentGuard.notNull(positionProvider, 'positionProvider');

    this._logger.verbose(`positionProvider: ${positionProvider.constructor.name}; Region: ${region}`);

    // Saving the original position (in case we were already in the outermost frame).
    const originalPosition = await this._originProvider.getState();
    await this._originProvider.setPosition(Location.ZERO); // first scroll to 0,0 so CSS stitching works.

    // Saving the original position (in case we were already in the outermost frame).
    const originalStitchedState = await positionProvider.getState();

    this._logger.verbose('Getting top/left image...');
    let image = await this._imageProvider.getImage();
    await this._debugScreenshotsProvider.save(image, 'original');

    // FIXME - scaling should be refactored
    const scaleProvider = this._scaleProviderFactory.getScaleProvider(image.getWidth());
    // Notice this we want to cut/crop an image before we scale it, we need to change
    const pixelRatio = 1 / scaleProvider.getScaleRatio();

    // FIXME - cropping should be overlaid, so a single cut provider will only handle a single part of the image.
    const scaledCutProvider = this._cutProvider.scale(pixelRatio);
    if (!(scaledCutProvider instanceof NullCutProvider)) {
      image = await scaledCutProvider.cut(image);
      await this._debugScreenshotsProvider.save(image, 'original-cut');
    }

    const regionInScreenshot = await this._getRegionInScreenshot(region, image, pixelRatio);

    if (!regionInScreenshot.isSizeEmpty()) {
      image = await image.crop(regionInScreenshot);
      await this._saveDebugScreenshotPart(image, region, 'cropped');
    }

    if (pixelRatio !== 1) {
      image = await image.scale(1 / pixelRatio);
      await this._debugScreenshotsProvider.save(image, 'scaled');
    }

    if (!fullArea || fullArea.isEmpty()) {
      let entireSize;
      try {
        entireSize = await positionProvider.getEntireSize();
        this._logger.verbose(`Entire size of region context: ${entireSize}`);
      } catch (err) {
        this._logger.log(`WARNING: Failed to extract entire size of region context ${err}`);
        this._logger.log(`Using image size instead: ${image.getWidth()}x${image.getHeight()}`);
        entireSize = new RectangleSize(image.getWidth(), image.getHeight());
      }

      // Notice that this might still happen even if we used "getImagePart", since "entirePageSize" might be that of a frame.
      if (image.getWidth() >= entireSize.getWidth() && image.getHeight() >= entireSize.getHeight()) {
        await this._originProvider.restoreState(originalPosition);
        return image;
      }

      fullArea = new Region(Location.ZERO, entireSize);
    }

    // These will be used for storing the actual stitched size (it is sometimes less than the size extracted via "getEntireSize").
    let lastSuccessfulLocation;
    let lastSuccessfulPartSize;

    // The screenshot part is a bit smaller than the screenshot size,
    // in order to eliminate duplicate bottom scroll bars, as well as fixed
    // position footers.
    const partImageSize = new RectangleSize({
      width: Math.max(image.getWidth() - this._stitchingOverlap, MIN_SCREENSHOT_PART_WIDTH),
      height: Math.max(image.getHeight() - this._stitchingOverlap, MIN_SCREENSHOT_PART_HEIGHT),
    });
    this._logger.verbose(`entire page region: ${fullArea}, image part size: ${partImageSize}`);

    // Getting the list of sub-regions composing the whole region (we'll take screenshot for each one).
    const imageParts = fullArea.getSubRegions(partImageSize);

    this._logger.verbose('Creating stitchedImage container.');
    // Notice stitchedImage uses the same type of image as the screenshots.
    let stitchedImage = MutableImage.newImage(fullArea.getWidth(), fullArea.getHeight());

    this._logger.verbose('Done! Adding initial screenshot...');
    // Starting with the screenshot we already captured at (0,0).
    const initialPart = image;
    this._logger.verbose(`Initial part:(0,0)[${initialPart.getWidth()} x ${initialPart.getHeight()}]`);
    await stitchedImage.copyRasterData(0, 0, initialPart);
    this._logger.verbose('Done!');

    lastSuccessfulPartSize = new RectangleSize(image.getWidth(), image.getHeight());

    // Take screenshot and stitch for each screenshot part.
    this._logger.verbose('Getting the rest of the image parts...');
    let partImage;
    for (const partRegion of imageParts) {
      // Skipping screenshot for 0,0 (already taken)
      // if (partRegion.getLeft() === 0 && partRegion.getTop() === 0) {
      //   continue;
      // }

      this._logger.verbose(`Taking screenshot for ${partRegion}`);
      // Set the position to the part's top/left.
      await positionProvider.setPosition(partRegion.getLocation());
      // Giving it time to stabilize.
      await GeneralUtils.sleep(this._waitBeforeScreenshots);
      // Screen size may cause the scroll to only reach part of the way.
      let originPosition = await positionProvider.getCurrentPosition();
/* fixme
      if (positionProvider.constructor.name === 'CssTranslateElementPositionProvider') {
        originPosition = partRegion.getLocation();
      }
*/
      const targetPosition = originPosition.offset(-fullArea.getLeft(), -fullArea.getTop());
      this._logger.verbose(`Origin Position is set to ${originPosition}`);
      this._logger.verbose(`Target Position is ${targetPosition}`);

      // Actually taking the screenshot.
      this._logger.verbose('Getting image...');
      partImage = await this._imageProvider.getImage();
      await this._debugScreenshotsProvider.save(partImage, `original-scrolled-${(await positionProvider.getCurrentPosition()).toStringForFilename()}`);

      // FIXME - cropping should be overlaid (see previous comment re cropping)
      if (!(scaledCutProvider instanceof NullCutProvider)) {
        this._logger.verbose('cutting...');
        partImage = await scaledCutProvider.cut(partImage);
        await this._debugScreenshotsProvider.save(partImage, `original-scrolled-cut-${(await positionProvider.getCurrentPosition()).toStringForFilename()}`);
      }

      if (!regionInScreenshot.isSizeEmpty()) {
        this._logger.verbose('cropping...');
        partImage = await partImage.crop(regionInScreenshot);
        await this._saveDebugScreenshotPart(partImage, partRegion, `original-scrolled-${await originPosition.toStringForFilename()}`);
      }

      if (pixelRatio !== 1) {
        this._logger.verbose('scaling...');
        // FIXME - scaling should be refactored
        partImage = await partImage.scale(1 / pixelRatio);
        await this._saveDebugScreenshotPart(partImage, partRegion, `original-scrolled-${await originPosition.toStringForFilename()}-scaled-`);
      }

      // Stitching the current part.
      this._logger.verbose('Stitching part into the image container...');
      await stitchedImage.copyRasterData(targetPosition.getX(), targetPosition.getY(), partImage);
      this._logger.verbose('Done!');

      lastSuccessfulLocation = originPosition;
    }

    if (partImage) {
      lastSuccessfulPartSize = new RectangleSize(partImage.getWidth(), partImage.getHeight());
    }

    this._logger.verbose('Stitching done!');
    await positionProvider.restoreState(originalStitchedState);
    await this._originProvider.restoreState(originalPosition);

    // If the actual image size is smaller than the extracted size, we crop the image.
    const actualImageWidth = lastSuccessfulLocation.getX() + lastSuccessfulPartSize.getWidth();
    const actualImageHeight = lastSuccessfulLocation.getY() + lastSuccessfulPartSize.getHeight();
    this._logger.verbose(`Extracted entire size: ${fullArea.getSize()}`);
    this._logger.verbose(`Actual stitched size: ${actualImageWidth}x${actualImageHeight}`);

    if (actualImageWidth < stitchedImage.getWidth() || actualImageHeight < stitchedImage.getHeight()) {
      this._logger.verbose('Trimming unnecessary margins...');
      stitchedImage = await stitchedImage.crop(new Region(0, 0, Math.min(actualImageWidth, stitchedImage.getWidth()), Math.min(actualImageHeight, stitchedImage.getHeight())));
      this._logger.verbose('Done!');
    }

    await this._debugScreenshotsProvider.save(stitchedImage, 'stitched');
    return stitchedImage;
  }

  /**
   * @param {Region} region
   * @param {MutableImage} image
   * @param {number} pixelRatio
   * @return {Promise<Region>}
   */
  async _getRegionInScreenshot(region, image, pixelRatio) {
    if (region.isSizeEmpty()) {
      return region;
    }

    this._logger.verbose('Creating screenshot object...');
    // We need the screenshot to be able to convert the region to screenshot coordinates.
    const screenshot = await this._screenshotFactory.makeScreenshot(image);
    this._logger.verbose('Getting region in screenshot...');

    // Region regionInScreenshot = screenshot.convertRegionLocation(regionProvider.getRegion(), regionProvider.getCoordinatesType(), CoordinatesType.SCREENSHOT_AS_IS);
    let regionInScreenshot = screenshot.getIntersectedRegion(region, CoordinatesType.SCREENSHOT_AS_IS);

    this._logger.verbose(`Region in screenshot: ${regionInScreenshot}`);
    regionInScreenshot = regionInScreenshot.scale(pixelRatio);
    this._logger.verbose(`Scaled region: ${regionInScreenshot}`);

    regionInScreenshot = this._regionPositionCompensation.compensateRegionPosition(regionInScreenshot, pixelRatio);

    // Handling a specific case where the region is actually larger than the screenshot (e.g., when body width/height
    // are set to 100%, and an internal div is set to value which is larger than the viewport).
    regionInScreenshot.intersect(new Region(0, 0, image.getWidth(), image.getHeight()));
    this._logger.verbose(`Region after intersect: ${regionInScreenshot}`);
    return regionInScreenshot;
  }
}

exports.FullPageCaptureAlgorithm = FullPageCaptureAlgorithm;
