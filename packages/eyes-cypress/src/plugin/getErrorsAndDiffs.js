'use strict';

function getErrorsAndDiffs(testResultsArr) {
  return testResultsArr.reduce(
    ({failed, diffs, passed}, testResults) => {
      if (testResults instanceof Error || testResults.error) {
        failed.push(testResults);
      } else {
        const testStatus = testResults.getStatus();
        if (testStatus === 'Passed') {
          passed.push(testResults);
        } else {
          if (testStatus === 'Unresolved') {
            if (testResults.getIsNew()) {
              testResults.error = new Error(
                `${testResults.getName()}. Please approve the new baseline at ${testResults.getUrl()}`,
              );
              failed.push(testResults);
            } else {
              diffs.push(testResults);
            }
          } else if (testStatus === 'Failed') {
            failed.push(testResults);
          }
        }
      }

      return {failed, diffs, passed};
    },
    {failed: [], diffs: [], passed: []},
  );
}

module.exports = getErrorsAndDiffs;
