'use strict'

require('chromedriver')
const {By} = require('selenium-webdriver')
const {getDriver} = require('../coverage/custom/util/TestSetup')
const {
  Eyes,
  Target,
  ConsoleLogHandler,
  StitchMode,
  VisualGridRunner,
  BatchInfo,
} = require('../../index')

let /** @type {WebDriver} */ driver, /** @type {Eyes} */ eyes, batch
describe('CheckFluent', () => {
  before(async function() {
    driver = await getDriver('CHROME')

    batch = new BatchInfo()
    await driver.get('https://applitools.github.io/demo/TestPages/FramesTestPage/')
  })

  beforeEach(async function() {
    if (this.currentTest.title.includes('on VG')) {
      eyes = new Eyes(new VisualGridRunner())
    } else {
      eyes = new Eyes()
    }
    eyes.setBatch(batch)
    eyes.setLogHandler(new ConsoleLogHandler(false))
    driver = await eyes.open(driver, this.test.parent.title, this.currentTest.title, {
      width: 700,
      height: 460,
    })
  })

  it('check region with ignored region', async () => {
    await driver.executeScript(`
      const block = document.querySelector('#overflowing-div');
      const random = document.createElement('div');
      random.innerText = Date.now();
      random.id = 'random-div'
      block.prepend(random)
    `)
    await eyes.check(
      'Ignore Region',
      Target.region(By.id('overflowing-div')).ignoreRegions(By.id('random-div')),
    )
    return eyes.close()
  })

  it('check region fully', async () => {
    eyes.setStitchMode(StitchMode.CSS)
    await eyes.check(
      'Region Fully',
      Target.region(By.id('overflowing-div-image'))
        .ignoreRegions(driver.findElement(By.id('overflowing-div')))
        .fully(),
    )
    return eyes.close()
  })

  it('check region fully with scroll', async () => {
    eyes.setStitchMode(StitchMode.SCROLL)
    await eyes.check(
      'Region Fully',
      Target.region(By.id('overflowing-div-image'))
        .ignoreRegions(driver.findElement(By.id('overflowing-div')))
        .fully(),
    )
    return eyes.close()
  })

  it('check region fully with scroll on VG', async () => {
    eyes.setStitchMode(StitchMode.SCROLL)
    await eyes.check(
      'Region Fully',
      Target.region(By.id('overflowing-div-image'))
        .ignoreRegions(driver.findElement(By.id('overflowing-div')))
        .fully(),
    )
    return eyes.close()
  })

  // TODO: review commented out tests
  /* it('TestCheckWindow', async function () {
    await eyes.check('Window', Target.window()
      .timeout(5000)
      .ignoreRegions(new Region(50, 50, 100, 100))
      .ignoreRegions(By.id('overflowing-div')));
    return eyes.close();
  });

  it('TestCheckWindowFully', async function () {
    await eyes.check('Full Window', Target.window()
      .floatingRegion(new Region(10, 10, 20, 20), 3, 3, 20, 30)
      .floatingRegion(By.id('overflowing-div'), 3, 3, 20, 30)
      .fully());
    return eyes.close();
  });

  it('TestCheckRegion', async function () {
    await eyes.check('Region by selector', Target.region(By.id('overflowing-div'))
      .ignoreRegions(new Region(50, 50, 100, 100)));
    return eyes.close();
  });

  it('TestCheckElementFully', async function () {
    await eyes.check('Region by element - fully', Target.region(driver.findElement(By.id('overflowing-div-image'))).fully());
    return eyes.close();
  });

  it('TestCheckFrame', async function () {
    await eyes.check('Frame', Target.frame('frame1'));
    return eyes.close();
  });

  it('TestCheckFrameFully', async function () {
    await eyes.check('Full Frame', Target.frame('frame1').fully());
    return eyes.close();
  });

  it('TestCheckRegionInFrame', async function () {
    await eyes.check('Region in Frame', Target.frame('frame1').region(By.id('inner-frame-div')).fully());
    return eyes.close();
  });

  it('TestCheckFrameInFrameFully', async function () {
    await eyes.check('Full Frame in Frame', Target.frame('frame1')
      .frame('frame1-1')
      .fully());
    return eyes.close();
  });

  // it('TestCheckRegionInFrameInFrame', async function () {
  //   await eyes.check('Region in Frame in Frame', Target.frame('frame1')
  //     .frame('frame1-1')
  //     .region(By.css('img'))
  //     .fully());
  // });

  it('TestScrollbarsHiddenAndReturned', async function () {
    await eyes.check('Window (Before)', Target.window().fully());

    await eyes.check(
      'Inner frame div',
      Target.frame('frame1')
        .region(By.id('inner-frame-div'))
        .fully()
    );

    await eyes.check('Window (After)', Target.window().fully());

    return eyes.close();
  });

  it('TestCheckRegionInFrame2', async function () {
    await eyes.check('Inner frame div 1', Target.frame('frame1')
      .region(By.id('inner-frame-div'))
      .fully()
      .timeout(5000)
      .ignoreRegions(new Region(50, 50, 100, 100)));

    await eyes.check('Inner frame div 2', Target.frame('frame1')
      .region(By.id('inner-frame-div'))
      .fully()
      .ignoreRegions(new Region(50, 50, 100, 100))
      .ignoreRegions(new Region(70, 170, 90, 90)));

    await eyes.check('Inner frame div 3', Target.frame('frame1')
      .region(By.id('inner-frame-div'))
      .fully()
      .timeout(5000));

    await eyes.check('Inner frame div 4', Target.frame('frame1')
      .region(By.id('inner-frame-div'))
      .fully());

    await eyes.check('Full frame with floating region', Target.frame('frame1')
      .fully()
      .layout()
      .floatingRegion(new Region(200, 200, 150, 150), 25, 25, 25, 25));

    return eyes.close();
  }); */

  afterEach(async function() {
    return eyes.abort()
  })

  after(function() {
    return driver.quit()
  })
})
