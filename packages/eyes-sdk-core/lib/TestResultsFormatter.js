'use strict';

const OK = 'ok';
const NOT_OK = 'not ok';

/**
 * A utility class for aggregating and formatting test results.
 */
class TestResultsFormatter {
  /**
   * @param {TestResults[]} resultsList
   */
  constructor(resultsList = []) {
    this._resultsList = resultsList;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Adds an additional results object to the currently stored results list.
   *
   * @param {TestResults} results - A test results returned by a call to `eyes.close' or 'eyes.abort'.
   * @return {TestResultsFormatter} - The updated 'TestResultsFormatter' instance.
   */
  addTestResults(results) {
    if (results) {
      this._resultsList.push(results);
    }

    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Adds an additional results object to the currently stored results list.
   *
   * @deprecated use {@link #addTestResults(results)} instead
   * @param {TestResults} results - A test results returned by a call to `eyes.close' or 'eyes.abort'.
   * @return {TestResultsFormatter} - The updated 'TestResultsFormatter' instance.
   */
  addResults(results) {
    return this.addTestResults(results);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {TestResults[]}
   */
  getResultsList() {
    return this._resultsList;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {void}
   */
  clearResultsList() {
    this._resultsList = [];
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Creates a TAP representation of the tests results list in hierarchic format.
   *
   * @param {boolean} [includeSubTests=true] - If true, steps will be treated as "subtests". Default is true.
   * @param {boolean} [markNewAsPassed=false] - If true, new tests will be treated as "passed". Default is false.
   * @return {string} - A string which is the TAP representation of the results list.
   */
  asFormatterString(includeSubTests = true, markNewAsPassed = false) {
    if (this._resultsList.length === 0) {
      return 'No results found.';
    }

    let formattedString = '[EYES: TEST RESULTS]:\n';

    for (let i = 0; i < this._resultsList.length; i += 1) {
      /** @type {TestResults} */ const currentResult = this._resultsList[i];

      const testTitle = `${currentResult.getName()} [${currentResult.getHostDisplaySize().toString()}]`;
      let testResult = '';

      if (currentResult.getIsNew()) {
        testResult = markNewAsPassed ? 'Passed' : 'New';
      } else if (currentResult.isPassed()) {
        testResult = 'Passed';
      } else {
        const stepsFailed = currentResult.getMismatches() + currentResult.getMissing();
        testResult = `Failed ${stepsFailed} of ${currentResult.getSteps()}`;
      }

      formattedString += `${testTitle} - ${testResult}\n`;

      if (includeSubTests) {
        if (currentResult.getStepsInfo().length > 0) {
          for (let j = 0; j < currentResult.getStepsInfo().length; j += 1) {
            const currentStep = currentResult.getStepsInfo()[j];

            const subTestTitle = currentStep.getName();
            const subTestResult = currentStep.getIsDifferent() ? 'Passed' : 'Failed';
            formattedString += `\t> ${subTestTitle} - ${subTestResult}\n`;
          }
        } else {
          formattedString += '\tNo steps exist for this test.\n';
        }
      }
    }

    formattedString += `See details at ${this._resultsList[0].getAppUrls().getBatch()}`;

    return formattedString;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Creates a TAP representation of the tests results list in hierarchic format.
   *
   * @param {boolean} [includeSubTests=true] - If true, steps will be treated as "subtests". Default is true.
   * @param {boolean} [markNewAsPassed=false] - If true, new tests will be treated as "passed". Default is false.
   * @return {string} - A string which is the TAP representation of the results list.
   */
  asHierarchicTAPString(includeSubTests = true, markNewAsPassed = false) {
    if (this._resultsList.length === 0) {
      return '';
    }

    let tapString = `1..${this._resultsList.length}\n`;

    for (let i = 0; i < this._resultsList.length; i += 1) {
      /** @type {TestResults} */ const currentResult = this._resultsList[i];
      const tapIndex = i + 1;

      if (i > 0) {
        tapString += '#\n';
      }

      const name = `Test: '${currentResult.getName()}', Application: '${currentResult.getAppName()}'`;

      if (currentResult.isPassed()) {
        tapString += `${OK} ${tapIndex} - [PASSED TEST] ${name}\n`;
      } else if (currentResult.getIsNew()) { // Test did not pass (might also be a new test).
        // New test
        const newResult = markNewAsPassed ? OK : NOT_OK;
        tapString += `${newResult} ${tapIndex} - [NEW TEST] ${name}\n`;
      } else {
        // Failed / Aborted test.
        tapString += `${NOT_OK} ${tapIndex} - `;
        if (currentResult.getIsAborted()) {
          tapString += `[ABORTED TEST] ${name}\n`;
        } else {
          tapString += `[FAILED TEST] ${name}\n`;
        }
        tapString += `#\tMismatches: ${currentResult.getMismatches()}\n`;
      }

      const url = currentResult.getAppUrls() && currentResult.getAppUrls().getSession() ?
        currentResult.getAppUrls().getSession() : "No URL (session didn't start).";
      tapString += `#\tTest url: ${url}\n`;
      tapString += `#\tBrowser: ${currentResult.getHostApp()}, Viewport: ${currentResult.getHostDisplaySize()}\n`;

      if (includeSubTests) {
        if (currentResult.getStepsInfo().length > 0) {
          tapString += `\t1..${currentResult.getStepsInfo().length}\n`;
          for (let j = 0; j < currentResult.getStepsInfo().length; j += 1) {
            const currentStep = currentResult.getStepsInfo()[j];
            tapString += '\t';
            tapString += currentStep.getIsDifferent() ? NOT_OK : OK;
            tapString += ` '${currentStep.getName()}', URL: ${currentStep.getAppUrls().getStep()}\n`;
          }
        } else {
          tapString += '\tNo steps exist for this test.\n';
        }
      }
    }

    return tapString;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Creates a TAP representation of the tests results list in which each steps are colored as success/fail.
   *
   * @param {boolean} [markNewAsPassed=false] - If true, new tests will be treated as "passed". Default is false.
   * @return {string} - A string which is the TAP representation of the results list.
   */
  asFlattenedTAPString(markNewAsPassed = false) {
    if (this._resultsList.length === 0) {
      return '';
    }

    let tapString = '';
    let stepsCounter = 0;

    // We'll add the TAP plan at the beginning, after we calculate the total number of steps.
    for (let i = 0; i < this._resultsList.length; i += 1) {
      tapString += '#\n';

      /** @type {TestResults} */ const currentResult = this._resultsList[i];
      const tapIndex = i + 1;

      const name = `Test: '${currentResult.getName()}', Application: '${currentResult.getAppName()}'`;

      if (currentResult.isPassed()) {
        tapString += `# ${OK} ${tapIndex} - [PASSED TEST] ${name}\n`;
      } else if (currentResult.getIsNew()) { // Test did not pass (might also be a new test).
        // New test
        const newResult = markNewAsPassed ? OK : NOT_OK;
        tapString += `# ${newResult} ${tapIndex} - [NEW TEST] ${name}\n`;
      } else {
        // Failed / Aborted test.
        tapString += `# ${NOT_OK} ${tapIndex} - `;
        if (currentResult.getIsAborted()) {
          tapString += `[ABORTED TEST] ${name}\n`;
        } else {
          tapString += `[FAILED TEST] ${name}\n`;
        }
        tapString += `#\tMismatches: ${currentResult.getMismatches()}\n`;
      }

      const url = currentResult.getAppUrls() && currentResult.getAppUrls().getSession() ?
        currentResult.getAppUrls().getSession() : "No URL (session didn't start).";

      tapString += `#\tTest url: ${url}\n`;
      if (currentResult.getStepsInfo().length > 0) {
        for (let j = 0; j < currentResult.getStepsInfo().length; j += 1) {
          stepsCounter += 1;
          const currentStep = currentResult.getStepsInfo()[j];
          tapString += currentStep.getIsDifferent() ? NOT_OK : OK;
          tapString += ` ${stepsCounter} '${currentStep.getName()}', URL: ${currentStep.getAppUrls().getStep()}\n`;
        }
      } else {
        tapString += '#\tNo steps exist for this test.\n';
      }
    }

    if (stepsCounter > 0) {
      tapString = `1..${stepsCounter}\n${tapString}`;
    }

    return tapString;
  }
}

exports.TestResultsFormatter = TestResultsFormatter;
