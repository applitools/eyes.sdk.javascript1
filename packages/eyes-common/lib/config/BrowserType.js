'use strict';

/**
 * @readonly
 * @enum {string}
 */
const BrowserType = {
  CHROME: 'chrome',
  FIREFOX: 'firefox',
  IE_11: 'ie',
  IE_10: 'ie10',
  EDGE: 'edge',
};

Object.freeze(BrowserType);
exports.BrowserType = BrowserType;
