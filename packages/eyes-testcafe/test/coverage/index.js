const createTestCafe = require('testcafe')
const stream = require('stream')
const fs = require('fs')
const {
  makeCoverageTests,
  convertExecutionModeToSuffix,
} = require('@applitools/sdk-test-kit').coverageTests
const uuidv4 = require('uuid/v4')

const sdkName = 'eyes-testcafe'
const branchId = uuidv4()

function makeCommands() {
  let baselineTestName
  let cache = {
    setup: [],
  }
  function _out() {
    return cache
  }
  function _setup(options) {
    baselineTestName = options.baselineTestName
    cache.setup.push(`eyes.setBranchName('${options.branchName}')`)
    options.executionMode.isCssStitching
      ? cache.setup.push(`eyes.setStitchMode(StitchMode.CSS)`)
      : undefined
    options.executionMode.isScrollStitching
      ? cache.setup.push(`eyes.setStitchMode(StitchMode.SCROLL)`)
      : undefined
    cache.setup.push(`eyes.setBatch('JS Coverage Tests - ${sdkName}', '${branchId}')`)
    cache.setup.push(`
      if (process.env.APPLITOOLS_API_KEY_SDK) {
        eyes.setApiKey(process.env.APPLITOOLS_API_KEY_SDK)
      }
    `)
  }
  function abort() {}
  function visit(url) {
    cache.visit = url
  }
  function open(options) {
    const viewportSizes = options.viewportSize.split('x')
    cache.open = `await eyes.open(driver, '${options.appName}', '${baselineTestName}', {width: ${viewportSizes[0]}, height: ${viewportSizes[1]}})`
  }
  function checkFrame() {}
  function checkRegion() {}
  function checkWindow(options) {
    const isFully = !!(options && options.isFully)
    cache.checkWindow = `await eyes.check(undefined, Target.window().fully(${isFully}))`
  }
  function close(_options) {
    cache.close = `await eyes.close()`
  }
  function getAllTestResults() {}
  function scrollDown() {}
  function switchToFrame() {}
  function type() {}
  return {
    _out,
    _setup,
    abort,
    checkFrame,
    checkRegion,
    checkWindow,
    close,
    getAllTestResults,
    open,
    scrollDown,
    switchToFrame,
    type,
    visit,
  }
}

function makeRun() {
  function createTestFiles(testFileDir, supportedTests) {
    supportedTests.forEach(async supportedTest => {
      const commands = makeCommands()
      const tests = makeCoverageTests(commands)
      const baselineTestName = `${supportedTest.name}${convertExecutionModeToSuffix(
        supportedTest.executionMode,
      )}`
      if (commands._setup) {
        commands._setup({
          baselineTestName,
          branchName: 'master',
          executionMode: supportedTest.executionMode,
        })
      }
      // run test to generate cache
      await tests[supportedTest.name]()
      // emit test contents from cache
      const body = emitTest(supportedTest.name, commands._out())
      if (!fs.existsSync(testFileDir)) {
        fs.mkdirSync(testFileDir)
      }
      fs.writeFileSync(`${testFileDir}/${baselineTestName}.js`, body)
    })
  }

  function emitTest(testName, output) {
    let testCommands = {...output}
    delete testCommands.visit
    delete testCommands.getAllTestResults
    delete testCommands.setup
    return `const {Eyes, StitchMode, Target} = require('../../../index')
const eyes = new Eyes()

fixture\`${testName}\`
  .page('${output.visit}')
  .beforeEach(async () => {
    ${output.setup.join('\n    ')}
  })
  ${output.getAllTestResults ? '.after(async () => ' + output.getAllTestResults + ')' : ''}

test('${testName}', async driver => {
  ${Object.values(testCommands).join('\n  ')}
})`
  }

  class MyStream extends stream.Writable {
    _write(chunk, _encoding, next) {
      this.report = JSON.parse(chunk.toString('utf8'))
      next()
    }
  }

  async function run(supportedTests) {
    process.stdout.write('Preparing test files...')
    const testFileDir = `${__dirname}/tmp`
    createTestFiles(testFileDir, supportedTests)
    process.stdout.write(' Done!\n\n')
    console.log(`(you can see them in ${testFileDir})`)
    console.log('Running TestCafe tests...')
    const testCafe = await createTestCafe('localhost', 1337, 1338)
    const runner = testCafe.createRunner()
    const stream = new MyStream()
    await runner
      .src(testFileDir)
      .browsers('chrome:headless')
      .concurrency(5)
      .reporter('json', stream)
      .run()
      .catch(console.error)
    stream.report.fixtures.forEach(fixture => {
      console.log(fixture.tests)
    })
    testCafe.close()
  }

  return {run}
}

const supportedTests = [
  // viewport
  {name: 'TestCheckWindow_Fluent', executionMode: {isCssStitching: true}},
  {name: 'TestCheckWindow_Fluent', executionMode: {isScrollStitching: true}},
  // full page
  {name: 'TestCheckPageWithHeader_Window_Fully', executionMode: {isCssStitching: true}},
  {name: 'TestCheckPageWithHeader_Window_Fully', executionMode: {isScrollStitching: true}},
]

makeRun().run(supportedTests)
