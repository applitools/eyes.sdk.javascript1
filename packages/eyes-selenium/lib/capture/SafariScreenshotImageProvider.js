'use strict';

const { MutableImage, Region, OSNames, RectangleSize } = require('@applitools/eyes-common');
const { ImageProvider } = require('@applitools/eyes-sdk-core');

const { ScrollPositionProvider } = require('../positioning/ScrollPositionProvider');
const { SeleniumJavaScriptExecutor } = require('../SeleniumJavaScriptExecutor');

/**
 * @ignore
 */
class SafariScreenshotImageProvider extends ImageProvider {
  /**
   * @param {Eyes} eyes
   * @param {Logger} logger - A Logger instance.
   * @param {EyesWebDriver} tsInstance
   * @param {UserAgent} userAgent
   */
  constructor(eyes, logger, tsInstance, userAgent) {
    super();

    this._eyes = eyes;
    this._logger = logger;
    this._tsInstance = tsInstance;
    this._userAgent = userAgent;

    this._jsExecutor = new SeleniumJavaScriptExecutor(eyes.getDriver());
  }

  /**
   * @inheritDoc
   * @return {Promise<MutableImage>}
   */
  async getImage() {
    this._logger.verbose('Getting screenshot as base64...');
    let screenshot64 = await this._tsInstance.takeScreenshot();
    screenshot64 = screenshot64.replace(/\r\n/g, ''); // Because of SauceLabs returns image with line breaks

    this._logger.verbose('Done getting base64! Creating MutableImage...');
    const image = new MutableImage(screenshot64);
    await this._eyes.getDebugScreenshotsProvider().save(image, 'SAFARI');

    if (this._eyes.getIsCutProviderExplicitlySet()) {
      return image;
    }

    const scaleRatio = this._eyes.getDevicePixelRatio();
    const originalViewportSize = await this._eyes.getViewportSize();
    let viewportSize = originalViewportSize.scale(scaleRatio);

    this._logger.verbose(`logical viewport size: ${originalViewportSize}`);

    if (this._userAgent.getOS() === OSNames.IOS) {
      let topBarHeight = 20;
      let leftBarWidth = 0;
      let bottomBarHeight = 44;
      let rightBarWidth = 0;
      let urlBarHeight = 44;

      const imageWidth = image.getWidth();
      const imageHeight = image.getHeight();
      const displayLogicalWidth = Math.ceil(imageWidth / scaleRatio);
      const displayLogicalHeight = Math.ceil(imageHeight / scaleRatio);

      this._logger.verbose(`physical device pixel size: ${imageWidth} x ${imageHeight}`);
      this._logger.verbose(`physical device logical size: ${displayLogicalWidth} x ${displayLogicalHeight}`);

      if (displayLogicalHeight === 736 && displayLogicalWidth === 414) { // iPhone 5.5 inch
        this._logger.verbose('iPhone 5.5 inch detected');
        topBarHeight = 18;
      } else if (displayLogicalHeight === 812 && displayLogicalWidth === 375) { // iPhone 5.8 inch p
        this._logger.verbose('iPhone 5.8 inch portrait detected');
        topBarHeight = 44;
        bottomBarHeight = 83;
      } else if (displayLogicalWidth === 812 && displayLogicalHeight === 375) { // iPhone 5.8 inch l
        this._logger.verbose('iPhone 5.8 inch landscape detected');
        leftBarWidth = 44;
        rightBarWidth = 44;
      }

      if (displayLogicalHeight < displayLogicalWidth) {
        this._logger.verbose('landscape mode detected');
        topBarHeight = 0;
        if (displayLogicalWidth === 812 && displayLogicalHeight === 375) { // on iPhone X crop the home indicator.
          bottomBarHeight = 15;
        } else {
          bottomBarHeight = 0;
        }

        // on iPhone 5.5 inch with Safari 10 in landscape mode crop the tabs bar.
        if (displayLogicalWidth === 736 && displayLogicalHeight === 414 &&
          parseInt(this._userAgent.getBrowserMajorVersion(), 10) < 11) {
          topBarHeight = 33;
        }
      }

      if (parseInt(this._userAgent.getBrowserMajorVersion(), 10) >= 11) { // Safari >= 11
        this._logger.verbose('safari version 11 or higher detected');
        urlBarHeight = 50;
      }

      viewportSize = new RectangleSize({
        width: Math.ceil(imageWidth - ((leftBarWidth + rightBarWidth) * scaleRatio)),
        height: Math.ceil(imageHeight - ((topBarHeight + urlBarHeight + bottomBarHeight) * scaleRatio)),
      });

      this._logger.verbose(`computed physical viewport size: ${viewportSize}`);
      this._logger.verbose('cropping IOS browser image');

      const region = new Region(
        Math.ceil(leftBarWidth * scaleRatio),
        Math.ceil((topBarHeight + urlBarHeight) * scaleRatio),
        viewportSize.getWidth(),
        viewportSize.getHeight()
      );
      return image.crop(region);
    }

    if (!this._eyes.getForceFullPageScreenshot()) {
      const currentFrameChain = this._eyes.getDriver().getFrameChain();

      let loc;
      if (currentFrameChain.size() === 0) {
        const positionProvider = new ScrollPositionProvider(this._logger, this._jsExecutor);
        loc = await positionProvider.getCurrentPosition();
      } else {
        loc = currentFrameChain.getDefaultContentScrollPosition();
      }

      await image.crop(new Region(loc.scale(scaleRatio), viewportSize));
    }

    return image;
  }
}

exports.SafariScreenshotImageProvider = SafariScreenshotImageProvider;
