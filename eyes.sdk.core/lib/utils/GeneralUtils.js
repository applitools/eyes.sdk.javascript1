'use strict';

const merge = require('deepmerge');
const dateformat = require('dateformat');
const stackTrace = require('stack-trace');

const DATE_FORMAT_ISO8601_FOR_OUTPUT = "yyyy-mm-dd'T'HH:MM:ss'Z'";
const DATE_FORMAT_RFC1123 = "ddd, dd mmm yyyy HH:MM:ss 'GMT'";

const BASE64_CHARS_PATTERN = /[^A-Z0-9+/=]/i;

const MS_IN_S = 1000;
const MS_IN_M = 60000;

const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * @private
 * @param {object} to
 * @param {object} from
 * @param {string} fnName
 */
const mixin = (to, from, fnName) => {
  to[fnName] = () => from[fnName](...arguments);
};

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

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {object} object
   * @return {string}
   * @deprecated use GeneralUtils.toString instead
   */
  static toJson(object) {
    return GeneralUtils.toString(object);
  }

  /**
   * Convert object into json string
   *
   * @param {object} object
   * @param {string[]} [exclude]
   * @return {string}
   */
  static toString(object, exclude = []) {
    if (!GeneralUtils.isPlainObject(object)) {
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
      if (rename[publicKey]) publicKey = rename[publicKey];

      if (hasOwnProperty.call(object, objectKey) && !exclude.includes(objectKey)) {
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
   * Assign all properties of the object that exists in the instance to it
   *
   * @template T
   * @param {T} inst
   * @param {object} object
   * @param {object} [mapping]
   * @return {T}
   */
  static assignTo(inst, object, mapping = {}) {
    if (inst == null) {
      throw new TypeError('Cannot assign object to null.');
    }

    if (object == null) {
      throw new TypeError('Cannot assign empty object or null.');
    }

    Object.keys(object).forEach(objectKey => {
      const privateKey = `_${objectKey}`;
      if (
        hasOwnProperty.call(object, objectKey) &&
        hasOwnProperty.call(inst, privateKey)
      ) {
        if (hasOwnProperty.call(mapping, objectKey)) {
          inst[privateKey] = mapping[objectKey].call(null, object[objectKey]);
        } else {
          inst[privateKey] = object[objectKey];
        }
      }
    });

    return inst;
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
    return merge(x, y, { isMergeableObject: GeneralUtils.isPlainObject });
  }

  /**
   * Mixin methods from one object into another.
   * Follow the prototype chain and apply form root to current - but skip the top (object)
   *
   * @param {object} to The object to which methods will be added
   * @param {object} from The object from which methods will be copied
   */
  static mixin(to, from) {
    let index;
    let proto = from;
    const protos = [];
    while (proto) {
      protos.push(Object.getOwnPropertyNames(proto));
      proto = Object.getPrototypeOf(proto);
    }

    for (index = protos.length - 2; index >= 0; index -= 1) {
      protos[index].forEach(method => {
        if (!to[method] && typeof from[method] === 'function' && method !== 'constructor') {
          mixin(to, from, method);
        }
      });
    }
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
   * Clone object
   *
   * @param {Date|Array|object} obj
   * @return {*}
   */
  static clone(obj) {
    // noinspection EqualityComparisonWithCoercionJS
    if (obj == null || typeof obj !== 'object') {
      return obj;
    }

    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }

    if (obj instanceof Array) {
      return Array.from(obj);
    }

    if (obj instanceof Object) {
      const copy = obj.constructor();
      Object.keys(obj).forEach(attr => {
        if (Object.prototype.hasOwnProperty.call(obj, attr)) {
          copy[attr] = GeneralUtils.clone(obj[attr]);
        }
      });
      return copy;
    }

    throw new Error("Unable to copy object! Its type isn't supported.");
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
    return dateformat(date, DATE_FORMAT_ISO8601_FOR_OUTPUT, true);
  }

  /**
   * Convert a Date object to a RFC-1123 date string
   *
   * @param {Date} [date] Date which will be converted
   * @return {string} string formatted as RFC-1123 (E, dd MMM yyyy HH:mm:ss 'GMT')
   */
  static toRfc1123DateTime(date = new Date()) {
    return dateformat(date, DATE_FORMAT_RFC1123, true);
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
   * Format elapsed time by template (#m #s #ms)
   *
   * @param {number} elapsedMs
   * @return {string} formatted string
   */
  static elapsedString(elapsedMs) {
    const min = Math.floor(elapsedMs / MS_IN_M);
    if (min > 0) {
      elapsedMs -= min * MS_IN_M;
    }
    const sec = Math.floor(elapsedMs / MS_IN_S);
    if (sec > 0) {
      elapsedMs -= sec * MS_IN_S;
    }

    if (min > 0) {
      return `${min}m ${sec}s ${elapsedMs}ms`;
    }
    return `${sec}s ${elapsedMs}ms`;
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
   * @return {number}
   */
  static currentTimeMillis() {
    return Date.now();
  }

  /**
   * @param value
   * @return {boolean}
   */
  static isString(value) {
    return typeof value === 'string' || value instanceof String;
  }

  /**
   * @param value
   * @return {boolean}
   */
  static isNumber(value) {
    return typeof value === 'number' || value instanceof Number;
  }

  /**
   * @param value
   * @return {boolean}
   */
  static isBoolean(value) {
    return typeof value === 'boolean' || value instanceof Boolean;
  }

  /**
   * @param value
   * @return {boolean}
   */
  static isObject(value) {
    return value != null && typeof value === 'object' && Array.isArray(value) === false;
  }

  /**
   * @param value
   * @return {boolean}
   */
  static isPlainObject(value) {
    return GeneralUtils.isObject(value) && value.constructor === Object;
  }

  /**
   * @param value
   * @return {boolean}
   */
  static isArray(value) {
    return Array.isArray(value);
  }

  /**
   * @param value
   * @return {boolean}
   */
  static isBuffer(value) {
    return (
      value != null &&
      !!value.constructor &&
      typeof value.constructor.isBuffer === 'function' &&
      value.constructor.isBuffer(value)
    );
  }

  static isBase64(str) {
    if (!GeneralUtils.isString(str)) {
      return false;
    }

    const len = str.length;
    if (!len || len % 4 !== 0 || BASE64_CHARS_PATTERN.test(str)) {
      return false;
    }

    const firstPaddingChar = str.indexOf('=');
    return (
      firstPaddingChar === -1 || firstPaddingChar === len - 1 || (firstPaddingChar === len - 2 && str[len - 1] === '=')
    );
  }

  /**
   * @typedef {object} CallSite
   * @property {function} getTypeName returns the type of this as a string.
   * @property {function} getFunctionName returns the name of the current function, typically its name property.
   * @property {function} getMethodName returns the name of the property of this or one of its prototypes that holds
   *   the current function
   * @property {function} getFileName if this function was defined in a script returns the name of the script
   * @property {function} getLineNumber if this function was defined in a script returns the current line number
   * @property {function} getColumnNumber if this function was defined in a script returns the current column number
   * @property {function} isNative is this call in native V8 code?
   *
   * @return {CallSite[]}
   */
  static getStackTrace() {
    return stackTrace.get();
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
}

exports.GeneralUtils = GeneralUtils;
