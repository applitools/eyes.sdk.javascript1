'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const makeHandlers = require('../../../src/plugin/handlers');
const getErrorsAndDiffs = require('../../../src/plugin/getErrorsAndDiffs');
const processCloseAndAbort = require('../../../src/plugin/processCloseAndAbort');
const errorDigest = require('../../../src/plugin/errorDigest');

describe('handlers', () => {
  describe('batchStart', () => {
    it('sets checkWindow VGC with config', async () => {
      let _args;
      const handlers = makeHandlers({
        visualGridClient: {
          openEyes: () => ({
            checkWindow: args => (_args = args),
          }),
        },
        config: {},
        logger: console,
        processCloseAndAbort,
        getErrorsAndDiffs,
        errorDigest,
      });

      await handlers.open({});
      await handlers.checkWindow({
        useDom: true,
        enablePatterns: true,
        ignoreDisplacements: true,
        variationGroupId: 'variationGroupId',
      });
      expect(_args.useDom).to.be.true;
      expect(_args.enablePatterns).to.be.true;
      expect(_args.ignoreDisplacements).to.be.true;
      expect(_args.variationGroupId).be.equal('variationGroupId');
    });
  });

  describe('openEyes', () => {
    it('calls openEyes with args', async () => {
      let _args;
      const handlers = makeHandlers({
        visualGridClient: {openEyes: args => (_args = args)},
        config: {},
        logger: console,
        processCloseAndAbort,
        getErrorsAndDiffs,
        errorDigest,
      });

      const eyes = await handlers.open({enablePatterns: true});
      expect(_args.enablePatterns).to.be.true;
      expect(eyes).to.equal(_args);
    });
  });

  describe('devices', () => {
    it('calls getIosDevicesSizes on visualGridClient', async () => {
      let _args = {};
      const handlers = makeHandlers({
        visualGridClient: {
          getIosDevicesSizes: () => (_args.ios = true),
          getEmulatedDevicesSizes: () => (_args.emulated = true),
        },
        config: {},
        logger: console,
        processCloseAndAbort,
        getErrorsAndDiffs,
        errorDigest,
      });
      handlers.getIosDevicesSizes();
      handlers.getEmulatedDevicesSizes();
      expect(_args).to.deep.equal({ios: true, emulated: true});
    });
  });
});
