/* global window document */
const puppeteer = require('puppeteer');
const {describe, it, before, after} = require('mocha');
const {expect} = require('chai');
const testServer = require('@applitools/sdk-shared/src/run-test-server');
const makeGetStoryData = require('../../src/getStoryData');
const {ptimeoutWithError} = require('@applitools/functional-commons');
const browserLog = require('../../src/browserLog');
const logger = require('../util/testLogger');

describe('getStoryData', () => {
  let browser, page, closeTestServer;
  before(async () => {
    browser = await puppeteer.launch({headless: true});
    page = await browser.newPage();
    const server = await testServer({port: 7272});
    closeTestServer = server.close;
    browserLog({page, onLog: text => console.log(`[browser] ${text}`)});
  });

  after(async () => {
    await browser.close();
    await closeTestServer();
  });

  it('works with waitBeforeScreenshot as a number', async () => {
    const processPageAndSerialize = () => ({
      resourceUrls: ['url1', window.timeout],
      blobs: [{url: 'url2', type: 'type', value: 'ss'}],
      cdt: 'cdt',
      frames: [],
    });

    const getStoryData = makeGetStoryData({
      logger,
      processPageAndSerialize,
      waitBeforeScreenshot: 2000,
    });

    const getStoryPromise = getStoryData({
      story: {},
      storyUrl: 'http://localhost:7272/renderTimeoutNumber.html',
      page,
    });
    const {resourceUrls, resourceContents, cdt} = await ptimeoutWithError(
      getStoryPromise,
      3000,
      'timeout',
    );

    expect(resourceUrls).to.eql(['url1', 1500]);
    expect(resourceContents).to.eql({
      url2: {url: 'url2', type: 'type', value: Buffer.from('ss', 'base64')},
    });
    expect(cdt).to.equal('cdt');
  });

  it('works with waitBeforeScreenshot as a css selector', async () => {
    const processPageAndSerialize = () => ({
      resourceUrls: [
        'url1',
        document.getElementById('newDiv') && document.getElementById('newDiv').innerText,
      ],
      blobs: [{url: 'url2', type: 'type', value: 'ss'}],
      cdt: 'cdt',
      frames: [],
    });

    const getStoryData = makeGetStoryData({
      logger,
      processPageAndSerialize,
      waitBeforeScreenshot: '#newDiv',
    });

    const getStoryPromise = getStoryData({
      story: {},
      storyUrl: 'http://localhost:7272/renderTimeoutSelector.html',
      page,
    });
    const {resourceUrls, resourceContents, cdt} = await ptimeoutWithError(
      getStoryPromise,
      3000,
      'timeout',
    );

    expect(resourceUrls).to.eql(['url1', 'div created']);
    expect(resourceContents).to.eql({
      url2: {url: 'url2', type: 'type', value: Buffer.from('ss', 'base64')},
    });
    expect(cdt).to.equal('cdt');
  });

  it('works with waitBeforeScreenshot as a function', async () => {
    const processPageAndSerialize = () => ({
      resourceUrls: ['url1', document.getElementById('changeME').innerText],
      blobs: [{url: 'url2', type: 'type', value: 'ss'}],
      cdt: 'cdt',
      frames: [],
    });

    const getStoryData = makeGetStoryData({
      logger,
      processPageAndSerialize,
      waitBeforeScreenshot: () => window.ready === 'ok',
    });

    const getStoryPromise = getStoryData({
      story: {},
      storyUrl: 'http://localhost:7272/renderTimeoutFunction.html',
      page,
    });
    const {resourceUrls, resourceContents, cdt} = await ptimeoutWithError(
      getStoryPromise,
      3000,
      'timeout',
    );

    expect(resourceUrls).to.eql(['url1', '1500 ms passed']);
    expect(resourceContents).to.eql({
      url2: {url: 'url2', type: 'type', value: Buffer.from('ss', 'base64')},
    });
    expect(cdt).to.equal('cdt');
  });

  it('uses storybook client API V5 when possible', async () => {
    const processPageAndSerialize = () => ({
      resourceUrls: [],
      blobs: [],
      cdt: document.getElementById('story').textContent,
      frames: [],
    });

    await page.goto('http://localhost:7272/renderStorybookClientApiV5_2-iframe.html');
    const getStoryData = makeGetStoryData({logger, processPageAndSerialize});

    expect((await getStoryData({story: {isApi: true, index: 0}, page})).cdt).to.equal('story1');
    expect((await getStoryData({story: {isApi: true, index: 1}, page})).cdt).to.equal('story2');
  });

  it('uses storybook client API V5 when possible', async () => {
    const processPageAndSerialize = () => ({
      resourceUrls: [],
      blobs: [],
      cdt: document.getElementById('story').textContent,
      frames: [],
    });

    await page.goto('http://localhost:7272/renderStorybookClientApiV5-iframe.html');
    const getStoryData = makeGetStoryData({logger, processPageAndSerialize});

    expect((await getStoryData({story: {isApi: true, index: 0}, page})).cdt).to.equal('story1');
    expect((await getStoryData({story: {isApi: true, index: 1}, page})).cdt).to.equal('story2');
  });

  it('uses storybook client API V4 when possible', async () => {
    const processPageAndSerialize = () => ({
      resourceUrls: [],
      blobs: [],
      cdt: document.getElementById('story').textContent,
      frames: [],
    });

    await page.goto('http://localhost:7272/renderStorybookClientApiV4-iframe.html');
    const getStoryData = makeGetStoryData({logger, processPageAndSerialize});

    expect((await getStoryData({story: {isApi: true, index: 0}, page})).cdt).to.equal(
      'Button-With text',
    );
  });

  it('runs runBefore before extracting story data V5', async () => {
    const processPageAndSerialize = () => ({
      resourceUrls: [],
      blobs: [],
      cdt: document.getElementById('root').textContent,
      frames: [],
    });

    await page.goto('http://localhost:7272/runBeforeV5-iframe.html');
    const getStoryData = makeGetStoryData({logger, processPageAndSerialize});

    const {cdt} = await getStoryData({
      story: {
        isApi: true,
        index: 0,
        parameters: {
          eyes: {
            runBefore: {},
          },
        },
      },
      page,
    });

    expect(cdt).to.equal('story done');
  });

  it('runs runBefore before extracting story data V4', async () => {
    const processPageAndSerialize = () => ({
      resourceUrls: [],
      blobs: [],
      cdt: document.getElementById('root').textContent,
      frames: [],
    });

    await page.goto('http://localhost:7272/runBeforeV4-iframe.html');
    const getStoryData = makeGetStoryData({logger, processPageAndSerialize});

    const {cdt} = await getStoryData({
      story: {
        isApi: true,
        index: 0,
        parameters: {
          eyes: {
            runBefore: {},
          },
        },
      },
      page,
    });

    expect(cdt).to.equal('story done');
  });

  it("doesn't throw on exception in runBefore", async () => {
    const processPageAndSerialize = () => ({
      resourceUrls: [],
      blobs: [],
      cdt: document.getElementById('root').textContent,
      frames: [],
    });

    await page.goto('http://localhost:7272/runBeforeWithException-iframe.html');
    const getStoryData = makeGetStoryData({logger, processPageAndSerialize});

    const {cdt} = await getStoryData({
      story: {isApi: true, index: 0, parameters: {eyes: {runBefore: {}}}},
      page,
    });

    expect(cdt).to.equal('story done');
  });

  it('reloads page when reloadPagePerStory is set', async () => {
    const processPageAndSerialize = () => ({
      resourceUrls: [],
      blobs: [],
      cdt: document.getElementById('root').textContent,
      frames: [],
    });

    const storyUrl = 'http://localhost:7272/reloadPagePerStory.html';

    await page.goto(storyUrl);
    const getStoryData = makeGetStoryData({
      logger,
      processPageAndSerialize,
      reloadPagePerStory: true,
    });

    const {cdt} = await getStoryData({
      story: {isApi: true, index: 0},
      storyUrl,
      page,
    });

    expect(cdt).to.equal('fresh content');
  });
});
