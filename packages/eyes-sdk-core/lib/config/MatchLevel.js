const Enum = require('../utils/Enum')

/**
 * @enum 
 * @typedef {string} MatchLevel
 */

/**
 * The extent in which two images match (or are expected to match).
 */
const MatchLevels = Enum('MatchLevel', {
  /* Images do not necessarily match. */
  None: 'None',
  /* Images have the same layout (legacy algorithm). */
  LegacyLayout: 'Layout1',
  /* Images have the same layout. */
  Layout: 'Layout',
  /* Images have the same layout. */
  Layout2: 'Layout2',
  /* Images have the same content. */
  Content: 'Content',
  /* Images are nearly identical. */
  Strict: 'Strict',
  /* Images are identical. */
  Exact: 'Exact',
})

module.exports = MatchLevels
