const assert = require('assert')
const {makeEmitTracker, makeEmitTests} = require('../../src/code-export/emit')

const createTestFileString = require('../../js/mocha-template')

const fakeSdkImplementation = () => {
  let result = makeEmitTracker()
  return {
    hooks: {
      vars: () => {
        result.storeHook('vars', 'let x')
      },
      deps: () => {
        result.storeHook('deps', `const {blah} = require('blah')`)
      },
      beforeEach: () => {
        result.storeHook('beforeEach', 'setup')
      },
      afterEach: () => {
        result.storeHook('afterEach', 'cleanup')
      },
    },
    open: () => {
      result.storeCommand('open')
    },
    checkElement: () => {
      result.storeCommand('checkElement')
    },
    checkWindow: () => {
      result.storeCommand('checkWindow')
    },
    close: () => {
      result.storeCommand('close')
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
  // TODO
  it.skip('skips a test marked as disabled', () => {
    const {emitTests} = makeEmitTests(fakeSdkImplementation, fakeCoverageTests)
    const supportedTests = [{name: 'test-a', executionMode: {isVisualGrid: true}, disabled: true}]
    assert.deepStrictEqual(emitTests(supportedTests), [
      {
        name: 'test-a_VG',
        hooks: {
          vars: [`let x`],
          deps: [`const {blah} = require('blah')`],
          beforeEach: ['setup'],
          afterEach: ['cleanup'],
        },
        commands: ['open', 'checkWindow', 'close'],
        disabled: true,
      },
    ])
  })
  // TODO
  it.skip('returns tests broken out by their stringified parts', () => {
    const {emitTests} = makeEmitTests(fakeSdkImplementation, fakeCoverageTests)
    const supportedTests = [{name: 'test-a', executionMode: {isVisualGrid: true}}]
    assert.deepStrictEqual(emitTests(supportedTests), [
      {
        name: 'test-a_VG',
        hooks: {
          vars: [`let x`],
          deps: [`const {blah} = require('blah')`],
          beforeEach: ['setup'],
          afterEach: ['cleanup'],
        },
        commands: ['open', 'checkWindow', 'close'],
        disabled: undefined,
      },
    ])
  })
  it('returns a final string to be written to a test file', () => {
    const emittedTest = {
      name: 'test-a_VG',
      hooks: {
        vars: [`let x`],
        deps: [`const {blah} = require('blah')`],
        beforeEach: ['setup'],
        afterEach: ['cleanup'],
      },
      commands: ['open', 'checkWindow', 'close'],
    }
    const expectedTest = `const {blah} = require('blah')

describe('Coverage Tests', () => {
  let x
  beforeEach(async () => {
    setup
  })
  afterEach(async () => {
    cleanup
  })
  it('test-a_VG', async () => {
    open
    checkWindow
    close
  })
})`
    assert.deepStrictEqual(createTestFileString(emittedTest), expectedTest)
  })
  it('returns a skipped test suite for a disabled test', () => {
    const emittedTest = {
      name: 'test-a_VG',
      hooks: {
        vars: [`let x`],
        deps: [`const {blah} = require('blah')`],
        beforeEach: ['setup'],
        afterEach: ['cleanup'],
      },
      commands: ['open', 'checkWindow', 'close'],
      disabled: true,
    }
    const expectedTest = `const {blah} = require('blah')

describe.skip('Coverage Tests', () => {
  let x
  beforeEach(async () => {
    setup
  })
  afterEach(async () => {
    cleanup
  })
  it('test-a_VG', async () => {
    open
    checkWindow
    close
  })
})`
    assert.deepStrictEqual(createTestFileString(emittedTest), expectedTest)
  })
})
