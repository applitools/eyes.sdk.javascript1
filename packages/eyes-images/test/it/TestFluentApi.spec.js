'use strict';

const { Eyes, Target, ConsoleLogHandler, Region, RectangleSize } = require('../../index');

let /** @type {Eyes} */ eyes;
describe('EyesImages.TestFluentApi', function () {
  this.timeout(5 * 60 * 1000);

  before(function () {
    eyes = new Eyes();
    eyes.setLogHandler(new ConsoleLogHandler(false));
    // eyes.setProxy('http://localhost:8888');
  });

  beforeEach(async function () {
    await eyes.open(this.test.parent.title, this.currentTest.title);
  });

  it('TestImage', async function () {
    await eyes.check(this.test.title, Target.image(`${__dirname}/../fixtures/minions-800x500.png`));
    await eyes.close();
  });

  it('TestImageWithIgnoreRegion', async function () {
    await eyes.check(this.test.title, Target.image(`${__dirname}/../fixtures/minions-800x500.png`)
      .ignoreRegions(new Region(10, 20, 30, 40)));
    await eyes.close();
  });

  it('TestRegion', async function () {
    await eyes.check(this.test.title, Target.region(`${__dirname}/../fixtures/minions-800x500.png`, new Region({ left: 315, top: 290, width: 190, height: 135 })));
    await eyes.close();
  });

  it('TestImageByUrl', async function () {
    await eyes.check(this.test.title, Target.url('https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_120x44dp.png')
      .imageSize(new RectangleSize(240, 88)));
    await eyes.close();
  });

  it('TestImageWithDom', async function () {
    const randomDom = '{"tagName":"HTML","style":{"background-color":"rgba(0, 0, 0, 0)","background-image":"none","background-size":"auto","color":"rgb(0, 0, 0)","border-width":"0px","border-color":"rgb(0, 0, 0)","border-style":"none","padding":"0px","margin":"0px"},"rect":{"width":929,"height":490,"top":0,"left":0},"attributes":{"lang":"en"},"childNodes":[{"tagName":"#text","text":"\\n"},{"tagName":"BODY","style":{"background-color":"rgba(0, 0, 0, 0)","background-image":"none","background-size":"auto","color":"rgb(0, 0, 0)","border-width":"0px","border-color":"rgb(0, 0, 0)","border-style":"none","padding":"0px","margin":"8px"},"rect":{"width":913,"height":458,"top":16,"left":8},"childNodes":[{"tagName":"#text","text":"\\n  "},{"tagName":"STYLE","style":{"background-color":"rgba(0, 0, 0, 0)","background-image":"none","background-size":"auto","color":"rgb(0, 0, 0)","border-width":"0px","border-color":"rgb(0, 0, 0)","border-style":"none","padding":"0px","margin":"0px"},"rect":{"width":0,"height":0,"top":0,"left":0},"childNodes":[{"tagName":"#text","text":"\\n    p {\\n      color: red;\\n      display: block;\\n      border: 1px solid blue;\\n     }\\n  "}]},{"tagName":"#text","text":"\\n  "},{"tagName":"P","style":{"background-color":"rgb(250, 250, 210)","background-image":"none","background-size":"auto","color":"rgb(255, 0, 0)","border-width":"1px","border-color":"rgb(0, 0, 255)","border-style":"solid","padding":"0px","margin":"16px 0px"},"rect":{"width":913,"height":92,"top":16,"left":8},"attributes":{"id":"p2"},"childNodes":[{"tagName":"#text","text":"Bacon ipsum dolor amet shankle brisket meatball turkey short loin pork chop short ribs t-bone shoulder. Burgdoggen tail porchetta, fatback turducken tri-tip filet mignon. Pork leberkas ham bresaola salami picanha bacon buffalo pig pork loin kielbasa. Shoulder bacon shankle, ham hock pork belly pig hamburger sirloin picanha corned beef t-bone. Chuck pork chop pork loin ball tip buffalo sausage venison short ribs alcatra. Short loin prosciutto porchetta meatloaf. T-bone short loin ham beef, jerky kevin swine leberkas shank boudin hamburger pastrami shoulder porchetta pork loin."}]},{"tagName":"#text","text":"\\n  "},{"tagName":"DIV","style":{"background-color":"rgba(0, 0, 0, 0)","background-image":"none","background-size":"auto","color":"rgb(0, 0, 0)","border-width":"10px","border-color":"rgb(255, 0, 0)","border-style":"solid","padding":"0px","margin":"0px"},"rect":{"width":220,"height":170,"top":124,"left":8},"attributes":{"style":"border: 10px solid red; width: 200px; height: 150px; overflow-y: scroll;","id":"scroll1"},"childNodes":[{"tagName":"#text","text":"\\n    "},{"tagName":"P","style":{"background-color":"rgb(250, 250, 210)","background-image":"none","background-size":"auto","color":"rgb(255, 0, 0)","border-width":"1px","border-color":"rgb(0, 0, 255)","border-style":"solid","padding":"0px","margin":"16px 0px"},"rect":{"width":183,"height":434,"top":150,"left":18},"attributes":{"id":"p1"},"childNodes":[{"tagName":"#text","text":"Bacon ipsum dolor amet shankle brisket meatball turkey short loin pork chop short ribs t-bone shoulder. Burgdoggen tail porchetta, fatback turducken tri-tip filet mignon. Pork leberkas ham bresaola salami picanha bacon buffalo pig pork loin kielbasa. Shoulder bacon shankle, ham hock pork belly pig hamburger sirloin picanha corned beef t-bone. Chuck pork chop pork loin ball tip buffalo sausage venison short ribs alcatra. Short loin prosciutto porchetta meatloaf. T-bone short loin ham beef, jerky kevin swine leberkas shank boudin hamburger pastrami shoulder porchetta pork loin."}]},{"tagName":"#text","text":"\\n    "},{"tagName":"P","style":{"background-color":"rgb(250, 250, 210)","background-image":"none","background-size":"auto","color":"rgb(255, 0, 0)","border-width":"1px","border-color":"rgb(0, 0, 255)","border-style":"solid","padding":"0px","margin":"16px 0px"},"rect":{"width":183,"height":326,"top":600,"left":18},"childNodes":[{"tagName":"#text","text":"Landjaeger shoulder leberkas pig doner salami ground round short loin buffalo swine jowl ham hock cow. Bresaola corned beef swine biltong meatball. Landjaeger turkey salami, leberkas strip steak ribeye bacon shoulder tri-tip pastrami bresaola tongue. Capicola ham frankfurter salami, pork chop short ribs turducken kielbasa alcatra flank sausage sirloin andouille. Sausage frankfurter spare ribs sirloin biltong hamburger kevin ham hock."}]},{"tagName":"#text","text":"\\n    "},{"tagName":"P","style":{"background-color":"rgb(250, 250, 210)","background-image":"none","background-size":"auto","color":"rgb(255, 0, 0)","border-width":"1px","border-color":"rgb(0, 0, 255)","border-style":"solid","padding":"0px","margin":"16px 0px"},"rect":{"width":183,"height":326,"top":942,"left":18},"childNodes":[{"tagName":"#text","text":"Frankfurter turkey ham hock strip steak kielbasa filet mignon pancetta bresaola pastrami cupim. Tenderloin kevin turducken ground round, porchetta pig shank. Tri-tip pork ball tip pork belly sirloin t-bone fatback flank bresaola. Bresaola biltong corned beef chuck leberkas t-bone cupim, fatback doner jerky boudin. Rump shank tongue kevin bresaola leberkas prosciutto spare ribs ribeye frankfurter boudin tri-tip pork loin. Hamburger sirloin shankle tri-tip."}]},{"tagName":"#text","text":"\\n  "}]},{"tagName":"#text","text":"\\n  "},{"tagName":"P","style":{"background-color":"rgb(250, 250, 210)","background-image":"none","background-size":"auto","color":"rgb(255, 0, 0)","border-width":"1px","border-color":"rgb(0, 0, 255)","border-style":"solid","padding":"0px","margin":"16px 0px"},"rect":{"width":913,"height":74,"top":310,"left":8},"childNodes":[{"tagName":"#text","text":"Landjaeger shoulder leberkas pig doner salami ground round short loin buffalo swine jowl ham hock cow. Bresaola corned beef swine biltong meatball. Landjaeger turkey salami, leberkas strip steak ribeye bacon shoulder tri-tip pastrami bresaola tongue. Capicola ham frankfurter salami, pork chop short ribs turducken kielbasa alcatra flank sausage sirloin andouille. Sausage frankfurter spare ribs sirloin biltong hamburger kevin ham hock."}]},{"tagName":"#text","text":"\\n  "},{"tagName":"P","style":{"background-color":"rgb(250, 250, 210)","background-image":"none","background-size":"auto","color":"rgb(255, 0, 0)","border-width":"1px","border-color":"rgb(0, 0, 255)","border-style":"solid","padding":"0px","margin":"16px 0px"},"rect":{"width":913,"height":74,"top":400,"left":8},"childNodes":[{"tagName":"#text","text":"Frankfurter turkey ham hock strip steak kielbasa filet mignon pancetta bresaola pastrami cupim. Tenderloin kevin turducken ground round, porchetta pig shank. Tri-tip pork ball tip pork belly sirloin t-bone fatback flank bresaola. Bresaola biltong corned beef chuck leberkas t-bone cupim, fatback doner jerky boudin. Rump shank tongue kevin bresaola leberkas prosciutto spare ribs ribeye frankfurter boudin tri-tip pork loin. Hamburger sirloin shankle tri-tip."}]},{"tagName":"#text","text":"\\n\\n"}]}],"css":"p{background:lightgoldenrodyellow;}p{color:red;display:block;border:1px solid blue;}"}';
    await eyes.check(this.test.title, Target.image(`${__dirname}/../fixtures/minions-800x500.png`)
      .withDom(randomDom).withLocation({ x: 10, y: 50 }));
    await eyes.close();
  });

  afterEach(async function () {
    await eyes.abort();
  });
});
