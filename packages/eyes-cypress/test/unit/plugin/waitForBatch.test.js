'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const makeWaitForBatch = require('../../../src/plugin/waitForBatch');
const {concurrencyMsg} = require('../../../src/plugin/concurrencyMsg');

function getErrorsAndDiffs(testResultsArr) {
  return testResultsArr.reduce(
    ({passed, failed, diffs}, x) => {
      if (x === 'passed') passed.push(x);
      if (/^failed:/.test(x)) failed.push(x.split(':')[1]);
      if (x === 'diffs') diffs.push(x);
      return {passed, failed, diffs};
    },
    {
      passed: [],
      failed: [],
      diffs: [],
    },
  );
}

function errorDigest({passed, failed, diffs}) {
  return `${passed}::${failed}##${diffs}`;
}

function processCloseAndAbort({runningTests}) {
  return runningTests;
}

describe('waitForBatch', () => {
  const logger = process.env.APPLITOOLS_SHOW_LOGS ? console : {log: () => {}};
  const waitForBatch = makeWaitForBatch({
    logger,
    processCloseAndAbort,
    getErrorsAndDiffs,
    errorDigest,
    handleBatchResultsFile: results => results,
  });

  it("returns test count when there's no error", async () => {
    const runningTests = [['passed'], ['passed'], ['passed', 'passed']];
    expect(await waitForBatch(runningTests)).to.eql(4);
  });

  it('throws error with digest when found errors', async () => {
    const runningTests = ['failed:bla', 'diffs', 'passed'];
    const msg = await waitForBatch(runningTests).then(
      () => 'ok',
      err => err.message,
    );
    expect(msg).to.equal('passed::bla##diffs');
  });

  it("doesn't output concurrency message if concurrency is not the default", async () => {
    const origLog = console.log;
    try {
      const runningTests = [['passed']];
      let output = '';
      console.log = (...args) => (output += args.join(', '));

      expect(await waitForBatch(runningTests)).to.eql(1);
      expect(output).to.equal('');
    } finally {
      console.log = origLog;
    }
  });

  it('outputs concurrency message', async () => {
    const origLog = console.log;
    try {
      const runningTests = [['passed']];
      let output = '';
      console.log = (...args) => (output += args.join(', '));

      const waitForBatch = makeWaitForBatch({
        logger,
        processCloseAndAbort,
        getErrorsAndDiffs,
        errorDigest,
        concurrency: 1,
        handleBatchResultsFile: results => results,
      });

      expect(await waitForBatch(runningTests)).to.eql(1);
      expect(output).to.equal(concurrencyMsg);
    } finally {
      console.log = origLog;
    }
  });

  it('outputs concurrency message also with env var', async () => {
    const origLog = console.log;
    try {
      const runningTests = [['passed']];
      let output = '';
      console.log = (...args) => (output += args.join(', '));

      const waitForBatch = makeWaitForBatch({
        logger,
        processCloseAndAbort,
        getErrorsAndDiffs,
        errorDigest,
        concurrency: '1',
        handleBatchResultsFile: results => results,
      });

      const closeBatch = async () => {};
      expect(await waitForBatch(runningTests, closeBatch)).to.eql(1);
      expect(output).to.equal(concurrencyMsg);
    } finally {
      console.log = origLog;
    }
  });
});
