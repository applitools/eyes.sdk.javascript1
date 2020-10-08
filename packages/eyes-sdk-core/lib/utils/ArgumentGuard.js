'use strict'
const TypeUtils = require('./TypeUtils')

/**
 * Fails if the input parameter equals the input value.
 *
 * @param {object} param - The input parameter.
 * @param {object} value - The input value.
 * @param {string} paramName - The input parameter name.
 */
function notEqual(param, value, paramName) {
  if (param === value) {
    throw new Error(`IllegalArgument: ${paramName} === ${value}`)
  }
}

/**
 * Fails if the input parameter contains some special characters or punctuation
 *
 * @param {object} param - The input parameter.
 * @param {string} paramName - The input parameter name.
 */
function alphanumeric(param, paramName) {
  if (!param.match(/^[a-z0-9]+$/i)) {
    throw new Error(`IllegalArgument: ${paramName} is not alphanumeric`)
  }
}

/**
 * Fails if the input parameter is null.
 *
 * @param {object} param - The input parameter.
 * @param {string} paramName - The input parameter name.
 */
function notNull(param, paramName) {
  if (param === null || param === undefined) {
    throw new Error(`IllegalArgument: ${paramName} is null or undefined`)
  }
}

/**
 * Fails if the input parameter is not null.
 *
 * @param {object} param - The input parameter.
 * @param {string} paramName - The input parameter name.
 */
function isNull(param, paramName) {
  if (param !== null && param !== undefined) {
    throw new Error(`IllegalArgument: ${paramName} is not null or undefined`)
  }
}

/**
 * Fails if the input parameter string is null or empty.
 *
 * @param {object} param - The input parameter.
 * @param {string} paramName - The input parameter name.
 */
function notNullOrEmpty(param, paramName) {
  if (!param) {
    throw new Error(`IllegalArgument: ${paramName} is null or empty`)
  }
}

/**
 * Fails if the input integer parameter is negative.
 *
 * @param {number} param - The input parameter.
 * @param {string} paramName - The input parameter name.
 * @param {boolean} shouldBeInteger - Whether or not, the number should be en integer
 */
function greaterThanOrEqualToZero(param, paramName, shouldBeInteger = false) {
  if (shouldBeInteger) {
    isInteger(param, paramName)
  }

  if (param < 0) {
    throw new Error(`IllegalArgument: ${paramName} < 0`)
  }
}

/**
 * Fails if the input integer parameter is smaller than 1.
 *
 * @param {number} param - The input parameter.
 * @param {string} paramName - The input parameter name.
 * @param {boolean} isInteger - Whether or not, the number should be en integer
 */
function greaterThanZero(param, paramName, isInteger = false) {
  if (isInteger) {
    isInteger(param, paramName)
  }

  if (param <= 0) {
    throw new Error(`IllegalArgument: ${paramName} < 1`)
  }
}

/**
 * Fails if the input integer parameter is equal to 0.
 *
 * @param {number} param - The input parameter.
 * @param {string} paramName - The input parameter name.
 * @param {boolean} isInteger - Whether or not, the number should be en integer
 */
function notZero(param, paramName, isInteger = false) {
  if (isInteger) {
    isInteger(param, paramName)
  }

  if (param === 0) {
    throw new Error(`IllegalArgument: ${paramName} === 0`)
  }
}

/**
 * Fails if the input number is not integer
 *
 * @param {number} param - The input parameter.
 * @param {string} paramName - The input parameter name.
 * @param {boolean} [strict=true] - If {@code false} then the value can be null|undefined
 */
function isInteger(param, paramName, strict = true) {
  if ((strict || TypeUtils.isNotNull(param)) && !TypeUtils.isInteger(param)) {
    throw new Error(`IllegalArgument: ${paramName} is not integer`)
  }
}

/**
 * Fails if param is not a string.
 *
 * @param {object} param - The input parameter.
 * @param {string} paramName - The input parameter name.
 * @param {boolean} [strict=true] - If {@code false} then the value can be null|undefined
 */
function isString(param, paramName, strict = true) {
  if ((strict || TypeUtils.isNotNull(param)) && !TypeUtils.isString(param)) {
    throw new Error(`IllegalType: ${paramName} is not a string`)
  }
}

/**
 * Fails if param is not a number.
 *
 * @param {object} param - The input parameter.
 * @param {string} paramName - The input parameter name.
 * @param {boolean} [strict=true] - If {@code false} then the value can be null|undefined
 */
function isNumber(param, paramName, strict = true) {
  if ((strict || TypeUtils.isNotNull(param)) && !TypeUtils.isNumber(param)) {
    throw new Error(`IllegalType: ${paramName} is not a number`)
  }
}

/**
 * Fails if param is not a boolean.
 *
 * @param {object} param - The input parameter.
 * @param {string} paramName - The input parameter name.
 * @param {boolean} [strict=true] - If {@code false} then the value can be null|undefined
 */
function isBoolean(param, paramName, strict = true) {
  if ((strict || TypeUtils.isNotNull(param)) && !TypeUtils.isBoolean(param)) {
    throw new Error(`IllegalType: ${paramName} is not a boolean`)
  }
}

/**
 * Fails if param is not an array.
 *
 * @param {object} param - The input parameter.
 * @param {string} paramName - The input parameter name.
 * @param {boolean} [strict=true] - If {@code false} then the value can be null|undefined
 */
function isArray(param, paramName, strict = true) {
  if ((strict || TypeUtils.isNotNull(param)) && !TypeUtils.isArray(param)) {
    throw new Error(`IllegalType: ${paramName} is not an array`)
  }
}

/**
 * Fails if param is not a plain object.
 *
 * @param {object} param - The input parameter.
 * @param {string} paramName - The input parameter name.
 * @param {boolean} [strict=true] - If {@code false} then the value can be null|undefined
 */
function isPlainObject(param, paramName, strict = true) {
  if ((strict || param) && !TypeUtils.isPlainObject(param)) {
    throw new Error(`IllegalType: ${paramName} is not an object`)
  }
}

/**
 * Fails if param is not a buffer.
 *
 * @param {object} param - The input parameter.
 * @param {string} paramName - The input parameter name.
 * @param {boolean} [strict=true] - If {@code false} then the value can be null|undefined
 */
function isBuffer(param, paramName, strict = true) {
  if ((strict || TypeUtils.isNotNull(param)) && !TypeUtils.isBuffer(param)) {
    throw new Error(`IllegalType: ${paramName} is not a buffer`)
  }
}

/**
 * Fails if param is not a base64 string.
 *
 * @param {object} param - The input parameter.
 */
function isBase64(param) {
  if (!TypeUtils.isBase64(param)) {
    throw new Error(`IllegalType: \`${param}\` is not a base64 string`)
  }
}

/**
 * Fails if isValid is false.
 *
 * @param {boolean} isValid - Whether the current state is valid.
 * @param {string} errMsg - A description of the error.
 */
function isValidState(isValid, errMsg) {
  if (!isValid) {
    throw new Error(`IllegalState: ${errMsg}`)
  }
}

/**
 * Fails if isValid is false.
 *
 * @param {object} param - The input parameter.
 * @param {object} type - The expected param type
 * @param {boolean} [strict=true] - If {@code false} then the value can be null|undefined
 */
function isValidType(param, type, strict = true) {
  if ((strict || TypeUtils.isNotNull(param)) && !(param instanceof type)) {
    throw new Error(`IllegalType: ${param} is not instance of ${type.constructor.name}`)
  }
}

/**
 * Fails if isValid is false.
 *
 * @param {*} value - The input value.
 * @param {object} enumObject - The required enum object
 * @param {boolean} [strict=true] - If {@code false} then the value can be null|undefined
 */
function isValidEnumValue(value, enumObject, strict = true) {
  if ((strict || TypeUtils.isNotNull(value)) && !Object.values(enumObject).includes(value)) {
    throw new Error(`IllegalType: ${value} is not a valid '${enumObject._name}' value`)
  }
}

/**
 * Check if object contains all required properties
 *
 * @param {object} object - The input object.
 * @param {string|string[]} properties - The array of properties to test
 * @param {string} paramName - The input parameter name.
 */
function hasProperties(object, properties, paramName) {
  if (!TypeUtils.has(object, properties)) {
    throw new Error(
      `IllegalArgument: ${paramName} should have the following properties: '${properties}'`,
    )
  }
}

module.exports = {
  notEqual,
  alphanumeric,
  notNull,
  isNull,
  notNullOrEmpty,
  greaterThanOrEqualToZero,
  greaterThanZero,
  notZero,
  isInteger,
  isString,
  isNumber,
  isBoolean,
  isArray,
  isPlainObject,
  isBuffer,
  isBase64,
  isValidState,
  isValidType,
  isValidEnumValue,
  hasProperties,
}
