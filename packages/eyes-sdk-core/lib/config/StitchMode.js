const Enum = require('../utils/Enum')

/**
 * @typedef {import('../utils/Enum').EnumValues<typeof StitchModes>} StitchMode
 */

/**
 * Represents the types of available stitch modes.
 */
const StitchModes = Enum('StitchMode', {
  /**
   * Standard JS scrolling.
   * @type {'Scroll'}
   */
  SCROLL: 'Scroll',
  /**
   * CSS translation based stitching.
   * @type {'CSS'}
   */
  CSS: 'CSS',
})

module.exports = StitchModes
