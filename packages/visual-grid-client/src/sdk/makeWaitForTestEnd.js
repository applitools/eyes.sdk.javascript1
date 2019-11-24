'use strict';

function makeWaitForTestEnd({getCheckWindowPromises, openEyesPromises, logger}) {
  return async function waitForTestEnd(onTestEnd) {
    return Promise.all(
      getCheckWindowPromises().map((checkWindowPromise, i) =>
        // the close job must start after openEyes has finished, otherwise resolving the whole test will fail.
        // This situation could happen when a render fails and the checkWindow promise is rejected before
        // waiting on openEyesPromise.
        checkWindowPromise
          .then(r => {
            logger.verbose(`waitForTestEnd() checkWindow ${i} done`);
            return Promise.all([openEyesPromises[i], r]);
          })
          .then(([, r]) => {
            logger.verbose(`waitForTestEnd() open ${i} done`);
            return onTestEnd(i, r);
          }),
      ),
    );
  };
}

module.exports = makeWaitForTestEnd;
