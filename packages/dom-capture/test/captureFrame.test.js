'use strict';
const {describe, it, after, before, beforeEach} = require('mocha');
const {expect} = require('chai');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const testServer = require('@applitools/sdk-shared/src/run-test-server');
const {getCaptureDomScript} = require('../index');
const {beautifyOutput, getPerformanceMetrics} = require('./util/beautifyOutput');
const {loadFixture} = require('./util/loadFixture');
const {version} = require('../package.json');

describe('captureFrame', () => {
  let browser,
    page,
    baseUrl,
    closeTestServer,
    captureFrameWithMetrics,
    captureFrameWithFetchTimeLimit,
    captureFrame;

  before(async () => {
    browser = await puppeteer.launch();
    const server = await testServer({port: 50993});
    baseUrl = `http://localhost:${server.port}`;
    closeTestServer = server.close;
    const captureDomScript = await getCaptureDomScript();
    captureFrame = `(${captureDomScript})()`;
    captureFrameWithMetrics = `(${captureDomScript})(undefined, undefined, true)`;
    captureFrameWithFetchTimeLimit = `(${captureDomScript})(undefined, undefined, true, 5000)`;
  });

  after(async () => {
    await browser.close();
    await closeTestServer();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    // page.on('console', msg => {
    //   console.log(msg.args().join(' '));
    // });
  });

  it('works', async () => {
    await page.goto(`${baseUrl}/test.html`);

    const output = await page.evaluate(captureFrameWithMetrics);
    const domStr = beautifyOutput(output);

    if (process.env.APPLITOOLS_UPDATE_FIXTURES) {
      fs.writeFileSync('test/fixtures/captureFrame.dom.json', domStr);
    }
    const expected = loadFixture('captureFrame.dom.json', {
      replaceSource: /\"scriptVersion\": \"\d+\.\d+\.\d+\"/,
      replaceTarget: `"scriptVersion": "${version}"`,
    });
    expect(domStr).to.eql(expected);
    const metrics = getPerformanceMetrics(output);
    expect(metrics).to.exist;
    expect(metrics.doCaptureDoc).to.exist;
    expect(metrics.prefetchCss).to.exist;
    expect(metrics.waitForImages).to.exist;
  });

  it('capture frame with no metrics does not return metrics', async () => {
    await page.goto(`${baseUrl}/test.html`);

    const output = await page.evaluate(captureFrame);
    const domStr = beautifyOutput(output);

    if (process.env.APPLITOOLS_UPDATE_FIXTURES) {
      fs.writeFileSync('test/fixtures/captureFrame.dom.json', domStr);
    }
    const expected = loadFixture('captureFrame.dom.json', {
      replaceSource: /\"scriptVersion\": \"\d+\.\d+\.\d+\"/,
      replaceTarget: `"scriptVersion": "${version}"`,
    });
    expect(domStr).to.eql(expected);
    const metrics = getPerformanceMetrics(output);
    expect(metrics).to.equal(undefined);
  });

  it('drills into iframes when no cross-origin', async () => {
    await page.goto(`${baseUrl}/testWithIframe.html`);

    const domStr = beautifyOutput(await page.evaluate(captureFrameWithMetrics));

    if (process.env.APPLITOOLS_UPDATE_FIXTURES) {
      fs.writeFileSync('test/fixtures/testWithIframe.dom.json', domStr);
    }
    const expected = loadFixture('testWithIframe.dom.json', {
      replaceSource: /\"scriptVersion\": \"\d+\.\d+\.\d+\"/,
      replaceTarget: `"scriptVersion": "${version}"`,
    });
    expect(domStr).to.eql(expected);
  });

  it('drills into iframes with srcdoc', async () => {
    await page.goto(`${baseUrl}/testWithSrcdocIframe.html`);

    const domStr = beautifyOutput(await page.evaluate(captureFrameWithMetrics));

    if (process.env.APPLITOOLS_UPDATE_FIXTURES) {
      fs.writeFileSync('test/fixtures/testWithSrcdocIframe.dom.json', domStr);
    }
    const expected = loadFixture('testWithSrcdocIframe.dom.json', {
      replaceSource: /\"scriptVersion\": \"\d+\.\d+\.\d+\"/,
      replaceTarget: `"scriptVersion": "${version}"`,
    });
    expect(domStr).to.eql(expected);
  });

  it('works with shadow dom', async () => {
    await page.goto(`${baseUrl}/shadow-dom.html`);

    const domStr = beautifyOutput(await page.evaluate(captureFrameWithMetrics));

    if (process.env.APPLITOOLS_UPDATE_FIXTURES) {
      fs.writeFileSync('test/fixtures/shadow-dom.dom.json', domStr);
    }
    const expected = loadFixture('shadow-dom.dom.json', {
      replaceSource: /\"scriptVersion\": \"\d+\.\d+\.\d+\"/,
      replaceTarget: `"scriptVersion": "${version}"`,
    });
    expect(domStr).to.eql(expected);
  });

  it("places iframe tokens when there's cross origin", async () => {
    const port = 7272;
    const anotherTestServer = await testServer({port});
    await page.goto(`${baseUrl}/testWithCrossOriginIframe.html`);

    const domStr = beautifyOutput(await page.evaluate(captureFrameWithMetrics));

    if (process.env.APPLITOOLS_UPDATE_FIXTURES) {
      fs.writeFileSync('test/fixtures/testWithCrossOriginIframe.dom.json', domStr);
    }

    const expected = loadFixture('testWithCrossOriginIframe.dom.json', {
      replaceSource: /\"scriptVersion\": \"\d+\.\d+\.\d+\"/,
      replaceTarget: `"scriptVersion": "${version}"`,
    });

    try {
      expect(domStr).to.eql(expected);
    } finally {
      await anotherTestServer.close();
    }
  });

  it("places unfetched css tokens when there's unfetched css", async () => {
    const port = 7272;
    const anotherTestServer = await testServer({port});

    await page.goto(`${baseUrl}/cross.html`);

    const domStr = beautifyOutput(await page.evaluate(captureFrameWithMetrics));

    if (process.env.APPLITOOLS_UPDATE_FIXTURES) {
      fs.writeFileSync('test/fixtures/crossOrigin.dom.json', domStr);
    }

    const expected = loadFixture('crossOrigin.dom.json', {
      replaceSource: /\"scriptVersion\": \"\d+\.\d+\.\d+\"/,
      replaceTarget: `"scriptVersion": "${version}"`,
    });

    try {
      expect(domStr).to.eql(expected);
    } finally {
      await anotherTestServer.close();
    }
  });

  it("don't fetch css if fetching is to long", async () => {
    const port = 7273; // Use unique port to avoid cache of css resource
    const anotherTestServer = await testServer({port, delayRecourses: 10000});

    await page.goto(`http://localhost:${port}/longCss.html`);

    const domStr = beautifyOutput(await page.evaluate(captureFrameWithFetchTimeLimit));

    if (process.env.APPLITOOLS_UPDATE_FIXTURES) {
      fs.writeFileSync('test/fixtures/longCss.dom.json', domStr);
    }

    const expected = loadFixture('longCss.dom.json', {
      replaceSource: /\"scriptVersion\": \"\d+\.\d+\.\d+\"/,
      replaceTarget: `"scriptVersion": "${version}"`,
    });

    try {
      expect(domStr).to.eql(expected);
    } finally {
      await anotherTestServer.close();
    }
  });

  it('gathers unfetched css from different frames', async () => {
    const port = 7272;
    const anotherTestServer = await testServer({port});

    await page.goto(`${baseUrl}/crossFrame.html`);

    const domStr = beautifyOutput(await page.evaluate(captureFrameWithMetrics));

    if (process.env.APPLITOOLS_UPDATE_FIXTURES) {
      fs.writeFileSync('test/fixtures/crossFrame.dom.json', domStr);
    }

    const expected = loadFixture('crossFrame.dom.json', {
      replaceSource: /\"scriptVersion\": \"\d+\.\d+\.\d+\"/,
      replaceTarget: `"scriptVersion": "${version}"`,
    });
    try {
      expect(domStr).to.eql(expected);
    } finally {
      await anotherTestServer.close();
    }
  });

  it.skip('handles custom page (use to try out stuff)', async () => {
    await page.goto(
      `http://snapshot-server-app/?rg_render-path=%2Fsha256%2F9761fc3e5c493bcaa73df8a20affecf8424226cc436e726fa14717e70f0712e5&rg_render-id=6ec7c1e9-2b85-4530-9800-5e3c0ca7e4b0&rg_auth-token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0SnlGZmMwaFRVX2pzZTVCNlFTX2lnfn4iLCJpYXQiOjE1NDAzNjE2NTMsImV4cCI6MTU0MDM4MzI1MywiaXNzIjoiZXllc2FwaS5hcHBsaXRvb2xzLmNvbSJ9.VVLzqrE_F41ACvtU1Xerxh9pt0ro7OFSrXnKmG7_HV0dVhblaDQz9lLWtGdqV7xjp1GCB3vOI4Qt8HIf6q_jDMsd1qQjhkdgmz2V6VfwusyYUVntCAjNwiiZocYpo16RuxvicdFHyX8dvGUlTXCKLfoCCKya6tNuiyri4kK72Bg&rg_origin=https%3A%2F%2Fapplitools.com&rg_namespace-override=4JyFfc0hTU_jse5B6QS_ig~~&rg_urlmode=rewrite`,
    );

    const domStr = beautifyOutput(await page.evaluate(captureFrameWithMetrics));

    fs.writeFileSync(path.join(__dirname, 'custom-page-result/custom-page.json'), domStr);
  });
});
