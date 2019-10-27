'use strict';

function makeTestController({testName, numOfTests, logger}) {
  const errors = [...new Array(numOfTests)];
  const renderIds = [...new Array(numOfTests)].map(() => []);
  let abortedByUser = false;
  let fatalError = false;

  return {
    setError: (index, err) => {
      logger.log('error set in test', testName, err);
      errors[index] = err && err.message ? err : new Error(err);
    },

    getError: index => {
      return errors[index];
    },

    setIsAbortedByUser: () => {
      logger.log('user aborted test', testName);
      abortedByUser = true;
    },

    getIsAbortedByUser: () => {
      return abortedByUser;
    },

    setFatalError: err => {
      fatalError = err && err.message ? err : new Error(err);
    },

    getFatalError: () => {
      return fatalError;
    },

    shouldStopAllTests: () => {
      return fatalError || errors.every(Boolean) || abortedByUser;
    },

    shouldStopTest: index => {
      return errors[index] || fatalError || abortedByUser;
    },

    addRenderId(index, ids) {
      renderIds[index].push(ids);
    },

    getRenderIds(index) {
      return renderIds[index];
    },
  };
}

module.exports = makeTestController;
