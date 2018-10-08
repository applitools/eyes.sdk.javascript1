'use strict';

const { ConsoleLogHandler, RectangleSize, Region, Location, MouseTrigger } = require('@applitools/eyes.sdk.core');
const { Eyes } = require('../index');

let eyes = null;
describe('Eyes.Images.JavaScript - simple check image', function () {
  this.timeout(5 * 60 * 1000);

  before(async function () {
    eyes = new Eyes();
    eyes.setLogHandler(new ConsoleLogHandler(true));

    // eyes.setProxy('http://localhost:9999');
    eyes.setHostOS('Mac OS X 10.10');
    eyes.setHostApp('My browser');
  });

  it('test check method', async function () {
    await eyes.open(this.test.parent.title, this.test.title, new RectangleSize(1000, 633));

    await eyes.checkImage(`${__dirname}/resources/image2.png`, 'My second image');

    console.log(`Running session: ${eyes.getRunningSession()}`);
    eyes.addMouseTrigger(MouseTrigger.MouseAction.Click, new Region(288, 44, 92, 36), new Location(10, 10));
    await eyes.checkImage(`${__dirname}/resources/image1.png`, 'My first image');

    console.log(`Running session: ${eyes.getRunningSession()}`);
    eyes.addMouseTrigger(MouseTrigger.MouseAction.Click, new Region(288, 44, 92, 36), new Location(10, 10));
    await eyes.checkRegion(`${__dirname}/resources/image1.png`, new Region(309, 227, 381, 215), 'Specific region');

    const results = await eyes.close(false);
    console.log(`Results: ${results}`);
  });

  afterEach(async function () {
    await eyes.abortIfNotClosed();
  });
});
