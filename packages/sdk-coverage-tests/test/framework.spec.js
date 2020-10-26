const assert = require('assert')
const {Console} = require('console')
const {Writable} = require('stream')
const chalk = require('chalk')
const {useFramework} = require('../src/framework')

describe('framework', () => {
  it('works', () => {
    const {context, api} = useFramework()

    assert.deepStrictEqual(Object.keys(context.tests), [])

    api.test('1', {})
    api.test('2', {})

    assert.deepStrictEqual(Object.keys(context.tests), ['1', '2'])

    assert.strictEqual(context.testsConfig, null)

    api.config({pages: {}})

    assert.deepStrictEqual(context.testsConfig, {pages: {}})
  })

  it('warn if something is overridden', () => {
    const output = []
    const stdout = new Writable({
      write(chunk, _encoding, callback) {
        output.push(chunk.toString())
        callback(null)
      },
    })
    const originalConsole = global.console
    global.console = new Console({stdout})

    const {context, api} = useFramework()
    api.test('test a', {})
    api.test('test a', {})

    assert.deepStrictEqual(Object.keys(context.tests), ['test a'])
    assert.strictEqual(
      output[0].replace(/\b\d+\b/g, '%line%').replace('\n', ''),
      chalk.yellow(
        `WARNING: test with name "test a" on line %line% overrides the test with same name on line %line%`,
      ),
    )

    api.config({z: 0})
    api.config({a: 0})

    assert.deepStrictEqual(context.testsConfig, {a: 0})

    assert.strictEqual(
      output[1].replace('\n', ''),
      chalk.yellow(`WARNING: tests configuration object was reset`),
    )

    global.console = originalConsole
  })
})
