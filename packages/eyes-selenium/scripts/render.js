'use strict'
const chromedriver = require('chromedriver')
const {URL} = require('url')
const {Builder, By} = require('selenium-webdriver')
const {
  Eyes,
  ClassicRunner,
  VisualGridRunner,
  Target,
  FileLogHandler,
  Configuration,
  StitchMode,
  EyesSeleniumUtils,
  DeviceName,
  ScreenOrientation,
  // BatchInfo,
  // FileDebugScreenshotsProvider,
} = require('../index')
const path = require('path')
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
  .option('device-emulation', {
    describe: 'the device emulation to render to when in vg mode',
    type: 'string',
    choices: Object.keys(DeviceName),
  })
  .option('screen-orientation', {
    describe: 'the device emulation screen oriantation to render to when in device-emulation mode',
    type: 'string',
    choices: Object.keys(ScreenOrientation),
    default: 'PORTRAIT',
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
  .options('match-timeout', {
    describe: 'match timeout',
    type: 'number',
    default: 0,
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

  .help().argv

const [url] = args._
if (!url) {
  throw new Error('missing url argument!')
}

;(async function() {
  console.log('Running Selenium render for', url)
  console.log(
    'Options: ',
    Object.keys(args)
      .map(key => (!['_', '$0'].includes(key) ? `* ${key}: ${args[key]}` : ''))
      .join('\n  '),
  )

  if (args.webdriverProxy) {
    await chromedriver.start(['--whitelisted-ips=127.0.0.1'], true)
  }
  const driver = await buildDriver({headless: args.headless, webdriverProxy: args.webdriverProxy})

  const runner = args.vg ? new VisualGridRunner() : new ClassicRunner()
  const eyes = new Eyes(runner)
  const configuration = new Configuration({
    viewportSize: {width: 1024, height: 768},
    stitchMode: args.css ? StitchMode.CSS : StitchMode.SCROLL,
  })
  const [width, height] = args.viewportSize.split('x').map(Number)
  configuration.setViewportSize({width, height})
  if (args.browser) {
    configuration.addBrowsers(args.browser)
  }
  if (args.deviceEmulation) {
    const orientation = args.screenOrientation || 'PORTRAIT'
    configuration.addDeviceEmulation(
      DeviceName[args.deviceEmulation],
      ScreenOrientation[orientation],
    )
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
  eyes.setConfiguration(configuration)

  const {logger, logFilePath} = initLog(eyes, new URL(url).hostname.replace(/\./g, '-'))
  logger.log('[render script] Running Selenium render for', url)
  logger.log(`[render script] process versions: ${JSON.stringify(process.versions)}`)
  console.log('log file at:', logFilePath)

  await driver.get(url)

  try {
    await eyes.open(driver, 'selenium render', url)

    let target = Target.window()
      .fully(args.fully)
      .ignoreDisplacements(args.ignoreDisplacements)
      .timeout(args.matchTimeout)

    if (args.ignoreRegions) {
      target.ignoreRegions.apply(
        target,
        args.ignoreRegions.split(',').map(s => By.css(s.trim())),
      )
    }

    if (args.layoutRegions) {
      target.layoutRegions.apply(
        target,
        args.layoutRegions.split(',').map(s => By.css(s.trim())),
      )
    }

    logger.log('[render script] awaiting delay...', args.delay * 1000)
    await new Promise(r => setTimeout(r, args.delay * 1000))
    logger.log('[render script] awaiting delay... DONE')

    // debugger

    if (args.scrollPage) {
      await EyesSeleniumUtils.scrollPage(driver)
    }

    await eyes.check('selenium render', target)
    await eyes.close(true)

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
    await driver.quit()
    if (args.webdriverProxy) {
      await chromedriver.stop()
    }
  }
})()

function buildDriver({headless, webdriverProxy} = {}) {
  let builder = new Builder().withCapabilities({
    browserName: 'chrome',
    'goog:chromeOptions': {
      args: headless ? ['--headless'] : [],
    },
  })
  if (webdriverProxy) {
    builder = builder
      .usingServer('http://localhost.charlesproxy.com:9515')
      .usingWebDriverProxy('http://localhost:8888')
  }
  return builder.build()
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
