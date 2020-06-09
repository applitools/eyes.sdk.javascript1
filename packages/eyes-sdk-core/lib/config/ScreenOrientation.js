'use strict'
const {Enum} = require('../utils/Enum')

/**
 * @readonly
 * @enum {string}
 */
const ScreenOrientation = {
  PORTRAIT: 'portrait',
  LANDSCAPE: 'landscape',
}

exports.ScreenOrientation = Enum('ScreenOrientation', ScreenOrientation)
