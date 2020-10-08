'use strict'

const {hasOwnProperty, toString} = Object.prototype

const BASE64_CHARS_PATTERN = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/
const DUMMY_URL_PATTERN = /^(?:\w+:)?\/\/(\S+)$/

/**
 * Checks if `value` is `null` or `undefined`. But the `value` can be one of following: `0`, `NaN`, `false`, `""`.
 *
 * @param {*} value
 * @return {boolean}
 */
function isNull(value) {
  return value == null
}

/**
 * Checks if `value` is NOT `null` and NOT `undefined`.
 *
 * @param {*} value
 * @return {boolean}
 */
function isNotNull(value) {
  return !isNull(value)
}

/**
 * Checks if `value` has a type `string` or created by the `String` constructor
 *
 * @param {*} value
 * @return {boolean}
 */
function isString(value) {
  return Object.prototype.toString.call(value) === '[object String]'
}

/**
 * Checks if `value` has a type `number` or created by the `Number` constructor
 *
 * @param {*} value
 * @return {boolean}
 */
function isNumber(value) {
  return typeof value === 'number' || value instanceof Number
}

/**
 * Checks if `value` has a type `number` or created by the `Number` constructor and the value is integer
 *
 * @param {*} value
 * @return {boolean}
 */
function isInteger(value) {
  return isNumber(value) && Number.isInteger(value)
}

/**
 * Checks if `value` has a type `boolean` or created by the `Boolean` constructor
 *
 * @param {*} value
 * @return {boolean}
 */
function isBoolean(value) {
  return typeof value === 'boolean' || value instanceof Boolean
}

/**
 * Checks if `value` has a type `object` and not `null`.
 *
 * @param {*} value
 * @return {boolean}
 */
function isObject(value) {
  return typeof value === 'object' && value !== null
}

/**
 * Checks if `value` is a plain object. An object created by either `{}`, `new Object()` or `Object.create(null)`.
 *
 * @param {*} value
 * @return {boolean}
 */
function isPlainObject(value) {
  if (!isObject(value) || toString.call(value) !== '[object Object]') {
    return false
  }

  const prototype = Object.getPrototypeOf(value)
  return prototype === null || prototype === Object.getPrototypeOf({})
}

/**
 * Checks if `value` is an array.
 *
 * @param {*} value
 * @return {boolean}
 */
function isArray(value) {
  return Array.isArray(value)
}

/**
 * Checks if `value` is a Buffer.
 *
 * @param {*} value
 * @return {boolean}
 */
function isBuffer(value) {
  return Buffer.isBuffer(value)
}

/**
 * Checks if `value` is a base64 string.
 *
 * @param {*} value
 * @return {boolean}
 */
function isBase64(value) {
  return isString(value) && BASE64_CHARS_PATTERN.test(value)
}

/**
 * Checks if `value` is a base64 string.
 *
 * @param {*} value
 * @return {boolean}
 */
function isUrl(value) {
  return isString(value) && DUMMY_URL_PATTERN.test(value)
}

/**
 * Checks if `keys` is a direct property(ies) of `object`.
 *
 * @param {object} object - The object to query.
 * @param {string|string[]} keys - The key(s) to check.
 */
function has(object, keys) {
  if (object == null) {
    return false
  }

  if (!Array.isArray(keys)) {
    keys = [keys]
  }

  for (const key of keys) {
    if (!hasOwnProperty.call(object, key)) {
      return false
    }
  }

  return true
}

/**
 * Checks if `methods` is a method(s) of `object`.
 *
 * @param {object} object - The object to query.
 * @param {string|string[]} methods - The methods(s) to check.
 */
function hasMethod(object, methods) {
  if (object == null) {
    return false
  }

  if (!Array.isArray(methods)) {
    methods = [methods]
  }

  for (const key of methods) {
    if (typeof object[key] !== 'function') {
      return false
    }
  }

  return true
}

/**
 * Returns a `value` if it is !== undefined, or `defaultValue` otherwise
 *
 * @param {*} value
 * @param {*} defaultValue
 * @return {*}
 */
function getOrDefault(value, defaultValue) {
  if (value !== undefined) {
    return value
  }

  return defaultValue
}

/**
 * Checks if `value` has a type `function`
 *
 * @param {*} value
 * @return {boolean}
 */
function isFunction(value) {
  return typeof value === 'function'
}

/**
 * Checks if `value` is implements iterator protocol
 *
 * @param {*} value
 * @return {boolean}
 */
function isIterator(value) {
  return Boolean(value) && isFunction(value.next)
}

/**
 * Checks if `obj` is an instance of `constructor`
 *
 * @param {*} obj
 * @param {Function} constructor
 * @return {boolean}
 */
function instanceOf(obj, constructor) {
  if (!obj) return false
  if (!isString(constructor)) return obj.constructor[`__${constructor.name}`]
  let proto = Object.getPrototypeOf(obj)
  while (proto) {
    if (proto.constructor.name === constructor) return true
    proto = Object.getPrototypeOf(proto)
  }
  return false
}

module.exports = {
  isNull,
  isNotNull,
  isString,
  isNumber,
  isInteger,
  isBoolean,
  isObject,
  isPlainObject,
  isArray,
  isBuffer,
  isBase64,
  isUrl,
  has,
  hasMethod,
  getOrDefault,
  isFunction,
  isIterator,
  instanceOf,
}
