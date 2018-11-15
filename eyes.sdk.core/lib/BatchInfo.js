'use strict';

const { ArgumentGuard } = require('./ArgumentGuard');
const { GeneralUtils } = require('./utils/GeneralUtils');

/**
 * A batch of tests.
 */
class BatchInfo {
  /**
   * Creates a new BatchInfo instance.
   * @param {string} [name] - Name of batch or {@code null} if anonymous.
   * @param {Date} [startedAt] - Batch start time, defaults to the current time.
   * @param {string} [id] - ID of the batch, should be generated using GeneralUtils.guid().
   */
  constructor(name, startedAt, id) {
    this._id = id || process.env.APPLITOOLS_BATCH_ID || GeneralUtils.guid();
    this._name = name || process.env.APPLITOOLS_BATCH_NAME;
    this._startedAt = GeneralUtils.toISO8601DateTime(startedAt || new Date());
  }

  /**
   * @protected
   * @param {object} object
   * @return {BatchInfo}
   */
  static fromObject(object) {
    return GeneralUtils.assignTo(new BatchInfo(), object);
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
   * @protected
   * @param {string} value - The batch's ID
   */
  setId(value) {
    ArgumentGuard.notNullOrEmpty(value, 'id');
    this._id = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /** 
   * @return {string} -  The name of the batch or {@code null} if anonymous.
   */
  getName() {
    return this._name;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {Date} - The batch start date
   */
  getStartedAt() {
    return GeneralUtils.fromISO8601DateTime(this._startedAt);
  }

  /** 
   * @override 
   * @protected
   */
  toJSON() {
    return GeneralUtils.toPlain(this);
  }

  /** 
   * @override 
   * @protected
   */
  toString() {
    return `BatchInfo { ${JSON.stringify(this)} }`;
  }
}

exports.BatchInfo = BatchInfo;
