'use strict'
const fs = require('fs')
const path = require('path')
const chromedriver = require('chromedriver')
const {URL} = require('url')
const cwd = process.cwd()
const spec = require(path.resolve(cwd, 'src/SpecWrappedDriver'))
const {
  Eyes,
  ClassicRunner,
  VisualGridRunner,
  Target,
  FileLogHandler,
  Configuration,
  StitchMode,
  DeviceName,
  ScreenOrientation,
  MatchLevel,
  // FileDebugScreenshotsProvider,
} = require(cwd)
const {EyesJsBrowserUtils} = require('../../eyes-sdk-core')
const yargs = require('yargs')
const args = yargs
  .usage('yarn render <url> [options]')
  .example(
    'yarn render http://example.org --viewport-size 800x600 --css',
    'classic viewport screenshot, browser width 800 pixels, browser height 600 pixels, css stitching',
  )
  .example(
    'yarn render http://example.org --vg --browser firefox(1200x900)',
    'visual grid render, defalut viewport size of 1024x768, vg browser is firefox at 1200x900',
  )
  .example(
    'yarn render http://example.org --ignore-regions "#ignore-this,.dynamic-element" --fully',
    'classic full page screenshot, 2 ignore selectors',
  )
  .option('api-key', {
    describe: 'Applitools API key',
    type: 'string',
    default: process.env.APPLITOOLS_API_KEY,
  })
  .option('target-element', {
    describe: 'translates to Target.region(...)',
    type: 'string',
  })
  .option('target-frame', {
    describe: 'translates to Target.frame(...)',
    type: 'string',
  })
  .option('vg', {
    type: 'boolean',
    describe: 'when specified, use visual grid instead of classic runner',
  })
  .option('css', {
    type: 'boolean',
    describe: 'when specified, use CSS stitch mode',
  })
  .option('headless', {
    default: true,
    type: 'boolean',
    describe: 'open browser in non-headless mode',
  })
  .option('fully', {
    type: 'boolean',
    describe: 'whether to check target fully',
    default: false,
  })
  .option('delay', {
    describe: 'delay in seconds before capturing page',
    type: 'number',
    default: 0,
  })
  .option('browser', {
    alias: 'b',
    describe: 'the browser to render to when in vg mode',
    type: 'string',
    coerce: parseBrowser,
  })
  .option('device-name', {
    describe: 'the chrome-emulation device name to render to when in vg mode',
    type: 'string',
    choices: Object.values(DeviceName),
  })
  .option('screen-orientation', {
    describe: 'the device screen oriantation to render to when in chrome emulation',
    type: 'string',
    choices: Object.values(ScreenOrientation),
  })
  .option('ignore-displacements', {
    describe: 'when specified, ignore displaced content',
    type: 'boolean',
    default: false,
  })
  .option('ignore-regions', {
    describe: 'comma-separated list of selectors to ignore',
    type: 'string',
  })
  .option('layout-regions', {
    describe: 'comma-separated list of selectors for layout regions',
    type: 'string',
  })
  .option('viewport-size', {
    describe: 'the viewport size to open the browser (widthxheight)',
    type: 'string',
    default: '1024x768',
  })
  .option('scroll-page', {
    describe: 'before taking the screenshot, scroll page to the bottom and up',
    type: 'boolean',
  })
  .option('match-timeout', {
    describe: 'match timeout',
    type: 'number',
    default: 0,
  })
  .option('match-level', {
    describe: 'match level',
    type: 'string',
    choices: Object.values(MatchLevel),
  })
  .option('accessibility-validation', {
    describe: 'accessibility validation (comma separated, e.g. AA.WCAG_2_0)',
    type: 'string',
  })
  .option('server-url', {
    describe: 'server url',
    type: 'string',
  })
  .option('api-key', {
    describe: 'API key',
    type: 'string',
  })
  .option('proxy', {
    describe: 'proxy string, e.g. http://localhost:8888',
    type: 'string',
  })
  .option('webdriver-proxy', {
    describe:
      'whether to use charles as a proxy to webdriver calls (works on port 8888, need to start Charles manually prior to running this script',
    type: 'boolean',
  })
  .option('env-name', {
    describe: 'baseline env name',
    type: 'string',
  })
  .option('driver-capabilities', {
    describe:
      'capabilities for driver. Comma-separated with colon for key/value. Example: --sauce-options "deviceName:iPhone 8 Simulator,platformName:iOS,platformVersion:13.2,appiumVersion:1.16.0,browserName:Safari"',
    type: 'string',
    coerce: parseCompoundParameter,
  })
  .option('driver-server', {
    describe: 'server for driver.',
    type: 'string',
  })
  .option('tag', {
    describe: 'tag for checkpoint',
    type: 'string',
    default: 'selenium render',
  })
  .option('app-name', {
    describe: 'app name for baseline',
    type: 'string',
    default: 'selenium render',
  })
  .option('display-name', {
    describe:
      "display name for test. This is what shows up in the dashboard as the test name, but doesn't affect the baseline.",
    type: 'string',
  })
  .option('batch-id', {
    describe: 'batch id',
    type: 'string',
  })
  .option('batch-name', {
    describe: 'batch name',
    type: 'string',
  })
  .option('run-before', {
    describe:
      'path to JavaScript file which exports an async function which should be run before the visual check. The function receives the driver as a parameter so is can perform page interactions.',
    type: 'string',
    coerce: processRunBefore,
  })
  .option('attach', {
    describe: 'attach to existing chrome via remote debugging port',
    type: 'boolean',
  })
  .option('scroll-root-element', {
    describe: 'selector to scroll root element',
    type: 'string',
  })
  .option('stitch-overlap', {
    describe: 'stitch overlap',
    type: 'number',
  })
  .help().argv

let [url] = args._
if (!url && !args.attach) {
  throw new Error('missing url argument!')
}

;(async function() {
  const isMobileEmulation = args.deviceName && !args.vg

  if (args.webdriverProxy) {
    await chromedriver.start(['--whitelisted-ips=127.0.0.1'], true)
  }

  let runBeforeFunc
  if (args.runBefore !== undefined) {
    if (!fs.existsSync(args.runBefore)) {
      throw new Error('file specified in --run-before does not exist:', args.runBefore)
    }
    runBeforeFunc = require(args.runBefore)
    if (typeof runBeforeFunc !== 'function') {
      throw new Error(`exported value from --run-before file is not a function: ${args.runBefore}`)
    }
  }

  const driver = await buildDriver({...args, isMobileEmulation})

  if (args.attach) {
    url = await spec.executeScript(driver, 'return window.location.href')
  }

  console.log('Running Selenium render for', url)
  console.log(
    'Options:\n ',
    Object.entries(args)
      .map(argToString)
      .filter(x => x)
      .join('\n  '),
  )

  const runner = args.vg ? new VisualGridRunner() : new ClassicRunner()
  const eyes = new Eyes(runner)
  const configuration = new Configuration({
    stitchMode: args.css ? StitchMode.CSS : StitchMode.SCROLL,
  })
  if (args.viewportSize && !isMobileEmulation) {
    const [width, height] = args.viewportSize.split('x').map(Number)
    configuration.setViewportSize({width, height})
  }
  if (args.browser) {
    configuration.addBrowsers(args.browser)
  }
  if (args.deviceName) {
    configuration.addDeviceEmulation(args.deviceName, args.screenOrientation)
  }
  if (args.serverUrl) {
    configuration.setServerUrl(args.serverUrl)
  }
  if (args.apiKey) {
    configuration.setApiKey(args.apiKey)
  }
  if (args.proxy) {
    configuration.setProxy(args.proxy)
  }
  if (args.accessibilityValidation) {
    const [level, version] = args.accessibilityValidation.split(',')
    configuration.setAccessibilityValidation({level, version})
  }
  if (args.matchLevel) {
    configuration.setMatchLevel(args.matchLevel)
  }
  if (args.envName) {
    configuration.setBaselineEnvName(args.envName) // determines the baseline
    configuration.setEnvironmentName(args.envName) // shows up in the Environment column in the dasboard
  }
  if (args.displayName) {
    configuration.setDisplayName(args.displayName)
  }
  if (args.batchId || args.batchName) {
    configuration.setBatch({id: args.batchId, name: args.batchName})
  }
  if (args.batchId) {
    configuration.setDontCloseBatches(true)
  }
  if (args.stitchOverlap) {
    configuration.setStitchOverlap(args.stitchOverlap)
  }

  eyes.setConfiguration(configuration)

  const {logger, logFilePath} = initLog(eyes, new URL(url).hostname.replace(/\./g, '-'))
  logger.log('[render script] Running Selenium render for', url)
  logger.log(`[render script] process versions: ${JSON.stringify(process.versions)}`)
  console.log('log file at:', logFilePath)

  if (!args.attach) {
    await spec.visit(driver, url)
  }

  try {
    if (runBeforeFunc) {
      await runBeforeFunc(driver)
    }

    await eyes.open(driver, args.appName, url)

    let target

    if (args.targetElement) {
      target = Target.region(args.targetElement)
    } else if (args.targetFrame) {
      target = Target.frame(args.targetFrame)
    } else {
      target = Target.window()
    }
    target = target
      .fully(args.fully)
      .ignoreDisplacements(args.ignoreDisplacements)
      .timeout(args.matchTimeout)

    if (args.ignoreRegions) {
      target.ignoreRegions.apply(
        target,
        args.ignoreRegions.split(',').map(s => s.trim()),
      )
    }

    if (args.layoutRegions) {
      target.layoutRegions.apply(
        target,
        args.layoutRegions.split(',').map(s => s.trim()),
      )
    }

    if (args.scrollRootElement) {
      target.scrollRootElement(args.scrollRootElement)
    }

    logger.log('[render script] awaiting delay...', args.delay * 1000)
    await new Promise(r => setTimeout(r, args.delay * 1000))
    logger.log('[render script] awaiting delay... DONE')

    // debugger

    if (args.scrollPage) {
      await EyesJsBrowserUtils.scrollPage(driver)
    }

    await eyes.check(args.tag, target)
    await eyes.close(false)

    const testResultsSummary = await runner.getAllTestResults(false)
    const resultsStr = testResultsSummary
      .getAllResults()
      .map(testResultContainer => {
        const testResults = testResultContainer.getTestResults()
        return testResults ? formatResults(testResults) : testResultContainer.getException()
      })
      .join('\n')

    console.log('\nRender results:\n', resultsStr)
  } finally {
    if (!args.attach) {
      await spec.cleanup(driver)
    }
    if (args.webdriverProxy) {
      await chromedriver.stop()
    }
  }
})().catch(ex => {
  console.log(ex)
  process.exit(1)
})

function buildDriver({
  headless,
  webdriverProxy,
  driverCapabilities,
  driverServer,
  isMobileEmulation,
  deviceName,
  attach,
} = {}) {
  const capabilities = {
    browserName: 'chrome',
    'goog:chromeOptions': {
      // w3c: false,
      args: headless ? ['--headless'] : [],
      mobileEmulation: isMobileEmulation ? {deviceName} : undefined,
      debuggerAddress: attach ? '127.0.01:9222' : undefined,
    },
    ...driverCapabilities,
  }

  if (process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY) {
    capabilities['sauce:options'] = {
      username: process.env.SAUCE_USERNAME,
      accesskey: process.env.SAUCE_ACCESS_KEY,
    }
  }

  console.log(
    'Running with capabilities:\n',
    Object.entries(capabilities)
      .map(argToString)
      .join('\n '),
    '\n',
  )

  return spec.build({capabilities, serverUrl: driverServer, webdriverProxy})
}

function initLog(eyes, filename) {
  const logFilePath = path.resolve(__dirname, `../logs/${filename}-${formatDate(new Date())}.log`)
  const logHandler = new FileLogHandler(true, logFilePath)
  logHandler.open()
  eyes.setLogHandler(logHandler)
  return {logger: eyes.getLogger(), logFilePath}
}

function formatResults(testResults) {
  return `
Test name                 : ${testResults.getName()}
Test status               : ${testResults.getStatus()}
URL to results            : ${testResults.getUrl()}
Total number of steps     : ${testResults.getSteps()}
Number of matching steps  : ${testResults.getMatches()}
Number of visual diffs    : ${testResults.getMismatches()}
Number of missing steps   : ${testResults.getMissing()}
Display size              : ${testResults.getHostDisplaySize().toString()}
Steps                     :
${testResults
  .getStepsInfo()
  .map(step => {
    return `  ${step.getName()} - ${getStepStatus(step)}`
  })
  .join('\n')}`
}

function getStepStatus(step) {
  if (step.getIsDifferent()) {
    return 'Diff'
  } else if (!step.getHasBaselineImage()) {
    return 'New'
  } else if (!step.getHasCurrentImage()) {
    return 'Missing'
  } else {
    return 'Passed'
  }
}

function formatDate(d) {
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const date = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${date}-${hours}-${minutes}-${seconds}`
}

function parseBrowser(arg) {
  const match = /^(chrome|chrome-1|chrome-2|chrome-canary|firefox|firefox-1|firefox-2|ie11|ie10|edge|safari|safari-1|safari-2|ie-vmware|edge-chromium|edge-chromium-1|edge-chromium-2)(\( *(\d+) *(x|,) *(\d+) *\))?$/.exec(
    arg,
  )

  if (!match)
    throw new Error(
      'invalid syntax. Supports only chrome[-one-version-back/-two-versions-back], firefox[-one-version-back/-two-versions-back], ie11, ie10, edge, safari[-one-version-back/-two-versions-back] as browsers, and the syntax is browser(widthxheight)',
    )

  return {name: match[1], width: parseInt(match[3], 10), height: parseInt(match[5], 10)}
}

/**
 * "key1:value1,key2:value2,key3:value3" --> {key1: value1, key2: value2, key3: value3}
 */
function parseCompoundParameter(str) {
  if (!str) return str

  return str
    .split(',')
    .map(keyValue => keyValue.split('=>'))
    .reduce((acc, [key, value]) => {
      acc[key] = value // not casting to Number or Boolean since I didn't need it
      return acc
    }, {})
}

function argToString([key, value]) {
  const valueStr = typeof value === 'object' ? JSON.stringify(value) : value
  const shouldShow = !['_', '$0'].includes(key) && key.indexOf('-') === -1 // don't show the entire cli, and show only the camelCase version of each arg
  return shouldShow && `* ${key}: ${valueStr}`
}

function processRunBefore(str) {
  if (str.charAt(0) !== '/') str = `./${str}`
  return path.resolve(cwd, str)
}
