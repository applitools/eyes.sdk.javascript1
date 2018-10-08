'use strict';

const { ConsoleLogHandler, Region } = require('@applitools/eyes.sdk.core');
const { Eyes, Target } = require('../index');

let eyes = null;
describe('Eyes.Images.JavaScript - check api', function () {
  this.timeout(5 * 60 * 1000);

  before(async function () {
    eyes = new Eyes();
    eyes.setLogHandler(new ConsoleLogHandler(true));
  });

  it('test check method', async function () {
    await eyes.open(this.test.parent.title, this.test.title);
    await eyes.check('TestCheckImage_Fluent', Target.image(`${__dirname}/resources/minions-800x500.png`).ignore(new Region(10, 20, 30, 40)));
    await eyes.check('TestCheckRegion_Fluent', Target.region(`${__dirname}/resources/minions-800x500.png`, new Region({ left: 315, top: 290, width: 190, height: 135 })));
    await eyes.check('TestCheckImage_ByUrl', Target.url('https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_120x44dp.png'));
    await eyes.close();
  });

  afterEach(async function () {
    await eyes.abortIfNotClosed();
  });
});
