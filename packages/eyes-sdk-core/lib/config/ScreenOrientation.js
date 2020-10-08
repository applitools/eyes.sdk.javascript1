const Enum = require('../utils/Enum')

/**
 * @typedef {import('../utils/Enum').EnumValues<typeof ScreenOrientations>} ScreenOrientation
 */

/**
 * Represents the types of available stitch modes.
 */
const ScreenOrientations = Enum('ScreenOrientation', {
  /** @type {'portrait'} */
  PORTRAIT: 'portrait',
  /** @type {'landscape'} */
  LANDSCAPE: 'landscape',
})

module.exports = ScreenOrientations
