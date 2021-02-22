'use strict'

const fs = require('fs')
const assert = require('assert')
const {Eyes, ConsoleLogHandler, GeneralUtils} = require('../../index')

let /** @type {Eyes} */ eyes
describe('EyesImages.OCR', function() {
  before(function() {
    eyes = new Eyes()
    // eyes.setLogHandler(new ConsoleLogHandler(true))
    // eyes.setProxy('http://localhost:8888');
  })

  beforeEach(async function() {
    const testName = `${this.test.title}_${GeneralUtils.randomAlphanumeric()}`
    await eyes.open(this.test.parent.title, testName)
  })

  afterEach(async function() {
    await eyes.close(false)
  })

  it('ShouldExtractText', async function() {
    const image1 = `${__dirname}/../fixtures/image1.png`
    const image2 = fs.readFileSync(`${__dirname}/../fixtures/image2.png`)
    const image3 = `${__dirname}/../fixtures/jssdks.png`

    const texts = await eyes.extractText([
      {image: image1, target: {left: 138, top: 0, width: 100, height: 40}},
      {image: image2, target: {left: 366, top: 0, width: 100, height: 40}, hint: 'features'},
      {
        image: image2.toString('base64'),
        target: {left: 455, top: 0, width: 100, height: 40},
        hint: '\\l+',
      },
      {image: image3},
    ])

    assert.deepStrictEqual(texts, ['applitools', 'FEATURES', 'PRICING', 'JS SDKS'])
  })

  it('ShouldExtractTextRegions', async function() {
    const image1 = `${__dirname}/../fixtures/image1.png`

    const regions = await eyes.extractTextRegions({
      image: image1,
      patterns: ['applitools', 'customers'],
      ignoreCase: true,
    })

    assert.deepStrictEqual(regions, {
      applitools: [
        {x: 428, y: 574, width: 142, height: 12, text: "'Applitools transformed on"},
        {x: 637, y: 574, width: 176, height: 11, text: "'Applitools took us trom 30 hours"},
        {x: 188, y: 606, width: 168, height: 12, text: "they've been singing Applitools'"},
      ],
      customers: [{x: 560, y: 21, width: 63, height: 8, text: 'CUSTOMERS'}],
    })
  })
})
