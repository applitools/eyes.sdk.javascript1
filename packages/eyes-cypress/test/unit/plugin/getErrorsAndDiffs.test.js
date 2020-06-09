'use strict';

const {describe, it} = require('mocha');
const {expect} = require('chai');
const getErrorsAndDiffs = require('../../../src/plugin/getErrorsAndDiffs');
const {TestResults, TestResultsStatus} = require('@applitools/visual-grid-client');

describe('getErrorAndDiffs', () => {
  it('works', () => {
    const passed1 = new TestResults({
      name: 'test1',
      hostDisplaySize: {width: 1, height: 2},
      url: 'url1',
      status: TestResultsStatus.Passed,
    });
    const passed2 = new TestResults({
      name: 'test2',
      hostDisplaySize: {width: 3, height: 4},
      url: 'url2',
      status: TestResultsStatus.Passed,
    });
    const failed1 = new TestResults({
      name: 'test3',
      hostDisplaySize: {width: 5, height: 6},
      url: 'url3',
      status: TestResultsStatus.Failed,
    });
    const failed2 = new TestResults({
      name: 'test4',
      hostDisplaySize: {width: 7, height: 8},
      url: 'url4',
      status: TestResultsStatus.Failed,
    });
    const unresolved = new TestResults({
      name: 'test5',
      hostDisplaySize: {width: 9, height: 10},
      url: 'url5',
      status: TestResultsStatus.Unresolved,
    });
    const unresolvedNew = new TestResults({
      name: 'test6',
      hostDisplaySize: {width: 11, height: 12},
      url: 'url6',
      status: TestResultsStatus.Unresolved,
      isNew: true,
    });
    const err1 = new TestResults({
      name: 'test2',
      hostDisplaySize: {width: 13, height: 14},
      url: 'url2',
      status: TestResultsStatus.Passed,
    });
    err1.error = new Error('bla');
    const err2 = new TestResults({
      name: 'test2',
      hostDisplaySize: {width: 15, height: 16},
      url: 'url2',
      status: TestResultsStatus.Passed,
    });
    err2.error = new Error('bloo');
    const err3 = new Error('kuku');
    const testResultsArr = [
      passed1,
      passed2,
      failed1,
      failed2,
      unresolved,
      unresolvedNew,
      err1,
      err2,
      err3,
    ];
    const {failed, diffs, passed} = getErrorsAndDiffs(testResultsArr);
    expect(failed).to.eql([failed1, failed2, unresolvedNew, err1, err2, err3]);
    expect(diffs).to.eql([unresolved]);
    expect(passed).to.eql([passed1, passed2]);
  });
});
