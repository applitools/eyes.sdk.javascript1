'use strict'

/**
 * @readonly
 * @enum {string}
 */
const OSNames = {
  Android: 'Android',
  ChromeOS: 'Chrome OS',
  IOS: 'iOS',
  Linux: 'Linux',
  Macintosh: 'Macintosh',
  MacOSX: 'Mac OS X',
  Unknown: 'Unknown',
  Windows: 'Windows',
}

Object.freeze(OSNames)
exports.OSNames = OSNames
