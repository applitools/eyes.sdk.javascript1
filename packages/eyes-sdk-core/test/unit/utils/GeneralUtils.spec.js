'use strict'

const assert = require('assert')

const {GeneralUtils} = require('../../../index')

describe('GeneralUtils', () => {
  describe('urlConcat()', () => {
    it('should return / when the values are empty', () => {
      assert.strictEqual(GeneralUtils.urlConcat('', ''), '/')
    })
    it('should return the correct Url when both parts don\'t start/end with a "/"', () => {
      const left = 'http://www.applitools.com'
      const right = 'subdomain/index.html'
      assert.strictEqual(GeneralUtils.urlConcat(left, right), `${left}/${right}`)
    })
    it('should return the correct Url when only left part ends with a "/"', () => {
      const left = 'http://www.applitools.com/'
      const right = 'subdomain/index.html'
      assert.strictEqual(GeneralUtils.urlConcat(left, right), left + right)
    })
    it('should return the correct Url when only right part starts with a "/"', () => {
      const left = 'http://www.applitools.com'
      const right = '/subdomain/index.html'
      assert.strictEqual(GeneralUtils.urlConcat(left, right), left + right)
    })
    it('should return the correct Url when both parts start/end with a "/"', () => {
      const left = 'http://www.applitools.com'
      const right = '/subdomain/index.html'
      assert.strictEqual(GeneralUtils.urlConcat(`${left}/`, right), left + right)
    })
    it('should return the correct Url when given multiple suffixes', () => {
      assert.strictEqual(
        GeneralUtils.urlConcat('http://www.applitools.com/', '/subdomain/', '/index.html'),
        'http://www.applitools.com/subdomain/index.html',
      )
    })
    it('should return the correct Url when given multiple suffixes and query params', () => {
      assert.strictEqual(
        GeneralUtils.urlConcat('http://www.applitools.com/', '/subdomain/', '?param=1'),
        'http://www.applitools.com/subdomain?param=1',
      )
    })
    it('concatenate suffixes without slashes', () => {
      assert.strictEqual(
        GeneralUtils.urlConcat('http://www.applitools.com/', 'api', '/sessions/', 1233, 'create'),
        'http://www.applitools.com/api/sessions/1233/create',
      )
    })
  })

  describe('isAbsoluteUrl()', () => {
    it('should detect this urls as absolute', () => {
      assert.ok(GeneralUtils.isAbsoluteUrl('http://applitools.com'))
      assert.ok(GeneralUtils.isAbsoluteUrl('https://applitools.com'))
      assert.ok(GeneralUtils.isAbsoluteUrl('file://applitools.com'))
      assert.ok(GeneralUtils.isAbsoluteUrl('mailto:someone@applitools.com'))
      assert.ok(GeneralUtils.isAbsoluteUrl('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D'))
    })

    it('should detect this urls as relative', () => {
      assert.ok(!GeneralUtils.isAbsoluteUrl('//applitools.com'))
      assert.ok(!GeneralUtils.isAbsoluteUrl('/foo/bar'))
      assert.ok(!GeneralUtils.isAbsoluteUrl('foo/bar'))
      assert.ok(!GeneralUtils.isAbsoluteUrl('foo'))
    })
  })

  describe('jwtDecode()', () => {
    it('decoded should be equal with original', () => {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ'
      const decoded = GeneralUtils.jwtDecode(token)

      assert.strictEqual(decoded.admin, true)
      assert.strictEqual(decoded.name, 'John Doe')
      assert.strictEqual(decoded.sub, '1234567890')
    })
  })

  describe('randomAlphanumeric()', () => {
    it('should return a string of default size', () => {
      const randId = GeneralUtils.randomAlphanumeric()

      assert.strictEqual(randId.length, 8)
      assert.ok(randId.match('^[A-z0-9]+$'))
    })

    it('should return a string of size 4', () => {
      const randId = GeneralUtils.randomAlphanumeric(4)

      assert.strictEqual(randId.length, 4)
      assert.ok(randId.match('^[A-z0-9]+$'))
    })

    it('should return a string of size 40', () => {
      const randId = GeneralUtils.randomAlphanumeric(40)

      assert.strictEqual(randId.length, 40)
      assert.ok(randId.match('^[A-z0-9]+$'))
    })
  })

  describe('stringify()', () => {
    it('should return the same args for non-objects', () => {
      assert.strictEqual(GeneralUtils.stringify('hello world'), 'hello world')
      assert.strictEqual(GeneralUtils.stringify(123), '123')
      assert.strictEqual(GeneralUtils.stringify(true), 'true')
      assert.strictEqual(GeneralUtils.stringify(null), 'null')
      assert.strictEqual(GeneralUtils.stringify(undefined), 'undefined')
    })

    it('should call JSON.stringify for plain objects', () => {
      assert.strictEqual(GeneralUtils.stringify({prop: 'value'}), JSON.stringify({prop: 'value'}))
      assert.strictEqual(GeneralUtils.stringify({prop: 'value'}), '{"prop":"value"}')
    })

    it('should return the stack for errors', () => {
      const pattern = RegExp(/^Error: bla(\n\s+at [^\n]+)+$/)
      assert.ok(pattern.test(GeneralUtils.stringify(new Error('bla'))))
    })

    it('should return stringified function', () => {
      // eslint-disable-next-line
      assert.strictEqual(GeneralUtils.stringify(() => { return 'bla'; }), '() => { return \'bla\'; }');
    })

    it('should return ISO string for dates', () => {
      assert.strictEqual(
        GeneralUtils.stringify(new Date(1575117044000)),
        '2019-11-30T12:30:44.000Z',
      )
    })

    it('should concat multiple arguments', () => {
      assert.strictEqual(GeneralUtils.stringify(4, 'str', {prop: 'bla'}), '4 str {"prop":"bla"}')
    })

    it('should stringify array of objects', () => {
      assert.strictEqual(
        GeneralUtils.stringify([{prop: 'bla'}, {prop: 'blo'}]),
        '[{"prop":"bla"},{"prop":"blo"}]',
      )
    })

    it('should convert class to object', () => {
      class Foo {
        constructor() {
          this._bar = 'test'
          this._par = 'world'
        }
      }

      assert.strictEqual(GeneralUtils.stringify(new Foo()), '{"bar":"test","par":"world"}')
    })

    it('should convert class to object using toJSON', () => {
      class Foo {
        constructor() {
          this._bar = 'test'
          this._par = 'world'
        }

        toJSON() {
          return {par: this._par}
        }
      }

      assert.strictEqual(GeneralUtils.stringify({foo: new Foo()}), '{"foo":{"par":"world"}}')
    })

    it('should use toString method if available', () => {
      class Foo {
        constructor() {
          this._bar = 'test'
        }

        toString() {
          return `Foo {bar: ${this._bar}}`
        }
      }

      assert.strictEqual(GeneralUtils.stringify(new Foo()), 'Foo {bar: test}')
    })
  })

  describe('cartesianProduct()', () => {
    it('should return product of collections', () => {
      const dataProvider = GeneralUtils.cartesianProduct(
        'Google Pixel GoogleAPI Emulator',
        ['portrait', 'landscape'],
        '7.1',
        [false, true],
      )

      assert.deepStrictEqual(dataProvider, [
        ['Google Pixel GoogleAPI Emulator', 'portrait', '7.1', false],
        ['Google Pixel GoogleAPI Emulator', 'portrait', '7.1', true],
        ['Google Pixel GoogleAPI Emulator', 'landscape', '7.1', false],
        ['Google Pixel GoogleAPI Emulator', 'landscape', '7.1', true],
      ])
    })
  })

  describe('getPropertyByPath', () => {
    it('works', async () => {
      const obj = {one: {two: {three: 'ok'}}, another: false}
      const result = GeneralUtils.getPropertyByPath(obj, 'one.two.three')
      assert.strictEqual(result, 'ok')
    })

    it('works with 1 level', async () => {
      const obj = {one: {two: {three: 'ok'}}, another: false}
      const result = GeneralUtils.getPropertyByPath(obj, 'one')
      assert.strictEqual(result, obj.one)
    })

    it('works with booleans', async () => {
      let obj = {one: {two: {three: false}}, another: false}
      let result = GeneralUtils.getPropertyByPath(obj, 'one.two.three')
      assert.strictEqual(result, false)

      obj = {one: {two: {three: true}}, another: false}
      result = GeneralUtils.getPropertyByPath(obj, 'one.two.three')
      assert.strictEqual(result, true)
    })

    it('works with numbers', async () => {
      let obj = {one: {two: {three: 1}}, another: false}
      let result = GeneralUtils.getPropertyByPath(obj, 'one.two.three')
      assert.strictEqual(result, 1)

      obj = {one: {two: {three: 0}}, another: false}
      result = GeneralUtils.getPropertyByPath(obj, 'one.two.three')
      assert.strictEqual(result, 0)
    })

    it('returns undefined for wrong path', async () => {
      let obj = {one: {two: {three: false}}, another: false}
      let result = GeneralUtils.getPropertyByPath(obj, 'one.two.four')
      assert.strictEqual(result, undefined)

      obj = {one: {two: {three: true}}, another: false}
      result = GeneralUtils.getPropertyByPath(obj, 'one.three')
      assert.strictEqual(result, undefined)
    })

    it('returns undefined for bad path', async () => {
      let obj = {one: {two: {three: false}}, another: false}
      let result = GeneralUtils.getPropertyByPath(obj, 'one.two..three')
      assert.strictEqual(result, undefined)

      obj = {one: {two: {three: true}}, another: false}
      result = GeneralUtils.getPropertyByPath(obj, 'one.three.')
      assert.strictEqual(result, undefined)
    })

    it('returns undefined for bad obj', async () => {
      let result = GeneralUtils.getPropertyByPath(null, 'one.two..three')
      assert.strictEqual(result, undefined)

      result = GeneralUtils.getPropertyByPath(undefined, 'one.three.')
      assert.strictEqual(result, undefined)

      result = GeneralUtils.getPropertyByPath(3, 'one.three.')
      assert.strictEqual(result, undefined)
    })
  })

  describe('backwardCompatible', () => {
    it('works', async () => {
      let newParam = 'using new dont change'
      let oldParam
      let newParam2
      const oldParam2 = 'using old'

      const log = []
      const logger = {log: msg => log.push(msg)}

      ;({newParam, newParam2} = GeneralUtils.backwardCompatible(
        [{oldParam}, {newParam}],
        [{oldParam2}, {newParam2}],
        logger,
      ))

      assert.strictEqual(newParam, 'using new dont change')
      assert.strictEqual(newParam2, 'using old')
      assert.strictEqual(
        log[0],
        'warning - "oldParam2" is deprecated and will be removed, please use "newParam2" instead.',
      )
    })
  })

  describe('cleanStringForJSON()', () => {
    it('should return the same string', () => {
      const str = 'hello world'
      assert.strictEqual(GeneralUtils.cleanStringForJSON(str), str)
    })

    it('should escape some characters', () => {
      const str = 'hello\tworld$"#'
      assert.strictEqual(GeneralUtils.cleanStringForJSON(str), 'hello\\tworld$\\"#')
    })

    it('should convert to hex some characters', () => {
      const str = 'hello world �'
      assert.strictEqual(GeneralUtils.cleanStringForJSON(str), 'hello world �')
    })
  })

  describe('cachify()', () => {
    it('works', () => {
      let calledCount = 0
      const func = () => (++calledCount, 'rv-func')
      const cachedFunc = GeneralUtils.cachify(func)

      assert.strictEqual(cachedFunc(), 'rv-func')
      assert.strictEqual(cachedFunc(), 'rv-func')
      assert.strictEqual(calledCount, 1)
    })

    it('works by arg1 cache key', () => {
      let calledCount = {key1: 0, key2: 0}
      const func = (key, arg2) => (++calledCount[key], `key: ${key}, arg2 ${arg2}`)
      const cachedFunc = GeneralUtils.cachify(func)

      assert.strictEqual(cachedFunc('key1', 1), `key: key1, arg2 1`)
      assert.strictEqual(cachedFunc('key2', 1), `key: key2, arg2 1`)
      assert.strictEqual(cachedFunc('key1'), `key: key1, arg2 1`)
      assert.strictEqual(cachedFunc('key2'), `key: key2, arg2 1`)
      assert.strictEqual(calledCount['key1'], 1)
      assert.strictEqual(calledCount['key2'], 1)
    })

    it('works by ignoring arg1 cache key', () => {
      let calledCount = {key1: 0, key2: 0}
      const func = (key, arg2) => (++calledCount[key], `key: ${key}, arg2 ${arg2}`)
      const cachedFunc = GeneralUtils.cachify(func, true)

      assert.strictEqual(cachedFunc('key1', 1), `key: key1, arg2 1`)
      assert.strictEqual(cachedFunc('key2'), `key: key1, arg2 1`)
      assert.strictEqual(cachedFunc('key1'), `key: key1, arg2 1`)
      assert.strictEqual(cachedFunc('key2'), `key: key1, arg2 1`)
      assert.strictEqual(calledCount['key1'], 1)
    })
  })

  describe('isFeatureFlagOn()', () => {
    it('works', () => {
      process.env.APPLITOOLS_MY_FLAG = 'true'
      assert.strictEqual(GeneralUtils.isFeatureFlagOn('MY_FLAG'), true)

      process.env.APPLITOOLS_MY_FLAG = '1'
      assert.strictEqual(GeneralUtils.isFeatureFlagOn('MY_FLAG'), true)

      process.env.APPLITOOLS_MY_FLAG = 'false'
      assert.strictEqual(GeneralUtils.isFeatureFlagOn('MY_FLAG'), false)

      process.env.APPLITOOLS_MY_FLAG = '0'
      assert.strictEqual(GeneralUtils.isFeatureFlagOn('MY_FLAG'), false)

      process.env.APPLITOOLS_MY_FLAG = undefined
      assert.strictEqual(GeneralUtils.isFeatureFlagOn('MY_FLAG'), false)

      process.env.APPLITOOLS_MY_FLAG = 'just some value'
      assert.strictEqual(GeneralUtils.isFeatureFlagOn('MY_FLAG'), true)
      process.env.APPLITOOLS_MY_FLAG = undefined
    })
  })

  describe('isFeatureFlagOff()', () => {
    it('works', () => {
      process.env.APPLITOOLS_MY_FLAG = 'true'
      assert.strictEqual(GeneralUtils.isFeatureFlagOff('MY_FLAG'), false)

      process.env.APPLITOOLS_MY_FLAG = '1'
      assert.strictEqual(GeneralUtils.isFeatureFlagOff('MY_FLAG'), false)

      process.env.APPLITOOLS_MY_FLAG = 'false'
      assert.strictEqual(GeneralUtils.isFeatureFlagOff('MY_FLAG'), true)

      process.env.APPLITOOLS_MY_FLAG = '0'
      assert.strictEqual(GeneralUtils.isFeatureFlagOff('MY_FLAG'), true)

      process.env.APPLITOOLS_MY_FLAG = undefined
      assert.strictEqual(GeneralUtils.isFeatureFlagOff('MY_FLAG'), true)

      process.env.APPLITOOLS_MY_FLAG = 'just some value'
      assert.strictEqual(GeneralUtils.isFeatureFlagOff('MY_FLAG'), false)
      process.env.APPLITOOLS_MY_FLAG = undefined
    })
  })

  describe('getBreakpointWidth()', () => {
    it('works', () => {
      assert.strictEqual(GeneralUtils.getBreakpointWidth([100], 50), 99)
      assert.strictEqual(GeneralUtils.getBreakpointWidth([100], 150), 100)
      assert.strictEqual(GeneralUtils.getBreakpointWidth([300, 100], 150), 100)
      assert.strictEqual(GeneralUtils.getBreakpointWidth([300, 100], 500), 300)
      assert.strictEqual(GeneralUtils.getBreakpointWidth([], 33), 33)
      assert.strictEqual(GeneralUtils.getBreakpointWidth(null, 33), 33)
      assert.strictEqual(GeneralUtils.getBreakpointWidth(undefined, 33), 33)
    })
  })
})
