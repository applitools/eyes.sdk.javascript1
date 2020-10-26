const assert = require('assert')
const {useEmitter, withHistory} = require('../src/emitter')

describe('emitter', () => {
  it('withHistory works', () => {
    const [history, emitters] = withHistory({
      methodA: () => 1,
      methodB: () => 'z',
    })

    emitters.methodA(1, 'a', [1, 2, 3])
    emitters.methodB({a: true})
    emitters.methodA()

    assert.deepStrictEqual(history, [
      {name: 'methodA', args: [1, 'a', [1, 2, 3]], result: 1},
      {name: 'methodB', args: [{a: true}], result: 'z'},
      {name: 'methodA', args: [], result: 1},
    ])
  })

  describe('useEmitter', () => {
    it('addCommand works', () => {
      const [{commands}, {addCommand}] = useEmitter()

      addCommand('aaa')
      addCommand('bbb')
      addCommand('zzz')

      assert.deepStrictEqual(commands, ['aaa', 'bbb', 'zzz'])
    })

    it('addCommand works', () => {
      const [{hooks}, {addHook}] = useEmitter()

      addHook('beforeEach', 'aaa')
      addHook('afterEach', 'bbb')
      addHook('beforeEach', 'zzz')

      assert.deepStrictEqual(hooks, {
        deps: [],
        vars: [],
        beforeEach: ['aaa', 'zzz'],
        afterEach: ['bbb'],
      })
    })
  })
})
