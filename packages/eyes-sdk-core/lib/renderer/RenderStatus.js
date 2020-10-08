'use strict'

/**
 * @readonly
 * @enum {string}
 */
const RenderStatus = {
  /**
   * A rendering requires some additional resources
   */
  NEED_MORE_RESOURCES: 'need-more-resources',

  /**
   * A rendering is in process
   */
  RENDERING: 'rendering',

  /**
   * A rendering finished
   */
  RENDERED: 'rendered',

  /**
   * A rendering finished with an error
   */
  ERROR: 'error',
}

Object.freeze(RenderStatus)
module.exports = RenderStatus
