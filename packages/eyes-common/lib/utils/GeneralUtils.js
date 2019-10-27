'use strict';

const merge = require('deepmerge');
// const util = require('util');

const { TypeUtils } = require('./TypeUtils');
const { DateTimeUtils } = require('./DateTimeUtils');

const ENV_PREFIXES = ['APPLITOOLS_', 'bamboo_APPLITOOLS_'];
const ALPHANUMERIC_MASK = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Collection of utility methods.
 *
 * @ignore
 */
class GeneralUtils {
  /**
   * Concatenate the url to the suffixes - making sure there are no double slashes
   *
   * @param {string} url - The left side of the URL.
   * @param {...string} suffixes - The right side.
   * @return {string} - the URL
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
   * @return {boolean} - the URL
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

    try {
      return JSON.stringify(object);
    } catch (err) {
      console.warn("Error during writing log:", err); // eslint-disable-line
      // console.warn(util.inspect(object, {depth: null, colors: true})); // eslint-disable-line
      return undefined;
    }
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
    Object.keys(object).forEach((objectKey) => {
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
   * @template TFirst
   * @template TSecond
   * @param {TFirst} target
   * @param {TSecond} source
   * @return {TFirst|TSecond}
   */
  static mergeDeep(target, source) {
    return merge(target, source, { isMergeableObject: TypeUtils.isPlainObject });
  }

  /**
   * Generate GUID
   *
   * @return {string}
   */
  static guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      // noinspection MagicNumberJS, NonShortCircuitBooleanExpressionJS
      const r = (Math.random() * 16) | 0; // eslint-disable-line no-bitwise
      // noinspection MagicNumberJS, NonShortCircuitBooleanExpressionJS
      const v = c === 'x' ? r : (r & 0x3) | 0x8; // eslint-disable-line no-bitwise
      return v.toString(16);
    });
  }

  /**
   * Generate random alphanumeric sequence
   *
   * @return {string}
   */
  static randomAlphanumeric(length = 8) {
    let res = '';
    for (let i = 0; i < length; i += 1) {
      res += ALPHANUMERIC_MASK.charAt(Math.floor(Math.random() * ALPHANUMERIC_MASK.length));
    }
    return res;
  }

  /**
   * Waits a specified amount of time before resolving the returned promise.
   *
   * @param {number} ms - The amount of time to sleep in milliseconds.
   * @return {Promise} - A promise which is resolved when sleep is done.
   */
  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Convert a Date object to a ISO-8601 date string
   *
   * @deprecated Use {@link DateTimeUtils.toISO8601DateTime} instead
   * @param {Date} [date] - Date which will be converted
   * @return {string} - string formatted as ISO-8601 (yyyy-MM-dd'T'HH:mm:ss'Z')
   */
  static toISO8601DateTime(date) {
    return DateTimeUtils.toISO8601DateTime(date);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Convert a Date object to a RFC-1123 date string
   *
   * @deprecated Use {@link DateTimeUtils.toRfc1123DateTime} instead
   * @param {Date} [date] - Date which will be converted
   * @return {string} - string formatted as RFC-1123 (E, dd MMM yyyy HH:mm:ss 'GMT')
   */
  static toRfc1123DateTime(date) {
    return DateTimeUtils.toRfc1123DateTime(date);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Convert a Date object to a RFC-1123 date string
   *
   * @deprecated Use {@link DateTimeUtils.toLogFileDateTime} instead
   * @param {Date} [date] - Date which will be converted
   * @return {string} - string formatted as RFC-1123 (E, dd MMM yyyy HH:mm:ss 'GMT')
   */
  static toLogFileDateTime(date) {
    return DateTimeUtils.toLogFileDateTime(date);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Creates {@link Date} instance from an ISO 8601 formatted string.
   *
   * @deprecated Use {@link DateTimeUtils.fromISO8601DateTime} instead
   * @param {string} dateTime - An ISO 8601 formatted string.
   * @return {Date} - A {@link Date} instance representing the given date and time.
   */
  static fromISO8601DateTime(dateTime) {
    return DateTimeUtils.fromISO8601DateTime(dateTime);
  }

  /**
   * Convert object(s) to a string
   *
   * @param {*} args
   * @return {string}
   */
  static stringify(...args) {
    return args.map((arg) => {
      if (arg != null && typeof arg === 'object') {
        if (arg.constructor !== Object) {
          // Not plain object
          if (arg instanceof Error && arg.stack) {
            return arg.stack;
          }

          if (arg instanceof Array && arg.length) {
            return `[${arg.map(i => GeneralUtils.stringify(i)).join(',')}]`;
          }

          if (typeof arg.toString === 'function' && arg.toString !== Object.prototype.toString) {
            return arg.toString();
          }
        }

        return GeneralUtils.toString(arg);
      }

      return arg;
    }).join(' ');
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
   * @param {...(Array|Object)} arrays - Variable number of arrays of n elements
   * @return {Array<Array>} - Product of arrays as an array of X arrays of N elements,
   *   where X is the product of the input arrays' lengths
   */
  static cartesianProduct(...arrays) {
    const getArrayOf = a => (Array.isArray(a) ? a : [a]);
    const prod2 = (a, b) => getArrayOf(b).map(e1 => a.map(e2 => [e1, ...e2])).reduce((arr, e) => arr.concat(e), []);
    const prod = (a, ...rest) => (rest.length > 0 ? prod(prod2(a, rest.pop()), ...rest) : a);
    return prod([[]], ...arrays);
  }

  /**
   * Get a property of the object by a path string
   *
   * @param {object} object - The object to query.
   * @param {string} path - The path of a property (example: "foo.bar.baz" ).
   * @return {*|undefined} - The value of the given property or `undefined` if the property is not exists.
   */
  static getPropertyByPath(object, path) {
    if (!object || !/^([a-zA-Z0-9-_.]+\.)*[a-zA-Z0-9-_.]+$/.test(path)) {
      return undefined; // TODO: may be we can throw an error if path is given in wrong format
    }

    let val = object;
    for (const key of path.split('.')) {
      val = typeof val === 'object' ? val[key] : undefined;
      if (val === undefined) {
        return undefined;
      }
    }

    return val;
  }

  /**
   * Get an environment property by property name
   *
   * @param {string} propName The property name to look up
   * @param {boolean=false} isBoolean Whether or not the value should be converted to boolean type
   * @return {*|undefined} - The value of the given property or `undefined` if the property is not exists.
   */
  static getEnvValue(propName, isBoolean = false) {
    if (process !== undefined) {
      for (const prefix of ENV_PREFIXES) {
        const value = process.env[prefix + propName];
        if (value !== undefined) {
          // for boolean values, cast string value
          if (isBoolean && !TypeUtils.isBoolean(value)) {
            return value === 'true';
          }

          return value;
        }
      }
    }

    return undefined;
  }
}

exports.GeneralUtils = GeneralUtils;
