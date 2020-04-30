'use strict';

const {describe, it, before} = require('mocha');
const {expect} = require('chai');
const {ptimeoutWithError} = require('@applitools/functional-commons');
const {getProcessPageAndSerializeForIE, getProcessPageAndSerializePollForIE} = require('../index');
const {loadJsonFixture} = require('./util/loadFixture');
const fs = require('fs');
const path = require('path');
const {Builder} = require('selenium-webdriver');
const ie = require('selenium-webdriver/ie');
const {version} = require('../package.json');

function executeAsyncScript(driver, func) {
  const script = `
    const callback = arguments[arguments.length - 1];
    (${func})()
      .then(JSON.stringify)
      .then(callback, function (err) { callback({ error: err && err.message || err })});
  `;
  return driver.executeAsyncScript(script);
}

describe('processPage for IE', () => {
  let processPage;
  let processPageSerializePoll;

  before(async () => {
    const _processPageAndSerialize = await getProcessPageAndSerializeForIE();
    processPage = driver =>
      executeAsyncScript(driver, _processPageAndSerialize).then(result => {
        const parsedResult = JSON.parse(result);
        if (parsedResult.error) {
          throw new Error(parsedResult.error);
        } else {
          return parsedResult;
        }
      });
    processPageSerializePoll = await getProcessPageAndSerializePollForIE();
  });

  function saveFixture(name, content) {
    fs.writeFileSync(path.resolve(__dirname, `fixtures/${name}`), JSON.stringify(content, null, 2));
  }

  async function buildDriver(browserName) {
    const username = process.env.SAUCE_USERNAME;
    const accessKey = process.env.SAUCE_ACCESS_KEY;
    if (!username || !accessKey) {
      throw new Error('Missing SAUCE_USERNAME and/or SAUCE_ACCESS_KEY!');
    }

    const sauceUrl = 'https://ondemand.saucelabs.com:443/wd/hub';
    const sauceCaps = {
      browserName,
      username: process.env.SAUCE_USERNAME,
      accessKey: process.env.SAUCE_ACCESS_KEY,
    };

    const driver = await new Builder()
      .withCapabilities(sauceCaps)
      .setIeOptions(new ie.Options().addArguments('-k', '-private'))
      .usingServer(sauceUrl)
      .build();
    await driver.manage().setTimeouts({script: 10000});
    return driver;
  }

  it('works in Edge', async () => {
    const driver = await buildDriver('MicrosoftEdge');
    try {
      const fixtureName = 'edge.cdt.json';
      const url = 'http://applitools-dom-snapshot.surge.sh/ie';
      await driver.get(url);
      const result = await processPage(driver);

      if (process.env.APPLITOOLS_UPDATE_FIXTURES) {
        saveFixture(fixtureName, result);
      }

      const {cdt, resourceUrls, blobs, srcAttr, frames} = loadJsonFixture(fixtureName);

      // the following assertions are here so that the mocha doesn't get stuck if the test fails on big blobs
      expect(result.cdt).to.eql(cdt);
      expect(result.resourceUrls).to.eql(resourceUrls);
      expect(result.blobs.map(b => b.url)).to.eql(blobs.map(b => b.url));

      expect(result).to.eql({
        blobs,
        cdt,
        frames,
        resourceUrls,
        url,
        srcAttr,
        scriptVersion: version,
      });
    } finally {
      await driver.quit();
    }
  });

  it('works in IE 11', async () => {
    const driver = await buildDriver('internet explorer');
    try {
      const fixtureName = 'ie11.cdt.json';
      const url = 'http://applitools-dom-snapshot.surge.sh/ie';
      await driver.get(url);

      const result = await processPage(driver);

      if (process.env.APPLITOOLS_UPDATE_FIXTURES) {
        saveFixture(fixtureName, result);
      }

      const {cdt, resourceUrls, blobs, srcAttr, frames} = loadJsonFixture(fixtureName);

      // the following assertions are here so that the mocha doesn't get stuck if the test fails on big blobs
      expect(result.cdt).to.eql(cdt);
      expect(result.resourceUrls).to.eql(resourceUrls);
      expect(result.blobs.map(b => b.url)).to.eql(blobs.map(b => b.url));

      expect(result).to.eql({
        blobs,
        cdt,
        frames,
        resourceUrls,
        url,
        srcAttr,
        scriptVersion: version,
      });
    } finally {
      await driver.quit();
    }
  });

  it('poll works in IE 10', async () => {
    const driver = await buildDriver('internet explorer');
    try {
      const fixtureName = 'ie10.cdt.json';
      const url = 'http://applitools-dom-snapshot.surge.sh/ie';
      await driver.get(url);

      async function doPoll() {
        const result = await driver.executeScript(`return (${processPageSerializePoll})()`);
        return JSON.parse(result);
      }
      let result = await doPoll();
      expect(result).to.eql({status: 'WIP', value: null, error: null});

      let resolve, reject;
      const done = new Promise((res, rej) => ((resolve = res), (reject = rej)));
      async function loopPoll() {
        const {status, value, error} = await doPoll();
        if (status === 'WIP') {
          setTimeout(loopPoll, 500);
        } else if (status === 'SUCCESS') {
          resolve(value);
        } else {
          reject(error);
        }
      }

      await loopPoll();
      result = await ptimeoutWithError(done, 10000, 'timeout!');
      if (process.env.APPLITOOLS_UPDATE_FIXTURES) {
        saveFixture(fixtureName, result);
      }

      const {cdt, resourceUrls, blobs, srcAttr, frames} = loadJsonFixture(fixtureName);

      // the following assertions are here so that the mocha doesn't get stuck if the test fails on big blobs
      expect(result.cdt).to.eql(cdt);
      expect(result.resourceUrls).to.eql(resourceUrls);
      expect(result.blobs.map(b => b.url)).to.eql(blobs.map(b => b.url));

      expect(result).to.eql({
        blobs,
        cdt,
        frames,
        resourceUrls,
        url,
        srcAttr,
        scriptVersion: version,
      });
    } finally {
      await driver.quit();
    }
  });
});
