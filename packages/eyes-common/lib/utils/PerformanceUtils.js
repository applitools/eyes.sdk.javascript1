'use strict';

const MS_IN_S = 1000;
const MS_IN_M = 60000;
const NS_IN_MS = 1000000;

const timeStorage = {};

/**
 * @private
 */
class Time {
  constructor(name) {
    if (name) {
      this._name = String(name);
    }
  }

  reset() {
    this._startTime = null;
    this._elapsedTime = null;

    this._result = null;
  }

  start() {
    this.reset();
    this._startTime = process.hrtime();
  }

  /**
   * @return {{name: string, time: number, summary: string}}
   */
  end() {
    if (!this._startTime) {
      throw new Error('start() should be called first!');
    }

    this._elapsedTime = process.hrtime(this._startTime);
    const elapsedMs = (this._elapsedTime[0] * MS_IN_S) + (this._elapsedTime[1] / NS_IN_MS);

    this._result = {
      name: this._name || '',
      time: Number(elapsedMs.toFixed(3)),
      summary: PerformanceUtils.elapsedString(elapsedMs),
    };

    return this._result;
  }

  /**
   * @return {?{name: string, time: number, summary: string}}
   */
  result() {
    return this._result;
  }
}

/**
 * Collection of utility methods for measure performance.
 *
 * @ignore
 */
class PerformanceUtils {
  /**
   * @param {string} [name] - Instance name or {@code null} if don't want to store it
   * @param {boolean} [storeResults=true]
   * @return {Time}
   */
  static start(name, storeResults = true) {
    const time = new Time(name);
    time.storeResults = storeResults;
    time.start();

    if (name && storeResults) {
      timeStorage[name] = time;
    }
    return time;
  }

  /**
   * @param {string} name - Instance name
   * @param {boolean} [deleteResults=false]
   * @return {{name: string, time: number, summary: string}}
   */
  static end(name, deleteResults = false) {
    if (!name) {
      throw new Error('Instance name required!');
    }

    const time = timeStorage[name];
    if (!time) {
      throw new Error(`No time instance with name: ${name}`);
    }

    if (time.result()) {
      return time.result();
    }

    const result = time.end();
    if (deleteResults) {
      delete timeStorage[name];
    }

    return result;
  }

  /**
   * @param {string} name - Instance name
   * @return {{name: string, time: number, summary: string}}
   */
  static result(name) {
    if (!name) {
      throw new Error('Instance name required!');
    }

    const time = timeStorage[name];
    if (!time) {
      throw new Error(`No time instance with name: ${name}`);
    }

    return time.result();
  }

  /**
   * Format elapsed time by template (#m #s #ms)
   *
   * @param {number} milliseconds
   * @return {string} - formatted string
   */
  static elapsedString(milliseconds) {
    const minutes = Math.floor(milliseconds / MS_IN_M);
    if (minutes > 0) {
      milliseconds -= minutes * MS_IN_M;
    }
    const seconds = Math.floor(milliseconds / MS_IN_S);
    if (seconds > 0) {
      milliseconds -= seconds * MS_IN_S;
    }

    if (minutes > 0) {
      return `${minutes}m ${seconds}s ${milliseconds}ms`;
    }
    return `${seconds}s ${milliseconds}ms`;
  }
}

exports.PerformanceUtils = PerformanceUtils;
