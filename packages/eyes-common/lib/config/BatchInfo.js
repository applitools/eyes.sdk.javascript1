'use strict';

const { ArgumentGuard } = require('../utils/ArgumentGuard');
const { GeneralUtils } = require('../utils/GeneralUtils');
const { TypeUtils } = require('../utils/TypeUtils');
const { DateTimeUtils } = require('../utils/DateTimeUtils');

/**
 * @typedef {{id: (string|undefined), name: (string|undefined), startedAt: (Date|string|undefined)}} BatchInfoObject
 */

/**
 * A batch of tests.
 */
class BatchInfo {
  /**
   * Creates a new BatchInfo instance.
   * Alternatively, batch can be set via global variables `APPLITOOLS_BATCH_ID`, `APPLITOOLS_BATCH_NAME`.
   *
   * @signature `new BatchInfo()`
   *
   * @signature `new BatchInfo(batchInfo)`
   * @sigparam {BatchInfo} batchInfo - The BatchInfo instance to clone from.
   *
   * @signature `new BatchInfo(object)`
   * @sigparam {{id: (string|undefined), name: (string|undefined), startedAt: (Date|string|undefined)}} object - The batch object to clone from.
   *
   * @signature `new BatchInfo(name, startedAt, id)`
   * @sigparam {string} name - Name of batch or {@code null} if anonymous.
   * @sigparam {Date|string} [startedAt] - Batch start time, defaults to the current time.
   * @sigparam {string} [id] - The ID of the existing batch, used to clone batch.
   *
   * @param {BatchInfo|BatchInfoObject|string} [varArg1] - The BatchInfo (or object) to clone from or the name of new batch.
   *   If no arguments given, new BatchInfo will be created with default or environment settings.
   * @param {string} [varArg2] - Batch start time, defaults to the current time.
   * @param {string} [varArg3] - ID of the batch, defaults is generated using GeneralUtils.guid().
   */
  constructor(varArg1, varArg2, varArg3) {
    if (varArg1 instanceof BatchInfo) {
      return new BatchInfo({ id: varArg1.getId(), name: varArg1.getName(), startedAt: varArg1.getStartedAt() });
    }

    if (TypeUtils.isString(varArg1)) {
      return new BatchInfo({ id: varArg3, name: varArg1, startedAt: varArg2 });
    }

    let { id, name, startedAt } = varArg1 || {};
    ArgumentGuard.isString(id, 'batchId', false);
    ArgumentGuard.isString(name, 'batchName', false);

    if (startedAt && !(startedAt instanceof Date)) {
      ArgumentGuard.isString(startedAt, 'startedAt', false);
      startedAt = DateTimeUtils.fromISO8601DateTime(startedAt);
    }

    this._id = id || process.env.APPLITOOLS_BATCH_ID || GeneralUtils.guid();
    this._name = name || process.env.APPLITOOLS_BATCH_NAME;
    this._startedAt = startedAt || new Date();
  }

  /**
   * @return {string} - The id of the current batch.
   */
  getId() {
    return this._id;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Sets a unique identifier for the batch. Sessions with batch info which includes the same ID will be grouped
   * together.
   *
   * @param {string} value - The batch's ID
   */
  setId(value) {
    ArgumentGuard.notNullOrEmpty(value, 'id');
    this._id = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string} - The name of the batch or {@code null} if anonymous.
   */
  getName() {
    return this._name;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {Date} - The batch start date
   */
  getStartedAt() {
    return this._startedAt;
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
    return `BatchInfo { ${JSON.stringify(this)} }`;
  }
}

exports.BatchInfo = BatchInfo;
