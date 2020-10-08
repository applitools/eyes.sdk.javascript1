'use strict'

const {
  Eyes,
  BatchInfo,
  ConsoleLogHandler,
  Target,
  MatchLevel,
  RectangleSize,
} = require('../../index')

describe('TestEyesImages', function() {
  let batch

  before(() => {
    batch = new BatchInfo('TestEyesImages')
  })

  function setup(testTitle) {
    const eyes = new Eyes()
    eyes.setBatch(batch)
    eyes.setLogHandler(new ConsoleLogHandler())

    eyes.getLogger().log(`running test: ${testTitle}`)
    return eyes
  }

  async function teardown(eyes) {
    try {
      const results = await eyes.close()
      eyes.getLogger().log(`Mismatches: ${results.getMismatches()}`)
    } finally {
      await eyes.abort()
    }
  }

  it('TestLayout2', async function() {
    const eyes = setup(this.test.title)
    eyes.setMatchLevel(MatchLevel.Layout2)

    await eyes.open('TestEyesImages', this.test.title, new RectangleSize(1024, 768))
    await eyes.check(this.test.title, Target.image(`${__dirname}/../fixtures/yahoo1a.png`))
    await teardown(eyes)
  })
})
