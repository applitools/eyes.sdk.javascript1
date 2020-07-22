const Enum = require('../utils/Enum')

/**
 * @enum 
 * @typedef{'Scroll'|'CSS'} StitchMode
 */

/**
 * Represents the types of available stitch modes.
 */
const StitchModes = Enum('StitchMode', {
  /* Standard JS scrolling. */
  SCROLL: 'Scroll',
  /* CSS translation based stitching. */
  CSS: 'CSS',
})

module.exports = StitchModes
