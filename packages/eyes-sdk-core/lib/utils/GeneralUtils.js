'use strict'

const merge = require('deepmerge')
const {exec} = require('child_process')
const {promisify} = require('util')
const TypeUtils = require('./TypeUtils')
const DateTimeUtils = require('./DateTimeUtils')
const chalk = require('chalk')

const promisifiedExec = promisify && exec && promisify(exec)
const ENV_PREFIXES = ['APPLITOOLS_', 'bamboo_APPLITOOLS_']
const ALPHANUMERIC_MASK = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

/**
 * Concatenate the url to the suffixes - making sure there are no double slashes
 *
 * @param {string} url - The left side of the URL.
 * @param {...string} suffixes - The right side.
 * @return {string} - the URL
 */
function urlConcat(url, ...suffixes) {
  let concatUrl = stripTrailingSlash(url)

  for (let i = 0, l = suffixes.length; i < l; i += 1) {
    /** @type {string} */
    const suffix = String(suffixes[i])
    if (!suffix.startsWith('/') && !(i === l - 1 && suffix.startsWith('?'))) {
      concatUrl += '/'
    }
    concatUrl += stripTrailingSlash(suffix)
  }

  return concatUrl
}

/**
 * If given URL ends with '/', the method with cut it and return URL without it
 *
 * @param {string} url
 * @return {string}
 */
function stripTrailingSlash(url) {
  return url.endsWith('/') ? url.slice(0, -1) : url
}

/**
 * Check if an URL is absolute
 *
 * @param {string} url
 * @return {boolean} - the URL
 */
function isAbsoluteUrl(url) {
  return /^[a-z][a-z0-9+.-]*:/.test(url)
}

/**
 * Converts all arguments to a single string, used for logging
 *
 * @param {...*} args
 * @return {string}
 */
function stringify(...args) {
  return args.map(arg => stringifySingle(arg)).join(' ')
}

/**
 * Converts argument to string
 *
 * @param {*} arg
 * @return {string}
 */
function stringifySingle(arg) {
  if (TypeUtils.isObject(arg)) {
    if (!TypeUtils.isPlainObject(arg)) {
      if (arg instanceof Error && arg.stack) {
        return arg.stack
      }

      if (arg instanceof Date) {
        return arg.toISOString()
      }

      if (arg instanceof Array && arg.length) {
        return `[${arg.map(i => stringifySingle(i)).join(',')}]`
      }

      if (typeof arg.toString === 'function' && arg.toString !== Object.prototype.toString) {
        return arg.toString()
      }
    }

    return toString(arg)
  }

  return String(arg)
}

/**
 * Converts object or class to string, used within `toString` method of classes
 *
 * @param {object} object
 * @param {string[]} [exclude]
 * @return {string}
 */
function toString(object, exclude = []) {
  if (!TypeUtils.isPlainObject(object)) {
    object = toPlain(object, exclude)
  }

  try {
    return JSON.stringify(object)
  } catch (err) {
    console.warn("Error on converting to string:", err); // eslint-disable-line
    // console.warn(util.inspect(object, {depth: null, colors: true})); // eslint-disable-line
    return undefined
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
function toPlain(object, exclude = [], rename = {}) {
  if (object == null) {
    throw new TypeError('Cannot make null plain.')
  }

  const plainObject = {}
  Object.keys(object).forEach(objectKey => {
    let publicKey = objectKey.replace('_', '')
    if (rename[publicKey]) {
      publicKey = rename[publicKey]
    }

    if (Object.prototype.hasOwnProperty.call(object, objectKey) && !exclude.includes(objectKey)) {
      if (object[objectKey] instanceof Object && typeof object[objectKey].toJSON === 'function') {
        plainObject[publicKey] = object[objectKey].toJSON()
      } else {
        plainObject[publicKey] = object[objectKey]
      }
    }
  })
  return plainObject
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
function mergeDeep(target, source) {
  return merge(target, source, {isMergeableObject: TypeUtils.isPlainObject})
}

/**
 * Generate GUID
 *
 * @return {string}
 */
function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0 // eslint-disable-line no-bitwise

    const v = c === 'x' ? r : (r & 0x3) | 0x8 // eslint-disable-line no-bitwise
    return v.toString(16)
  })
}

/**
 * Generate random alphanumeric sequence
 *
 * @return {string}
 */
function randomAlphanumeric(length = 8) {
  let res = ''
  for (let i = 0; i < length; i += 1) {
    res += ALPHANUMERIC_MASK.charAt(Math.floor(Math.random() * ALPHANUMERIC_MASK.length))
  }
  return res
}

/**
 * Waits a specified amount of time before resolving the returned promise.
 *
 * @param {number} ms - The amount of time to sleep in milliseconds.
 * @return {Promise} - A promise which is resolved when sleep is done.
 */
function sleep(ms) {
  if (TypeUtils.isNumber(ms)) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

/**
 * Convert a Date object to a ISO-8601 date string
 *
 * @deprecated Use {@link DateTimeUtils.toISO8601DateTime} instead
 * @param {Date} [date] - Date which will be converted
 * @return {string} - string formatted as ISO-8601 (yyyy-MM-dd'T'HH:mm:ss'Z')
 */
function toISO8601DateTime(date) {
  return DateTimeUtils.toISO8601DateTime(date)
}

/**
 * Convert a Date object to a RFC-1123 date string
 *
 * @deprecated Use {@link DateTimeUtils.toRfc1123DateTime} instead
 * @param {Date} [date] - Date which will be converted
 * @return {string} - string formatted as RFC-1123 (E, dd MMM yyyy HH:mm:ss 'GMT')
 */
function toRfc1123DateTime(date) {
  return DateTimeUtils.toRfc1123DateTime(date)
}

/**
 * @deprecated Use {@link DateTimeUtils.toLogFileDateTime} instead
 * @param {Date} [date] - Date which will be converted
 * @return {string} - string formatted as RFC-1123 (yyyy_mm_dd__HH_MM_ss_l)
 */
function toLogFileDateTime(date) {
  return DateTimeUtils.toLogFileDateTime(date)
}

/**
 * Creates {@link Date} instance from an ISO 8601 formatted string.
 *
 * @deprecated Use {@link DateTimeUtils.fromISO8601DateTime} instead
 * @param {string} dateTime - An ISO 8601 formatted string.
 * @return {Date} - A {@link Date} instance representing the given date and time.
 */
function fromISO8601DateTime(dateTime) {
  return DateTimeUtils.fromISO8601DateTime(dateTime)
}

/**
 * Simple method that decode JSON Web Tokens
 *
 * @param {string} token
 * @return {object}
 */
function jwtDecode(token) {
  let payloadSeg = token.split('.')[1]
  payloadSeg += new Array(5 - (payloadSeg.length % 4)).join('=')
  payloadSeg = payloadSeg.replace(/-/g, '+').replace(/_/g, '/')
  return JSON.parse(Buffer.from(payloadSeg, 'base64').toString())
}

/**
 * Cartesian product of arrays
 *
 * @param {...([]|Object)} arrays - Variable number of arrays of n elements
 * @return {Array<Array<[]>>} - Product of arrays as an array of X arrays of N elements,
 *   where X is the product of the input arrays' lengths
 */
function cartesianProduct(...arrays) {
  const getArrayOf = a => (Array.isArray(a) ? a : [a])
  const prod2 = (a, b) =>
    getArrayOf(b)
      .map(e1 => a.map(e2 => [e1, ...e2]))
      .reduce((arr, e) => arr.concat(e), [])
  const prod = (a, ...rest) => (rest.length > 0 ? prod(prod2(a, rest.pop()), ...rest) : a)
  return prod([[]], ...arrays)
}

/**
 * Get a property of the object by a path string
 *
 * @param {object} object - The object to query.
 * @param {string} path - The path of a property (example: "foo.bar.baz" ).
 * @return {*|undefined} - The value of the given property or `undefined` if the property is not exists.
 */
function getPropertyByPath(object, path) {
  if (!object || !/^([a-zA-Z0-9-_.]+\.)*[a-zA-Z0-9-_.]+$/.test(path)) {
    return undefined // TODO: may be we can throw an error if path is given in wrong format
  }

  let val = object
  for (const key of path.split('.')) {
    val = typeof val === 'object' ? val[key] : undefined
    if (val === undefined) {
      return undefined
    }
  }

  return val
}

/**
 * Get an environment property by property name
 *
 * @param {string} propName The property name to look up
 * @param {boolean=false} isBoolean Whether or not the value should be converted to boolean type
 * @return {*|undefined} - The value of the given property or `undefined` if the property is not exists.
 */
function getEnvValue(propName, isBoolean = false) {
  if (process !== undefined) {
    for (const prefix of ENV_PREFIXES) {
      const value = process.env[prefix + propName]
      if (value !== undefined && value !== 'null') {
        // for boolean values, cast string value
        if (isBoolean && !TypeUtils.isBoolean(value)) {
          return value === 'true'
        }

        return value
      }
    }
  }

  return undefined
}

/**
 * Make sure new param value is set with either backward compatible param or the new param.
 *
 * @param {...object[]} params The parameter map.
 * @param {logger} logger to log errors
 * @example
 *
 * foo({newParam, oldPram}) {
 *    ({newParam} = backwardCompatible([{oldParam}, {newParam}], logger))
 *    // now if oldParam is used we set it to oldParam and log a deprecation message.
 * }
 *
 */
function backwardCompatible(...args) {
  const results = {}
  const logger = args.pop()
  for (const [oldParam, newParam] of args) {
    const oldParamName = Object.keys(oldParam)[0]
    const newParamName = Object.keys(newParam)[0]
    if (oldParam[oldParamName] === undefined) {
      results[newParamName] = newParam[newParamName]
    } else {
      logger.log(
        `warning - "${oldParamName}" is deprecated and will be removed, please use "${newParamName}" instead.`,
      )
      results[newParamName] = oldParam[oldParamName]
    }
  }

  return results
}

/**
 * @param {string} str
 * @return {string}
 */
function cleanStringForJSON(str) {
  if (str == null || str.length === 0) {
    return ''
  }

  let sb = ''
  let char = '\0'
  let tmp

  for (let i = 0, l = str.length; i < l; i += 1) {
    char = str[i]
    switch (char) {
      case '\\':
      case '"':
      case '/':
        sb += '\\' + char; // eslint-disable-line
        break
      case '\b':
        sb += '\\b'
        break
      case '\t':
        sb += '\\t'
        break
      case '\n':
        sb += '\\n'
        break
      case '\f':
        sb += '\\f'
        break
      case '\r':
        sb += '\\r'
        break
      default:
        if (char < ' ') {
          tmp = '000' + char.toString(16); // eslint-disable-line
          sb += '\\u' + tmp.substring(tmp.length - 4); // eslint-disable-line
        } else {
          sb += char
        }
        break
    }
  }

  return sb
}

function isFeatureFlagOn(featureName) {
  const envValue = getEnvValue(featureName)
  return (
    envValue === '1' ||
    envValue === 'true' ||
    (envValue && envValue !== '0' && envValue !== 'false' && envValue !== 'undefined')
  )
}

function isFeatureFlagOff(featureName) {
  return !isFeatureFlagOn(featureName)
}

/**
 * @template T
 * @param {PromiseLike<T>} promise
 *
 * @returns {PromiseLike<[any|undefined, T|undefined]>} a 2-tuple where the first element is the error if promise is rejected,
 *   or undefined if resolved,
 *   and the second value is the value resolved by the promise, or undefined if rejected
 *
 * Note: copyied @applitools/functional-commons
 */
function presult(promise) {
  return promise.then(
    v => [undefined, v],
    err => [err],
  )
}

function pexec(...args) {
  if (!promisifiedExec) {
    throw new Error('cannot find exec and/or promisify perhaps you are running in the browser?')
  }
  return promisifiedExec(...args)
}

function cachify(getterFunction, cacheRegardlessOfArgs = false) {
  const cachedGetter = (function() {
    const cache = {}
    return function(...args) {
      let cacheKey = 'default'
      if (!cacheRegardlessOfArgs) {
        const [key] = args
        cacheKey = stringify(key)
      }
      if (!(cacheKey in cache)) {
        cache[cacheKey] = getterFunction(...args)
      }
      return cache[cacheKey]
    }
  })()
  return cachedGetter
}

function getBreakpointWidth(breakpoints, width) {
  if (!TypeUtils.isArray(breakpoints) || breakpoints.length === 0) {
    return width
  }
  const breakpoint = breakpoints.find(breakpoint => width >= breakpoint)
  return breakpoint || breakpoints[breakpoints.length - 1] - 1
}

function deprecationWarning({deprecatedThing, newThing, isDead}) {
  const msg = isDead
    ? `Notice: ${deprecatedThing} is no longer supported.`
    : `Notice: ${deprecatedThing} has been renamed. Please use ${newThing} instead.\n`

  chalk.yellow(msg)
}

module.exports = {
  urlConcat,
  stripTrailingSlash,
  isAbsoluteUrl,
  stringify,
  stringifySingle,
  toString,
  toPlain,
  mergeDeep,
  guid,
  randomAlphanumeric,
  sleep,
  toISO8601DateTime,
  toRfc1123DateTime,
  toLogFileDateTime,
  fromISO8601DateTime,
  jwtDecode,
  cartesianProduct,
  getPropertyByPath,
  getEnvValue,
  backwardCompatible,
  cleanStringForJSON,
  isFeatureFlagOn,
  isFeatureFlagOff,
  presult,
  pexec,
  cachify,
  getBreakpointWidth,
  deprecationWarning,
}
