'use strict';

const _merge = require('deepmerge');
const dateFormat = require('dateformat');

const { TypeUtils } = require('./TypeUtils');

const merge = _merge.default ? _merge.default : _merge;
const DATE_FORMAT_ISO8601 = "yyyy-mm-dd'T'HH:MM:ss'Z'";
const DATE_FORMAT_RFC1123 = "ddd, dd mmm yyyy HH:MM:ss 'GMT'";
const DATE_FORMAT_LOGFILE = 'yyyy_mm_dd_HH_MM_ss_l';

/**
 * Collection of utility methods.
 */
class GeneralUtils {
  /**
   * Concatenate the url to the suffixes - making sure there are no double slashes
   *
   * @param {string} url The left side of the URL.
   * @param {string...} suffixes The right side.
   * @return {string} the URL
   */
  static urlConcat(url, ...suffixes) {
    let concatUrl = GeneralUtils.stripTrailingSlash(url);

    for (let i = 0, l = suffixes.length; i < l; i += 1) {
      /** @type {string} */
      const suffix = String(suffixes[i]);
      if (!suffix.startsWith('/') && !(i === l - 1 && suffix.startsWith('?'))) {
        concatUrl += '/';
      }
      concatUrl += GeneralUtils.stripTrailingSlash(suffix);
    }

    return concatUrl;
  }

  /**
   * If given URL ends with '/', the method with cut it and return URL without it
   *
   * @param {string} url
   * @return {string}
   */
  static stripTrailingSlash(url) {
    return url.endsWith('/') ? url.slice(0, -1) : url;
  }

  /**
   * Check if an URL is absolute
   *
   * @param {string} url
   * @return {boolean} the URL
   */
  static isAbsoluteUrl(url) {
    return /^[a-z][a-z0-9+.-]*:/.test(url);
  }

  /**
   * Convert object into json string
   *
   * @param {object} object
   * @param {string[]} [exclude]
   * @return {string}
   */
  static toString(object, exclude = []) {
    if (!TypeUtils.isPlainObject(object)) {
      object = GeneralUtils.toPlain(object, exclude);
    }

    return JSON.stringify(object);
  }

  /**
   * Convert a class to plain object
   * Makes all private properties public (remove '_' char from prop names)
   *
   * @param {object} object
   * @param {string[]} [exclude]
   * @param {object} [rename]
   * @return {object}
   */
  static toPlain(object, exclude = [], rename = {}) {
    if (object == null) {
      throw new TypeError('Cannot make null plain.');
    }

    const plainObject = {};
    Object.keys(object).forEach(objectKey => {
      let publicKey = objectKey.replace('_', '');
      if (rename[publicKey]) {
        publicKey = rename[publicKey];
      }

      if (Object.prototype.hasOwnProperty.call(object, objectKey) && !exclude.includes(objectKey)) {
        if (object[objectKey] instanceof Object && typeof object[objectKey].toJSON === 'function') {
          plainObject[publicKey] = object[objectKey].toJSON();
        } else {
          plainObject[publicKey] = object[objectKey];
        }
      }
    });
    return plainObject;
  }

  /**
   * Merge two objects x and y deeply, returning a new merged object with the elements from both x and y.
   * If an element at the same key is present for both x and y, the value from y will appear in the result.
   * Merging creates a new object, so that neither x or y are be modified.
   * @see package 'deepmerge'
   *
   * @param {object} x
   * @param {object} y
   * @return {object}
   */
  static mergeDeep(x, y) {
    return merge(x, y, { isMergeableObject: TypeUtils.isPlainObject });
  }

  /**
   * Generate GUID
   *
   * @return {string}
   */
  static guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      // noinspection MagicNumberJS, NonShortCircuitBooleanExpressionJS
      const r = (Math.random() * 16) | 0; // eslint-disable-line no-bitwise
      // noinspection MagicNumberJS, NonShortCircuitBooleanExpressionJS
      const v = c === 'x' ? r : (r & 0x3) | 0x8; // eslint-disable-line no-bitwise
      return v.toString(16);
    });
  }

  /**
   * Waits a specified amount of time before resolving the returned promise.
   *
   * @param {number} ms The amount of time to sleep in milliseconds.
   * @return {Promise<void>} A promise which is resolved when sleep is done.
   */
  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Convert a Date object to a ISO-8601 date string
   *
   * @param {Date} [date] Date which will be converted
   * @return {string} string formatted as ISO-8601 (yyyy-MM-dd'T'HH:mm:ss'Z')
   */
  static toISO8601DateTime(date = new Date()) {
    return dateFormat(date, DATE_FORMAT_ISO8601, true);
  }

  /**
   * Convert a Date object to a RFC-1123 date string
   *
   * @param {Date} [date] Date which will be converted
   * @return {string} string formatted as RFC-1123 (E, dd MMM yyyy HH:mm:ss 'GMT')
   */
  static toRfc1123DateTime(date = new Date()) {
    return dateFormat(date, DATE_FORMAT_RFC1123, true);
  }

  /**
   * Convert a Date object to a RFC-1123 date string
   *
   * @param {Date} [date] Date which will be converted
   * @return {string} string formatted as RFC-1123 (E, dd MMM yyyy HH:mm:ss 'GMT')
   */
  static toLogFileDateTime(date = new Date()) {
    return dateFormat(date, DATE_FORMAT_LOGFILE, false);
  }

  /**
   * Creates {@link Date} instance from an ISO 8601 formatted string.
   *
   * @param {string} dateTime An ISO 8601 formatted string.
   * @return {Date} A {@link Date} instance representing the given date and time.
   */
  static fromISO8601DateTime(dateTime) {
    return new Date(dateTime);
  }

  /**
   * Convert object(s) to a string
   *
   * @param {*} args
   * @return {string}
   */
  static stringify(...args) {
    return args
      .map(arg => {
        if (arg != null && typeof arg === 'object') {
          if (arg.constructor !== Object) {
            // Not plain object
            if (arg instanceof Error && arg.stack) {
              return arg.stack;
            }

            if (typeof arg.toString === 'function' && arg.toString !== Object.prototype.toString) {
              return arg.toString();
            }
          }

          return JSON.stringify(arg);
        }

        return arg;
      })
      .join(' ');
  }

  /**
   * Simple method that decode JSON Web Tokens
   *
   * @param {string} token
   * @return {object}
   */
  static jwtDecode(token) {
    let payloadSeg = token.split('.')[1];
    payloadSeg += new Array(5 - (payloadSeg.length % 4)).join('=');
    payloadSeg = payloadSeg.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(Buffer.from(payloadSeg, 'base64').toString());
  }

  /**
   * Cartesian product of arrays
   *
   * @param {...(Array|Object)} arrays Variable number of arrays of n elements
   * @return {Array<Array>} Product of arrays as an array of X arrays of N elements,
   *   where X is the product of the input arrays' lengths
   */
  static cartesianProduct(...arrays) {
    const getArrayOf = a => (Array.isArray(a) ? a : [a]);
    const prod2 = (a, b) => getArrayOf(b).map(e1 => a.map(e2 => [e1, ...e2])).reduce((arr, e) => arr.concat(e), []);
    const prod = (a, ...rest) => (rest.length > 0 ? prod(prod2(a, rest.pop()), ...rest) : a);
    return prod([[]], ...arrays);
  }
}

exports.GeneralUtils = GeneralUtils;
