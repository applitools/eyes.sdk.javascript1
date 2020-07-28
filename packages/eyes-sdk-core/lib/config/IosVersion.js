const Enum = require('../utils/Enum')

/**
 * @typedef {import('../utils/Enum').EnumValues<typeof IosVersions>} IosVersion
 */

/**
 * iOS version for visual-grid rendering
 */
const IosVersions = Enum('IosVersion', {
  /** @type {'latest'} */
  Latest: 'latest',
})

module.exports = IosVersions
