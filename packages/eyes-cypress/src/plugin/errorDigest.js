'use strict';
const chalk = require('chalk');

const formatByStatus = {
  Passed: {
    color: 'green',
    symbol: '\u2713',
    title: tests => `Passed - ${tests} tests`,
  },
  Failed: {
    color: 'red',
    symbol: '\u2716',
    title: tests => `Errors - ${tests} tests`,
  },
  Unresolved: {
    color: 'yellow',
    symbol: '\u26A0',
    title: tests => `Diffs detected - ${tests} tests`,
  },
};

function errorDigest({passed, failed, diffs, logger}) {
  logger.log('errorDigest: diff errors', diffs);
  logger.log('errorDigest: test errors', failed);

  const testLink = diffs.length ? `\n${indent()}See details at: ${diffs[0].getUrl()}` : '';
  return (
    'Eyes-Cypress detected diffs or errors during execution of visual tests:' +
    testResultsToString(passed, 'Passed') +
    testResultsToString(diffs, 'Unresolved') +
    testResultsToString(failed, 'Failed') +
    `${testLink}`
  );
}

function stringifyTestResults(testResults) {
  const hostDisplaySize = testResults.getHostDisplaySize();
  const viewport = hostDisplaySize ? `[${hostDisplaySize}]` : '';
  const testName = `${testResults.getName()} ${viewport}`;
  return testName + (testResults.error ? ` : ${testResults.error}` : '');
}

function testResultsToString(testResultsArr, category) {
  const {color, title, symbol} = formatByStatus[category];
  const results = testResultsArr.reduce((acc, testResults) => {
    if (!testResults.isEmpty) {
      const error = hasError(testResults) ? stringifyError(testResults) : undefined;
      acc.push(
        `${colorify(symbol, color)} ${chalk.reset(error || stringifyTestResults(testResults))}`,
      );
    }
    return acc;
  }, []);

  const coloredTitle = results.length ? colorify(title(results.length), color) : '';
  return testResultsSection(coloredTitle, results);
}

function testResultsSection(title, results) {
  return results.length ? `${indent()}${title}${indent(3)}${results.join(indent(3))}` : '';
}

function stringifyError(testResults) {
  return testResults.error
    ? stringifyTestResults(testResults)
    : `[Eyes test not started] : ${testResults}`;
}

function indent(spaces = 2) {
  return `\n   ${'  '.repeat(spaces)}`;
}

function hasError(testResult) {
  return testResult.error || testResult instanceof Error;
}

function colorify(msg, color) {
  return chalk[color](msg);
}

module.exports = errorDigest;
