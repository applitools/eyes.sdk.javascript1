'use strict';

const {describe, it} = require('mocha');
const {expect} = require('chai');
const makeOpenEyesLimitedConcurrency = require('../../../src/sdk/openEyesLimitedConcurrency');
const {promisify: p} = require('util');
const psetTimeout = p(setTimeout);

describe('openEyesLimitedConcurrency', () => {
  function runClose({close}) {
    return close();
  }

  it('works', async () => {
    let counter = 0;
    const timeouts = [150, 50, 150, 150, 50];
    let results = [];
    const openEyes = async arg => {
      await psetTimeout(timeouts[counter++]);
      return {
        close: async () => {
          results.push(arg);
        },
        abort: async () => {
          results.push(arg);
        },
      };
    };
    console.verbose = console.log;
    const openEyesLimitedConcurrency = makeOpenEyesLimitedConcurrency({
      openEyes,
      concurrency: 2,
      logger: console,
    });
    await Promise.all([
      openEyesLimitedConcurrency(1).then(runClose),
      openEyesLimitedConcurrency(2).then(runClose),
      openEyesLimitedConcurrency(3).then(runClose),
      openEyesLimitedConcurrency(4).then(runClose),
      openEyesLimitedConcurrency(5).then(runClose),
    ]);

    expect(results).to.eql([2, 1, 3, 5, 4]);

    counter = 0;
    results = [];

    await Promise.all([
      openEyes(1).then(runClose),
      openEyes(2).then(runClose),
      openEyes(3).then(runClose),
      openEyes(4).then(runClose),
      openEyes(5).then(runClose),
    ]);

    expect(results).to.eql([2, 5, 1, 3, 4]);

    /*
    Explanation:
  
    First case: 2 concurrent jobs with the following timeline:

    5     -
    4    ---
    3  ---
    2 -
    1 ---
    (every dash is 50ms)

    Order of termination: 2,1,3,5,4

    
    Second case: Jobs are not throttled, the timeline is:

    5 -
    4 ---
    3 ---
    2 -
    1 ---
    (every dash is 50ms)

    And the order of termination: 2,5,1,3,4
    */
  });
});
