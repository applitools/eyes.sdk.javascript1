'use strict'

const {Region} = require('@applitools/eyes-sdk-core')
const {presult} = require('@applitools/functional-commons')
const createRenderRequest = require('./createRenderRequest')
const createCheckSettings = require('./createCheckSettings')
const isInvalidAccessibility = require('./isInvalidAccessibility')
const calculateSelectorsToFindRegionsFor = require('./calculateSelectorsToFindRegionsFor')
const makeWaitForTestEnd = require('./makeWaitForTestEnd')

function makeCheckWindow({
  globalState,
  testController,
  createRGridDOMAndGetResourceMapping,
  putResources,
  getRenderJobInfo,
  render,
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
  visualGridOptions: _visualGridOptions,
  resolveTests,
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
    closeAfterMatch,
    throwEx = true,
  }) {
    const snapshots = Array.isArray(snapshot) ? snapshot : Array(browsers.length).fill(snapshot)

    if (target === 'window' && !fully) {
      sizeMode = 'viewport'
    } else if (target === 'region' && selector) {
      sizeMode = fully ? 'full-selector' : 'selector'
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

    const resourcesPromises = snapshots.map(async snapshot => {
      const {rGridDom: dom, allResources: resources} = await createRGridDOMAndGetResourceMapping({
        resourceUrls: snapshot.resourceUrls,
        resourceContents: snapshot.resourceContents,
        cdt: snapshot.cdt,
        frames: snapshot.frames,
        userAgent,
        referer: url,
        proxySettings: wrappers[0].getProxy(),
      })
      await putResources([dom, ...Object.values(resources)])
      return {dom, resources: Object.values(resources)}
    })

    const checkWindowRunningJobs = browsers.map((_browser, index) =>
      checkWindowJob(index, getCheckWindowPromises()[index]).catch(
        testController.setError.bind(null, index),
      ),
    )
    setCheckWindowPromises(checkWindowRunningJobs)

    const renderJobs = new WeakMap()

    if (closeAfterMatch) {
      const waitAndResolveTests = makeWaitForTestEnd({
        getCheckWindowPromises,
        openEyesPromises,
        logger,
      })

      let error, didError
      const settleError = (throwEx ? Promise.reject : Promise.resolve).bind(Promise)

      const batchId = wrappers[0].getBatchIdWithoutGenerating()
      globalState.batchStore.addId(batchId)

      return waitAndResolveTests(async (testIndex, result) => {
        resolveTests[testIndex]()

        if ((error = testController.getFatalError())) {
          await wrappers[testIndex].ensureAborted()
          return (didError = true), error
        }
        if ((error = testController.getError(testIndex))) {
          return (didError = true), error
        }

        const [closeError, closeResult] = await [null, result]
        if (!closeError) {
          return closeResult
        } else {
          didError = true
          return closeError
        }
      }).then(results => {
        return didError ? settleError(results) : results
      })
    }

    async function checkWindowJob(index, prevJobPromise = presult(Promise.resolve())) {
      logger.verbose(
        `starting checkWindowJob. test=${testName} stepCount #${currStepCount} index=${index}`,
      )

      const wrapper = wrappers[index]

      if (testController.shouldStopTest(index)) {
        logger.log(`aborting checkWindow - not waiting for render to complete (so no renderId yet)`)
        return
      }

      await openEyesPromises[index]

      if (testController.shouldStopTest(index)) {
        logger.log(`aborting checkWindow after waiting for openEyes promise`)
        return
      }

      const renderRequest = createRenderRequest({
        url,
        browser: browsers[index],
        renderInfo,
        sizeMode,
        selector,
        selectorsToFindRegionsFor,
        region,
        scriptHooks,
        sendDom,
        visualGridOptions,
      })

      if (!wrapper.getAppEnvironment()) {
        const info = await getRenderJobInfo(renderRequest)
        wrapper.setRenderJobInfo(info)
      }

      await wrapper.ensureRunningSession()

      const {dom, resources} = await resourcesPromises[index]
      renderRequest.setDom(dom)
      renderRequest.setResources(resources)
      renderRequest.setRenderer(wrapper.getRenderer())

      const [renderErr, renderId] = await presult(renderJob(renderRequest))

      if (testController.shouldStopTest(index)) {
        logger.log(
          `aborting checkWindow after render request complete but before waiting for rendered status`,
        )
        if (renderJobs.has(renderRequest)) renderJobs.get(renderRequest)()
        return
      }

      // render error fails all tests
      if (renderErr) {
        logger.log('got render error aborting tests', renderErr)
        testController.setFatalError(renderErr)
        if (renderJobs.has(renderRequest)) renderJobs.get(renderRequest)()
        return
      }

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
        if (renderJobs.has(renderRequest)) renderJobs.get(renderRequest)()
        return
      }

      if (renderStatusErr) {
        logger.log('got render status error aborting tests')
        testController.setFatalError(renderStatusErr)
        if (renderJobs.has(renderRequest)) renderJobs.get(renderRequest)()
        return
      }

      const {imageLocation: screenshotUrl, domLocation, selectorRegions} = renderStatusResult

      if (screenshotUrl) {
        logger.verbose(`screenshot available for ${renderId} at ${screenshotUrl}`)
      } else {
        logger.log(`screenshot NOT available for ${renderId}`)
      }

      renderJobs.get(renderRequest)()

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
      if ((sizeMode === 'selector' || sizeMode === 'full-selector') && imageLocationRegion) {
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
        closeAfterMatch,
        throwEx,
      }

      return wrapper.checkWindow(checkArgs)
    }

    async function renderJob(renderRequest) {
      if (testController.shouldStopAllTests()) {
        logger.log(`aborting renderJob because there was an error in getAllResources`)
        return
      }

      const renderRequestTask = new Task()
      globalState.setQueuedRendersCount(globalState.getQueuedRendersCount() + 1)
      const holder = new Promise(resolve => {
        renderThroat(async () => {
          logger.log(`starting to render test ${testName}`)
          renderJobs.set(renderRequest, resolve)
          const [renderIdErr, renderId] = await presult(render(renderRequest))
          if (renderIdErr) {
            renderRequestTask.reject(renderIdErr)
          } else {
            renderRequestTask.resolve(renderId)
          }
          globalState.setQueuedRendersCount(globalState.getQueuedRendersCount() - 1)
          return holder
        })
      })

      return renderRequestTask.promise
    }
  }
}

module.exports = makeCheckWindow

function Task() {
  this.promise = new Promise((r, j) => {
    this.resolve = r
    this.reject = j
  })
}
