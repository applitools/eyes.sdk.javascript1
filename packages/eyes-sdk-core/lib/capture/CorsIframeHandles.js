const Enum = require('../utils/Enum')

/**
 * @typedef {import('../utils/Enum').EnumValues<typeof CorsIframeHandles>} CorsIframeHandle
 */

const CorsIframeHandles = Enum('CorsIframeHandle', {
  /**
   * We should REMOVE the SRC attribute of the iframe
   * @type {'BLANK'}
   */
  BLANK: 'BLANK',
  /**
   * Not to do anything
   * @type {'KEEP'}
   */
  KEEP: 'KEEP',
  /**
   * @type {'SNAPSHOT'}
   */
  SNAPSHOT: 'SNAPSHOT',
})

module.exports = CorsIframeHandles
