const assert = require('assert')
const {makeEmitTests} = require('../../../src/coverage-tests/code-export/emit')
const {createTestFileString} = require('../../../src/coverage-tests/code-export/render')

const fakeSdkImplementation = () => {
  let result = {
    hooks: {
      deps: [],
      beforeEach: [],
      afterEach: [],
    },
    commands: [],
  }
  return {
    hooks: {
      deps: () => {
        result.hooks.deps.push(`const {blah} = require('blah')`)
      },
      beforeEach: () => {
        result.hooks.beforeEach.push('setup')
      },
      afterEach: () => {
        result.hooks.afterEach.push('cleanup')
      },
    },
    open: () => {
      result.commands.push('open')
    },
    checkElement: () => {
      result.commands.push('checkElement')
    },
    checkWindow: () => {
      result.commands.push('checkWindow')
    },
    close: () => {
      result.commands.push('close')
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
  it('returns tests broken out by their stringified parts', () => {
    const {emitTests} = makeEmitTests(fakeSdkImplementation, fakeCoverageTests)
    const supportedTests = [{name: 'test-a', executionMode: {isVisualGrid: true}}]
    assert.deepStrictEqual(emitTests(supportedTests), [
      {
        name: 'test-a_VG',
        hooks: {
          deps: [`const {blah} = require('blah')`],
          beforeEach: ['setup'],
          afterEach: ['cleanup'],
        },
        commands: ['open', 'checkWindow', 'close'],
      },
    ])
  })
  it('returns a final string to be written to a test file', () => {
    const emittedTest = {
      name: 'test-a_VG',
      hooks: {
        deps: [`const {blah} = require('blah')`],
        beforeEach: ['setup'],
        afterEach: ['cleanup'],
      },
      commands: ['open', 'checkWindow', 'close'],
    }
    const expectedTest = `// Generated by sdk-test-kit
const {blah} = require('blah')

describe('Coverage Tests', () => {
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
