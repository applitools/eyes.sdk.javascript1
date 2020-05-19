'use strict';
const {describe, it, before} = require('mocha');
const {expect} = require('chai');
const makeHandlers = require('../../../src/plugin/handlers');
const getErrorsAndDiffs = require('../../../src/plugin/getErrorsAndDiffs');
const processCloseAndAbort = require('../../../src/plugin/processCloseAndAbort');
const errorDigest = require('../../../src/plugin/errorDigest');

describe('handlers', () => {
  describe('batchStart', () => {
    let handlers, _vgcConfig;

    before(() => {
      handlers = makeHandlers({
        makeVisualGridClient: config => {
          _vgcConfig = Object.assign(config);
          delete _vgcConfig.logger;
          return {};
        },
        config: {},
        logger: console,
        processCloseAndAbort,
        getErrorsAndDiffs,
        errorDigest,
      });
    });

    it('sets VGC with the given viewport', async () => {
      handlers.batchStart({viewport: {width: 200, height: 300}});
      expect(_vgcConfig).to.deep.eq({browser: {width: 200, height: 300}});
    });

    it('sets VGC with the config viewport and not the handler data', async () => {
      const handlers = makeHandlers({
        makeVisualGridClient: config => {
          _vgcConfig = Object.assign(config);
          delete _vgcConfig.logger;
          return {};
        },
        config: {browser: {width: 400, height: 400}},
        logger: console,
        processCloseAndAbort,
        getErrorsAndDiffs,
        errorDigest,
      });
      handlers.batchStart({viewport: {width: 200, height: 300}});
      expect(_vgcConfig).to.deep.eq({browser: {width: 400, height: 400}});
    });

    it('does not set VGC with a wrong viewport', async () => {
      handlers.batchStart({});
      expect(_vgcConfig).to.deep.eq({});

      handlers.batchStart({viewport: {width: 200}});
      expect(_vgcConfig).to.deep.eq({});

      handlers.batchStart({viewport: {width: null, height: null}});
      expect(_vgcConfig).to.deep.eq({});
    });

    it('sets VGC with useDom, enablePatterns and ignoreDisplacements config', async () => {
      const handlers = makeHandlers({
        makeVisualGridClient: config => {
          _vgcConfig = Object.assign(config);
          delete _vgcConfig.logger;
          return {};
        },
        config: {useDom: true, enablePatterns: true, ignoreDisplacements: true},
        logger: console,
        processCloseAndAbort,
        getErrorsAndDiffs,
        errorDigest,
      });
      handlers.batchStart({});
      expect(_vgcConfig).to.deep.eq({
        useDom: true,
        enablePatterns: true,
        ignoreDisplacements: true,
      });
    });

    it('sets checkWindow VGC with useDom, enablePatterns and ignoreDisplacements config', async () => {
      let _args;
      const handlers = makeHandlers({
        makeVisualGridClient: () => ({
          openEyes: () => ({
            checkWindow: args => (_args = args),
          }),
        }),
        config: {enablePatterns: false},
        logger: console,
        processCloseAndAbort,
        getErrorsAndDiffs,
        errorDigest,
      });
      handlers.batchStart({});
      await handlers.open({});
      await handlers.checkWindow({useDom: true, enablePatterns: true, ignoreDisplacements: true});
      expect(_args.useDom).to.be.true;
      expect(_args.enablePatterns).to.be.true;
      expect(_args.ignoreDisplacements).to.be.true;
    });
  });
});
