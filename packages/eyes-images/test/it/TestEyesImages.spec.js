'use strict';

const { FileUtils } = require('@applitools/eyes-common');
const { MouseTrigger, ImageProvider, MutableImage, Location } = require('@applitools/eyes-sdk-core');
const { Eyes, BatchInfo, ConsoleLogHandler, MatchLevel, RectangleSize, Region, Target } = require('../../index');

describe('TestEyesImages', function () {
  this.timeout(5 * 60 * 1000);

  let batch;

  before(() => {
    batch = new BatchInfo('TestEyesImages');
  });

  function setup(testTitle) {
    const eyes = new Eyes();
    eyes.setBatch(batch);
    eyes.setLogHandler(new ConsoleLogHandler());

    eyes.getLogger().log(`running test: ${testTitle}`);
    return eyes;
  }

  async function teardown(eyes) {
    try {
      const results = await eyes.close();
      eyes.getLogger().log(`Mismatches: ${results.getMismatches()}`);
    } finally {
      await eyes.abort();
    }
  }

  it('TestImageProvider', async function () {
    const eyes = setup(this.test.title);
    await eyes.open('TestEyesImages', 'TestImageProvider(Bitmap)', { width: 800, height: 500 });

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

    await eyes.checkImage(new ImageProviderImpl(), this.test.title);
    await teardown(eyes);
  });

  it('TestBitmap', async function () {
    const eyes = setup(this.test.title);
    await eyes.open('TestEyesImages', 'CheckImage(Bitmap)');

    const gbg1Data = await FileUtils.readToBuffer(`${__dirname}/../fixtures/gbg1.png`);
    const gbg2Data = await FileUtils.readToBuffer(`${__dirname}/../fixtures/gbg2.png`);
    await eyes.checkImage(gbg1Data, 'TestBitmap1');
    await eyes.checkImage(gbg2Data, 'TestBitmap2');
    await teardown(eyes);
  });

  it('TestRegion', async function () {
    const eyes = setup(this.test.title);
    await eyes.open('TestEyesImages', 'TestRegion(Bitmap)');

    eyes.addMouseTrigger(MouseTrigger.MouseAction.Click, new Region(288, 44, 92, 36), new Location(10, 10));

    const gbg1Data = await FileUtils.readToBuffer(`${__dirname}/../fixtures/gbg1.png`);
    await eyes.checkRegion(gbg1Data, new Region(309, 227, 381, 215), this.test.title);
    await teardown(eyes);
  });

  it('TestBytes', async function () {
    const eyes = setup(this.test.title);
    await eyes.open('TestEyesImages', 'CheckImage(byte[])', new RectangleSize(1024, 768));

    const gbg1Data = await FileUtils.readToBuffer(`${__dirname}/../fixtures/gbg1.png`);
    const gbg2Data = await FileUtils.readToBuffer(`${__dirname}/../fixtures/gbg2.png`);
    await eyes.checkImage(new MutableImage(gbg1Data), 'TestBytes1');
    await eyes.checkImage(new MutableImage(gbg2Data), 'TestBytes2');
    await teardown(eyes);
  });

  it('TestBase64', async function () {
    const eyes = setup(this.test.title);
    await eyes.open('TestEyesImages', 'CheckImage(base64)', new RectangleSize(1024, 768));

    const gbg1Data = await FileUtils.readToBuffer(`${__dirname}/../fixtures/gbg1.png`);
    const gbg2Data = await FileUtils.readToBuffer(`${__dirname}/../fixtures/gbg2.png`);
    await eyes.checkImage(gbg1Data.toString('base64'), 'TestBase64 1');
    await eyes.checkImage(gbg2Data.toString('base64'), 'TestBase64 2');
    await teardown(eyes);
  });

  it('TestFile', async function () {
    const eyes = setup(this.test.title);
    await eyes.open('TestEyesImages', 'CheckImageFile', new RectangleSize(1024, 768));

    await eyes.checkImage(`${__dirname}/../fixtures/gbg1.png`, 'TestPath1');
    await eyes.checkImage(`${__dirname}/../fixtures/gbg2.png`, 'TestPath2');
    await teardown(eyes);
  });

  it('TestUrl', async function () {
    const eyes = setup(this.test.title);
    await eyes.open('TestEyesImages', 'CheckImageAtUrl', new RectangleSize(1024, 768));

    await eyes.checkImage('https://applitools.github.io/demo/images/gbg1.png', 'TestUrl1');
    await eyes.checkImage('https://applitools.github.io/demo/images/gbg2.png', 'TestUrl2');
    await teardown(eyes);
  });

  it('TestFluent_Path', async function () {
    const eyes = setup(this.test.title);
    await eyes.open('TestEyesImages', 'CheckImage_Fluent', new RectangleSize(1024, 768));

    await eyes.check('CheckImage_Fluent', Target.image(`${__dirname}/../fixtures/gbg1.png`));
    await teardown(eyes);
  });

  it('TestFluent_Bitmap', async function () {
    const eyes = setup(this.test.title);
    await eyes.open('TestEyesImages', 'CheckImage_Fluent', new RectangleSize(1024, 768));

    const data = await FileUtils.readToBuffer(`${__dirname}/../fixtures/gbg1.png`);
    await eyes.check('CheckImage_Fluent', Target.image(data));
    await teardown(eyes);
  });

  it('TestFluent_WithIgnoreRegion', async function () {
    const eyes = setup(this.test.title);
    await eyes.open('TestEyesImages', 'CheckImage_WithIgnoreRegion_Fluent', new RectangleSize(1024, 768));

    await eyes.check('CheckImage_WithIgnoreRegion_Fluent', Target.image(`${__dirname}/../fixtures/gbg1.png`)
      .ignoreRegions(new Region(10, 20, 30, 40)));
    await teardown(eyes);
  });

  it('TestFluent_WithRegion', async function () {
    const eyes = setup(this.test.title);
    await eyes.open('TestEyesImages', 'CheckImage_WithRegion_Fluent');

    await eyes.check('CheckImage_WithRegion_Fluent', Target.image(`${__dirname}/../fixtures/gbg1.png`)
      .region(new Region(10, 20, 30, 40)));
    await teardown(eyes);
  });

  it('TestFluent_WithDomSnapshot', async function () {
    const eyes = setup(this.test.title);
    await eyes.open('TestEyesImages', 'CheckImage_WithDomSnapshot_Fluent');

    const randomDom = '{"tagName":"HTML","style":{"background-color":"rgba(0, 0, 0, 0)","background-image":"none","background-size":"auto","color":"rgb(0, 0, 0)","border-width":"0px","border-color":"rgb(0, 0, 0)","border-style":"none","padding":"0px","margin":"0px"},"rect":{"width":929,"height":490,"top":0,"left":0},"attributes":{"lang":"en"},"childNodes":[{"tagName":"#text","text":"\\n"},{"tagName":"BODY","style":{"background-color":"rgba(0, 0, 0, 0)","background-image":"none","background-size":"auto","color":"rgb(0, 0, 0)","border-width":"0px","border-color":"rgb(0, 0, 0)","border-style":"none","padding":"0px","margin":"8px"},"rect":{"width":913,"height":458,"top":16,"left":8},"childNodes":[{"tagName":"#text","text":"\\n  "},{"tagName":"STYLE","style":{"background-color":"rgba(0, 0, 0, 0)","background-image":"none","background-size":"auto","color":"rgb(0, 0, 0)","border-width":"0px","border-color":"rgb(0, 0, 0)","border-style":"none","padding":"0px","margin":"0px"},"rect":{"width":0,"height":0,"top":0,"left":0},"childNodes":[{"tagName":"#text","text":"\\n    p {\\n      color: red;\\n      display: block;\\n      border: 1px solid blue;\\n     }\\n  "}]},{"tagName":"#text","text":"\\n  "},{"tagName":"P","style":{"background-color":"rgb(250, 250, 210)","background-image":"none","background-size":"auto","color":"rgb(255, 0, 0)","border-width":"1px","border-color":"rgb(0, 0, 255)","border-style":"solid","padding":"0px","margin":"16px 0px"},"rect":{"width":913,"height":92,"top":16,"left":8},"attributes":{"id":"p2"},"childNodes":[{"tagName":"#text","text":"Bacon ipsum dolor amet shankle brisket meatball turkey short loin pork chop short ribs t-bone shoulder. Burgdoggen tail porchetta, fatback turducken tri-tip filet mignon. Pork leberkas ham bresaola salami picanha bacon buffalo pig pork loin kielbasa. Shoulder bacon shankle, ham hock pork belly pig hamburger sirloin picanha corned beef t-bone. Chuck pork chop pork loin ball tip buffalo sausage venison short ribs alcatra. Short loin prosciutto porchetta meatloaf. T-bone short loin ham beef, jerky kevin swine leberkas shank boudin hamburger pastrami shoulder porchetta pork loin."}]},{"tagName":"#text","text":"\\n  "},{"tagName":"DIV","style":{"background-color":"rgba(0, 0, 0, 0)","background-image":"none","background-size":"auto","color":"rgb(0, 0, 0)","border-width":"10px","border-color":"rgb(255, 0, 0)","border-style":"solid","padding":"0px","margin":"0px"},"rect":{"width":220,"height":170,"top":124,"left":8},"attributes":{"style":"border: 10px solid red; width: 200px; height: 150px; overflow-y: scroll;","id":"scroll1"},"childNodes":[{"tagName":"#text","text":"\\n    "},{"tagName":"P","style":{"background-color":"rgb(250, 250, 210)","background-image":"none","background-size":"auto","color":"rgb(255, 0, 0)","border-width":"1px","border-color":"rgb(0, 0, 255)","border-style":"solid","padding":"0px","margin":"16px 0px"},"rect":{"width":183,"height":434,"top":150,"left":18},"attributes":{"id":"p1"},"childNodes":[{"tagName":"#text","text":"Bacon ipsum dolor amet shankle brisket meatball turkey short loin pork chop short ribs t-bone shoulder. Burgdoggen tail porchetta, fatback turducken tri-tip filet mignon. Pork leberkas ham bresaola salami picanha bacon buffalo pig pork loin kielbasa. Shoulder bacon shankle, ham hock pork belly pig hamburger sirloin picanha corned beef t-bone. Chuck pork chop pork loin ball tip buffalo sausage venison short ribs alcatra. Short loin prosciutto porchetta meatloaf. T-bone short loin ham beef, jerky kevin swine leberkas shank boudin hamburger pastrami shoulder porchetta pork loin."}]},{"tagName":"#text","text":"\\n    "},{"tagName":"P","style":{"background-color":"rgb(250, 250, 210)","background-image":"none","background-size":"auto","color":"rgb(255, 0, 0)","border-width":"1px","border-color":"rgb(0, 0, 255)","border-style":"solid","padding":"0px","margin":"16px 0px"},"rect":{"width":183,"height":326,"top":600,"left":18},"childNodes":[{"tagName":"#text","text":"Landjaeger shoulder leberkas pig doner salami ground round short loin buffalo swine jowl ham hock cow. Bresaola corned beef swine biltong meatball. Landjaeger turkey salami, leberkas strip steak ribeye bacon shoulder tri-tip pastrami bresaola tongue. Capicola ham frankfurter salami, pork chop short ribs turducken kielbasa alcatra flank sausage sirloin andouille. Sausage frankfurter spare ribs sirloin biltong hamburger kevin ham hock."}]},{"tagName":"#text","text":"\\n    "},{"tagName":"P","style":{"background-color":"rgb(250, 250, 210)","background-image":"none","background-size":"auto","color":"rgb(255, 0, 0)","border-width":"1px","border-color":"rgb(0, 0, 255)","border-style":"solid","padding":"0px","margin":"16px 0px"},"rect":{"width":183,"height":326,"top":942,"left":18},"childNodes":[{"tagName":"#text","text":"Frankfurter turkey ham hock strip steak kielbasa filet mignon pancetta bresaola pastrami cupim. Tenderloin kevin turducken ground round, porchetta pig shank. Tri-tip pork ball tip pork belly sirloin t-bone fatback flank bresaola. Bresaola biltong corned beef chuck leberkas t-bone cupim, fatback doner jerky boudin. Rump shank tongue kevin bresaola leberkas prosciutto spare ribs ribeye frankfurter boudin tri-tip pork loin. Hamburger sirloin shankle tri-tip."}]},{"tagName":"#text","text":"\\n  "}]},{"tagName":"#text","text":"\\n  "},{"tagName":"P","style":{"background-color":"rgb(250, 250, 210)","background-image":"none","background-size":"auto","color":"rgb(255, 0, 0)","border-width":"1px","border-color":"rgb(0, 0, 255)","border-style":"solid","padding":"0px","margin":"16px 0px"},"rect":{"width":913,"height":74,"top":310,"left":8},"childNodes":[{"tagName":"#text","text":"Landjaeger shoulder leberkas pig doner salami ground round short loin buffalo swine jowl ham hock cow. Bresaola corned beef swine biltong meatball. Landjaeger turkey salami, leberkas strip steak ribeye bacon shoulder tri-tip pastrami bresaola tongue. Capicola ham frankfurter salami, pork chop short ribs turducken kielbasa alcatra flank sausage sirloin andouille. Sausage frankfurter spare ribs sirloin biltong hamburger kevin ham hock."}]},{"tagName":"#text","text":"\\n  "},{"tagName":"P","style":{"background-color":"rgb(250, 250, 210)","background-image":"none","background-size":"auto","color":"rgb(255, 0, 0)","border-width":"1px","border-color":"rgb(0, 0, 255)","border-style":"solid","padding":"0px","margin":"16px 0px"},"rect":{"width":913,"height":74,"top":400,"left":8},"childNodes":[{"tagName":"#text","text":"Frankfurter turkey ham hock strip steak kielbasa filet mignon pancetta bresaola pastrami cupim. Tenderloin kevin turducken ground round, porchetta pig shank. Tri-tip pork ball tip pork belly sirloin t-bone fatback flank bresaola. Bresaola biltong corned beef chuck leberkas t-bone cupim, fatback doner jerky boudin. Rump shank tongue kevin bresaola leberkas prosciutto spare ribs ribeye frankfurter boudin tri-tip pork loin. Hamburger sirloin shankle tri-tip."}]},{"tagName":"#text","text":"\\n\\n"}]}],"css":"p{background:lightgoldenrodyellow;}p{color:red;display:block;border:1px solid blue;}"}';
    await eyes.check('CheckImage_WithDomSnapshot_Fluent', Target.image(`${__dirname}/../fixtures/gbg1.png`)
      .withDom(randomDom).withLocation({ x: 10, y: 50 }));
    await teardown(eyes);
  });

  it('TestLayout2', async function () {
    const eyes = setup(this.test.title);
    eyes.setMatchLevel(MatchLevel.Layout);
    await eyes.open('CheckLayout2', 'Check Layout2', new RectangleSize(1024, 768));

    const path = '../fixtures/yahoo1a.png';
    // var path = '../fixtures/yahoo1b.png';
    // var path = '../fixtures/aol1.png';
    // var path = '../fixtures/aol2.png';

    eyes.check(path, Target.path(path));
    await teardown(eyes);
  });
});
