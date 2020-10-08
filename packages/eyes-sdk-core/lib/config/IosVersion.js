const Enum = require('../utils/Enum')

/**
 * @typedef {import('../utils/Enum').EnumValues<typeof IosVersions>} IosVersion
 */

/**
 * iOS version for visual-grid rendering
 */
const IosVersions = Enum('IosVersion', {
  /** @type {'latest'} */
  LATEST: 'latest',
  LATEST_ONE_VERSION_BACK: 'latest-1',
})

module.exports = IosVersions
