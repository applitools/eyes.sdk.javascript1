'use strict';
const {describe, it, before, after} = require('mocha');
const {expect} = require('chai');
const makeWaitForBatch = require('../../../src/plugin/waitForBatch');
const {TestResults} = require('@applitools/eyes-sdk-core');
const makeHandleBatchResultsFile = require('../../../src/plugin/makeHandleBatchResultsFile');
const baseDir = require('../../util/baseDir');
const fs = require('fs');
const {promisify} = require('util');
const {resolve} = require('path');
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);

describe('waitForBatch', () => {
  let waitForBatch, results;

  before(() => {
    waitForBatch = makeWaitForBatch({
      logger: console,
      processCloseAndAbort: ({runningTests}) => runningTests,
      concurrency: 1,
      getErrorsAndDiffs: results => ({failed: [], diffs: [], passed: results}),
      errorDigest: () => null,
      handleBatchResultsFile: makeHandleBatchResultsFile({
        tapDirPath: baseDir,
        tapFileName: 'test.tap',
      }),
    });
    results = [
      {name: 'someName1', appName: 'someAppName1'},
      {name: 'someName2', appName: 'someAppName2'},
    ].map(result => new TestResults(result));
  });

  after(async () => {
    await unlink(tapDirPath);
  });

  it('writes a test result file', async () => {
    const succeeded = await waitForBatch(results);
    expect(succeeded).to.equal(results.length);
    await testTapFile(results);
  });

  it('re-writes a test result file', async () => {
    const succeeded = await waitForBatch(results);
    expect(succeeded).to.equal(results.length);
    await testTapFile(results);
  });

  const outputLine = result =>
    `[FAILED TEST] Test: '${result.getName()}', Application: '${result.getAppName()}'`;
  const tapDirPath = resolve(baseDir, 'test.tap');
  const testTapFile = async results => {
    const data = await readFile(tapDirPath, 'utf8');
    results.forEach(result => expect(data).to.include(outputLine(result)));
    expect(data).to.include(`1..${results.length}`);
  };
});
