const assert = require('assert')
const {makeEmitTests} = require('../../../src/coverage-tests/code-export')

const fakeSdkImplementation = () => {
  let result = {}
  return {
    _setup: () => {
      result.setup = 'setup'
    },
    _cleanup: () => {
      result.cleanup = 'cleanup'
    },
    open: () => {
      result.open = 'open'
    },
    checkElement: () => {
      result.checkElement = 'checkElement'
    },
    checkWindow: () => {
      result.checkWindow = 'checkWindow'
    },
    close: () => {
      result.close = 'close'
    },
    out: result,
  }
}
const fakeCoverageTests = ({open, checkElement, checkWindow, close}) => {
  return {
    'test-a': () => {
      open()
      checkWindow()
      close()
    },
    'test-b': () => {
      open()
      checkElement()
      close()
    },
  }
}

describe('Code Export', () => {
  it('returns strings to be written to file', () => {
    const {emitTests} = makeEmitTests(fakeSdkImplementation, fakeCoverageTests)
    const supportedTests = [{name: 'test-a', executionMode: {isVisualGrid: true}}]
    assert.deepStrictEqual(emitTests(supportedTests), {
      'test-a_VG': {
        setup: 'setup',
        cleanup: 'cleanup',
        open: 'open',
        checkWindow: 'checkWindow',
        close: 'close',
      },
    })
  })
})
