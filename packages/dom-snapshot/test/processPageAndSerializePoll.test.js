'use strict';
const {describe, it, before, after, beforeEach, afterEach} = require('mocha');
const {expect} = require('chai');
const puppeteer = require('puppeteer');
const {getProcessPageAndSerializePoll} = require('../index');
const testServer = require('@applitools/sdk-shared/src/run-test-server');
const {ptimeoutWithError, delay} = require('@applitools/functional-commons');
const {version} = require('../package.json');
const decodeFrame = require('./util/decodeFrame');

describe('processPageAndSerialzePoll', () => {
  let server;
  let browser;
  let page;
  let processPageAndSerializePoll;

  before(async () => {
    server = await testServer({port: 7375});
    const _processPageAndSerializePoll = await getProcessPageAndSerializePoll();
    processPageAndSerializePoll = () =>
      page.evaluate(
        `(() => {${_processPageAndSerializePoll} return __processPageAndSerializePoll()})()`,
      );
  });

  after(async () => {
    await server.close();
  });

  beforeEach(async () => {
    browser = await puppeteer.launch({headless: true}); // in before each because in the cors tests puppeteer was somehow reusing the previous test's app handler
    page = await browser.newPage();
    await page.setCacheEnabled(false); // not sure if this helps anything, but it feels reasonable to do
    // page.on('console', msg => {
    //   console.log(`[BROWSER] ${msg.text()}`);
    // });
  });

  afterEach(async () => {
    await browser.close();
    // await new Promise(r => setTimeout(r, 100000));
  });

  it('works for basic page', async () => {
    const url = 'http://localhost:7375/basic-page.html';
    await page.goto(url);
    let result = JSON.parse(await processPageAndSerializePoll());
    expect(result).to.eql({status: 'WIP', value: null, error: null});

    const poll = async () => {
      const r = JSON.parse(await processPageAndSerializePoll());
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
    const r = JSON.parse(await processPageAndSerializePoll());
    expect(r).to.eql({status: 'WIP', value: null, error: null});

    result = result.value;
    decodeFrame(result);

    expect(result).to.eql({
      cdt: [
        {nodeType: 9, childNodeIndexes: [1, 15]},
        {nodeType: 10, nodeName: 'html'},
        {nodeType: 3, nodeValue: '\n'},
        {nodeType: 1, nodeName: 'HEAD', attributes: [], childNodeIndexes: [2]},
        {nodeType: 3, nodeValue: '\n'},
        {nodeType: 3, nodeValue: '\n  '},
        {nodeType: 3, nodeValue: 'Very Baisc'},
        {
          nodeType: 1,
          nodeName: 'DIV',
          attributes: [{name: 'class', value: 'someClass'}],
          childNodeIndexes: [6],
        },
        {nodeType: 3, nodeValue: '\n  '},
        {nodeType: 3, nodeValue: 'Very Baisc 2'},
        {
          nodeType: 1,
          nodeName: 'DIV',
          attributes: [
            {name: 'id', value: 'basic-yo'},
            {name: 'class', value: 'someClass2'},
          ],
          childNodeIndexes: [9],
        },
        {nodeType: 3, nodeValue: '\n  '},
        {nodeType: 1, nodeName: 'SCRIPT', attributes: [], childNodeIndexes: []},
        {nodeType: 3, nodeValue: '\n\n'},
        {
          nodeType: 1,
          nodeName: 'BODY',
          attributes: [],
          childNodeIndexes: [5, 7, 8, 10, 11, 12, 13],
        },
        {
          nodeType: 1,
          nodeName: 'HTML',
          attributes: [{name: 'lang', value: 'en'}],
          childNodeIndexes: [3, 4, 14],
        },
      ],
      url: 'http://localhost:7375/basic-page.html',
      resourceUrls: [],
      srcAttr: null,
      blobs: [],
      frames: [],
      scriptVersion: version,
    });
  });

  it('returns error when processPage rejects', async () => {
    const url = 'http://localhost:7375/basic-page.html';
    await page.goto(url);
    const _processPageAndSerializePoll = (await getProcessPageAndSerializePoll()).replace(
      '/* MARKER FOR TEST - DO NOT DELETE */',
      'return Promise.reject(new Error("SOME ERROR"));',
    );
    processPageAndSerializePoll = () =>
      page.evaluate(
        `(() => {${_processPageAndSerializePoll} return __processPageAndSerializePoll()})()`,
      );
    let result = JSON.parse(await processPageAndSerializePoll());
    expect(result).to.eql({status: 'WIP', value: null, error: null});

    const poll = async () => {
      const r = JSON.parse(await processPageAndSerializePoll());
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
