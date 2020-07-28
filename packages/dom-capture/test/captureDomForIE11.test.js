'use strict';
const {describe, it, before} = require('mocha');
const {expect} = require('chai');
const {getCaptureDomForIEScript} = require('../');
const {loadFixture} = require('./util/loadFixture');
const {beautifyOutput} = require('./util/beautifyOutput');
const {version} = require('../package.json');
const openPageWith = require('./util/openPageWith');
const executeAsyncScript = require('./util/executeAsyncScript');
const saveFixture = require('./util/saveFixture');

describe('captureDom for IE 11', () => {
  let captureDom;

  before(async () => {
    const _captureDom = await getCaptureDomForIEScript();
    captureDom = driver => executeAsyncScript(driver, _captureDom);
  });

  it('works in IE 11', async () => {
    const driver = await openPageWith({browserName: 'internet explorer'});
    try {
      const fixtureName = 'ie11.dom.json';
      const domStr = beautifyOutput(await captureDom(driver));

      if (process.env.APPLITOOLS_UPDATE_FIXTURES) {
        saveFixture(fixtureName, domStr);
      }

      const expected = loadFixture(fixtureName).replace(
        'DOM_CAPTURE_SCRIPT_VERSION_TO_BE_REPLACED',
        version,
      );

      expect(domStr).to.equal(expected);
    } finally {
      await driver.quit();
    }
  });
});
