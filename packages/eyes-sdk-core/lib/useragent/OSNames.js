const Enum = require('../utils/Enum')

/**
 * @typedef {string} OSName
 */

const OSNames = Enum('OSName', {
  Android: 'Android',
  ChromeOS: 'Chrome OS',
  IOS: 'iOS',
  Linux: 'Linux',
  Macintosh: 'Macintosh',
  MacOSX: 'Mac OS X',
  Unknown: 'Unknown',
  Windows: 'Windows',
})

module.exports = OSNames
