const assert = require('assert')
const assertRejects = require('assert-rejects')
const Axios = require('axios')
const {Logger} = require('../../index')
const MockDriver = require('../utils/MockDriver')
const {Driver} = require('../utils/FakeSDK')
const takeDomCapture = require('../../lib/utils/takeDomCapture')

describe('takeDomCapture', () => {
  let logger = new Logger(false)
  let mock, driver

  function createDomCapture(domCapture) {
    const tokens = {
      separator: '-----',
      cssStartToken: '#####',
      cssEndToken: '#####',
      iframeStartToken: '@@@@@',
      iframeEndToken: '@@@@@',
    }

    const result = [
      JSON.stringify(tokens),
      extract(tokens.cssStartToken, tokens.cssEndToken).join('\n'),
      tokens.separator,
      extract(tokens.iframeStartToken, tokens.iframeEndToken).join('\n'),
      tokens.separator,
      domCapture,
    ]

    return result.join('\n')

    function extract(start, end) {
      const regexp = new RegExp(`${start}(.*?)${end}`, 'g')
      const matches = []
      let match
      while ((match = regexp.exec(domCapture))) {
        matches.push(match[1])
      }
      return matches
    }
  }

  beforeEach(async () => {
    mock = new MockDriver()
    mock.mockElements([
      {
        selector: 'frame1',
        frame: true,
        isCORS: true,
        children: [{selector: 'frame1-1', frame: true, isCORS: true}],
      },
      {
        selector: 'frame2',
        frame: true,
        children: [{selector: 'frame2-2', frame: true, isCORS: true}],
      },
    ])
    driver = new Driver(logger, mock)
    await driver.init()
  })

  it('works', async () => {
    mock.mockScript('dom-capture', () => {
      return JSON.stringify({status: 'SUCCESS', value: createDomCapture('dom capture')})
    })

    const result = await takeDomCapture(logger, driver)

    assert.strictEqual(result, 'dom capture')
  })

  it('works with polling', async () => {
    mock.mockScript('dom-capture', function() {
      this.poll = this.poll || 0
      if (this.poll === 0) {
        this.domCapture = createDomCapture('dom capture')
      }
      const result =
        this.poll <= 3
          ? JSON.stringify({status: 'WIP'})
          : JSON.stringify({status: 'SUCCESS', value: this.domCapture})
      this.poll += 1
      return result
    })

    const result = await takeDomCapture(logger, driver)

    assert.strictEqual(result, 'dom capture')
  })

  it('handle frames', async () => {
    mock.mockScript('dom-capture', function() {
      let value
      if (this.name === null) {
        value = createDomCapture(
          'main frame dom capture [@@@@@frame1@@@@@] [@@@@@frame2,frame2-2@@@@@]',
        )
      } else if (this.name === 'frame1') {
        value = createDomCapture('frame1 dom capture [@@@@@frame1-1@@@@@]')
      } else if (this.name === 'frame1-1') {
        value = createDomCapture('frame1-1 dom capture')
      } else if (this.name === 'frame2-2') {
        value = createDomCapture('frame2-2 dom capture')
      }
      return JSON.stringify({status: 'SUCCESS', value})
    })

    const result = await takeDomCapture(logger, driver)

    assert.strictEqual(
      result,
      'main frame dom capture [frame1 dom capture [frame1-1 dom capture]] [frame2-2 dom capture]',
    )
  })

  it('handle css', async () => {
    mock.mockScript('dom-capture', () => {
      return JSON.stringify({
        status: 'SUCCESS',
        value: createDomCapture('dom capture (#####http://css.com/main.css#####)'),
      })
    })

    const result = await takeDomCapture(logger, driver, {
      axios: Axios.create({
        adapter: async () => ({data: 'very big css file', status: 200}),
      }),
    })

    assert.strictEqual(result, 'dom capture (very big css file)')
  })

  it('handles error response', async () => {
    mock.mockScript('dom-capture', () => {
      return JSON.stringify({status: 'ERROR', error: 'Oops! Something went wrong!'})
    })

    assertRejects(
      takeDomCapture(logger, driver),
      `Error during capture dom and pull script: 'Oops! Something went wrong!'`,
    )
  })

  it('stops execution if timeout is reached', async () => {
    mock.mockScript('dom-capture', () => {
      return JSON.stringify({status: 'WIP'})
    })

    assertRejects(takeDomCapture(logger, driver, {executionTimeout: 1000}), 'dom-capture Timed out')
  })
})
