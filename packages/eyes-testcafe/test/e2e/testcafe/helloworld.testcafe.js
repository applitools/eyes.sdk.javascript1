/* global fixture */

'use strict';

const { CheckSettings } = require('@applitools/eyes-sdk-core');
const { Configuration } = require('@applitools/eyes-common');
const { Eyes } = require('../../../');

fixture`Hello world`.page`https://applitools.com/helloworld`; // eslint-disable-line no-unused-expressions
// .afterEach(async () => eyes.close())
// .after(async () => eyes.waitForResults(true));

test('testcafe Eyes e2e helloworld', async (t) => {
  const configuration = new Configuration({ showLogs: !!process.env.APPLITOOLS_SHOW_LOGS, viewportSize: { width: 800, height: 600 } });
  const eyes = new Eyes({ t, configuration });
  await eyes.open('TestCafe app', 'TestCafe Eyes e2e helloworld');
  await eyes.check('TestCafe hellowold', new CheckSettings());
  await eyes.close();
});
