const Enum = require('../utils/Enum')

/**
 * @typedef {string} BrowserName
 */

const BrowserNames = Enum('BrowserName', {
  Edge: 'Edge',
  IE: 'IE',
  Firefox: 'Firefox',
  Chrome: 'Chrome',
  Safari: 'Safari',
  Chromium: 'Chromium',
})

module.exports = BrowserNames
