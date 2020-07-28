'use strict';
const {describe, it, before} = require('mocha');
const {expect} = require('chai');
const {getCaptureDomForIEScript, getCaptureDomAndPollForIE} = require('../');
const {loadFixture} = require('./util/loadFixture');
const {beautifyOutput} = require('./util/beautifyOutput');
const {Builder} = require('selenium-webdriver');
const ie = require('selenium-webdriver/ie');
const {ptimeoutWithError} = require('@applitools/functional-commons');
const {version} = require('../package.json');
const saveFixture = require('./util/saveFixture');

describe('captureDom for IE 10', () => {
  let captureDomAndPoll;

  before(async () => {
    const _captureDom = await getCaptureDomForIEScript();
    captureDomAndPoll = await getCaptureDomAndPollForIE();
  });

  async function openPageWith({
    browserName,
    version,
    url = 'http://applitools-dom-capture-origin-1.surge.sh/ie.html',
  }) {
    const username = process.env.SAUCE_USERNAME;
    const accessKey = process.env.SAUCE_ACCESS_KEY;
    if (!username || !accessKey) {
      throw new Error('Missing SAUCE_USERNAME and/or SAUCE_ACCESS_KEY!');
    }

    const sauceUrl = 'https://ondemand.saucelabs.com:443/wd/hub';
    const sauceCaps = {
      browserName,
      version,
      username: process.env.SAUCE_USERNAME,
      accessKey: process.env.SAUCE_ACCESS_KEY,
    };

    const driver = await new Builder()
      .withCapabilities(sauceCaps)
      .setIeOptions(new ie.Options().addArguments('-k', '-private'))
      .usingServer(sauceUrl)
      .build();
    await driver.manage().setTimeouts({script: 10000});
    await driver
      .manage()
      .window()
      .setRect({width: 1024, height: 768});

    await driver.get(url);
    return driver;
  }

  it('works in IE 10 with poll', async () => {
    const driver = await openPageWith({browserName: 'internet explorer'});
    try {
      const fixtureName = 'ie10.dom.json';

      async function doPoll() {
        const result = await driver.executeScript(`return (${captureDomAndPoll})()`);
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
      const domStr = beautifyOutput(result);
      if (process.env.APPLITOOLS_UPDATE_FIXTURES) {
        saveFixture(fixtureName, domStr);
      }
      const expected = loadFixture(fixtureName).replace(
        'DOM_CAPTURE_SCRIPT_VERSION_TO_BE_REPLACED',
        version,
      );

      expect(domStr).to.eql(expected);
    } finally {
      await driver.quit();
    }
  });
});
