const {describe, it} = require('mocha');
const {expect} = require('chai');
const processResults = require('../../src/processResults');
const {TestResultsStatus} = require('@applitools/eyes-sdk-core');
const {TestResults} = require('@applitools/eyes-sdk-core/lib/TestResults');
describe('processResults', () => {
  it('works', async () => {
    const results = [
      {
        title: 'My Component | Button1',
        resultsOrErr: [
          new TestResults({
            name: 'someName1',
            appName: 'My Component | Button1',
            hostDisplaySize: {width: 10, height: 20},
            appUrls: {batch: 'https://eyes.com/results'},
          }),
        ],
      },
      {
        title: 'My Component | Button2',
        resultsOrErr: [
          new TestResults({
            name: 'someName2',
            appName: 'My Component | Button2',
            hostDisplaySize: {width: 100, height: 200},
            appUrls: {batch: 'https://eyes.com/results'},
          }),
        ],
      },
    ];
    const processResult = processResults({results, totalTime: 10000, concurrency: 1});
    expect(JSON.stringify(processResult.formatter)).to.equal(
      JSON.stringify({
        _resultsList: [
          {
            name: 'someName1',
            appName: 'My Component | Button1',
            hostDisplaySize: {
              width: 10,
              height: 20,
            },
            appUrls: {batch: 'https://eyes.com/results'},
          },
          {
            name: 'someName2',
            appName: 'My Component | Button2',
            hostDisplaySize: {
              width: 100,
              height: 200,
            },
            appUrls: {batch: 'https://eyes.com/results'},
          },
        ],
      }),
    );
  });

  it('works with 1 diff', async () => {
    const results = [
      {
        title: 'My Component | Button2',
        resultsOrErr: [
          new TestResults({
            status: TestResultsStatus.Passed,
            name: 'My Component | Button2',
            hostApp: 'Chrome',
            hostDisplaySize: {width: 10, height: 20},
            appUrls: {batch: 'https://eyes.com/results'},
          }),
        ],
      },
      {
        title: 'My Component | Button1',
        resultsOrErr: [
          new TestResults({
            status: TestResultsStatus.Unresolved,
            isDifferent: true,
            name: 'My Component | Button1',
            hostApp: 'Firefox',
            hostDisplaySize: {width: 100, height: 200},
            appUrls: {batch: 'https://eyes.com/results'},
          }),
        ],
      },
    ];
    const {outputStr, exitCode} = processResults({results, totalTime: 10000, concurrency: 1});
    const expectedOutput =
      '\n[EYES: TEST RESULTS]:\n\nMy Component | Button2 [Chrome] [10x20] - \u001b[32mPassed\u001b[39m\n\nMy Component | Button1 [Firefox] [100x200] - \u001b[38;2;255;165;0mUnresolved\u001b[39m\n\n\u001b[38;2;255;165;0m\u001b[39m\n\u001b[38;2;255;165;0mA total of 1 difference was found.\u001b[39m\nSee details at https://eyes.com/results\nTotal time: 10 seconds\n';
    expect(expectedOutput).to.eql(outputStr);
    expect(exitCode).to.eql(1);
  });

  it('works with multiple diffs', async () => {
    const results = [
      {
        title: 'My Component | Button2',
        resultsOrErr: [
          new TestResults({
            status: TestResultsStatus.Unresolved,
            isDifferent: true,
            name: 'My Component | Button2',
            hostApp: 'Chrome',
            hostDisplaySize: {width: 10, height: 20},
            appUrls: {batch: 'https://eyes.com/results'},
          }),
        ],
      },
      {
        title: 'My Component | Button1',
        resultsOrErr: [
          new TestResults({
            status: TestResultsStatus.Unresolved,
            isDifferent: true,
            name: 'My Component | Button1',
            hostApp: 'Firefox',
            hostDisplaySize: {width: 100, height: 200},
            appUrls: {batch: 'https://eyes.com/results'},
          }),
        ],
      },
    ];
    const {outputStr, exitCode} = processResults({results, totalTime: 10000, concurrency: 1});
    const expectedOutput =
      '\n[EYES: TEST RESULTS]:\n\nMy Component | Button1 [Firefox] [100x200] - \u001b[38;2;255;165;0mUnresolved\u001b[39m\nMy Component | Button2 [Chrome] [10x20] - \u001b[38;2;255;165;0mUnresolved\u001b[39m\n\n\u001b[38;2;255;165;0m\u001b[39m\n\u001b[38;2;255;165;0mA total of 2 differences were found.\u001b[39m\nSee details at https://eyes.com/results\nTotal time: 10 seconds\n';
    expect(expectedOutput).to.eql(outputStr);
    expect(exitCode).to.eql(1);
  });

  it('works with 1 error', async () => {
    const results = [
      {
        title: 'My Component | Button2',
        resultsOrErr: [
          new TestResults({
            status: TestResultsStatus.Passed,
            isDifferent: false,
            name: 'My Component | Button2',
            hostApp: 'Chrome',
            hostDisplaySize: {width: 10, height: 20},
            appUrls: {batch: 'https://eyes.com/results'},
          }),
        ],
      },
      {
        title: 'My Component | Button1',
        resultsOrErr: [new Error('some error messgae !')],
      },
    ];
    const {outputStr, exitCode} = processResults({results, totalTime: 10000, concurrency: 1});
    const expectedOutput =
      '\n[EYES: TEST RESULTS]:\n\nMy Component | Button2 [Chrome] [10x20] - \u001b[32mPassed\u001b[39m\n\nMy Component | Button1 - \u001b[31mFailed\u001b[39m some error messgae !\n\u001b[31m\u001b[39m\n\u001b[31mA total of 1 story failed for unexpected error.\u001b[39m\nSee details at https://eyes.com/results\nTotal time: 10 seconds\n';
    expect(expectedOutput).to.eql(outputStr);
    expect(exitCode).to.eql(1);
  });

  it('works with multiple errors', async () => {
    const results = [
      {
        title: 'My Component | Button2',
        resultsOrErr: [
          new TestResults({
            status: TestResultsStatus.Passed,
            isDifferent: false,
            name: 'My Component | Button2',
            hostApp: 'Chrome',
            hostDisplaySize: {width: 10, height: 20},
            appUrls: {batch: 'https://eyes.com/results'},
          }),
          new Error('another error messgae !'),
        ],
      },
      {
        title: 'My Component | Button1',
        resultsOrErr: [new Error('some error messgae !')],
      },
    ];
    const {outputStr, exitCode} = processResults({results, totalTime: 10000, concurrency: 1});
    const expectedOutput =
      '\n[EYES: TEST RESULTS]:\n\nMy Component | Button2 [Chrome] [10x20] - \u001b[32mPassed\u001b[39m\n\nMy Component | Button1 - \u001b[31mFailed\u001b[39m some error messgae !\nMy Component | Button2 - \u001b[31mFailed\u001b[39m another error messgae !\n\u001b[31m\u001b[39m\n\u001b[31mA total of 2 stories failed for unexpected errors.\u001b[39m\nSee details at https://eyes.com/results\nTotal time: 10 seconds\n';
    expect(expectedOutput).to.eql(outputStr);
    expect(exitCode).to.eql(1);
  });

  it('works with diffs and errors', async () => {
    const results = [
      {
        title: 'My Component | Button2',
        resultsOrErr: [
          new TestResults({
            status: TestResultsStatus.Unresolved,
            isDifferent: true,
            name: 'My Component | Button2',
            hostApp: 'Chrome',
            hostDisplaySize: {width: 10, height: 20},
            appUrls: {batch: 'https://eyes.com/results'},
          }),
        ],
      },
      {
        title: 'My Component | Button1',
        resultsOrErr: [new Error('some error messgae !')],
      },
      {
        title: 'My Component | Button3',
        resultsOrErr: [new Error('some error messgae !')],
      },
    ];
    const {outputStr, exitCode} = processResults({results, totalTime: 10000, concurrency: 1});
    const expectedOutput =
      '\n[EYES: TEST RESULTS]:\n\nMy Component | Button2 [Chrome] [10x20] - \u001b[38;2;255;165;0mUnresolved\u001b[39m\n\nMy Component | Button1 - \u001b[31mFailed\u001b[39m some error messgae !\nMy Component | Button3 - \u001b[31mFailed\u001b[39m some error messgae !\n\u001b[31m\u001b[39m\n\u001b[31mA total of 1 difference was found and 2 stories failed for unexpected errors.\u001b[39m\nSee details at https://eyes.com/results\nTotal time: 10 seconds\n';
    expect(expectedOutput).to.eql(outputStr);
    expect(exitCode).to.eql(1);
  });

  it('works with no diifs and no errors', async () => {
    const results = [
      {
        title: 'My Component | Button2',
        resultsOrErr: [
          new TestResults({
            status: TestResultsStatus.Passed,
            isDifferent: false,
            name: 'My Component | Button2',
            hostApp: 'Chrome',
            hostDisplaySize: {width: 10, height: 20},
            appUrls: {batch: 'https://eyes.com/results'},
          }),
        ],
      },
    ];
    const {outputStr, exitCode} = processResults({results, totalTime: 10000, concurrency: 1});
    const expectedOutput =
      '\n[EYES: TEST RESULTS]:\n\nMy Component | Button2 [Chrome] [10x20] - \u001b[32mPassed\u001b[39m\n\n\u001b[32m\u001b[39m\n\u001b[32mNo differences were found!\u001b[39m\nSee details at https://eyes.com/results\nTotal time: 10 seconds\n';
    expect(expectedOutput).to.eql(outputStr);
    expect(exitCode).to.eql(0);
  });

  it('works with no diffs no errors and no succeeses', async () => {
    const results = [
      {
        title: 'My Component | Button2',
        resultsOrErr: [],
      },
    ];
    const {outputStr, exitCode} = processResults({results, totalTime: 10000, concurrency: 1});
    const expectedOutput = '\n[EYES: TEST RESULTS]:\n\nTest is finished but no results returned.\n';
    expect(expectedOutput).to.eql(outputStr);
    expect(exitCode).to.eql(1);
  });
  it('passes errors to the formatter correctly', async () => {
    const results = [
      {
        title: 'My Component | Button1',
        resultsOrErr: [new Error('some error message')],
      },
    ];
    const {formatter} = processResults({results, totalTime: 10000, concurrency: 1});
    const storedResults = formatter.getResultsList();
    expect(storedResults.length).to.eql(1);
    expect(storedResults[0].getName()).to.eql('My Component | Button1');
    expect(storedResults[0].error).to.eql(results[0].resultsOrErr[0]);
  });
});
