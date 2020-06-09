'use strict';
const {describe, it, before, after, beforeEach, afterEach} = require('mocha');
const {expect} = require('chai');
const fetch = require('../../util/fetchWithNoCAVerify');
let startPlugin = require('../../../src/plugin/startPlugin');

describe('start plugin', () => {
  let getCloseServer, __module;

  beforeEach(() => {
    __module = {exports: () => {}};
    getCloseServer = startPlugin(__module);
  });

  afterEach(async () => {
    __module = null;
    await getCloseServer()();
  });

  it('starts plugin server and patches module exports', async () => {
    const {eyesPort} = await __module.exports();
    const resp = await fetch(`https://localhost:${eyesPort}/hb`);
    expect(resp.status).to.equal(200);
  });

  it('patches module exports with correct pref', async () => {
    const {eyesIsDisabled, eyesFailCypressOnDiff} = await __module.exports();
    expect(eyesIsDisabled).to.be.false;
    expect(eyesFailCypressOnDiff).to.be.true;
  });

  describe('with eyes disabled', () => {
    before(() => {
      process.env['APPLITOOLS_IS_DISABLED'] = true;
      delete require.cache[require.resolve('../../../src/plugin/startPlugin')];
      startPlugin = require('../../../src/plugin/startPlugin');
    });

    beforeEach(() => {
      __module = {exports: () => {}};
      getCloseServer = startPlugin(__module);
    });

    after(() => {
      delete process.env['APPLITOOLS_IS_DISABLED'];
      delete require.cache[require.resolve('../../../src/plugin/startPlugin')];
    });

    it('patches module exports with disabled eyes pref', async () => {
      const {eyesIsDisabled} = await __module.exports();
      expect(eyesIsDisabled).to.be.true;
    });
  });

  describe('with eyes dont fail cypress on diff', () => {
    before(() => {
      process.env['APPLITOOLS_FAIL_CYPRESS_ON_DIFF'] = false;
      delete require.cache[require.resolve('../../../src/plugin/startPlugin')];
      startPlugin = require('../../../src/plugin/startPlugin');
    });

    beforeEach(() => {
      __module = {exports: () => {}};
      getCloseServer = startPlugin(__module);
    });

    after(() => {
      delete process.env['APPLITOOLS_FAIL_CYPRESS_ON_DIFF'];
      delete require.cache[require.resolve('../../../src/plugin/startPlugin')];
    });

    it('patches module exports with dont fail on diff pref', async () => {
      const {eyesFailCypressOnDiff} = await __module.exports();
      expect(eyesFailCypressOnDiff).to.be.false;
    });
  });

  describe('with eyes timeout ', () => {
    before(() => {
      process.env['APPLITOOLS_EYES_TIMEOUT'] = '1234';
      delete require.cache[require.resolve('../../../src/plugin/startPlugin')];
      startPlugin = require('../../../src/plugin/startPlugin');
    });

    beforeEach(() => {
      __module = {exports: () => {}};
      getCloseServer = startPlugin(__module);
    });

    after(() => {
      delete process.env['APPLITOOLS_EYES_TIMEOUT'];
      delete require.cache[require.resolve('../../../src/plugin/startPlugin')];
    });

    it('patches module exports with dont fail on diff pref', async () => {
      const {eyesTimeout} = await __module.exports();
      expect(eyesTimeout).to.be.equal('1234');
    });
  });
});
