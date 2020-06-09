'use strict';
const {describe, it, before, after, beforeEach, afterEach} = require('mocha');
const {expect} = require('chai');
const puppeteer = require('puppeteer');
const {getCaptureDomAndPollScript, getCaptureDomScript} = require('../index');
const {testServer} = require('@applitools/sdk-shared');
const {ptimeoutWithError, delay} = require('@applitools/functional-commons');

describe('captureDomAndPoll', () => {
  let server;
  let browser;
  let page;
  let captureDomAndPoll, captureDom;

  before(async () => {
    server = await testServer({port: 7375});
    const _captureDomAndPoll = await getCaptureDomAndPollScript();
    const _captureDom = await getCaptureDomScript();
    captureDomAndPoll = () =>
      page.evaluate(`(() => {${_captureDomAndPoll} return __captureDomAndPoll()})()`);
    captureDom = () => page.evaluate(`(() => {${_captureDom} return __captureDom()})()`);
  });

  after(async () => {
    await server.close();
  });

  beforeEach(async () => {
    browser = await puppeteer.launch(); // in before each because in the cors tests puppeteer was somehow reusing the previous test's app handler
    page = await browser.newPage();
    await page.setCacheEnabled(false); // not sure if this helps anything, but it feels reasonable to do
    // page.on('console', msg => {
    //   console.log(`[BROWSER] ${msg.text()}`);
    // });
  });

  afterEach(async () => {
    await browser.close();
  });

  it('works for basic page', async () => {
    const url = 'http://localhost:7375/basic-page.html';
    await page.goto(url);
    let result = JSON.parse(await captureDomAndPoll());
    expect(result).to.eql({status: 'WIP', value: null, error: null});

    const poll = async () => {
      const r = JSON.parse(await captureDomAndPoll());
      if (r.status === 'WIP') {
        await delay(500);
        return poll();
      }
      return r;
    };

    result = await ptimeoutWithError(poll, 4000, 'timeout');
    expect(result.status).to.eql('SUCCESS');
    expect(result.error).to.eql(null);

    // make sure it deletes old result
    const r = JSON.parse(await captureDomAndPoll());
    expect(r).to.eql({status: 'WIP', value: null, error: null});

    result = result.value;
    const expected = await captureDom();
    expect(result).to.eql(expected);
  });

  it('returns error when captureDom rejects', async () => {
    const url = 'http://localhost:7375/reject-capture-dom.html';
    await page.goto(url);
    let result = JSON.parse(await captureDomAndPoll());
    expect(result).to.eql({status: 'WIP', value: null, error: null});

    const poll = async () => {
      const r = JSON.parse(await captureDomAndPoll());
      if (r.status === 'WIP') {
        await delay(500);
        return poll();
      }
      return r;
    };

    result = await ptimeoutWithError(poll, 4000, 'timeout');
    expect(result).to.eql({status: 'ERROR', value: null, error: 'SOME ERROR'});
  });
});
