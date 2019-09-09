/* global fixture */

'use strict';

const { Configuration } = require('@applitools/eyes-common');
const { Selector } = require('testcafe');
const { Eyes, Target } = require('../../../');

fixture`Hello world`.page`https://applitools.com/helloworld`; // eslint-disable-line no-unused-expressions
// .afterEach(async () => eyes.close())
// .after(async () => eyes.waitForResults(true));

test('helloworld region', async (t) => {
  const configuration = new Configuration({ showLogs: !!process.env.APPLITOOLS_SHOW_LOGS, viewportSize: { width: 800, height: 600 } });
  const eyes = new Eyes({ t, configuration });
  await t.resizeWindow(800, 600);
  await eyes.open('Applitools helloworld', 'eyes-testcafe e2e - element');
  await eyes.check('some tag', Target.region(Selector('.fancy.title.primary')));
  await eyes.close();
});
