const Enum = require('../utils/Enum')

/**
 * @typedef {import('../utils/Enum').EnumValues<typeof SessionTypes>} SessionType
 */

/**
 * Represents the types of available stitch modes.
 */
const SessionTypes = Enum('SessionType', {
  /**
   * Default type of sessions.
   * @type {'SEQUENTIAL'}
   */
  SEQUENTIAL: 'SEQUENTIAL',
  /**
   * A timing test session
   * @type {'PROGRESSION'}
   */
  PROGRESSION: 'PROGRESSION',
})

module.exports = SessionTypes
