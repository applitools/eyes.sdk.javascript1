'use strict';

/**
 * Determines how detected failures are reported.
 *
 * @readonly
 * @enum {number}
 */
const FailureReports = {
  /**
   * Failures are reported immediately when they are detected.
   */
  IMMEDIATE: 'IMMEDIATE',

  /**
   * Failures are reported when tests are completed (i.e., when {@link EyesBase#close()} is called).
   */
  ON_CLOSE: 'ON_CLOSE',
};

Object.freeze(FailureReports);
exports.FailureReports = FailureReports;
