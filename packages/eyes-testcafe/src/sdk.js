const {
  EyesSDK,
  TypeUtils,
  VisualGridRunner,
  TestResultsFormatter,
  ConfigUtils,
  Logger,
} = require('@applitools/eyes-sdk-core')
const VisualGridClient = require('@applitools/visual-grid-client')
const spec = require('./spec-driver')
const {version} = require('../package.json')
const {translateArgsToConfig, makeTranslateArgsToCheckSettings, writeTapFile} = require('./util')
const sdk = EyesSDK({
  name: 'eyes.testcafe',
  version,
  spec,
  VisualGridClient,
})
const translateArgsToCheckSettings = makeTranslateArgsToCheckSettings(sdk.CheckSettings)

process.env.APPLITOOLS_SCRIPT_RESULT_MAX_BYTE_LENGTH = 4718592 // 4.5 MB
process.env.APPLITOOLS_SCRIPT_REMOVE_REVERSE_PROXY_URL_PREFIXES = true

class DecoratedEyesFactory extends sdk.EyesFactory {
  constructor({configPath, runner = new VisualGridRunner()} = {}) {
    // init
    const applitoolsConfigJs = ConfigUtils.getConfig({configPath})
    runner.testConcurrency = {
      testConcurrency: applitoolsConfigJs.concurrency || applitoolsConfigJs.testConcurrency,
    }
    const eyesInstance = super(runner)
    const _open = eyesInstance.open.bind(eyesInstance)
    const _check = eyesInstance.check.bind(eyesInstance)
    const _close = eyesInstance.close.bind(eyesInstance)
    let failTestcafeOnDiff = true
    let tapDirPath

    // set api wrapper
    const api = {
      async open(...args) {
        let openArgs, config, driver
        if (args && args.length === 1 && TypeUtils.isObject(args[0]) && !spec.isDriver(args[0])) {
          const {t, appName, testName} = args[0]
          openArgs = [t, appName, testName]
          config = translateArgsToConfig({...applitoolsConfigJs, ...args[0]})
          driver = t
        } else {
          openArgs = args
          config = translateArgsToConfig(applitoolsConfigJs)
          driver = args[0]
        }
        failTestcafeOnDiff = config.failTestcafeOnDiff
        tapDirPath = config.tapDirPath
        if (!process.env.APPLITOOLS_USE_PRELOADED_CONFIG) {
          eyesInstance.setConfiguration(config)
          eyesInstance.logger = new Logger(process.env.APPLITOOLS_SHOW_LOGS || config.getShowLogs())
        }
        // driver health check, re: https://trello.com/c/xNCZNfPi
        try {
          await spec.executeScript(driver, () => {
            return true
          })
        } catch (error) {
          throw new Error(
            `The browser is in an invalid state due to JS errors on the page that TestCafe is unable to handle. Try running the test with TestCafe's --skip-js-errors option enabled: https://devexpress.github.io/testcafe/documentation/reference/configuration-file.html#skipjserrors`,
          )
        }
        return await _open(...openArgs)
      },
      async checkWindow(args) {
        let preparedArgs
        if (TypeUtils.isObject(args)) {
          if (args.tag && Object.keys(args).length === 1)
            preparedArgs = {tag: args.tag, target: 'window', fully: true}
          else if (args.window && !args.fully) preparedArgs = {...args, fully: true}
          else preparedArgs = {...args}
        } else preparedArgs = {tag: args, target: 'window', fully: true}

        await _check(translateArgsToCheckSettings(preparedArgs))
      },
      async waitForResults(throwEx = true) {
        const resultsSummary = await eyesInstance
          .getRunner()
          .getAllTestResults(throwEx && failTestcafeOnDiff)
        if (tapDirPath) {
          const results = resultsSummary.getAllResults().map(r => r.getTestResults())
          const formatter = new TestResultsFormatter(results)
          writeTapFile({tapDirPath, formatter})
        }
        return resultsSummary
      },
      async close(throwEx = true) {
        return await _close(throwEx && failTestcafeOnDiff)
      },
    }
    eyesInstance.open = api.open
    eyesInstance.checkWindow = api.checkWindow
    eyesInstance.waitForResults = api.waitForResults
    eyesInstance.close = api.close
    return eyesInstance
  }
}

const modifiedSdk = {...sdk}
modifiedSdk.EyesFactory = DecoratedEyesFactory
module.exports = {
  ...modifiedSdk,
}
