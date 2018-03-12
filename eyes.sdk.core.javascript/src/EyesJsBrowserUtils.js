'use strict';

const EyesError = require('./errors/EyesError');
const RectangleSize = require('./geometry/RectangleSize');
const Location = require('./geometry/Location');

const JS_GET_VIEWPORT_SIZE =
    "var height = undefined; " +
    "var width = undefined; " +
    "if (window.innerHeight) { height = window.innerHeight; } " +
    "else if (document.documentElement && document.documentElement.clientHeight) { height = document.documentElement.clientHeight; } " +
    "else { var b = document.getElementsByTagName('body')[0]; if (b.clientHeight) {height = b.clientHeight;} }; " +
    "if (window.innerWidth) { width = window.innerWidth; } " +
    "else if (document.documentElement && document.documentElement.clientWidth) { width = document.documentElement.clientWidth; } " +
    "else { var b = document.getElementsByTagName('body')[0]; if (b.clientWidth) { width = b.clientWidth;} }; " +
    "return [width, height];";

const JS_GET_CURRENT_SCROLL_POSITION =
    "var doc = document.documentElement; " +
    "var x = window.scrollX || ((window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)); " +
    "var y = window.scrollY || ((window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)); " +
    "return [x, y];";

// IMPORTANT: Notice there's a major difference between scrollWidth and scrollHeight.
// While scrollWidth is the maximum between an element's width and its content width,
// scrollHeight might be smaller (!) than the clientHeight, which is why we take the maximum between them.
const JS_COMPUTE_CONTENT_ENTIRE_SIZE =
    "var scrollWidth = document.documentElement.scrollWidth; " +
    "var bodyScrollWidth = document.body.scrollWidth; " +
    "var totalWidth = Math.max(scrollWidth, bodyScrollWidth); " +
    "var clientHeight = document.documentElement.clientHeight; " +
    "var bodyClientHeight = document.body.clientHeight; " +
    "var scrollHeight = document.documentElement.scrollHeight; " +
    "var bodyScrollHeight = document.body.scrollHeight; " +
    "var maxDocElementHeight = Math.max(clientHeight, scrollHeight); " +
    "var maxBodyHeight = Math.max(bodyClientHeight, bodyScrollHeight); " +
    "var totalHeight = Math.max(maxDocElementHeight, maxBodyHeight); ";

const JS_RETURN_CONTENT_ENTIRE_SIZE = JS_COMPUTE_CONTENT_ENTIRE_SIZE + "return [totalWidth, totalHeight];";

const JS_SCROLL_TO_BOTTOM_RIGHT = JS_COMPUTE_CONTENT_ENTIRE_SIZE + "window.scrollTo(totalWidth, totalHeight);";

const JS_TRANSFORM_KEYS = ["transform", "-webkit-transform"];

const JS_GET_IS_BODY_OVERFLOW_HIDDEN =
    "var styles = window.getComputedStyle(document.body, null);" +
    "var overflow = styles.getPropertyValue('overflow');" +
    "var overflowX = styles.getPropertyValue('overflow-x');" +
    "var overflowY = styles.getPropertyValue('overflow-y');" +
    "return overflow == 'hidden' || overflowX == 'hidden' || overflowY == 'hidden'";

/**
 * Handles browser related functionality.
 */
class EyesJsBrowserUtils {

    /**
     * Sets the overflow of the current context's document element.
     *
     * @param {EyesJsExecutor} executor The executor to use.
     * @param {String} value The overflow value to set.
     * @return {Promise.<String>} The previous value of overflow (could be {@code null} if undefined).
     */
    static setOverflow(executor, value) {
        let script;
        if (value) {
            script =
                "var origOverflow = document.documentElement.style.overflow; " +
                "document.documentElement.style.overflow = \"" + value + "\"; " +
                "return origOverflow";
        } else {
            script =
                "var origOverflow = document.documentElement.style.overflow; " +
                "document.documentElement.style.overflow = undefined; " +
                "return origOverflow";
        }

        return executor.executeScript(script).catch(err => {
            throw new EyesError('Failed to set overflow', err);
        });
    }

    /**
     * @param {EyesJsExecutor} executor The executor to use.
     * @return {Promise.<Boolean>} A promise which resolves to the {@code true} if body overflow is hidden, {@code false} otherwise.
     */
    static isBodyOverflowHidden(executor) {
        return executor.executeScript(JS_GET_IS_BODY_OVERFLOW_HIDDEN).catch(err => {
            throw new EyesError('Failed to get state of body overflow', err);
        });
    }

    /**
     * Updates the document's body "overflow" value
     *
     * @param {EyesJsExecutor} executor The executor to use.
     * @param {String} overflowValue The values of the overflow to set.
     * @return {Promise.<String>} A promise which resolves to the original overflow of the document.
     */
    static setBodyOverflow(executor, overflowValue) {
        let script;
        if (overflowValue === null) {
            script =
                "var origOverflow = document.body.style.overflow; " +
                "document.body.style.overflow = undefined; " +
                "return origOverflow";
        } else {
            script =
                "var origOverflow = document.body.style.overflow; " +
                "document.body.style.overflow = \"" + overflowValue + "\"; " +
                "return origOverflow";
        }

        return executor.executeScript(script).catch(err => {
            throw new EyesError('Failed to set body overflow', err);
        });
    }

    /**
     * Hides the scrollbars of the current context's document element.
     *
     * @param {EyesJsExecutor} executor The executor to use.
     * @param {int} stabilizationTimeout The amount of time to wait for the "hide scrollbars" action to take effect (Milliseconds). Zero/negative values are ignored.
     * @return {Promise.<String>} The previous value of the overflow property (could be {@code null}).
     */
    static hideScrollbars(executor, stabilizationTimeout) {
        return EyesJsBrowserUtils.setOverflow(executor, "hidden").then(result => {
            if (stabilizationTimeout > 0) {
                return executor.sleep(stabilizationTimeout).then(() => result);
            }
            return result;
        });
    }

    /**
     * Gets the current scroll position.
     *
     * @param {EyesJsExecutor} executor The executor to use.
     * @return {Promise.<Location>} The current scroll position of the current frame.
     */
    static getCurrentScrollPosition(executor) {
        return executor.executeScript(JS_GET_CURRENT_SCROLL_POSITION).then(result => {
            // If we can't find the current scroll position, we use 0 as default.
            return new Location(Math.ceil(result[0]) || 0, Math.ceil(result[1]) || 0);
        });
    }

    /**
     * Sets the scroll position of the current frame.
     *
     * @param {EyesJsExecutor} executor The executor to use.
     * @param {Location} location Location to scroll to
     * @return {Promise} A promise which resolves after the action is performed and timeout passed.
     */
    static setCurrentScrollPosition(executor, location) {
        return executor.executeScript(`window.scrollTo(${location.getY()}, ${location.getY()})`);
    }

    /**
     * Scrolls current frame to its bottom right.
     *
     * @param {EyesJsExecutor} executor The executor to use.
     * @return {Promise} A promise which resolves after the action is performed and timeout passed.
     */
    static scrollToBottomRight(executor) {
        return executor.executeScript(JS_SCROLL_TO_BOTTOM_RIGHT);
    }

    /**
     * Get the entire page size.
     *
     * @param {EyesJsExecutor} executor The executor to use.
     * @return {Promise.<RectangleSize>} A promise which resolves to an object containing the width/height of the page.
     */
    static getCurrentFrameContentEntireSize(executor) {
        // IMPORTANT: Notice there's a major difference between scrollWidth and scrollHeight.
        // While scrollWidth is the maximum between an element's width and its content width,
        // scrollHeight might be smaller (!) than the clientHeight, which is why we take the maximum between them.
        return executor.executeScript(JS_RETURN_CONTENT_ENTIRE_SIZE).then(result => {
            return new RectangleSize(parseInt(result[0], 10) || 0, parseInt(result[1], 10) || 0);
        }).catch(err => {
            throw new EyesError("Failed to extract entire size!", err);
        });
    }

    /**
     * Tries to get the viewport size using Javascript. If fails, gets the entire browser window size!
     *
     * @param {EyesJsExecutor} executor The executor to use.
     * @return {Promise.<RectangleSize>} The viewport size.
     */
    static getViewportSize(executor) {
        return executor.executeScript(JS_GET_VIEWPORT_SIZE).then(result => {
            return new RectangleSize(parseInt(result[0], 10) || 0, parseInt(result[1], 10) || 0);
        });
    }

    /**
     * Gets the device pixel ratio.
     *
     * @param {EyesJsExecutor} executor The executor to use.
     * @return {Promise.<number>} A promise which resolves to the device pixel ratio (float type).
     */
    static getDevicePixelRatio(executor) {
        return executor.executeScript('return window.devicePixelRatio').then(result => {
            return parseFloat(result);
        });
    }

    /**
     * Get the current transform of page.
     *
     * @param {EyesJsExecutor} executor The executor to use.
     * @return {Promise.<Object.<String, String>>} A promise which resolves to the current transform value.
     */
    static getCurrentTransform(executor) {
        let script = "return { ";
        for (let i = 0, l = JS_TRANSFORM_KEYS.length; i < l; i++) {
            script += `'${JS_TRANSFORM_KEYS[i]}': document.documentElement.style['${JS_TRANSFORM_KEYS[i]}'],`;
        }
        script += " }";
        return executor.executeScript(script);
    }

    /**
     * Sets transforms for document.documentElement according to the given map of style keys and values.
     *
     * @param {EyesJsExecutor} executor The executor to use.
     * @param {Object.<String, String>} transforms The transforms to set. Keys are used as style keys and values are the values for those styles.
     * @return {Promise}
     */
    static setTransforms(executor, transforms) {
        let script = "";
        for (const key in transforms) {
            if (transforms.hasOwnProperty(key)) {
                script += `document.documentElement.style['${key}'] = '${transforms[key]}';`;
            }
        }
        return executor.executeScript(script);
    }

    /**
     * Set the given transform to document.documentElement for all style keys defined in {@link JS_TRANSFORM_KEYS}
     *
     * @param {EyesJsExecutor} executor The executor to use.
     * @param {String} transform The transform to set.
     * @return {Promise} A promise which resolves to the previous transform once the updated transform is set.
     */
    static setTransform(executor, transform) {
        const transforms = {};
        if (!transform) {
            transform = '';
        }

        for (let i = 0, l = JS_TRANSFORM_KEYS.length; i < l; i++) {
            transforms[JS_TRANSFORM_KEYS[i]] = transform;
        }

        return EyesJsBrowserUtils.setTransforms(executor, transforms);
    }

    /**
     * Translates the current documentElement to the given position.
     *
     * @param {EyesJsExecutor} executor The executor to use.
     * @param {Location} position The position to translate to.
     * @return {Promise} A promise which resolves to the previous transform when the scroll is executed.
     */
    static translateTo(executor, position) {
        return EyesJsBrowserUtils.setTransform(executor, `translate(-${position.getX()}px, -${position.getY()}px)`);
    }
}

module.exports = EyesJsBrowserUtils;
