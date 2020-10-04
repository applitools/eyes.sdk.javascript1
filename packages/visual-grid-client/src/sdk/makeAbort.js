'use strict'
const {presult} = require('@applitools/functional-commons')
const makeWaitForTestEnd = require('./makeWaitForTestEnd')

function makeAbort({
  getCheckWindowPromises,
  wrappers,
  openEyesPromises,
  resolveTests,
  testController,
  globalState,
  logger,
}) {
  const waitAndResolveTests = makeWaitForTestEnd({
    getCheckWindowPromises,
    openEyesPromises,
    logger,
  })

  return async () => {
    testController.setIsAbortedByUser()

    const batchId = wrappers[0].getBatchIdWithoutGenerating()
    globalState.batchStore.addId(batchId)

    return waitAndResolveTests(async testIndex => {
      const [closeErr, closeResult] = await presult(wrappers[testIndex].abort())
      resolveTests[testIndex]()
      if (closeErr) {
        throw closeErr
      }
      return closeResult
    })
  }
}

module.exports = makeAbort
