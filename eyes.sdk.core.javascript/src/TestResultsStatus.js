'use strict';

/**
 * @readonly
 * @enum {String}
 */
const TestResultsStatus = {
  Passed: 'Passed',
  Unresolved: 'Unresolved',
  Failed: 'Failed'
};

Object.freeze(TestResultsStatus);
module.exports = TestResultsStatus;
