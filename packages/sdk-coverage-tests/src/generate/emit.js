const {useEmitter} = require('../emitter')
const {isFunction} = require('../common-util')

function emitTests(tests, config) {
  const emittedTests = []
  const errors = []
  for (const test of tests) {
    try {
      emittedTests.push(emitTest(test, config))
    } catch (error) {
      errors.push({test, error})
    }
  }
  return {emittedTests, errors}
}

function emitTest(test, {makeSdk, fileTemplate}) {
  if (!isFunction(test.test)) {
    throw new Error(`Missing implementation for test ${test.name}`)
  }
  test.config.baselineName = test.config.baselineName || test.key
  test.meta = {features: test.features}
  if (test.env) {
    test.meta.browser = test.env.browser
    test.meta.mobile = Boolean(test.env.device)
    test.meta.native = Boolean(test.env.device && !test.env.browser)
    test.meta.headfull = Boolean(!test.env.headless)
  }
  const [output, emitter] = useEmitter()
  const sdk = makeSdk(emitter, test)
  test.output = output
  if (test.page) sdk.driver.visit(test.page)
  test.test(sdk)
  test.code = fileTemplate(test)
  return test
}

module.exports = {emitTests, emitTest}
