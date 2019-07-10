'use strict';

const assert = require('assert');
const { GeneralUtils } = require('@applitools/eyes-common');
const { Eyes, ConsoleLogHandler, TestResultsStatus } = require('../../index');

let /** @type {Eyes} */ eyes;
describe('EyesImages.TestImageDiffs', function () {
  this.timeout(5 * 60 * 1000);

  before(function () {
    eyes = new Eyes();
    eyes.setLogHandler(new ConsoleLogHandler(false));
    // eyes.setProxy('http://localhost:8888');
  });

  it('ShouldDetectDiffs', async function () {
    const testName = `${this.test.title}_${GeneralUtils.randomAlphanumeric()}`;
    const image1 = `${__dirname}/../fixtures/image1.png`;
    const image2 = `${__dirname}/../fixtures/image2.png`;

    await eyes.open(this.test.parent.title, testName);
    await eyes.checkImage(image1);
    await eyes.close(false);

    await eyes.open(this.test.parent.title, testName);
    await eyes.checkImage(image2);
    const results = await eyes.close(false);

    assert.strictEqual(results.getStatus(), TestResultsStatus.Unresolved);
  });
});
