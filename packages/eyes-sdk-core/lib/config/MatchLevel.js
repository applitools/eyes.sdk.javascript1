const Enum = require('../utils/Enum')

/**
 * @typedef {import('../utils/Enum').EnumValues<typeof MatchLevels>} MatchLevel
 */

/**
 * The extent in which two images match (or are expected to match).
 */
const MatchLevels = Enum('MatchLevel', {
  /**
   * Images do not necessarily match.
   * @type {'None'}
   */
  None: 'None',
  /**
   * Images have the same layout (legacy algorithm).
   * @type {'Layout1'}
   */
  LegacyLayout: 'Layout1',
  /**
   * Images have the same layout.
   * @type {'Layout'}
   */
  Layout: 'Layout',
  /**
   * Images have the same layout.
   * @type {'Layout2'}
   */
  Layout2: 'Layout2',
  /**
   * Images have the same content.
   * @type {'Content'}
   */
  Content: 'Content',
  /**
   * Images are nearly identical.
   * @type {'Strict'}
   */
  Strict: 'Strict',
  /**
   * Images are identical.
   * @type {'Exact'}
   */
  Exact: 'Exact',
})

module.exports = MatchLevels
