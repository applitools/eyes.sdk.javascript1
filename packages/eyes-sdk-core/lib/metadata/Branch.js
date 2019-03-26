'use strict';

const { GeneralUtils } = require('@applitools/eyes-common');

class Branch {
  /**
   * @param {string} id
   * @param {string} name
   * @param {boolean} isDeleted
   * @param {object} updateInfo - TODO: add typed `updateInfo`
   */
  constructor({ id, name, isDeleted, updateInfo } = {}) {
    this._id = id;
    this._name = name;
    this._isDeleted = isDeleted;
    this._updateInfo = updateInfo;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getId() {
    return this._id;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} value
   */
  setId(value) {
    this._id = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getName() {
    return this._name;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} value
   */
  setName(value) {
    this._name = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean}
   */
  getIsDeleted() {
    return this._isDeleted;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {boolean} value
   */
  setIsDeleted(value) {
    this._isDeleted = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {object}
   */
  getUpdateInfo() {
    return this._updateInfo;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {object} value
   */
  setUpdateInfo(value) {
    this._updateInfo = value;
  }

  /**
   * @override
   */
  toJSON() {
    return GeneralUtils.toPlain(this);
  }

  /**
   * @override
   */
  toString() {
    return `Branch { ${JSON.stringify(this)} }`;
  }
}

exports.Branch = Branch;
