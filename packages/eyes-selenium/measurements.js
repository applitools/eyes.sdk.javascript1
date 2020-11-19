const cwd = process.cwd()
const path = require('path')
const spec = require(path.resolve(cwd, 'src/spec-driver'))
const {VisualGridRunner, FileLogHandler, BatchInfo, Eyes, Configuration} = require(cwd)
const fs = require('fs')

const STEPS = Number(process.env.MEASURE_STEPS)
const CONCURRENCY = Number(process.env.MEASURE_CONCURRENCY)
const BROWSERS = Number(process.env.MEASURE_BROWSERS)
const TESTS = Number(process.env.MEASURE_TESTS)

const configStr = `TESTS=${TESTS},STEPS=${STEPS},CONCURRENCY=${CONCURRENCY},BROWSERS=${BROWSERS}`
console.log('running with', configStr)

const URL =
  'https://www.booking.com/index.uk.html?aid=376445;label=bookings-naam-B9ObXm1VJOAq2ho0czzpIQS267754536176:pl:ta:p1:p22,563,000:ac:ap:neg:fi:tiaud-898142577969:kwd-65526620:lp1012866:li:dec:dm:ppccp=UmFuZG9tSVYkc2RlIyh9YTQUGSsRwx9_piJbnTYecvA;ws=&gclid=Cj0KCQjwqfz6BRD8ARIsAIXQCf3I2VfJ6miqKlG1VxkOsAO1lUbIoh5rE06C9tDyl6rtZLzDsCpFS0caApfjEALw_wcB'

describe('Measurements', () => {
  let driver, destroyDriver, eyes
  let visits = []
  let startAll
  let logger
  let logHandler
  let logFilePath

  const runner = new VisualGridRunner(CONCURRENCY)

  before(() => {
    startAll = Date.now()
    ;({logHandler, logFilePath} = initLog(
      `steps-${STEPS}__conc-${CONCURRENCY}__tests-${TESTS}__browsers-${BROWSERS}_after`,
    ))
    console.log('log file at:', logFilePath)
  })

  after(async () => {
    logger.log('[Measurements] waiting for all results after', Date.now() - startAll)
    await runner.getAllTestResults(false)
    const total = Date.now() - startAll
    logger.log(`Total: ${total / 1000} sec (${minutes(total / 1000)})`)
    console.log(`Total: ${total / 1000} sec (${minutes(total / 1000)})`)
    const visitsTotal = visits
      .reduce((a, x) => a.concat(x), [])
      .map(Number)
      .reduce((sum, x) => sum + x, 0)
    logger.log(`Visit times: ${visits} (total ${visitsTotal})`)
    const totalMinus = (total - visitsTotal) / 1000
    logger.log(`Total minus visits: ${totalMinus} sec (${minutes(totalMinus)})`)
    console.log(`Total minus visits: ${totalMinus} sec (${minutes(totalMinus)})`)
    logHandler.close()
    fs.appendFileSync(
      './logs/measurements/total',
      `${configStr} | ${minutes(total / 1000)} | ${minutes(totalMinus)}\n`,
    )
  })

  function minutes(s) {
    return `${Math.floor(s / 60)}:${s % 60}`
  }

  beforeEach(async () => {
    ;[driver, destroyDriver] = await spec.build({browser: 'chrome'})
    eyes = getEyes({
      runner,
      browsersInfo: new Array(BROWSERS)
        .fill()
        .map((_, i) => ({name: 'chrome', width: 600 + 25 * i, height: 600 + 25 * i})),
      // browsersInfo: [{iosDeviceInfo: {deviceName: 'iPhone 11 Pro'}}],
    })
    eyes.setLogHandler(logHandler)
    logger = eyes.getLogger()
  })

  afterEach(async () => {
    await destroyDriver()
  })

  for (let t = 0; t < TESTS; t++) {
    const index = t + 1
    it(`Measurements ${index}`, async () => {
      logger.log(`[Measurements] starting test ${index}`)
      const before = Date.now()
      await spec.visit(driver, URL)
      const visitTime = Date.now() - before
      visits.push(visitTime)
      console.log(`[Measurements ${index}] visit ${URL} - ${visitTime}`)
      await eyes.open(driver, `Measurements`, `Measurements ${index} ${configStr}`)
      for (let i = 0, ii = STEPS; i < ii; i++) {
        await eyes.check({isFully: true})
        console.log(`[Measurements ${index}] step ${i + 1} done`)
      }
      eyes.close(false).then(() => {
        logHandler.open()
        console.log(`[Measurements ${index}] done`)
      })
    })
  }
})

function initLog(filename) {
  let logFilePath = path.resolve(__dirname, `logs/measurements/${filename}.log`)
  while (fs.existsSync(logFilePath)) {
    logFilePath = logFilePath.replace('.log', '_a.log')
  }
  const logHandler = new FileLogHandler(true, logFilePath)
  logHandler.open()
  return {logHandler, logFilePath}
}

const batch = new BatchInfo({name: 'JS SDK measurements'})

function getEyes({runner, ...config} = {}) {
  const eyes = new Eyes(runner)
  const conf = {
    batch,
    matchTimeout: 0,
    ...config,
  }
  eyes.setConfiguration(new Configuration(conf))

  return eyes
}
