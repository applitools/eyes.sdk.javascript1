'use strict';
const {presult} = require('@applitools/functional-commons');
const makeWaitForTestEnd = require('./makeWaitForTestEnd');
const storeBatchHandle = require('./storeBatchHandle');

function makeClose({
  getCheckWindowPromises,
  wrappers,
  openEyesPromises,
  resolveTests,
  testController,
  logger,
  batches,
}) {
  const waitAndResolveTests = makeWaitForTestEnd({
    getCheckWindowPromises,
    openEyesPromises,
  });

  return async (throwEx = true) => {
    const settleError = (throwEx ? Promise.reject : Promise.resolve).bind(Promise);

    if (testController.getIsAbortedByUser()) {
      logger.log('closeEyes() aborted by user');
      return settleError([]);
    }

    let error, didError;
    return waitAndResolveTests(async testIndex => {
      resolveTests[testIndex]();

      if ((error = testController.getFatalError())) {
        logger.log('closeEyes() fatal error found');
        await wrappers[testIndex].ensureAborted();
        return (didError = true), error;
      }
      if ((error = testController.getError(testIndex))) {
        logger.log('closeEyes() found test error');
        return (didError = true), error;
      }

      const [closeError, closeResult] = await presult(wrappers[testIndex].close(throwEx));
      if (!closeError) {
        const renderIds = testController.getRenderIds(testIndex);
        const steps = closeResult.getStepsInfo();
        for (const [i, renderId] of renderIds.entries()) {
          steps[i].setRenderId(renderId);
        }
        return closeResult;
      } else {
        didError = true;
        return closeError;
      }
    }).then(results => {
      storeBatchHandle(wrappers, batches);
      return didError ? settleError(results) : results;
    });
  };
}

module.exports = makeClose;
