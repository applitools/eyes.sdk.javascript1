'use strict';
const {presult} = require('@applitools/functional-commons');
const pollingHandler = require('./pollingHandler');
const makeWaitForBatch = require('./waitForBatch');
const makeHandleBatchResultsFile = require('./makeHandleBatchResultsFile');
const {GeneralUtils} = require('@applitools/visual-grid-client');
const runningTests = require('./runningTests');

function makeHandlers({
  config = {},
  visualGridClient,
  logger = console,
  processCloseAndAbort,
  getErrorsAndDiffs,
  errorDigest,
}) {
  logger.log('[handlers] creating handlers with the following config:', config);
  let pollBatchEnd, checkWindow, close, resources, openErr;

  return {
    open: async args => {
      try {
        logger.log(`[handlers] open: close=${typeof close}, args=`, args);
        args.accessibilitySettings = args.accessibilityValidation;
        delete args.accessibilityValidation;
        const eyes = await visualGridClient.openEyes(args);
        const runningTest = {
          abort: eyes.abort,
          closePromise: undefined,
        };
        checkWindow = eyes.checkWindow;
        close = makeClose(eyes.close, runningTest);
        resources = {};
        runningTests.add(runningTest);
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
      runningTests.reset();
      const {testConcurrency} = config;
      const waitForBatch = makeWaitForBatch({
        logger: (logger.extend && logger.extend('waitForBatch')) || logger,
        testConcurrency,
        processCloseAndAbort,
        getErrorsAndDiffs,
        errorDigest,
        isInteractive: GeneralUtils.getPropertyByPath(data, 'isInteractive'),
        handleBatchResultsFile: makeHandleBatchResultsFile(config),
      });
      pollBatchEnd = pollingHandler(
        waitForBatch.bind(null, runningTests.tests, visualGridClient.closeBatch),
      );
      return visualGridClient;
    },
    getIosDevicesSizes: () => visualGridClient.getIosDevicesSizes(),
    getEmulatedDevicesSizes: () => visualGridClient.getEmulatedDevicesSizes(),
    batchEnd: async () => {
      logger.log(`[handlers] batchEnd`);
      return await pollBatchEnd();
    },

    putResource: (id, buffer) => {
      if (!resources) {
        throw new Error('Please call cy.eyesOpen() before calling cy.eyesCheckWindow()');
      }
      resources[id] = buffer;
    },

    checkWindow: async ({
      url,
      snapshot = {},
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
      sendDom,
      useDom,
      enablePatterns,
      ignoreDisplacements,
      accessibility,
      matchLevel,
      visualGridOptions,
      variationGroupId,
    }) => {
      logger.log(`[handlers] checkWindow: checkWindow=${typeof checkWindow}`);
      if (!checkWindow) {
        throw new Error('Please call cy.eyesOpen() before calling cy.eyesCheckWindow()');
      }

      const snapshotsWithResourceContents = Array.isArray(snapshot)
        ? snapshot.map(getSnapshotWithResourceContents)
        : getSnapshotWithResourceContents(snapshot);

      if (sizeMode) {
        console.warn(
          'WARNING! "sizeMode" is deprecated and will be removed in the future, please use target instead.',
          '\nSee: https://github.com/applitools/eyes-cypress#target for more details.',
        );
      }

      return await checkWindow({
        url,
        snapshot: snapshotsWithResourceContents,
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
        sendDom,
        useDom,
        enablePatterns,
        ignoreDisplacements,
        accessibility,
        matchLevel,
        visualGridOptions,
        variationGroupId,
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

  function getSnapshotWithResourceContents(snapshot) {
    const target = {};
    Object.assign(target, snapshot, {
      resourceContents: blobDataToResourceContents(snapshot.blobData),
      frames: createResourceContents(snapshot.frames),
    });
    delete target.blobData;
    return target;
  }

  function createResourceContents(frames = []) {
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

  function blobDataToResourceContents(blobData = []) {
    return blobData.reduce((acc, {url, type, errorStatusCode}) => {
      const data = errorStatusCode ? {url, errorStatusCode} : {url, type, value: resources[url]};
      acc[url] = data;
      return acc;
    }, {});
  }
}

module.exports = makeHandlers;
