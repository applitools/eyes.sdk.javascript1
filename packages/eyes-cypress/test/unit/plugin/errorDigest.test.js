'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const chalk = require('chalk');
const errorDigest = require('../../../src/plugin/errorDigest');
const {TestResults} = require('@applitools/visual-grid-client');

// cypress wraps the error digest in red and 3 space indentation, and we throw the error digest in an `Error`
function _wrap(str) {
  return chalk.red(`   ${new Error(str)}`);
}

describe('errorDigest', () => {
  it('works', () => {
    const err1 = new TestResults({
      name: 'test0',
      hostDisplaySize: {width: 4, height: 5},
      url: 'url0',
    });
    err1.error = new Error('bla');
    const err2 = new TestResults({
      name: 'test0',
      hostDisplaySize: {width: 6, height: 7},
      url: 'url0',
    });
    err2.error = new Error('bloo');
    const err3 = new Error('kuku');
    const failed = [err1, err2, err3];
    const diffs = [
      new TestResults({
        name: 'test1',
        hostDisplaySize: {width: 100, height: 200},
        url: 'https://eyes.applitools.com/app/batches/1/2?accountId=UAujt6tHnEKUivQXIz7G6A~~',
        status: 'Unresolved',
      }),
      new TestResults({
        name: 'test2',
        hostDisplaySize: {width: 300, height: 400},
        url: 'url2',
        status: 'Unresolved',
      }),
    ];
    const passed = [
      new TestResults({
        name: 'test3',
        hostDisplaySize: {width: 1, height: 2},
        status: 'Passed',
      }),
    ];

    const output = errorDigest({
      passed,
      failed,
      diffs,
      logger: {log: () => {}},
    });

    // NOTE: this is a try to validate the expected output.
    // It was very hard to construct this expected string, so if this becomes a maintenance nightmare, I suggest not to try and preserve it.
    // It was mainly written for debugging purposes in order to quickly craft the output without having to run Cypress.

    //  this might help:
    // https://github.com/avajs/ava/blob/master/docs/04-snapshot-testing.md

    const expectedOutput = `Eyes-Cypress detected diffs or errors during execution of visual tests:
       ${chalk.green('Passed - 1 tests')}
         ${chalk.green('\u2713')} ${chalk.reset('test3 [1x2]')}
       ${chalk.ansi256(214)('Diffs detected - 2 tests')}
         ${chalk.yellow('\u26A0')} ${chalk.reset('test1 [100x200]')}
         ${chalk.yellow('\u26A0')} ${chalk.reset('test2 [300x400]')}
       ${chalk.red('Errors - 3 tests')}
         ${chalk.red('\u2716')} ${chalk.reset('test0 [4x5] : Error: bla')}
         ${chalk.red('\u2716')} ${chalk.reset('test0 [6x7] : Error: bloo')}
         ${chalk.red('\u2716')} ${chalk.reset('[Eyes test not started] : Error: kuku')}

       See details at: https://eyes.applitools.com/app/batches/1/2?accountId=UAujt6tHnEKUivQXIz7G6A~~`;

    // console.log(_wrap(output)); // debugging
    expect(output).to.deep.equal(expectedOutput);
  });

  it('should only print existing results', () => {
    const emptyResult = new TestResults();
    emptyResult.isEmpty = true;
    const passed = [
      new TestResults({
        name: 'test3',
        hostDisplaySize: {width: 1, height: 2},
        status: 'Passed',
      }),
      emptyResult,
    ];
    const failed = [];
    const diffs = [];
    const output = errorDigest({
      passed,
      failed,
      diffs,
      logger: {log: () => {}},
    });

    const expectedOutput = `Eyes-Cypress detected diffs or errors during execution of visual tests:
       ${chalk.green('Passed - 1 tests')}
         ${chalk.green('\u2713')} ${chalk.reset('test3 [1x2]')}`;

    expect(output).to.deep.equal(expectedOutput);
  });

  it('should handle error results', () => {
    const failure = new Error('i failed you');
    const passed = [];
    const failed = [failure];
    const diffs = [];
    const output = errorDigest({
      passed,
      failed,
      diffs,
      logger: {log: () => {}},
    });

    const expectedOutput = `Eyes-Cypress detected diffs or errors during execution of visual tests:
       ${chalk.red('Errors - 1 tests')}
         ${chalk.red('\u2716')} ${chalk.reset('[Eyes test not started] : Error: i failed you')}`;

    expect(output).to.deep.equal(expectedOutput);
  });

  it('should not print formatting codes when isInteractive', () => {
    const passed = [
      new TestResults({
        name: 'test3',
        hostDisplaySize: {width: 1, height: 2},
        status: 'Passed',
      }),
    ];
    const failed = [];
    const diffs = [
      new TestResults({
        name: 'test1',
        hostDisplaySize: {width: 100, height: 200},
        url: 'some_url',
        status: 'Unresolved',
      }),
    ];
    const output = errorDigest({
      passed,
      failed,
      diffs,
      logger: {log: () => {}},
      isInteractive: true,
    });

    const expectedOutput = `Eyes-Cypress detected diffs or errors during execution of visual tests:
       Passed - 1 tests
         \u2713 test3 [1x2]
       Diffs detected - 1 tests
         \u26A0 test1 [100x200]

       See details at: some_url`;

    expect(output).to.deep.equal(expectedOutput);
  });
});
