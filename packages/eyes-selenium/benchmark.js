const cwd = process.cwd()
const path = require('path')
const spec = require(path.resolve(cwd, 'src/spec-driver'))
const {testSetup} = require('@applitools/sdk-shared')
const {VisualGridRunner} = require(cwd)

const URLS = [
  'https://www.amazon.com/s?k=amazonbasics&pf_rd_p=9349ffb9-3aaa-476f-8532-6a4a5c3da3e7&pf_rd_r=0K3HR260GNHTJ1KXZ5QD',
  'https://edition.cnn.com/',
  'https://www.foxnews.com/',
  'https://www.booking.com/index.uk.html?aid=376445;label=bookings-naam-B9ObXm1VJOAq2ho0czzpIQS267754536176:pl:ta:p1:p22,563,000:ac:ap:neg:fi:tiaud-898142577969:kwd-65526620:lp1012866:li:dec:dm:ppccp=UmFuZG9tSVYkc2RlIyh9YTQUGSsRwx9_piJbnTYecvA;ws=&gclid=Cj0KCQjwqfz6BRD8ARIsAIXQCf3I2VfJ6miqKlG1VxkOsAO1lUbIoh5rE06C9tDyl6rtZLzDsCpFS0caApfjEALw_wcB',
]

const STEPS = 1
const CONCURRENCY = 10

describe('Coverage Tests', () => {
  let driver, destroyDriver, eyes
  let timing = []

  const runner = new VisualGridRunner(CONCURRENCY)

  after(async () => {
    const total = timing.reduce((total, time) => total + time, 0)
    console.log(`Total: ${total / 1000} sec`)
  })

  beforeEach(async () => {
    ;[driver, destroyDriver] = await spec.build({browser: 'chrome'})
    eyes = testSetup.getEyes({
      runner,
      configuration: {
        concurrentSessions: 10,
        browsersInfo: [
          {width: 800, height: 600, name: 'chrome'},
          {width: 800, height: 600, name: 'firefox'},
          {width: 1000, height: 1000, name: 'chrome'},
          {width: 1000, height: 1000, name: 'firefox'},
          {width: 1200, height: 960, name: 'chrome'},
          {width: 1200, height: 960, name: 'firefox'},
          {width: 1400, height: 960, name: 'chrome'},
          {width: 1400, height: 960, name: 'firefox'},
          {width: 1400, height: 960, name: 'ie'},
          {width: 1400, height: 960, name: 'edgelegacy'},
          {width: 1600, height: 1000, name: 'chrome'},
          {width: 1600, height: 1000, name: 'firefox'},
          {width: 1600, height: 1000, name: 'ie'},
          {width: 1600, height: 1000, name: 'edgelegacy'},
          {deviceName: 'Galaxy A5'},
        ],
      },
    })
  })

  afterEach(async () => {
    await destroyDriver(driver)
  })

  URLS.forEach((url, index) => {
    it(`Measurements ${index + 1}`, async () => {
      let start
      try {
        await spec.visit(driver, url)
        start = Date.now()
        await eyes.open(driver, `Measurements ${index + 1}`, `Measurements ${index + 1}`)
        for (const _ in Array(STEPS).fill(0)) {
          await eyes.check({isFully: true})
        }
        await eyes.close()
      } finally {
        timing.push(Date.now() - start)
      }
    })
  })
})
