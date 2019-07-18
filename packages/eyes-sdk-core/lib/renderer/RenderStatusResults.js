'use strict';

const { GeneralUtils, RectangleSize, Region } = require('@applitools/eyes-common');

/**
 * Encapsulates data for the render currently running in the client.
 */
class RenderStatusResults {
  /**
   * @param {RenderStatus} status
   * @param {string} imageLocation
   * @param {string} domLocation
   * @param {string} error
   * @param {string} os
   * @param {string} userAgent
   * @param {RectangleSize|object} deviceSize
   * @param {Region[]||object[]} selectorRegions
   */
  constructor({ status, imageLocation, domLocation, error, os, userAgent, deviceSize, selectorRegions } = {}) {
    if (deviceSize && !(deviceSize instanceof RectangleSize)) {
      deviceSize = new RectangleSize(deviceSize);
    }

    if (selectorRegions && selectorRegions.length > 0 && !(selectorRegions[0] instanceof Region)) {
      selectorRegions = selectorRegions.map(region => new Region({
        left: region.x,
        top: region.y,
        width: region.width,
        height: region.height,
        error: region.error,
      }));
    }

    this._status = status;
    this._imageLocation = imageLocation;
    this._domLocation = domLocation;
    this._error = error;
    this._os = os;
    this._userAgent = userAgent;
    this._deviceSize = deviceSize;
    this._selectorRegions = selectorRegions;
  }

  /**
   * @return {boolean}
   */
  isEmpty() {
    return (
      this._status === undefined &&
      this._imageLocation === undefined &&
      this._domLocation === undefined &&
      this._error === undefined &&
      this._os === undefined &&
      this._userAgent === undefined &&
      this._deviceSize === undefined &&
      this._selectorRegions === undefined
    );
  }

  /**
   * @return {RenderStatus}
   */
  getStatus() {
    return this._status;
  }

  /**
   * @param {RenderStatus} value
   */
  setStatus(value) {
    this._status = value;
  }

  /**
   * @return {string}
   */
  getImageLocation() {
    return this._imageLocation;
  }

  /**
   * @param {string} value
   */
  setImageLocation(value) {
    this._imageLocation = value;
  }

  /**
   * @return {string}
   */
  getDomLocation() {
    return this._domLocation;
  }

  /**
   * @param {string} value
   */
  setDomLocation(value) {
    this._domLocation = value;
  }

  /**
   * @return {string}
   */
  getError() {
    return this._error;
  }

  /**
   * @param {string} value
   */
  setError(value) {
    this._error = value;
  }

  /**
   * @return {string}
   */
  getOS() {
    return this._os;
  }

  /**
   * @param {string} value
   */
  setOS(value) {
    this._os = value;
  }

  /**
   * @return {string}
   */
  getUserAgent() {
    return this._userAgent;
  }

  /**
   * @param {string} value
   */
  setUserAgent(value) {
    this._userAgent = value;
  }

  /**
   * @return {RectangleSize}
   */
  getDeviceSize() {
    return this._deviceSize;
  }

  /**
   * @param {RectangleSize} value
   */
  setDeviceSize(value) {
    this._deviceSize = value;
  }

  /**
   * @return {Region[]}
   */
  getSelectorRegions() {
    return this._selectorRegions;
  }

  /**
   * @param {Region[]} value
   */
  setSelectorRegions(value) {
    this._selectorRegions = value;
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
    return `RenderStatusResults { ${JSON.stringify(this)} }`;
  }
}

exports.RenderStatusResults = RenderStatusResults;
