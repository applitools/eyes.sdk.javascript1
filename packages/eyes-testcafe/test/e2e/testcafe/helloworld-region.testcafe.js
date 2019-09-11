/* global fixture */

'use strict';

const { Configuration, Region } = require('@applitools/eyes-common');
const { Eyes, Target } = require('../../../');

fixture`Hello world`.page`https://applitools.com/helloworld`; // eslint-disable-line no-unused-expressions

test('helloworld region', async (t) => {
  const configuration = new Configuration({ showLogs: !!process.env.APPLITOOLS_SHOW_LOGS, viewportSize: { width: 800, height: 600 } });
  const eyes = new Eyes({ t, configuration });
  await t.resizeWindow(800, 600);
  await eyes.open('Applitools helloworld', 'eyes-testcafe e2e - region');
  await eyes.check('some tag', Target.region(new Region({ width: 625, height: 162, top: 100, left: 87 })));
  await eyes.close();
});
