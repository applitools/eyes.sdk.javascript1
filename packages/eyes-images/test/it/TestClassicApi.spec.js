'use strict';

const { FileUtils } = require('@applitools/eyes-common');
const { MouseTrigger } = require('@applitools/eyes-sdk-core');
const { Eyes, ImageProvider, ConsoleLogHandler, Region, Location, MutableImage } = require('../../index');

let /** @type {Eyes} */ eyes;
describe('EyesImages.TestClassicApi', function () {
  this.timeout(5 * 60 * 1000);

  before(function () {
    eyes = new Eyes();
    eyes.setLogHandler(new ConsoleLogHandler(false));
    // eyes.setProxy('http://localhost:8888');

    eyes.setHostOS('Mac OS X 10.10');
    eyes.setHostApp('My browser');
  });

  beforeEach(async function () {
    await eyes.open(this.test.parent.title, this.currentTest.title);
  });

  it('TestImage', async function () {
    eyes.addMouseTrigger(MouseTrigger.MouseAction.Click, new Region(288, 44, 92, 36), new Location(10, 10));

    await eyes.checkImage(`${__dirname}/../fixtures/image1.png`, this.test.title);
    await eyes.close();
  });

  it('TestRegion', async function () {
    eyes.addMouseTrigger(MouseTrigger.MouseAction.Click, new Region(288, 44, 92, 36), new Location(10, 10));

    await eyes.checkRegion(`${__dirname}/../fixtures/image1.png`, new Region(309, 227, 381, 215), this.test.title);
    await eyes.close();
  });

  it('TestImageProvider', async function () {
    const ImageProviderImpl = class ImageProviderImpl extends ImageProvider {
      // noinspection JSUnusedGlobalSymbols
      /**
       * @override
       */
      async getImage() {
        const data = await FileUtils.readToBuffer(`${__dirname}/../fixtures/minions-800x500.png`);
        return new MutableImage(data);
      }
    };

    await eyes.setViewportSize({ width: 800, height: 500 });
    await eyes.checkImage(new ImageProviderImpl(), this.test.title);
    await eyes.close();
  });

  afterEach(async function () {
    await eyes.abort();
  });
});
