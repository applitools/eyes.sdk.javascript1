'use strict';

// Region must come from sdk-core o.w when initailizing Region with
// Region we fail on not being an instance of Region.
const {Region} = require('@applitools/eyes-sdk-core');
const {presult} = require('@applitools/functional-commons');
const saveData = require('../troubleshoot/saveData');
const createRenderRequests = require('./createRenderRequests');
const createCheckSettings = require('./createCheckSettings');
const calculateMatchRegions = require('./calculateMatchRegions');
const isInvalidAccessibility = require('./isInvalidAccessibility');

function makeCheckWindow({
  testController,
  saveDebugData,
  createRGridDOMAndGetResourceMapping,
  renderBatch,
  waitForRenderedStatus,
  renderInfo,
  logger,
  getCheckWindowPromises,
  setCheckWindowPromises,
  browsers,
  wrappers,
  renderThroat,
  stepCounter,
  testName,
  openEyesPromises,
  fetchHeaders,
  matchLevel: _matchLevel,
  accessibilityLevel: _accessibilityLevel,
}) {
  return function checkWindow({
    resourceUrls = [],
    resourceContents = {},
    frames = [],
    url,
    cdt,
    tag,
    target = 'window',
    fully = true,
    sizeMode = 'full-page',
    selector,
    region,
    scriptHooks,
    ignore,
    floating,
    accessibility,
    sendDom = true,
    matchLevel = _matchLevel,
    accessibilityLevel = _accessibilityLevel,
    layout,
    strict,
    content,
    useDom,
    enablePatterns,
    ignoreDisplacements,
    source,
    referrer,
  }) {
    if (target === 'window' && !fully) {
      sizeMode = 'viewport';
    } else if (target === 'region' && selector) {
      sizeMode = 'selector';
    } else if (target === 'region' && region) {
      sizeMode = 'region';
    }
    fetchHeaders['Referer'] = referrer;

    const accErr = isInvalidAccessibility(accessibility);
    if (accErr) {
      testController.setFatalError(`Invalid accessibility:\n${accErr}`);
      return;
    }

    const currStepCount = ++stepCounter;
    logger.log(`running checkWindow for test ${testName} step #${currStepCount}`);
    if (testController.shouldStopAllTests()) {
      logger.log('aborting checkWindow synchronously');
      return;
    }

    if (typeof window === 'undefined') {
      const handleBrowserDebugData = require('../troubleshoot/handleBrowserDebugData');
      handleBrowserDebugData({
        frame: {resourceUrls, resourceContents, frames, cdt, url},
        metaData: {agentId: wrappers[0].getBaseAgentId()},
        logger,
      });
    }

    const getResourcesPromise = createRGridDOMAndGetResourceMapping({
      resourceUrls,
      resourceContents,
      cdt,
      frames,
    });

    const noOffsetSelectors = {
      all: [ignore, layout, strict, content, accessibility],
      ignore: 0,
      layout: 1,
      strict: 2,
      content: 3,
      accessibility: 4,
    };
    const offsetSelectors = {
      all: [floating],
      floating: 0,
    };
    const renderPromise = presult(startRender());

    let renderJobs; // This will be an array of `resolve` functions to rendering jobs. See `createRenderJob` below.

    setCheckWindowPromises(
      browsers.map((_browser, i) =>
        checkWindowJob(getCheckWindowPromises()[i], i).catch(testController.setError.bind(null, i)),
      ),
    );
    async function checkWindowJob(prevJobPromise = presult(Promise.resolve()), index) {
      if (testController.shouldStopTest(index)) {
        logger.log(
          `aborting checkWindow - not waiting for render to complete (so no renderId yet)`,
        );
        return;
      }

      const [renderErr, renderIds] = await renderPromise;

      if (testController.shouldStopTest(index)) {
        logger.log(
          `aborting checkWindow after render request complete but before waiting for rendered status`,
        );
        renderJobs && renderJobs[index]();
        return;
      }

      // render error fails all tests
      if (renderErr) {
        logger.log('got render error aborting tests', renderErr);
        testController.setFatalError(renderErr);
        renderJobs && renderJobs[index]();
        return;
      }

      const renderId = renderIds[index];
      testController.addRenderId(index, renderId);

      logger.verbose(
        `render request complete for ${renderId}. test=${testName} stepCount #${currStepCount} tag=${tag} target=${target} fully=${fully} region=${JSON.stringify(
          region,
        )} selector=${JSON.stringify(selector)} browser: ${JSON.stringify(browsers[index])}`,
      );

      const [renderStatusErr, renderStatusResult] = await presult(
        waitForRenderedStatus(renderId, testController.shouldStopTest.bind(null, index)),
      );

      if (testController.shouldStopTest(index)) {
        logger.log('aborting checkWindow after render status finished');
        renderJobs && renderJobs[index]();
        return;
      }

      if (renderStatusErr) {
        logger.log('got render status error aborting tests');
        testController.setFatalError(renderStatusErr);
        renderJobs && renderJobs[index]();
        await openEyesPromises[index];
        return;
      }

      const {
        imageLocation: screenshotUrl,
        domLocation,
        userAgent,
        deviceSize,
        selectorRegions,
      } = renderStatusResult;

      if (screenshotUrl) {
        logger.verbose(`screenshot available for ${renderId} at ${screenshotUrl}`);
      } else {
        logger.log(`screenshot NOT available for ${renderId}`);
      }

      renderJobs && renderJobs[index]();

      const wrapper = wrappers[index];
      wrapper.setInferredEnvironment(`useragent:${userAgent}`);
      if (deviceSize) {
        wrapper.setViewportSize(deviceSize);
      }

      logger.verbose(
        `checkWindow waiting for prev job. test=${testName}, stepCount #${currStepCount}`,
      );

      await prevJobPromise;

      if (testController.shouldStopTest(index)) {
        logger.log(
          `aborting checkWindow for ${renderId} because there was an error in some previous job`,
        );
        return;
      }

      const imageLocationRegion = sizeMode === 'selector' ? selectorRegions[0] : undefined;

      let imageLocation = undefined;
      if (sizeMode === 'selector' && imageLocationRegion) {
        imageLocation = new Region(imageLocationRegion).getLocation();
      } else if (sizeMode === 'region' && region) {
        imageLocation = new Region(region).getLocation();
      }

      const {noOffsetRegions, offsetRegions} = calculateMatchRegions({
        noOffsetSelectors: noOffsetSelectors.all,
        offsetSelectors: offsetSelectors.all,
        selectorRegions,
        imageLocationRegion,
      });

      const checkSettings = createCheckSettings({
        ignore: noOffsetRegions[noOffsetSelectors.ignore],
        floating: offsetRegions[offsetSelectors.floating],
        layout: noOffsetRegions[noOffsetSelectors.layout],
        strict: noOffsetRegions[noOffsetSelectors.strict],
        content: noOffsetRegions[noOffsetSelectors.content],
        accessibility: noOffsetRegions[noOffsetSelectors.accessibility],
        useDom,
        enablePatterns,
        ignoreDisplacements,
        renderId,
        matchLevel,
        accessibilityLevel,
      });

      logger.verbose(
        `checkWindow waiting for openEyes. test=${testName}, stepCount #${currStepCount}`,
      );

      await openEyesPromises[index];

      if (testController.shouldStopTest(index)) {
        logger.log(`aborting checkWindow after waiting for openEyes promise`);
        return;
      }

      logger.verbose(
        `running wrapper.checkWindow for test ${testName} stepCount #${currStepCount}`,
      );

      await wrapper.checkWindow({
        screenshotUrl,
        tag,
        domUrl: domLocation,
        checkSettings,
        imageLocation,
        source,
      });
    }

    async function startRender() {
      if (testController.shouldStopAllTests()) {
        logger.log(`aborting startRender because there was an error in getRenderInfo`);
        return;
      }

      const {rGridDom: dom, allResources: resources} = await getResourcesPromise;

      if (testController.shouldStopAllTests()) {
        logger.log(`aborting startRender because there was an error in getAllResources`);
        return;
      }

      const renderRequests = createRenderRequests({
        url,
        dom,
        resources: Object.values(resources),
        browsers,
        renderInfo,
        sizeMode,
        selector,
        region,
        scriptHooks,
        noOffsetSelectors: noOffsetSelectors.all,
        offsetSelectors: offsetSelectors.all,
        sendDom,
      });

      let renderIds = await renderThroat(() => renderBatch(renderRequests));
      renderJobs = renderIds.map(createRenderJob);

      if (saveDebugData) {
        for (const renderId of renderIds) {
          await saveData({renderId, cdt, resources, url, logger});
        }
      }

      return renderIds;
    }
  };

  /**
   * Run a function down the renderThroat and return a way to resolve it. Once resolved (in another place) it makes room in the throat for the next renders that
   */
  function createRenderJob() {
    let resolve;
    const p = new Promise(res => (resolve = res));
    renderThroat(() => p);
    return resolve;
  }
}

module.exports = makeCheckWindow;
