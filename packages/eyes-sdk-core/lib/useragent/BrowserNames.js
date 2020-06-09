'use strict'

const {Enum} = require('../utils/Enum')

/**
 * @readonly
 * @enum {string}
 */
const BrowserNames = {
  Edge: 'Edge',
  IE: 'IE',
  Firefox: 'Firefox',
  Chrome: 'Chrome',
  Safari: 'Safari',
  Chromium: 'Chromium',
}

exports.BrowserNames = Enum('BrowserNames', BrowserNames)
