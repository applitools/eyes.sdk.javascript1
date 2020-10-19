'use strict'

const {Region} = require('@applitools/eyes-sdk-core')
const {presult} = require('@applitools/functional-commons')
const createRenderRequests = require('./createRenderRequests')
const createCheckSettings = require('./createCheckSettings')
const isInvalidAccessibility = require('./isInvalidAccessibility')
const calculateSelectorsToFindRegionsFor = require('./calculateSelectorsToFindRegionsFor')

function makeCheckWindow({
  globalState,
  testController,
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
  userAgent,
  matchLevel: _matchLevel,
  isSingleWindow,
  getUserAgents,
  visualGridOptions: _visualGridOptions,
}) {
  return function checkWindow({
    snapshot,
    url,
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
    layout,
    strict,
    content,
    useDom,
    enablePatterns,
    ignoreDisplacements,
    visualGridOptions = _visualGridOptions,
  }) {
    const snapshots = Array.isArray(snapshot) ? snapshot : Array(browsers.length).fill(snapshot)

    if (target === 'window' && !fully) {
      sizeMode = 'viewport'
    } else if (target === 'region' && selector) {
      sizeMode = 'selector'
    } else if (target === 'region' && region) {
      sizeMode = 'region'
    }

    const accErr = isInvalidAccessibility(accessibility)
    if (accErr) {
      testController.setFatalError(`Invalid accessibility:\n${accErr}`)
      return
    }

    const currStepCount = ++stepCounter
    logger.log(`running checkWindow for test ${testName} step #${currStepCount}`)
    if (testController.shouldStopAllTests()) {
      logger.log('aborting checkWindow synchronously')
      return
    }

    const getResourcesPromise = Promise.all(
      snapshots.map(snapshot =>
        createRGridDOMAndGetResourceMapping({
          resourceUrls: snapshot.resourceUrls,
          resourceContents: snapshot.resourceContents,
          cdt: snapshot.cdt,
          frames: snapshot.frames,
          userAgent,
          referer: url,
          proxySettings: wrappers[0].getProxy(),
        }),
      ),
    )

    // const userRegions = [ignore, layout, strict, content, accessibility, floating]
    const {selectorsToFindRegionsFor, getMatchRegions} = calculateSelectorsToFindRegionsFor({
      sizeMode,
      selector,
      ignore,
      layout,
      strict,
      content,
      accessibility,
      floating,
    })

    const renderPromise = presult(startRender())
    let renderJobs // This will be an array of `resolve` functions to rendering jobs. See `createRenderJob` below.

    setCheckWindowPromises(
      browsers.map((_browser, i) =>
        checkWindowJob(getCheckWindowPromises()[i], i).catch(testController.setError.bind(null, i)),
      ),
    )
    async function checkWindowJob(prevJobPromise = presult(Promise.resolve()), index) {
      logger.verbose(
        `starting checkWindowJob. test=${testName} stepCount #${currStepCount} index=${index}`,
      )

      const wrapper = wrappers[index]

      if (testController.shouldStopTest(index)) {
        logger.log(`aborting checkWindow - not waiting for render to complete (so no renderId yet)`)
        return
      }

      const [renderErr, renderIds] = await renderPromise

      if (testController.shouldStopTest(index)) {
        logger.log(
          `aborting checkWindow after render request complete but before waiting for rendered status`,
        )
        renderJobs && renderJobs[index]()
        return
      }

      // render error fails all tests
      if (renderErr) {
        logger.log('got render error aborting tests', renderErr)
        const userAgents = await getUserAgents()
        wrapper.setInferredEnvironment(`useragent:${userAgents[browsers[index].name]}`)
        testController.setFatalError(renderErr)
        renderJobs && renderJobs[index]()
        return
      }

      const renderId = renderIds[index]
      testController.addRenderId(index, renderId)

      logger.verbose(
        `render request complete for ${renderId}. test=${testName} stepCount #${currStepCount} tag=${tag} target=${target} fully=${fully} region=${JSON.stringify(
          region,
        )} selector=${JSON.stringify(selector)} browser: ${JSON.stringify(browsers[index])}`,
      )

      const [renderStatusErr, renderStatusResult] = await presult(
        waitForRenderedStatus(renderId, testController.shouldStopTest.bind(null, index)),
      )

      if (testController.shouldStopTest(index)) {
        logger.log('aborting checkWindow after render status finished')
        renderJobs && renderJobs[index]()
        return
      }

      if (renderStatusErr) {
        logger.log('got render status error aborting tests')
        const userAgents = await getUserAgents()
        wrapper.setInferredEnvironment(`useragent:${userAgents[browsers[index].name]}`)
        testController.setFatalError(renderStatusErr)
        renderJobs && renderJobs[index]()
        await openEyesPromises[index]
        return
      }

      const {
        imageLocation: screenshotUrl,
        domLocation,
        userAgent,
        deviceSize,
        selectorRegions,
      } = renderStatusResult

      if (screenshotUrl) {
        logger.verbose(`screenshot available for ${renderId} at ${screenshotUrl}`)
      } else {
        logger.log(`screenshot NOT available for ${renderId}`)
      }

      renderJobs && renderJobs[index]()

      wrapper.setInferredEnvironment(`useragent:${userAgent}`)
      if (deviceSize) {
        wrapper.setViewportSize(deviceSize)
      }

      logger.verbose(
        `checkWindow waiting for prev job. test=${testName}, stepCount #${currStepCount}`,
      )

      await prevJobPromise

      if (testController.shouldStopTest(index)) {
        logger.log(
          `aborting checkWindow for ${renderId} because there was an error in some previous job`,
        )
        return
      }

      const {imageLocationRegion, ...regions} = getMatchRegions({selectorRegions})

      let imageLocation = undefined
      if (sizeMode === 'selector' && imageLocationRegion) {
        imageLocation = new Region(imageLocationRegion).getLocation()
      } else if (sizeMode === 'region' && region) {
        imageLocation = new Region(region).getLocation()
      }

      const checkSettings = createCheckSettings({
        ...regions,
        useDom,
        enablePatterns,
        ignoreDisplacements,
        renderId,
        matchLevel,
      })

      logger.verbose(
        `checkWindow waiting for openEyes. test=${testName}, stepCount #${currStepCount}`,
      )

      await openEyesPromises[index]

      if (testController.shouldStopTest(index)) {
        logger.log(`aborting checkWindow after waiting for openEyes promise`)
        return
      }

      logger.verbose(`running wrapper.checkWindow for test ${testName} stepCount #${currStepCount}`)

      const checkArgs = {
        screenshotUrl,
        tag,
        domUrl: domLocation,
        checkSettings,
        imageLocation,
        url,
      }

      return !isSingleWindow ? wrapper.checkWindow(checkArgs) : wrapper.testWindow(checkArgs)
    }

    async function startRender() {
      if (testController.shouldStopAllTests()) {
        logger.log(`aborting startRender because there was an error in getRenderInfo`)
        return
      }

      const pages = await getResourcesPromise

      if (testController.shouldStopAllTests()) {
        logger.log(`aborting startRender because there was an error in getAllResources`)
        return
      }

      const renderRequests = createRenderRequests({
        url,
        pages,
        browsers,
        renderInfo,
        sizeMode,
        selector,
        selectorsToFindRegionsFor,
        region,
        scriptHooks,
        sendDom,
        visualGridOptions,
      })

      globalState.setQueuedRendersCount(globalState.getQueuedRendersCount() + 1)
      const renderBatchPromise = renderThroat(() => {
        logger.log(`starting to render test ${testName}`)
        return renderBatch(renderRequests)
      })
      renderJobs = renderRequests.map(createRenderJob)
      const renderIds = await renderBatchPromise
      globalState.setQueuedRendersCount(globalState.getQueuedRendersCount() - 1)

      return renderIds
    }
  }

  /**
   * Run a function down the renderThroat and return a way to resolve it. Once resolved (in another place) it makes room in the throat for the next renders that
   */
  function createRenderJob() {
    let resolve
    const p = new Promise(res => (resolve = res))
    renderThroat(() => p)
    return resolve
  }
}

module.exports = makeCheckWindow
