const {useEmitter, withHistory} = require('../emitter')
const {describeTest} = require('./describe')
const {isFunction, mergeObjects, toPascalCase} = require('../common-util')

function emitTests(tests, config) {
  let processedTests = Object.entries(tests).reduce((tests, [testName, {variants, ...test}]) => {
    test.name = testName
    test.key = test.key || toPascalCase(testName)
    if (variants) {
      Object.entries(variants).forEach(([variantName, variant]) => {
        let testVariant = mergeObjects(test, variant)
        testVariant.name += ' ' + variantName
        if (config.overrideTests && config.overrideTests[testVariant.name]) {
          testVariant = mergeObjects(testVariant, config.overrideTests[testVariant.name])
        }
        testVariant.config = testVariant.config || {}
        testVariant.skip = testVariant.skip && !config.ignoreSkip
        testVariant.key += variant.key || toPascalCase(variantName)
        tests.push(testVariant)
      })
    } else {
      if (config.overrideTests && config.overrideTests[test.name]) {
        test = mergeObjects(test, config.overrideTests[test.name])
      }
      test.config = test.config || {}
      test.skip = test.skip && !config.ignoreSkip
      tests.push(test)
    }
    return tests
  }, [])

  if (!config.emitSkipped) {
    processedTests = processedTests.filter(test => !test.skip)
  }

  return processedTests.map(test => {
    if (!isFunction(test.test)) {
      throw new Error(`Missing implementation for test ${test.name}`)
    }
    test.config.baselineName = test.config.baselineName || test.key
    const [output, emitter] = useEmitter()
    test.output = output
    test.meta = {features: test.features}
    if (test.env) {
      test.meta.browser = test.env.browser
      test.meta.mobile = Boolean(test.env.device)
      test.meta.native = Boolean(test.env.device && !test.env.browser)
    }
    const [history, sdk] = withHistory(config.initializeSdk(emitter, test))
    test.history = history
    if (test.page) sdk.driver.visit(config.pages[test.page])
    test.test(sdk)
    test.description = describeTest(test)
    return test
  })
}

exports.emitTests = emitTests
