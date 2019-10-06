'use strict';

const puppeteer = require('puppeteer');
const {makeVisualGridClient} = require('../src/visual-grid-client');
const {getProcessPageAndSerialize} = require('@applitools/dom-snapshot');
const {Logger} = require('@applitools/eyes-common');
const {delay: _delay} = require('@applitools/functional-commons');
const debug = require('debug')('eyes:render');

(async function() {
  const website = process.argv[2];

  if (!website) {
    console.log('no website passed');
    return;
  }

  console.log('checking website:', website);

  const {openEyes, closeBatch} = makeVisualGridClient({
    apiKey: process.env.APPLITOOLS_API_KEY,
    logger: new Logger(!!process.env.APPLITOOLS_SHOW_LOGS, 'eyes:vgc'),
    proxy: process.env.APPLITOOLS_PROXY,
  });

  const {checkWindow, close} = await openEyes({
    appName: 'render script',
    testName: `render script ${website}`,
    batchName: 'Render VGC',
    browser: [{width: 1024, height: 768, name: 'chrome'}],
    notifyOnCompletion: true,
  });

  debug('open done');

  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  const processPageAndSerialize = `(${await getProcessPageAndSerialize()})()`;

  await page.setViewport({width: 1024, height: 768});
  await page.goto(website);

  debug('navigation done');

  await _delay(2000);
  const frame = await page.evaluate(processPageAndSerialize);

  debug('processPage done');

  const mapBlobs = f => {
    f.resourceContents = f.blobs.map(({url, type, value}) => ({
      url,
      type,
      value: Buffer.from(value, 'base64'),
    }));
    f.frames.forEach(mapBlobs);
  };
  mapBlobs(frame);

  debug('decoding done');

  frame.ignore = [
    {selector: '.some-div-to-ignore'},
    {selector: 'body > div > div:nth-child(1) > div.fancy.title.primary'},
  ];
  checkWindow(frame);
  const results = await close(false);
  await closeBatch();

  if (results.some(r => r instanceof Error)) {
    console.log(
      '\nTest error:\n\t',
      results.map(r => r.message || r).reduce((acc, m) => ((acc = `${acc}\n\t${m}`), acc), ''),
    );
  } else {
    console.log(
      '\nTest result:\n\t',
      results
        .map(r => `${r.getStatus()} ${r.getUrl()} renderId: ${r.getStepsInfo()[0].getRenderId()}`)
        .join('\n\t'),
    );
  }
  await browser.close();

  debug('browser closed');
})();
