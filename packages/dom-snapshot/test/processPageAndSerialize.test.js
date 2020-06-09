'use strict';
const {describe, it, before, after, beforeEach, afterEach} = require('mocha');
const {expect} = require('chai');
const puppeteer = require('puppeteer');
const {delay} = require('@applitools/functional-commons');
const {getProcessPageAndSerialize} = require('../index');
const arrayBufferToBase64 = require('../src/browser/arrayBufferToBase64');
const {testServer} = require('@applitools/sdk-shared');
const {loadFixtureBuffer, loadJsonFixture} = require('./util/loadFixture');
const fs = require('fs');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
const {resolve} = require('path');
const {JSDOM} = require('jsdom');
const {version} = require('../package.json');

function decodeFrame(frame) {
  return Object.assign(frame, {
    blobs: frame.blobs.map(({url, type, value}) => ({
      url,
      type,
      value: Buffer.from(value, 'base64'),
    })),
    frames: frame.frames.map(decodeFrame),
  });
}

describe('processPage', () => {
  let server;
  let browser;
  let page;
  let processPage;
  let logPromise;

  before(async () => {
    server = await testServer({port: 7373});
    const _processPageAndSerialize = await getProcessPageAndSerialize();
    processPage = ({showLogs, useSessionCache, dontFetchResources} = {}) =>
      page
        .evaluate(
          `(${_processPageAndSerialize})(document, {
            showLogs: ${showLogs},
            useSessionCache: ${useSessionCache},
            dontFetchResources: ${dontFetchResources},
          })`,
        )
        .then(decodeFrame);
  });

  after(async () => {
    await server.close();
  });

  beforeEach(async () => {
    browser = await puppeteer.launch({headless: true}); // in before each because in the cors tests puppeteer was somehow reusing the previous test's app handler
    page = await browser.newPage();
    await page.setCacheEnabled(false); // not sure if this helps anything, but it feels reasonable to do

    logPromise = Promise.resolve();
    page.on('console', msg => {
      logPromise = logPromise.then(async () => {
        const args = msg.args();
        if (args[0] && (await args[0].jsonValue()).match(/\[dom-snapshot\]/)) {
          const values = await Promise.all(msg.args().map(arg => arg.jsonValue()));
          console.log(values.join(' '));
        }
      });
    });
  });

  afterEach(async () => {
    await logPromise;
    await browser.close();
    // await delay(100000);
  });

  it('works for external resources, internal resources and blobs', async () => {
    const url = 'http://localhost:7373/test-visual-grid.html';
    await page.goto(url);
    await delay(500);
    const result = await processPage();

    const blobUrlMap = {};

    for (const el of result.cdt) {
      const attr = el.attributes && el.attributes.find(x => x.name === 'data-blob');
      if (attr) {
        if (el.nodeName === 'LINK') {
          const hrefAttr = el.attributes.find(x => x.name === 'href');
          blobUrlMap[hrefAttr.value] = attr.value;
          hrefAttr.value = attr.value;
        }

        if (el.nodeName === 'IMG') {
          const srcAttr = el.attributes.find(x => x.name === 'src');
          blobUrlMap[srcAttr.value] = attr.value;
          srcAttr.value = attr.value;
        }
      }
    }

    for (const blob of result.blobs) {
      if (blob.url in blobUrlMap) {
        blob.url = `http://localhost:7373/${blobUrlMap[blob.url]}`;
      }
    }

    if (process.env.APPLITOOLS_UPDATE_FIXTURES) {
      const cdtStr = JSON.stringify(result.cdt, null, 2);
      fs.writeFileSync(resolve(__dirname, 'fixtures/test-visual-grid.puppeteer.cdt.json'), cdtStr);
    }

    const cdt = loadJsonFixture('test-visual-grid.puppeteer.cdt.json');
    const blobs = [
      {
        url: 'http://localhost:7373/smurfs.jpg',
        type: 'image/jpeg',
        value: loadFixtureBuffer('smurfs.jpg'),
      },
      {
        url: 'http://localhost:7373/blob1',
        type: 'image/jpeg',
        value: loadFixtureBuffer('smurfs.jpg'),
      },
      {
        url: 'http://localhost:7373/test.css',
        type: 'text/css; charset=UTF-8',
        value: loadFixtureBuffer('test.css'),
      },
      {
        url: 'http://localhost:7373/smurfs4.jpg',
        type: 'image/jpeg',
        value: loadFixtureBuffer('smurfs4.jpg'),
      },
      {
        url: 'http://localhost:7373/blob2',
        type: 'text/css',
        value: loadFixtureBuffer('blob.css'),
      },
      {
        url: 'http://localhost:7373/imported2.css',
        type: 'text/css; charset=UTF-8',
        value: loadFixtureBuffer('imported2.css'),
      },
      {
        url: 'http://localhost:7373/smurfs-style-attr.jpg',
        type: 'image/jpeg',
        value: loadFixtureBuffer('smurfs-style-attr.jpg'),
      },
    ];

    const resourceUrls = ['http://localhost:7374/get-cors.css'];

    // the following assertions are here so that the mocha doesn't get stuck if the test fails on big blobs
    expect(result.cdt).to.eql(cdt);
    expect(result.resourceUrls).to.eql(resourceUrls);
    expect(result.blobs.map(b => b.url)).to.eql(blobs.map(b => b.url));

    expect(result).to.eql({
      blobs,
      cdt,
      frames: [],
      srcAttr: null,
      resourceUrls,
      url,
      scriptVersion: version,
    });
  });

  it('rerturns all CDT resources while having a fake shadow root element', async () => {
    const url = 'http://localhost:7373/fakeShadow.html';
    await page.goto(url);
    await delay(500);
    const result = await processPage();

    const blobUrlMap = {};

    for (const el of result.cdt) {
      const attr = el.attributes && el.attributes.find(x => x.name === 'data-blob');
      if (attr) {
        if (el.nodeName === 'LINK') {
          const hrefAttr = el.attributes.find(x => x.name === 'href');
          blobUrlMap[hrefAttr.value] = attr.value;
          hrefAttr.value = attr.value;
        }
      }
    }

    if (process.env.APPLITOOLS_UPDATE_FIXTURES) {
      const cdtStr = JSON.stringify(result.cdt, null, 2);
      fs.writeFileSync(resolve(__dirname, 'fixtures/fake-shadow.puppeteer.cdt.json'), cdtStr);
    }

    const cdt = loadJsonFixture('fake-shadow.puppeteer.cdt.json');
    const blobs = [
      {
        url: 'http://localhost:7373/smurfs.jpg',
        type: 'image/jpeg',
        value: loadFixtureBuffer('smurfs.jpg'),
      },
      {
        url: 'http://localhost:7373/test.css',
        type: 'text/css; charset=UTF-8',
        value: loadFixtureBuffer('test.css'),
      },
    ];
    const resourceUrls = [];

    expect(result.blobs.map(b => b.url)).to.eql(blobs.map(b => b.url));
    expect(result.cdt).to.eql(cdt);
    expect(result.resourceUrls).to.eql(resourceUrls);
  });

  it('works for iframes', async () => {
    const url = 'http://localhost:7373/test-iframe.html';
    await page.goto(url);
    const result = await processPage();

    if (process.env.APPLITOOLS_UPDATE_FIXTURES) {
      const cdtStr = JSON.stringify(result.cdt, null, 2);
      fs.writeFileSync(resolve(__dirname, 'fixtures/test-iframe.puppeteer.cdt.json'), cdtStr);

      const frameCdtStr = JSON.stringify(result.frames[0].cdt, null, 2);
      fs.writeFileSync(resolve(__dirname, 'fixtures/frame.puppeteer.cdt.json'), frameCdtStr);

      const testCdtStr = JSON.stringify(result.frames[0].frames[0].cdt, null, 2);
      fs.writeFileSync(resolve(__dirname, 'fixtures/test.puppeteer.cdt.json'), testCdtStr);

      const innerTestCdtStr = JSON.stringify(result.frames[0].frames[1].cdt, null, 2);
      fs.writeFileSync(
        resolve(__dirname, 'fixtures/innerTest.puppeteer.cdt.json'),
        innerTestCdtStr,
      );
    }

    const cdt = loadJsonFixture('test-iframe.puppeteer.cdt.json');

    const blobs = [
      {
        url: 'http://localhost:7373/smurfs.jpg',
        type: 'image/jpeg',
        value: loadFixtureBuffer('smurfs.jpg'),
      },
      {
        url: 'http://localhost:7373/test.css',
        type: 'text/css; charset=UTF-8',
        value: loadFixtureBuffer('test.css'),
      },
    ];

    const expectedTest = {
      url: 'http://localhost:7373/test.html',
      cdt: loadJsonFixture('test.puppeteer.cdt.json'),
      resourceUrls: [],
      frames: [],
      blobs: [
        {
          url: 'http://localhost:7373/smurfs.jpg',
          type: 'image/jpeg',
          value: loadFixtureBuffer('smurfs.jpg'),
        },
        {
          url: 'http://localhost:7373/test.css',
          type: 'text/css; charset=UTF-8',
          value: loadFixtureBuffer('test.css'),
        },
      ],
      srcAttr: '../test.html',
    };

    const expectedInnerTest = {
      url: 'http://localhost:7373/iframes/inner/test.html',
      cdt: loadJsonFixture('innerTest.puppeteer.cdt.json'),
      resourceUrls: [],
      frames: [],
      blobs: [
        {
          url: 'http://localhost:7373/iframes/inner/smurfs.jpg',
          type: 'image/jpeg',
          value: loadFixtureBuffer('iframes/inner/smurfs.jpg'),
        },
      ],
      srcAttr: 'inner/test.html',
    };

    const expectedFrame = {
      url: 'http://localhost:7373/iframes/frame.html',
      cdt: loadJsonFixture('frame.puppeteer.cdt.json'),
      resourceUrls: [],
      blobs: [],
      frames: [expectedTest, expectedInnerTest],
      srcAttr: 'iframes/frame.html',
    };

    const expected = {
      url,
      cdt,
      srcAttr: null,
      resourceUrls: [],
      blobs,
      frames: [expectedFrame],
      scriptVersion: version,
    };

    expect(result.cdt).to.eql(cdt);
    expect(result.url).to.eql(url);
    expect(result.resourceUrls).to.eql([]);
    expect(result.blobs).to.eql(blobs);

    expect(result.frames[0].frames[0]).to.eql(expectedTest);
    expect(result.frames[0].frames[1]).to.eql(expectedInnerTest);
    expect(result.frames[0]).to.eql(expectedFrame);
    expect(result).to.eql(expected);
  });

  it('filters non aboslute urls', async () => {
    await page.goto(`data:text/html,<img src="body.jpg"/>`);
    const {blobs, resourceUrls} = await processPage();
    expect(blobs).to.eql([]);
    expect(resourceUrls).to.eql([]);
  });

  it('encodes css urls as uri', async () => {
    const url = 'http://localhost:7373/cssUri.html';
    await page.goto(url);
    const {blobs} = await processPage();
    expect(blobs).to.eql([
      {
        url: 'http://localhost:7373/somePath/gargamel3.jpg',
        type: 'image/jpeg',
        value: loadFixtureBuffer('somePath/gargamel3.jpg'),
      },
      {
        url: 'http://localhost:7373/cssUri.css',
        type: 'text/css; charset=UTF-8',
        value: loadFixtureBuffer('cssUri.css'),
      },
      {
        url: 'http://localhost:7373/somePath/gargamel2.jpg',
        type: 'image/jpeg',
        value: loadFixtureBuffer('somePath/gargamel2.jpg'),
      },
      {
        url: 'http://localhost:7373/somePath/gargamel.jpg',
        type: 'image/jpeg',
        value: loadFixtureBuffer('somePath/gargamel.jpg'),
      },
    ]);
  });

  it('handles css urls with not standard rel attribute', async () => {
    await page.setContent(
      `<link rel="preload as stylesheet" href="http://localhost:7373/inline-url.css"></link>`,
    );
    const {resourceUrls} = await processPage();
    expect(resourceUrls).to.eql(['http://localhost:7373/inline-url.css']);
  });

  it('handles data urls in link tags', async () => {
    await page.setContent(`<link rel="stylesheet" href="data:text/css,div{display:none;}"></link>`);
    const {blobs, resourceUrls} = await processPage();
    expect(blobs).to.eql([]);
    expect(resourceUrls).to.eql([]);
  });

  it('handles data urls in link attributes', async () => {
    await page.setContent(
      `<div style="background-image:url('http://localhost:7373/smurfs.jpg')">hi there</div>
       <div style="background-image:url('data:image/png,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==')">hi there</div>`,
    );
    const {blobs, resourceUrls} = await processPage();
    expect(blobs).to.eql([]);
    expect(resourceUrls).to.eql(['http://localhost:7373/smurfs.jpg']);
  });

  it('handles data urls in style tags', async () => {
    await page.setContent(
      `<style>div{background:url('data:image/png,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==');}</style>`,
    );
    const {blobs, resourceUrls} = await processPage();
    expect(blobs).to.eql([]);
    expect(resourceUrls).to.eql([]);
  });

  it('handles data urls in css resources', async () => {
    await page.goto('http://localhost:7373/inline-url.html');
    const {blobs, resourceUrls} = await processPage();
    expect(blobs).to.eql([
      {
        url: 'http://localhost:7373/inline-url.css',
        type: 'text/css; charset=UTF-8',
        value: loadFixtureBuffer('inline-url.css'),
      },
    ]);
    expect(resourceUrls).to.eql([]);
  });

  it('handles inline frames', async () => {
    await page.goto('http://localhost:7373/inline-frames/main.html');
    const {cdt, frames, resourceUrls, blobs, srcAttr, url} = await processPage();

    const iterateFrame = (f, cb) => {
      let i = -1;
      const doItr = f => {
        cb(f, ++i);
        f.frames.forEach(doItr);
      };
      doItr(f);
    };

    if (process.env.APPLITOOLS_UPDATE_FIXTURES) {
      const updatePromises = [];
      const updateCdt = async ({url, srcAttr, cdt, resourceUrls}, i) => {
        const frameStr = JSON.stringify({url, srcAttr, resourceUrls, cdt}, null, 2);
        const p = writeFile(
          resolve(__dirname, `fixtures/inline-frames/results/${i}.puppeteer.frame.json`),
          frameStr,
        );
        updatePromises.push(p);
      };
      iterateFrame({cdt, frames, srcAttr, url, resourceUrls}, updateCdt);
      await Promise.all(updatePromises);
    }

    const expectedFrames = [];
    const readFrame = (_f, i) => {
      expectedFrames.push(loadJsonFixture(`inline-frames/results/${i}.puppeteer.frame.json`));
    };
    iterateFrame({frames}, readFrame);

    const remRandomSrcAttr = s => (s && s.includes('blob:') ? s.replace(/[^\/]*$/, 'random') : s);
    iterateFrame({srcAttr, frames}, ({srcAttr}, i) => {
      expect(remRandomSrcAttr(srcAttr)).to.eql(remRandomSrcAttr(expectedFrames[i].srcAttr));
    });

    const remRandomUrl = s => s.replace(/(applitools-iframe=)(\d+)$/, '$1random');
    iterateFrame({url, frames}, ({url}, i) => {
      expect(remRandomUrl(url)).to.eql(remRandomUrl(expectedFrames[i].url));
    });
    iterateFrame({resourceUrls, frames}, ({resourceUrls}, i) => {
      expect(resourceUrls).to.eql(expectedFrames[i].resourceUrls);
    });

    const removeRandomFromCdt = cdt => {
      cdt.forEach(e => {
        if (e.nodeName === 'IFRAME') {
          e.attributes
            .filter(a => ['data-applitools-src', 'src'].includes(a.name))
            .forEach(a => {
              a.value = remRandomUrl(a.value);
            });
          if (e.attributes.find(a => a.name === 'data-blob')) {
            const a = e.attributes.find(a => a.name === 'src');
            a.value = a.value.replace(/[^\/]+$/, 'rendom');
          }
        }
      });
    };

    iterateFrame({cdt, frames}, ({cdt}, i) => {
      removeRandomFromCdt(cdt);
      removeRandomFromCdt(expectedFrames[i].cdt);
      expect(cdt).to.eql(expectedFrames[i].cdt);
    });

    const expectedBlobs = [
      [],
      [
        'http://localhost:7373/inline-frames/inner/inner.jpg',
        'http://localhost:7373/inline-frames/main.jpg',
      ],
      ['http://localhost:7373/inline-frames/inner/inner.jpg'],
      ['http://localhost:7373/inline-frames/other/other.jpg'],
      [
        'http://localhost:7373/inline-frames/other/other.jpg',
        'http://localhost:7373/inline-frames/main.jpg',
      ],
      ['http://localhost:7373/inline-frames/other/other.jpg'],
      ['http://localhost:7373/inline-frames/inner/inner.jpg'],
      [
        'http://localhost:7373/inline-frames/other/other.jpg',
        'http://localhost:7373/inline-frames/main.jpg',
      ],
      [
        'http://localhost:7373/inline-frames/inner/inner.jpg',
        'http://localhost:7373/inline-frames/other/other.jpg',
      ],
      [
        'http://localhost:7373/inline-frames/other/other.jpg',
        'http://localhost:7373/inline-frames/main.jpg',
      ],
      [
        'http://localhost:7373/inline-frames/inner/inner.jpg',
        'http://localhost:7373/inline-frames/other/other.jpg',
      ],
      [
        'http://localhost:7373/inline-frames/other/other.jpg',
        'http://localhost:7373/inline-frames/main.jpg',
      ],
      [
        'http://localhost:7373/inline-frames/inner/inner.jpg',
        'http://localhost:7373/inline-frames/other/other.jpg',
      ],
      [],
      [
        'http://localhost:7373/inline-frames/other/other.jpg',
        'http://localhost:7373/inline-frames/main.jpg',
      ],
      ['http://localhost:7373/inline-frames/main.jpg'],
      ['http://localhost:7373/inline-frames/other/other.jpg'],
      ['http://localhost:7373/inline-frames/main.jpg'],
      [
        'http://localhost:7373/inline-frames/inner/inner.jpg',
        'http://localhost:7373/inline-frames/other/other.jpg',
      ],
    ];

    iterateFrame({blobs, frames}, ({blobs}, i) => {
      expect(blobs).to.eql(
        expectedBlobs[i].map(url => ({
          url,
          type: 'image/jpeg',
          value: loadFixtureBuffer(url.replace(/http:\/\/localhost:7373/, '')),
        })),
      );
    });
  });

  it('works for nested css imports', async () => {
    await page.goto('http://localhost:7373/import.html');
    const {blobs} = await processPage();
    expect(blobs).to.eql([
      {
        url: 'http://localhost:7373/imported2.css',
        type: 'text/css; charset=UTF-8',
        value: loadFixtureBuffer('imported2.css'),
      },
      {
        url: 'http://localhost:7373/imported.css',
        type: 'text/css; charset=UTF-8',
        value: loadFixtureBuffer('imported.css'),
      },
      {
        url: 'http://localhost:7373/import.css',
        type: 'text/css; charset=UTF-8',
        value: loadFixtureBuffer('import.css'),
      },
    ]);
  });

  it('works for svg', async () => {
    await page.goto('http://localhost:7373/svg-links.html');
    const {blobs} = await processPage();
    expect(blobs.map(b => ({url: b.url, type: b.type}))).to.eql([
      {
        url: 'http://localhost:7373/smurfs.jpg',
        type: 'image/jpeg',
      },
      {
        url: 'http://localhost:7373/smurfs1.jpg',
        type: 'image/jpeg',
      },
      {
        url: 'http://localhost:7373/gargamel.jpg',
        type: 'image/jpeg',
      },
      {
        url: 'http://localhost:7373/basic.svg',
        type: 'image/svg+xml',
      },
      {
        url: 'http://localhost:7373/gargamel2.jpg',
        type: 'image/jpeg',
      },
      {
        url: 'http://localhost:7373/basic2.svg',
        type: 'image/svg+xml',
      },
      {
        url: 'http://localhost:7373/gargamel3.jpg',
        type: 'image/jpeg',
      },
      {
        url: 'http://localhost:7373/basic4.svg',
        type: 'image/svg+xml',
      },
      {
        url: 'http://localhost:7373/svg.css',
        type: 'text/css; charset=UTF-8',
      },
      {
        url: 'http://localhost:7373/basic3.svg',
        type: 'image/svg+xml',
      },
      {
        url: 'http://localhost:7373/smurfs5.jpg',
        type: 'image/jpeg',
      },
      {
        url: 'http://localhost:7373/svg2.css',
        type: 'text/css; charset=UTF-8',
      },
      {
        url: 'http://localhost:7373/smurfs4.jpg',
        type: 'image/jpeg',
      },
      {
        url: 'http://localhost:7373/somePath/gargamel4.jpg',
        type: 'image/jpeg',
      },
      {
        url: 'http://localhost:7373/with-style.svg',
        type: 'image/svg+xml',
      },
    ]);
  });

  it("returns resources that could not be fetched due to cors in the 'resourceUrls' property", async () => {
    const serverOfCorsRequest = await testServer({port: 7374});
    try {
      const url = 'http://localhost:7373/possible-cors.html';
      await page.goto(url);
      const result = await processPage();
      expect(result.blobs.length).to.eq(0);
      expect(result.resourceUrls.length).to.eq(1);
      expect(result.resourceUrls[0]).to.eq('http://localhost:7374/possible-cors.png');
    } finally {
      await serverOfCorsRequest.close();
    }
  });

  it("returns cors resources that were fetched successfully in the 'blobs' property", async () => {
    const serverOfCorsRequest = await testServer({port: 7374, allowCors: true});
    try {
      const url = 'http://localhost:7373/possible-cors.html';
      await page.goto(url);
      const result = await processPage();
      expect(result.resourceUrls.length).to.eq(0);
      expect(result.blobs.length).to.eq(1);
      expect(result.blobs[0]).to.eql({
        url: 'http://localhost:7374/possible-cors.png',
        type: 'image/png',
        value: loadFixtureBuffer('possible-cors.png'),
      });
    } finally {
      await serverOfCorsRequest.close();
    }
  });

  it('handles cors cssRules exception for an inline frame', async () => {
    const serverOfCorsRequest = await testServer({port: 7374, allowCors: true});
    try {
      await page.goto('http://localhost:7373/cors-css-rules-container.html');
      const {
        frames: [{blobs, resourceUrls, srcAttr, url}],
      } = await processPage({showLogs: true});

      expect(srcAttr).to.eq('cors-css-rules.html');
      expect(url).to.eq('http://localhost:7373/cors-css-rules.html');
      expect(resourceUrls).to.eql([]);
      expect(blobs.length).to.eq(2);
      expect(blobs).to.eql([
        {
          url: 'http://localhost:7374/gargamel.jpg',
          type: 'image/jpeg',
          value: loadFixtureBuffer('gargamel.jpg'),
        },
        {
          url: 'http://localhost:7374/cors.css',
          type: 'text/css; charset=UTF-8',
          value: loadFixtureBuffer('cors.css'),
        },
      ]);
    } finally {
      await serverOfCorsRequest.close();
    }
  });

  it('works for shadow dom', async () => {
    const url = 'http://localhost:7373/shadow-dom.html';
    await page.goto(url);
    const {blobs, cdt, resourceUrls, frames} = await processPage();
    if (process.env.APPLITOOLS_UPDATE_FIXTURES) {
      const cdtStr = JSON.stringify(cdt, null, 2);
      fs.writeFileSync(resolve(__dirname, 'fixtures/shadow-dom.puppeteer.cdt.json'), cdtStr);
    }

    const expectedCdt = loadJsonFixture('shadow-dom.puppeteer.cdt.json');

    expect(resourceUrls).to.eql(['https://localhost:1010/getting-cors.jpg']);
    expect(cdt).to.eql(expectedCdt);
    expect(blobs).to.eql([
      {
        url: 'http://localhost:7373/gargamel.jpg',
        type: 'image/jpeg',
        value: loadFixtureBuffer('gargamel.jpg'),
      },
      {
        url: 'http://localhost:7373/smurfs3.jpg',
        type: 'image/jpeg',
        value: loadFixtureBuffer('smurfs3.jpg'),
      },
      {
        url: 'http://localhost:7373/shadow.css',
        type: 'text/css; charset=UTF-8',
        value: loadFixtureBuffer('shadow.css'),
      },
      {
        url: 'http://localhost:7373/smurfs1.jpg',
        type: 'image/jpeg',
        value: loadFixtureBuffer('smurfs3.jpg'),
      },
      {
        url: 'http://localhost:7373/smurfs2.jpg',
        type: 'image/jpeg',
        value: loadFixtureBuffer('smurfs3.jpg'),
      },
    ]);
    expect(frames[0].blobs).to.eql([
      {
        url: 'http://localhost:7373/smurfs.jpg',
        type: 'image/jpeg',
        value: loadFixtureBuffer('smurfs.jpg'),
      },
    ]);
  });

  it('works for canvas', async () => {
    const url = 'http://localhost:7373/canvas.html';
    await page.goto(url);
    const {blobs, cdt, resourceUrls} = await processPage();
    if (process.env.APPLITOOLS_UPDATE_FIXTURES) {
      const cdtStr = JSON.stringify(cdt, null, 2);
      fs.writeFileSync(resolve(__dirname, 'fixtures/canvas.cdt.json'), cdtStr);
    }

    const expectedCdt = loadJsonFixture('canvas.cdt.json');

    const removeRandom = cdt => {
      const newCdt = [];
      cdt.forEach(e => {
        const newElem = {};
        newElem.nodeType = e.nodeType;
        newElem.nodeName = e.nodeName;
        newElem.childNodeIndexes = e.childNodeIndexes && [...e.childNodeIndexes];
        newElem.attributes =
          e.attributes && e.attributes.map(a => ({value: a.value, name: a.name}));
        newElem.attributes &&
          newElem.attributes.forEach(a => {
            if (a.name === 'data-applitools-src') {
              a.value = a.value.replace(/canvas-\d+\.png/g, 'canvas-d.png');
            }
          });
        newCdt.push(newElem);
      });
      return newCdt;
    };

    const htmlStr = fs.readFileSync(resolve(__dirname, 'fixtures/canvas.html'));
    const dom = new JSDOM(htmlStr, {url: 'http://something.org/'});
    const doc = dom.window.document;

    // Build the Canvas the same way as in the html file.
    const c = doc.getElementById('textCanvas');
    const ctx = c.getContext('2d');
    ctx.font = '30px Arial';
    ctx.strokeText('Hello World', 10, 50);
    const c1 = doc.getElementById('gardientCanvas');
    const ctx1 = c1.getContext('2d');
    const grd = ctx1.createRadialGradient(75, 50, 5, 90, 60, 100);
    grd.addColorStop(0, 'red');
    grd.addColorStop(1, 'white');
    ctx1.fillStyle = grd;
    ctx1.fillRect(10, 10, 150, 80);
    const c2 = doc.getElementById('circleCanvas');
    const ctx2 = c2.getContext('2d');
    ctx2.beginPath();
    ctx2.arc(95, 50, 40, 0, 2 * Math.PI);
    ctx2.stroke();

    const urlToCdtCanvasElem = url => {
      return cdt.find(
        e =>
          e.nodeName === 'CANVAS' &&
          !!e.attributes.find(a => a.name === 'data-applitools-src' && a.value === url),
      );
    };

    // Not taking doc canvas by IDs because their dataURL() is wrong..
    const canvasData = {
      circleCanvas:
        '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',
      textCanvas:
        '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',
      gardientCanvas:
        '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',
    };

    const result = blobs.map(b => {
      const idOfCanvasMatchingBlobUrl = urlToCdtCanvasElem(b.url).attributes.find(
        a => a.name === 'id',
      ).value;
      return {
        _blobUrl: b.url,
        _idOfCanvasMatchingBlobUrl: idOfCanvasMatchingBlobUrl,
        type: b.type,
        blobValue: arrayBufferToBase64(b.value),
        expectedValue: canvasData[idOfCanvasMatchingBlobUrl],
      };
    });

    expect(resourceUrls).to.eql([]);
    expect(removeRandom(cdt)).to.eql(removeRandom(expectedCdt));
    result.forEach(r => {
      expect(r.type).to.eql('image/png');
      expect(r.blobValue).to.eql(r.expectedValue);
    });
  });

  it('logs if showLogs parameter is passed', async () => {
    const logs = [];

    let logsArrayPromise = Promise.resolve();
    page.on('console', async msg => {
      logsArrayPromise = logsArrayPromise.then(async () => {
        const args = msg.args();
        if (args[0] && (await args[0].jsonValue()).match(/\[dom-snapshot\]/)) {
          logs.push(await Promise.all(msg.args().map(arg => arg.jsonValue())));
        }
      });
    });

    await page.goto('http://localhost:7373/test-visual-grid.html');
    await delay(500);

    await processPage();
    expect(logs.length).to.equal(0);

    const uniq = require('../src/browser/uniq');
    await processPage({showLogs: true});
    await logsArrayPromise;
    expect(logs.length).to.be.greaterThan(0);
    expect(uniq(logs.map(log => log[0]))).to.eql(['[dom-snapshot]']);
    expect(logs[0][2]).to.equal('processPage start');
    expect(logs[logs.length - 1][2]).to.equal('processPage end');
  });

  it('uses sessionStorage cache', async () => {
    await page.goto('http://localhost:7373/test-visual-grid.html');
    await delay(500);

    const result = await processPage({useSessionCache: true});
    const blobUrls = result.blobs.map(blob => blob.url);
    const {resourceUrls} = result;

    const resultWithCache = await processPage({useSessionCache: true});
    expect(resultWithCache.blobs.length).to.equal(0);
    expect(resultWithCache.resourceUrls.sort()).to.eql(resourceUrls.concat(blobUrls).sort());
    await logPromise;
  });

  it("doesn't fetch any external resource, internal resource and blob when 'dontFetchResources' is set", async () => {
    const url = 'http://localhost:7373/test-visual-grid.html';
    await page.goto(url);
    await delay(500);
    const result = await processPage({dontFetchResources: true});

    const cdt = loadJsonFixture('test-visual-grid.puppeteer.cdt.json');

    const resourceUrlMap = {};

    for (const el of result.cdt) {
      const attr = el.attributes && el.attributes.find(x => x.name === 'data-blob');
      if (attr) {
        if (el.nodeName === 'LINK') {
          const hrefAttr = el.attributes.find(x => x.name === 'href');
          resourceUrlMap[hrefAttr.value] = attr.value;
          hrefAttr.value = attr.value;
        }

        if (el.nodeName === 'IMG') {
          const srcAttr = el.attributes.find(x => x.name === 'src');
          resourceUrlMap[srcAttr.value] = attr.value;
          srcAttr.value = attr.value;
        }
      }
    }

    result.resourceUrls.forEach((resourceUrl, i) => {
      if (resourceUrl in resourceUrlMap) {
        result.resourceUrls.splice(i, 1, `http://localhost:7373/${resourceUrlMap[resourceUrl]}`);
      }
    });

    const resourceUrls = [
      'http://localhost:7373/smurfs.jpg',
      'http://localhost:7373/blob1',
      'http://localhost:7373/test.css',
      'http://localhost:7374/get-cors.css',
      'http://localhost:7373/blob2',
      'http://localhost:7373/imported2.css',
      'http://localhost:7373/smurfs-style-attr.jpg',
    ];

    // the following assertions are here so that the mocha doesn't get stuck if the test fails on big blobs
    expect(result.cdt).to.eql(cdt);
    expect(result.blobs).to.eql([]);
    expect(result.resourceUrls).to.eql(resourceUrls);

    expect(result).to.eql({
      blobs: [],
      cdt,
      frames: [],
      srcAttr: null,
      resourceUrls,
      url,
      scriptVersion: version,
    });
  });
});
