'use strict';

const { EyesError, RectangleSize, Location, ArgumentGuard, GeneralUtils } = require('@applitools/eyes-common');

const JS_GET_VIEWPORT_SIZE =
  'var height, width; ' +
  'if (window.innerHeight) { height = window.innerHeight; } ' +
  'else if (document.documentElement && document.documentElement.clientHeight) { height = document.documentElement.clientHeight; } ' +
  'else { var b = document.getElementsByTagName("body")[0]; if (b.clientHeight) {height = b.clientHeight;} }; ' +
  'if (window.innerWidth) { width = window.innerWidth; } ' +
  'else if (document.documentElement && document.documentElement.clientWidth) { width = document.documentElement.clientWidth; } ' +
  'else { var b = document.getElementsByTagName("body")[0]; if (b.clientWidth) { width = b.clientWidth;} }; ' +
  'return [width, height];';

const JS_GET_CURRENT_SCROLL_POSITION =
  'var doc = document.documentElement; ' +
  'var x = window.scrollX || ((window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)); ' +
  'var y = window.scrollY || ((window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)); ' +
  'return [x, y];';

// IMPORTANT: Notice there's a major difference between scrollWidth and scrollHeight.
// While scrollWidth is the maximum between an element's width and its content width,
// scrollHeight might be smaller (!) than the clientHeight, which is why we take the maximum between them.
const JS_COMPUTE_CONTENT_ENTIRE_SIZE =
  'var scrollWidth = document.documentElement.scrollWidth; ' +
  'var bodyScrollWidth = document.body.scrollWidth; ' +
  'var totalWidth = Math.max(scrollWidth, bodyScrollWidth); ' +
  'var clientHeight = document.documentElement.clientHeight; ' +
  'var bodyClientHeight = document.body.clientHeight; ' +
  'var scrollHeight = document.documentElement.scrollHeight; ' +
  'var bodyScrollHeight = document.body.scrollHeight; ' +
  'var maxDocElementHeight = Math.max(clientHeight, scrollHeight); ' +
  'var maxBodyHeight = Math.max(bodyClientHeight, bodyScrollHeight); ' +
  'var totalHeight = Math.max(maxDocElementHeight, maxBodyHeight); ';

const JS_RETURN_CONTENT_ENTIRE_SIZE = `${JS_COMPUTE_CONTENT_ENTIRE_SIZE}return [totalWidth, totalHeight];`;

const JS_SCROLL_TO_BOTTOM_RIGHT = `${JS_COMPUTE_CONTENT_ENTIRE_SIZE}window.scrollTo(totalWidth, totalHeight);`;

const JS_GET_OVERFLOW_AWARE_CONTENT_ENTIRE_SIZE =
  'var scrollWidth = document.documentElement.scrollWidth; ' +
  'var bodyScrollWidth = document.body.scrollWidth; ' +
  'var bodyOverflowX = window.getComputedStyle(document.body).overflowX;' +
  'var documentOverflowX = window.getComputedStyle(document.documentElement).overflowX;' +
  'var totalWidth = undefined;' +
  'if (bodyOverflowX !== "hidden" && documentOverflowX !== "hidden")' +
  '{ totalWidth = Math.max(scrollWidth, bodyScrollWidth); }' +
  'else if (bodyOverflowX !== "hidden" && documentOverflowX === "hidden")' +
  '{ totalWidth = bodyScrollWidth; }' +
  'else if (bodyOverflowX === "hidden" && documentOverflowX !== "hidden")' +
  '{ totalWidth = scrollWidth; }' +
  'else if (bodyOverflowX === "hidden" && documentOverflowX === "hidden")' +
  '{ totalWidth = window.innerWidth; }' +
  'var clientHeight = document.documentElement.clientHeight; ' +
  'var bodyClientHeight = document.body.clientHeight; ' +
  'var scrollHeight = document.documentElement.scrollHeight; ' +
  'var bodyScrollHeight = document.body.scrollHeight; ' +
  'var maxDocElementHeight = Math.max(clientHeight, scrollHeight); ' +
  'var maxBodyHeight = Math.max(bodyClientHeight, bodyScrollHeight); ' +
  'var bodyOverflowY = window.getComputedStyle(document.body).overflowY;' +
  'var documentOverflowY = window.getComputedStyle(document.documentElement).overflowY;' +
  'var totalHeight = undefined;' +
  'if (bodyOverflowY !== "hidden" && documentOverflowY !== "hidden")' +
  '{ totalHeight = Math.max(maxDocElementHeight, maxBodyHeight); }' +
  'else if (bodyOverflowY !== "hidden" && documentOverflowY === "hidden")' +
  '{ totalHeight = maxBodyHeight; }' +
  'else if (bodyOverflowY === "hidden" && documentOverflowY !== "hidden")' +
  '{ totalHeight = maxDocElementHeight; }' +
  'else if (bodyOverflowY === "hidden" && documentOverflowY === "hidden")' +
  '{ totalHeight = window.innerHeight; }' +
  'return [totalWidth, totalHeight];';

const JS_TRANSFORM_KEYS = ['transform', '-webkit-transform'];

/**
 * Handles browser related functionality.
 *
 * @ignore
 */
class EyesJsBrowserUtils {
  /**
   * Sets the overflow of the current context's document element.
   *
   * @param {EyesJsExecutor} executor - The executor to use.
   * @param {?string} value - The overflow value to set.
   * @param {WebElement} [rootElement]
   * @return {Promise<string>} - The previous value of overflow (could be {@code null} if undefined).
   */
  static async setOverflow(executor, value, rootElement) {
    ArgumentGuard.notNull(executor, 'executor');
    ArgumentGuard.notNull(rootElement, 'rootElement');

    const script = `var el = arguments[0]; var origOverflow = el.style.overflow; var newOverflow = '${value}'; ` +
      'el.style.overflow = newOverflow; ' +
      'if (newOverflow.toUpperCase() === \'HIDDEN\' && origOverflow.toUpperCase() !== \'HIDDEN\') { el.setAttribute(\'data-applitools-original-overflow\', origOverflow); } ' +
      'return origOverflow;';

    try {
      const result = await executor.executeScript(script, rootElement);
      await GeneralUtils.sleep(200);
      return result;
    } catch (err) {
      throw new EyesError('Failed to set overflow', err);
    }
  }

  /**
   * Hides the scrollbars of the current context's document element.
   *
   * @param {EyesJsExecutor} executor - The executor to use.
   * @param {number} stabilizationTimeout - The amount of time to wait for the "hide scrollbars" action to take effect
   *   (Milliseconds). Zero/negative values are ignored.
   * @param {WebElement} [scrollbarsRoot]
   * @return {Promise<string>} - The previous value of the overflow property (could be {@code null}).
   */
  static async hideScrollbars(executor, stabilizationTimeout, scrollbarsRoot) {
    const result = await EyesJsBrowserUtils.setOverflow(executor, 'hidden', scrollbarsRoot);
    if (stabilizationTimeout > 0) {
      await executor.sleep(stabilizationTimeout);
    }
    return result;
  }

  /**
   * Gets the current scroll position.
   *
   * @param {EyesJsExecutor} executor - The executor to use.
   * @return {Promise<Location>} - The current scroll position of the current frame.
   */
  static async getCurrentScrollPosition(executor) {
    const result = await executor.executeScript(JS_GET_CURRENT_SCROLL_POSITION);
    return new Location(Math.ceil(result[0]) || 0, Math.ceil(result[1]) || 0);
  }

  /**
   * Sets the scroll position of the current frame.
   *
   * @param {EyesJsExecutor} executor - The executor to use.
   * @param {Location} location - Location to scroll to
   * @return {Promise} - A promise which resolves after the action is performed and timeout passed.
   */
  static setCurrentScrollPosition(executor, location) {
    return executor.executeScript(`window.scrollTo(${location.getX()}, ${location.getY()})`);
  }

  /**
   * Scrolls current frame to its bottom right.
   *
   * @param {EyesJsExecutor} executor - The executor to use.
   * @return {Promise} - A promise which resolves after the action is performed and timeout passed.
   */
  static scrollToBottomRight(executor) {
    return executor.executeScript(JS_SCROLL_TO_BOTTOM_RIGHT);
  }

  /**
   * Get the entire page size.
   *
   * @param {EyesJsExecutor} executor - The executor to use.
   * @return {Promise<RectangleSize>} - A promise which resolves to an object containing the width/height of the page.
   */
  static async getCurrentFrameContentEntireSize(executor) {
    // IMPORTANT: Notice there's a major difference between scrollWidth and scrollHeight.
    // While scrollWidth is the maximum between an element's width and its content width,
    // scrollHeight might be smaller (!) than the clientHeight, which is why we take the maximum between them.
    try {
      const result = await executor.executeScript(JS_RETURN_CONTENT_ENTIRE_SIZE);
      return new RectangleSize(parseInt(result[0], 10) || 0, parseInt(result[1], 10) || 0);
    } catch (err) {
      throw new EyesError('Failed to extract entire size!', err);
    }
  }

  /**
   * Get the entire page size.
   *
   * @param {EyesJsExecutor} executor - The executor to use.
   * @return {Promise<RectangleSize>} - A promise which resolves to an object containing the width/height of the page.
   */
  static async getOverflowAwareContentEntireSize(executor) {
    try {
      const result = await executor.executeScript(JS_GET_OVERFLOW_AWARE_CONTENT_ENTIRE_SIZE);
      return new RectangleSize(parseInt(result[0], 10) || 0, parseInt(result[1], 10) || 0);
    } catch (err) {
      throw new EyesError('Failed to extract overflow aware entire size!', err);
    }
  }

  /**
   * Tries to get the viewport size using Javascript. If fails, gets the entire browser window size!
   *
   * @param {EyesJsExecutor} executor - The executor to use.
   * @return {Promise<RectangleSize>} - The viewport size.
   */
  static async getViewportSize(executor) {
    const result = await executor.executeScript(JS_GET_VIEWPORT_SIZE);
    return new RectangleSize(parseInt(result[0], 10) || 0, parseInt(result[1], 10) || 0);
  }

  /**
   * Gets the device pixel ratio.
   *
   * @param {EyesJsExecutor} executor - The executor to use.
   * @return {Promise<number>} - A promise which resolves to the device pixel ratio (float type).
   */
  static async getDevicePixelRatio(executor) {
    const result = await executor.executeScript('return window.devicePixelRatio');
    return parseFloat(result);
  }

  /**
   * Get the current transform of page.
   *
   * @param {EyesJsExecutor} executor - The executor to use.
   * @return {Promise<Map<string, string>>} - A promise which resolves to the current transform value.
   */
  static getCurrentTransform(executor) {
    let script = 'return { ';
    for (let i = 0, l = JS_TRANSFORM_KEYS.length; i < l; i += 1) {
      script += `'${JS_TRANSFORM_KEYS[i]}': document.documentElement.style['${JS_TRANSFORM_KEYS[i]}'],`;
    }
    script += ' }';
    return executor.executeScript(script);
  }

  /**
   * Sets transforms for document.documentElement according to the given map of style keys and values.
   *
   * @param {EyesJsExecutor} executor - The executor to use.
   * @param {Map<string, string>} transforms - The transforms to set. Keys are used as style keys and values are the
   *   values for those styles.
   * @return {Promise}
   */
  static setTransforms(executor, transforms) {
    let script = '';
    Object.keys(transforms).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(transforms, key)) {
        script += `document.documentElement.style['${key}'] = '${transforms[key]}';`;
      }
    });
    return executor.executeScript(script);
  }

  /**
   * Set the given transform to document.documentElement for all style keys defined in {@link JS_TRANSFORM_KEYS}
   *
   * @param {EyesJsExecutor} executor - The executor to use.
   * @param {string} transform - The transform to set.
   * @return {Promise} - A promise which resolves to the previous transform once the updated transform is set.
   */
  static setTransform(executor, transform) {
    if (!transform) {
      transform = '';
    }

    const transforms = {};
    for (let i = 0, l = JS_TRANSFORM_KEYS.length; i < l; i += 1) {
      transforms[JS_TRANSFORM_KEYS[i]] = transform;
    }

    return EyesJsBrowserUtils.setTransforms(executor, transforms);
  }

  /**
   * Translates the current documentElement to the given position.
   *
   * @param {EyesJsExecutor} executor - The executor to use.
   * @param {Location} position - The position to translate to.
   * @return {Promise} - A promise which resolves to the previous transform when the scroll is executed.
   */
  static translateTo(executor, position) {
    return EyesJsBrowserUtils.setTransform(executor, `translate(-${position.getX()}px, -${position.getY()}px)`);
  }
}

exports.EyesJsBrowserUtils = EyesJsBrowserUtils;
