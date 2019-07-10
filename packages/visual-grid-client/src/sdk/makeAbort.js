'use strict';
const makeWaitForTestEnd = require('./makeWaitForTestEnd');
const {presult} = require('@applitools/functional-commons');

function makeAbort({
  getCheckWindowPromises,
  wrappers,
  openEyesPromises,
  resolveTests,
  testController,
}) {
  const waitAndResolveTests = makeWaitForTestEnd({
    getCheckWindowPromises,
    openEyesPromises,
  });

  return async () => {
    testController.setIsAbortedByUser();
    return waitAndResolveTests(async testIndex => {
      const [closeErr, closeResult] = await presult(wrappers[testIndex].abort());
      resolveTests[testIndex]();
      if (closeErr) {
        throw closeErr;
      }
      return closeResult;
    });
  };
}

module.exports = makeAbort;
