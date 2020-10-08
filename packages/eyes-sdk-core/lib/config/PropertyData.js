'use strict'
const ArgumentGuard = require('../utils/ArgumentGuard')

/**
 * @typedef {{name: string, value: string}} PropertyDataObject
 */

/**
 * A property to sent to the server
 */
class PropertyData {
  /**
   * @signature `new PropertyData(location)`
   * @sigparam {PropertyData} location - The PropertyData instance to clone from.
   *
   * @signature `new PropertyData(object)`
   * @sigparam {{name: string, value: string}} object - The property object to clone from.
   *
   * @signature `new PropertyData(name, value)`
   * @sigparam {string} name - The property name.
   * @sigparam {string} value - The property value.
   *
   * @param {string|PropertyDataObject|PropertyData} varArg1
   * @param {string} [varArg2]
   */
  constructor(varArg1, varArg2) {
    if (arguments.length === 2) {
      return new PropertyData({name: varArg1, value: varArg2})
    }

    if (varArg1 instanceof PropertyData) {
      return new PropertyData({name: varArg1.getName(), value: varArg1.getValue()})
    }

    const {name, value} = varArg1
    ArgumentGuard.isString(name, 'name')
    ArgumentGuard.notNull(value, 'value')

    /** @type {string} */
    this._name = name
    /** @type {string} */
    this._value = value
  }

  /**
   * @return {string}
   */
  getName() {
    return this._name
  }

  /**
   * @param {string} value
   */
  setName(value) {
    this._name = value
  }

  /**
   * @return {string}
   */
  getValue() {
    return this._value
  }

  /**
   * @param {string} value
   */
  setValue(value) {
    this._value = value
  }

  /**
   * @override
   */
  toJSON() {
    return {
      name: this._name,
      value: this._value,
    }
  }

  /**
   * @override
   */
  toString() {
    return `PropertyData { ${JSON.stringify(this)} }`
  }
}

module.exports = PropertyData
