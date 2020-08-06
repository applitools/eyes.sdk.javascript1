'use strict';
const {presult} = require('@applitools/functional-commons');
const pollingHandler = require('./pollingHandler');
const makeWaitForBatch = require('./waitForBatch');
const makeHandleBatchResultsFile = require('./makeHandleBatchResultsFile');
const {GeneralUtils} = require('@applitools/eyes-sdk-core');

const TIMEOUT_MSG = timeout =>
  `Eyes-Cypress timed out after ${timeout}ms. The default timeout is 2 minutes. It's possible to increase this timeout by setting a the value of 'eyesTimeout' in Cypress configuration, e.g. for 3 minutes: Cypress.config('eyesTimeout', 180000)`;

function makeHandlers({
  makeVisualGridClient,
  config = {},
  logger = console,
  processCloseAndAbort,
  getErrorsAndDiffs,
  errorDigest,
}) {
  logger.log('[handlers] creating handlers with the following config:', config);
  let openEyes, pollBatchEnd, checkWindow, close, resources, openErr;
  let runningTests = [];

  return {
    open: async args => {
      try {
        logger.log(`[handlers] open: close=${typeof close}, args=`, args);
        args.accessibilitySettings = args.accessibilityValidation;
        delete args.accessibilityValidation;
        const eyes = await openEyes(args);
        const runningTest = {
          abort: eyes.abort,
          closePromise: undefined,
        };
        checkWindow = eyes.checkWindow;
        close = makeClose(eyes.close, runningTest);
        resources = {};
        runningTests.push(runningTest);
        logger.log('[handlers] open finished');
        return eyes;
      } catch (err) {
        logger.log(`[handlers] openEyes error ${err}`);
        openErr = err;
        throw err;
      }
    },

    batchStart: data => {
      logger.log('[handlers] batchStart with data', data);
      runningTests = [];
      const extraConfig = {};
      if (
        GeneralUtils.getPropertyByPath(data, 'viewport.height') &&
        GeneralUtils.getPropertyByPath(data, 'viewport.width')
      ) {
        extraConfig.browser = data.viewport;
      }
      if (GeneralUtils.getPropertyByPath(data, 'userAgent')) {
        extraConfig.userAgent = data.userAgent;
      }

      const client = makeVisualGridClient(
        Object.assign(extraConfig, config, {
          logger: (logger.extend && logger.extend('vgc')) || logger,
        }),
      );
      openEyes = client.openEyes;
      const waitForBatch = makeWaitForBatch({
        logger: (logger.extend && logger.extend('waitForBatch')) || logger,
        concurrency: config.concurrency,
        processCloseAndAbort,
        getErrorsAndDiffs,
        errorDigest,
        handleBatchResultsFile: makeHandleBatchResultsFile(config),
      });
      pollBatchEnd = pollingHandler(
        waitForBatch.bind(null, runningTests, client.closeBatch),
        TIMEOUT_MSG,
      );
      return client;
    },

    batchEnd: async ({timeout} = {}) => {
      logger.log(`[handlers] batchEnd, timeout=${timeout}`);
      return await pollBatchEnd({timeout});
    },

    putResource: (id, buffer) => {
      if (!resources) {
        throw new Error('Please call cy.eyesOpen() before calling cy.eyesCheckWindow()');
      }
      resources[id] = buffer;
    },

    checkWindow: async ({
      url,
      resourceUrls,
      cdt,
      tag,
      blobData = [],
      sizeMode,
      target,
      fully,
      selector,
      region,
      scriptHooks,
      ignore,
      floating,
      layout,
      content,
      strict,
      frames = [],
      sendDom,
      useDom,
      enablePatterns,
      ignoreDisplacements,
      accessibility,
      matchLevel,
      visualGridOptions,
    }) => {
      logger.log(`[handlers] checkWindow: checkWindow=${typeof checkWindow}`);
      if (!checkWindow) {
        throw new Error('Please call cy.eyesOpen() before calling cy.eyesCheckWindow()');
      }

      const resourceContents = blobDataToResourceContents(blobData);
      const framesWithResources = createResourceContents(frames);

      if (sizeMode) {
        console.warn(
          'WARNING! "sizeMode" is deprecated and will be removed in the future, please use target instead.',
          '\nSee: https://github.com/applitools/eyes-cypress#target for more details.',
        );
      }
      return await checkWindow({
        url,
        resourceUrls,
        resourceContents,
        cdt,
        tag,
        sizeMode,
        target,
        fully,
        selector,
        region,
        scriptHooks,
        ignore,
        floating,
        layout,
        content,
        strict,
        frames: framesWithResources,
        sendDom,
        useDom,
        enablePatterns,
        ignoreDisplacements,
        accessibility,
        matchLevel,
        visualGridOptions,
      });
    },

    close: async () => {
      logger.log(
        `[handlers] close: openErr=${openErr}, close=${typeof close}, checkWindow=${typeof checkWindow}, resources=${
          resources ? `count:${Object.keys(resources).length}` : resources
        }`,
      );
      if (openErr) {
        return;
      }

      if (!close) {
        throw new Error('Please call cy.eyesOpen() before calling cy.eyesClose()');
      }

      // not returning this promise because we don't to wait on it before responding to the client
      close();

      resources = null;
      close = null;
      checkWindow = null;
      openErr = null;
    },
  };

  function makeClose(doClose, runningTest) {
    return async function() {
      return (runningTest.closePromise = presult(doClose(false)));
    };
  }

  function createResourceContents(frames) {
    return frames.map(frame => {
      return {
        url: frame.url,
        cdt: frame.cdt,
        resourceUrls: frame.resourceUrls,
        resourceContents: blobDataToResourceContents(frame.blobData),
        frames: frame.frames ? createResourceContents(frame.frames) : undefined,
      };
    });
  }

  function blobDataToResourceContents(blobData) {
    return blobData.reduce((acc, {url, type, errorStatusCode}) => {
      const data = errorStatusCode ? {url, errorStatusCode} : {url, type, value: resources[url]};
      acc[url] = data;
      return acc;
    }, {});
  }
}

module.exports = makeHandlers;
module.exports.TIMEOUT_MSG = TIMEOUT_MSG;
