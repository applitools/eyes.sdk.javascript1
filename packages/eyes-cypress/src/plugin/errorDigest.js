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
    chalkFunction: chalk.ansi256(214),
    symbol: '\u26A0',
    title: tests => `Diffs detected - ${tests} tests`,
  },
};

function errorDigest({passed, failed, diffs, logger, isInteractive}) {
  logger.log('errorDigest: diff errors', diffs);
  logger.log('errorDigest: test errors', failed);

  const testResultsUrl = diffs.length
    ? colorify(diffs[0].getUrl(), 'reset', chalk.ansi256(86))
    : '';
  const seeDetails = testResultsUrl ? 'See details at:' : '';
  const testResultsPrefix = `\n${indent()}${seeDetails}`;
  const footer = testResultsUrl ? `${colorify(testResultsPrefix)} ${testResultsUrl}` : '';
  return (
    colorify('Eyes-Cypress detected diffs or errors during execution of visual tests.') +
    colorify(` ${seeDetails} ${testResultsUrl}`) +
    testResultsToString(passed, 'Passed') +
    testResultsToString(diffs, 'Unresolved') +
    testResultsToString(failed, 'Failed') +
    footer +
    '\n\n'
  );

  function testResultsToString(testResultsArr, category) {
    const {color, title, symbol, chalkFunction} = formatByStatus[category];
    const results = testResultsArr.reduce((acc, testResults) => {
      if (!testResults.isEmpty) {
        const error = hasError(testResults) ? stringifyError(testResults) : undefined;
        acc.push(
          `${colorify(symbol, color)} ${colorify(error || stringifyTestResults(testResults))}`,
        );
      }
      return acc;
    }, []);

    const coloredTitle = results.length
      ? colorify(title(results.length), color, chalkFunction)
      : '';
    return testResultsSection(coloredTitle, results);
  }

  function colorify(msg, color = 'reset', chalkFunction = chalk[color]) {
    return isInteractive ? msg : chalkFunction(msg);
  }
}

function stringifyTestResults(testResults) {
  const hostDisplaySize = testResults.getHostDisplaySize();
  const viewport = hostDisplaySize ? `[${hostDisplaySize}]` : '';
  const testName = `${testResults.getName()} ${viewport}`;
  return testName + (testResults.error ? ` : ${testResults.error}` : '');
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

module.exports = errorDigest;
