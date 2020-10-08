'use strict'
const Enum = require('./utils/Enum')
/**
 * @typedef {string} CoordinatesType
 */

/**
 * Determines how detected failures are reported.
 */
const FailureReports = Enum('FailureReport', {
  /**
   * Failures are reported immediately when they are detected.
   */
  IMMEDIATE: 'IMMEDIATE',

  /**
   * Failures are reported when tests are completed (i.e., when {@link EyesBase#close()} is called).
   */
  ON_CLOSE: 'ON_CLOSE',
})

module.exports = FailureReports
