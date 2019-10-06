'use strict';

const { ArgumentGuard, TypeUtils, FileUtils, EyesError, MutableImage, RectangleSize } = require('@applitools/eyes-common');
const { EyesBase, RegionProvider, NullRegionProvider, EyesSimpleScreenshot } = require('@applitools/eyes-sdk-core');

const { Target } = require('./fluent/Target');
const VERSION = require('../package.json').version;

/**
 * The main type - to be used by the users of the library to access all functionality.
 */
class Eyes extends EyesBase {
  /**
   * Initializes an Eyes instance.
   *
   * @param {string} [serverUrl] The Eyes server URL.
   * @param {?boolean} [isDisabled=false] - Will be checked <b>before</b> any argument validation. If true, all method
   *   will immediately return without performing any action.
   */
  constructor(serverUrl, isDisabled) {
    super(serverUrl, isDisabled);

    /** @type {String} */ this._title = undefined;
    /** @type {String} */ this._domString = undefined;
    /** @type {Location} */ this._imageLocation = undefined;
    this._inferred = '';

    /** @type {MutableImage} */ this._screenshot = undefined;
    /** @type {String} */ this._screenshotUrl = undefined;
    /** @type {ImageProvider} */ this._screenshotProvider = undefined;
  }

  /**
   * @override
   */
  getBaseAgentId() {
    return `eyes.images.javascript/${VERSION}`;
  }

  /**
   * Starts a test.
   *
   * @param {string} appName - The application being tested.
   * @param {string} testName - The test's name.
   * @param {RectangleSize} [imageSize] - Determines the resolution used for the baseline. {@code null} will
   *   automatically grab the resolution from the image.
   * @return {Promise}
   */
  open(appName, testName, imageSize) {
    return super.openBase(appName, testName, imageSize);
  }

  /**
   * Perform visual validation for the current image.
   *
   * @signature `checkImage(base64String, name, ignoreMismatch, retryTimeout)`
   * @sigparam {string} base64String - A base64 encoded image to use as the checkpoint image
   * @sigparam {string} [name] - Tag to be associated with the validation checkpoint.
   * @sigparam {boolean} [ignoreMismatch] - True if the server should ignore a negative result for the visual validation.
   * @sigparam {number} [retryTimeout] - timeout for performing the match (ms).
   *
   * @signature `checkImage(url, name, ignoreMismatch, retryTimeout)`
   * @sigparam {string} url - A URL of the PNG image to download and use as the checkpoint image
   *
   * @signature `checkImage(filePath, name, ignoreMismatch, retryTimeout)`
   * @sigparam {string} filePath - Path to a local PNG file to use as the checkpoint image
   *
   * @signature `checkImage(imageBuffer, name, ignoreMismatch, retryTimeout)`
   * @sigparam {Buffer} imageBuffer - A Buffer object that contains an image to use as checkpoint image
   *
   * @signature `checkImage(mutableImage, name, ignoreMismatch, retryTimeout)`
   * @sigparam {MutableImage} mutableImage - An in memory image to use as the checkpoint image
   *
   * @signature `checkImage(imageProvider, name, ignoreMismatch, retryTimeout)`
   * @sigparam {ImageProvider} imageProvider - An instance of class (object) which implements {@link ImageProvider}
   *  (has a method called {@code getImage} which returns {@code Promise<MutableImage>})
   *
   * @param {string|Buffer|ImageProvider|MutableImage} image - The image path, base64 string, image buffer or MutableImage.
   * @param {string} [name] - Tag to be associated with the validation checkpoint.
   * @param {boolean} [ignoreMismatch] - True if the server should ignore a negative result for the visual validation.
   * @param {number} [retryTimeout] - timeout for performing the match (ms).
   * @return {Promise<boolean>} - True if the image matched the expected output, false otherwise.
   * @throws {DiffsFoundError} Thrown if a mismatch is detected and immediate failure reports are enabled.
   */
  async checkImage(image, name, ignoreMismatch = false, retryTimeout = -1) {
    return this.check(name, Target.image(image).ignoreMismatch(ignoreMismatch).timeout(retryTimeout));
  }

  /**
   * Perform visual validation for the current image.
   *
   * @signature `checkRegion(base64String, region, name, ignoreMismatch, retryTimeout)`
   * @sigparam {string} base64String - A base64 encoded image to use as the checkpoint image
   * @sigparam {Region|RegionObject} region - The region of the image which should be verified, or {undefined}/{null} if the
   *   entire image should be verified.
   * @sigparam {string} [name] - Tag to be associated with the validation checkpoint.
   * @sigparam {boolean} [ignoreMismatch] - True if the server should ignore a negative result for the visual validation.
   * @sigparam {number} [retryTimeout] - timeout for performing the match (ms).
   *
   * @signature `checkRegion(url, region, name, ignoreMismatch, retryTimeout)`
   * @sigparam {string} url - A URL of the PNG image to download and use as the checkpoint image
   *
   * @signature `checkRegion(filePath, region, name, ignoreMismatch, retryTimeout)`
   * @sigparam {string} filePath - Path to a local PNG file to use as the checkpoint image
   *
   * @signature `checkRegion(imageBuffer, region, name, ignoreMismatch, retryTimeout)`
   * @sigparam {Buffer} imageBuffer - A Buffer object that contains an image to use as checkpoint image
   *
   * @signature `checkRegion(mutableImage, region, name, ignoreMismatch, retryTimeout)`
   * @sigparam {MutableImage} mutableImage - An in memory image to use as the checkpoint image
   *
   * @signature `checkRegion(imageProvider, region, name, ignoreMismatch, retryTimeout)`
   * @sigparam {ImageProvider} imageProvider - An instance of class (object) which implements {@link ImageProvider}
   *  (has a method called {@code getImage} which returns {@code Promise<MutableImage>})
   *
   * @param {string|Buffer|ImageProvider|MutableImage} image - The image path, base64 string, image buffer or MutableImage.
   * @param {Region|RegionObject} region - The region of the image which should be verified, or {undefined}/{null} if the
   *   entire image should be verified.
   * @param {string} [name] - An optional tag to be associated with the validation checkpoint.
   * @param {boolean} [ignoreMismatch] - True if the server should ignore a negative result for the visual validation.
   * @param {number} [retryTimeout] - timeout for performing the match (ms).
   * @return {Promise<boolean>} - True if the image matched the expected output, false otherwise.
   * @throws {DiffsFoundError} Thrown if a mismatch is detected and immediate failure reports are enabled.
   */
  async checkRegion(image, region, name, ignoreMismatch = false, retryTimeout = -1) {
    return this.check(name, Target.region(image, region).ignoreMismatch(ignoreMismatch).timeout(retryTimeout));
  }

  /**
   * @param {string} name - An optional tag to be associated with the validation checkpoint.
   * @param {ImagesCheckSettings|CheckSettings} checkSettings - The settings to use when checking the image.
   * @return {Promise<boolean>} - A promise which is resolved when the validation is finished. Indicates whether
   *  matchResults was as expected or not.
   */
  async check(name, checkSettings) {
    ArgumentGuard.notNull(checkSettings, 'checkSettings');

    if (this.getIsDisabled()) {
      this._logger.verbose(`check('${name}', checkSettings): Ignored`);
      return false;
    }

    if (TypeUtils.isNotNull(name)) {
      checkSettings.withName(name);
    } else {
      name = checkSettings.getName();
    }

    try {
      let regionProvider = new NullRegionProvider();

      // Set the title to be linked to the screenshot.
      this._title = name;
      this._domString = checkSettings.getDomString();
      this._imageLocation = checkSettings.getImageLocation();

      if (checkSettings.getTargetRegion()) {
        regionProvider = new RegionProvider(checkSettings.getTargetRegion());
      }

      if (checkSettings.getImageUrl()) {
        this._screenshotUrl = checkSettings.getImageUrl();

        if (!this._viewportSizeHandler.get() && checkSettings.getImageSize()) {
          await this.setViewportSize(checkSettings.getImageSize());
        }
      } else if (checkSettings.getImageProvider()) {
        this._screenshotProvider = checkSettings.getImageProvider();
      } else {
        this._screenshot = await this._normalizeImage(checkSettings);

        if (!this._viewportSizeHandler.get()) {
          await this.setViewportSize(this._screenshot.getSize());
        }
      }

      const matchResult = await super.checkWindowBase(regionProvider, name, checkSettings.getIgnoreMismatch(), checkSettings);
      return matchResult.getAsExpected();
    } finally {
      this._title = undefined;
      this._domString = undefined;
      this._imageLocation = undefined;

      this._screenshot = undefined;
      this._screenshotUrl = undefined;
      this._screenshotProvider = undefined;
    }
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @private
   * @param {ImagesCheckSettings} checkSettings - The settings to use when checking the image.
   * @return {Promise<MutableImage>}
   */
  async _normalizeImage(checkSettings) {
    if (checkSettings.getMutableImage()) {
      return checkSettings.getMutableImage();
    }

    if (checkSettings.getImageBuffer()) {
      return new MutableImage(checkSettings.getImageBuffer());
    }

    if (checkSettings.getImageString()) {
      return new MutableImage(checkSettings.getImageString());
    }

    if (checkSettings.getImagePath()) {
      try {
        const data = await FileUtils.readToBuffer(checkSettings.getImagePath());
        return new MutableImage(data);
      } catch (err) {
        throw new EyesError(`Can't read image [${err.message}]`);
      }
    }

    throw new EyesError("Can't recognize supported image from checkSettings.");
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Replaces the actual image in a running session.
   *
   * @param {number} stepIndex - The zero based index of the step in which to replace the image.
   * @param {string|Buffer|MutableImage} image - The image base64 string, image buffer or MutableImage.
   * @param {string} [tag] - A tag to be associated with the validation checkpoint.
   * @param {string} [title] - A title to be associated with the validation checkpoint.
   * @param {Trigger[]} [userInputs] - An array of user inputs to which lead to the validation checkpoint.
   * @return {Promise<boolean>} - True if the image matched the expected output, false otherwise.
   * @throws {DiffsFoundError} Thrown if a mismatch is detected and immediate failure reports are enabled.
   */
  async replaceImage(stepIndex, image, tag, title, userInputs) {
    ArgumentGuard.notNull(stepIndex, 'stepIndex');
    ArgumentGuard.notNull(image, 'image');

    if (this.getIsDisabled()) {
      this._logger.verbose(`replaceImage('${stepIndex}', Image, '${tag}', '${title}', '${userInputs}'): Ignored`);
      return false;
    }

    if (TypeUtils.isBuffer(image) || TypeUtils.isString(image)) {
      image = new MutableImage(image);
    }

    this._logger.verbose(`replaceImage('${stepIndex}', Image, '${tag}', '${title}', '${userInputs}')`);
    const results = await super.replaceWindow(stepIndex, image, tag, title, userInputs);
    return results.getAsExpected();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Adds a mouse trigger.
   *
   * @param {MouseTrigger.MouseAction} action  Mouse action.
   * @param {Region} control - The control on which the trigger is activated (context relative coordinates).
   * @param {Location} cursor  The cursor's position relative to the control.
   */
  addMouseTrigger(action, control, cursor) {
    super.addMouseTriggerBase(action, control, cursor);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Adds a keyboard trigger.
   *
   * @param {Region} control - The control's context-relative region.
   * @param {string} text - The trigger's text.
   */
  addTextTrigger(control, text) {
    super.addTextTriggerBase(control, text);
  }

  /**
   * @inheritDoc
   */
  async getViewportSize() {
    return this._viewportSizeHandler.get();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Set the viewport size.
   *
   * @param {RectangleSize|RectangleSizeObject} viewportSize - The required viewport size.
   * @return {Promise}
   */
  async setViewportSize(viewportSize) {
    ArgumentGuard.notNull(viewportSize, 'size');

    this._viewportSizeHandler.set(new RectangleSize(viewportSize));
  }

  /**
   * @inheritDoc
   */
  async getInferredEnvironment() {
    return this._inferred;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Sets the inferred environment for the test.
   *
   * @param {string} inferred - The inferred environment string.
   */
  setInferredEnvironment(inferred) {
    this._inferred = inferred;
  }

  /**
   * @inheritDoc
   */
  async getScreenshot() {
    if (this._screenshotProvider) {
      const screenshot = await this._screenshotProvider.getImage();
      return new EyesSimpleScreenshot(screenshot);
    }

    if (this._screenshot) {
      return new EyesSimpleScreenshot(this._screenshot);
    }

    return undefined;
  }

  /**
   * @inheritDoc
   */
  async getScreenshotUrl() {
    return this._screenshotUrl;
  }

  /**
   * @inheritDoc
   */
  async tryCaptureDom() {
    return this._domString;
  }

  /**
   * @inheritDoc
   */
  async getImageLocation() {
    return this._imageLocation;
  }

  /**
   * @inheritDoc
   */
  async getTitle() {
    return this._title;
  }
}

exports.Eyes = Eyes;
