'use strict';
const throatPkg = require('throat');
const {presult} = require('@applitools/functional-commons');

function makeOpenEyesLimitedConcurrency({openEyes, concurrency, logger}) {
  const throat = throatPkg(concurrency);

  return function openEyesLimitedConcurrency(args) {
    const {testName} = args,
      ts = Date.now();
    logger.verbose(
      `openEyesLimitedConcurrency: inserting to throat, testName=${testName}, ts=${ts}`,
    );
    return new Promise((resolveOpen, rejectOpen) => {
      throat(
        () =>
          new Promise(async resolveTest => {
            logger.verbose(
              `openEyesLimitedConcurrency: going to run the real openEyes, testName=${testName}, ts=${ts}`,
            );
            const [openErr, openResult] = await presult(openEyes(args));

            if (openErr) {
              rejectOpen(openErr);
              return;
            }

            const {close, abort} = openResult;

            openResult.close = async function() {
              const [closeErr, closeResult] = await presult(close.apply(this, arguments));
              resolveTest();

              if (closeErr) {
                throw closeErr;
              }

              return closeResult;
            };

            openResult.abort = async function() {
              const abortResult = await abort.apply(this, arguments);
              resolveTest();
              return abortResult;
            };

            resolveOpen(openResult);
          }),
      );
    });
  };
}

module.exports = makeOpenEyesLimitedConcurrency;
