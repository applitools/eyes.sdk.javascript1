'use strict'

/**
 * The extent in which two images match (or are expected to match).
 *
 * @readonly
 * @enum {string}
 */
const MatchLevel = {
  /**
   * Images do not necessarily match.
   */
  None: 'None',

  /**
   * Images have the same layout (legacy algorithm).
   */
  LegacyLayout: 'Layout1',

  /**
   * Images have the same layout.
   */
  Layout: 'Layout2',

  /**
   * Images have the same layout.
   */
  Layout2: 'Layout2',

  /**
   * Images have the same content.
   */
  Content: 'Content',

  /**
   * Images are nearly identical.
   */
  Strict: 'Strict',

  /**
   * Images are identical.
   */
  Exact: 'Exact',
}

Object.freeze(MatchLevel)
exports.MatchLevel = MatchLevel
