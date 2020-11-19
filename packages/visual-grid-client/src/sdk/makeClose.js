'use strict'
const {presult} = require('@applitools/functional-commons')
const makeWaitForTestEnd = require('./makeWaitForTestEnd')

function makeClose({
  getCheckWindowPromises,
  wrappers,
  openEyesPromises,
  resolveTests,
  testController,
  logger,
  globalState,
}) {
  const waitAndResolveTests = makeWaitForTestEnd({
    getCheckWindowPromises,
    openEyesPromises,
    logger,
  })

  return async (throwEx = true) => {
    let error, didError
    const settleError = (throwEx ? Promise.reject : Promise.resolve).bind(Promise)
    logger.log('closeEyes() called')

    if (testController.getIsAbortedByUser()) {
      logger.log('closeEyes() aborted by user')
      return settleError([])
    }

    const batchId = wrappers[0].getBatchIdWithoutGenerating()
    globalState.batchStore.addId(batchId)

    return waitAndResolveTests(async testIndex => {
      resolveTests[testIndex]()

      if ((error = testController.getFatalError())) {
        logger.log('closeEyes() fatal error found')
        await wrappers[testIndex].ensureAborted()
        return (didError = true), error
      }
      if ((error = testController.getError(testIndex))) {
        logger.log('closeEyes() found test error')
        return (didError = true), error
      }

      const closePromise = wrappers[testIndex].close(throwEx)
      const [closeError, closeResult] = await presult(closePromise)
      if (!closeError) {
        setRenderIds(closeResult, testIndex)
        return closeResult
      } else {
        didError = true
        return closeError
      }
    }).then(results => {
      logger.log(`closeEyes() done`)
      return didError ? settleError(results) : results
    })
  }

  function setRenderIds(result, testIndex) {
    const renderIds = testController.getRenderIds(testIndex)
    const steps = result.getStepsInfo()
    for (const [i, renderId] of renderIds.entries()) {
      steps[i].setRenderId(renderId)
    }
  }
}

module.exports = makeClose
