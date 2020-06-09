'use strict'

const assert = require('assert')

const {TypeUtils} = require('../../../index')

describe('TypeUtils', () => {
  describe('isNull()', () => {
    it('check null', () => {
      assert.ok(TypeUtils.isNull(null))
    })

    it('check undefined', () => {
      assert.ok(TypeUtils.isNull(undefined))
    })

    it('check number', () => {
      assert.ok(!TypeUtils.isNull(0))
    })

    it('check NaN', () => {
      assert.ok(!TypeUtils.isNull(NaN))
    })

    it('check string', () => {
      assert.ok(!TypeUtils.isNull(''))
    })

    it('check boolean', () => {
      assert.ok(!TypeUtils.isNull(false))
    })
  })

  describe('isNotNull()', () => {
    it('check null', () => {
      assert.ok(!TypeUtils.isNotNull(null))
    })

    it('check undefined', () => {
      assert.ok(!TypeUtils.isNotNull(undefined))
    })

    it('check number', () => {
      assert.ok(TypeUtils.isNotNull(0))
    })

    it('check NaN', () => {
      assert.ok(TypeUtils.isNotNull(NaN))
    })

    it('check string', () => {
      assert.ok(TypeUtils.isNotNull(''))
    })

    it('check boolean', () => {
      assert.ok(TypeUtils.isNotNull(false))
    })
  })

  describe('isString()', () => {
    it('check string object', () => {
      assert.ok(TypeUtils.isString(new String('I am a string object'))) // eslint-disable-line no-new-wrappers
    })

    it('check string literal', () => {
      assert.ok(TypeUtils.isString('I am a string literal'))
    })

    it('check number', () => {
      assert.ok(!TypeUtils.isString(1))
    })

    it('check object', () => {
      assert.ok(!TypeUtils.isString({hello: 'world'}))
    })

    it('check boolean', () => {
      assert.ok(!TypeUtils.isString(false))
    })

    it('check date', () => {
      assert.ok(!TypeUtils.isString(new Date()))
    })

    it('check array', () => {
      assert.ok(!TypeUtils.isString([1, 2, 3]))
    })

    it('check class', () => {
      class FooBar {}
      assert.ok(!TypeUtils.isString(new FooBar()))
    })
  })

  describe('isNumber()', () => {
    it('check string object', () => {
      assert.ok(!TypeUtils.isNumber(new String('I am a string object'))) // eslint-disable-line no-new-wrappers
    })

    it('check string literal', () => {
      assert.ok(!TypeUtils.isNumber('I am a string literal'))
    })

    it('check number', () => {
      assert.ok(TypeUtils.isNumber(1))
    })

    it('check number (double)', () => {
      assert.ok(TypeUtils.isNumber(1.25))
    })

    it('check object', () => {
      assert.ok(!TypeUtils.isNumber({hello: 'world'}))
    })

    it('check boolean', () => {
      assert.ok(!TypeUtils.isNumber(false))
    })

    it('check date', () => {
      assert.ok(!TypeUtils.isNumber(new Date()))
    })

    it('check array', () => {
      assert.ok(!TypeUtils.isNumber([1, 2, 3]))
    })

    it('check class', () => {
      class FooBar {}
      assert.ok(!TypeUtils.isNumber(new FooBar()))
    })
  })

  describe('isInteger()', () => {
    it('check number', () => {
      assert.ok(TypeUtils.isInteger(1))
    })

    it('check number (double)', () => {
      assert.ok(!TypeUtils.isInteger(1.25))
    })
  })

  describe('isBoolean()', () => {
    it('check string object', () => {
      assert.ok(!TypeUtils.isBoolean(new String('I am a string object'))) // eslint-disable-line no-new-wrappers
    })

    it('check string literal', () => {
      assert.ok(!TypeUtils.isBoolean('I am a string literal'))
    })

    it('check number', () => {
      assert.ok(!TypeUtils.isBoolean(1))
    })

    it('check object', () => {
      assert.ok(!TypeUtils.isBoolean({hello: 'world'}))
    })

    it('check boolean', () => {
      assert.ok(TypeUtils.isBoolean(false))
    })

    it('check boolean (positive)', () => {
      assert.ok(TypeUtils.isBoolean(true))
    })

    it('check date', () => {
      assert.ok(!TypeUtils.isBoolean(new Date()))
    })

    it('check array', () => {
      assert.ok(!TypeUtils.isBoolean([1, 2, 3]))
    })

    it('check class', () => {
      class FooBar {}
      assert.ok(!TypeUtils.isBoolean(new FooBar()))
    })
  })

  describe('isObject()', () => {
    it('check string object', () => {
      assert.ok(TypeUtils.isObject(new String('I am a string object'))) // eslint-disable-line no-new-wrappers
    })

    it('check string literal', () => {
      assert.ok(!TypeUtils.isObject('I am a string literal'))
    })

    it('check number', () => {
      assert.ok(!TypeUtils.isObject(1))
    })

    it('check object', () => {
      assert.ok(TypeUtils.isObject({hello: 'world'}))
    })

    it('check boolean', () => {
      assert.ok(!TypeUtils.isObject(false))
    })

    it('check date', () => {
      assert.ok(TypeUtils.isObject(new Date()))
    })

    it('check array', () => {
      assert.ok(TypeUtils.isObject([1, 2, 3]))
    })

    it('check class', () => {
      class FooBar {}
      assert.ok(TypeUtils.isObject(new FooBar()))
    })
  })

  describe('isPlainObject()', () => {
    it('check string object', () => {
      assert.ok(!TypeUtils.isPlainObject(new String('I am a string object'))) // eslint-disable-line no-new-wrappers
    })

    it('check string literal', () => {
      assert.ok(!TypeUtils.isPlainObject('I am a string literal'))
    })

    it('check number', () => {
      assert.ok(!TypeUtils.isPlainObject(1))
    })

    it('check object', () => {
      assert.ok(TypeUtils.isPlainObject({hello: 'world'}))
    })

    it('check boolean', () => {
      assert.ok(!TypeUtils.isPlainObject(false))
    })

    it('check date', () => {
      assert.ok(!TypeUtils.isPlainObject(new Date()))
    })

    it('check array', () => {
      assert.ok(!TypeUtils.isPlainObject([1, 2, 3]))
    })

    it('check class', () => {
      class FooBar {}
      assert.ok(!TypeUtils.isPlainObject(new FooBar()))
    })
  })

  describe('isArray()', () => {
    it('check string object', () => {
      assert.ok(!TypeUtils.isArray(new String('I am a string object'))) // eslint-disable-line no-new-wrappers
    })

    it('check string literal', () => {
      assert.ok(!TypeUtils.isArray('I am a string literal'))
    })

    it('check number', () => {
      assert.ok(!TypeUtils.isArray(1))
    })

    it('check object', () => {
      assert.ok(!TypeUtils.isArray({hello: 'world'}))
    })

    it('check boolean', () => {
      assert.ok(!TypeUtils.isArray(false))
    })

    it('check date', () => {
      assert.ok(!TypeUtils.isArray(new Date()))
    })

    it('check array', () => {
      assert.ok(TypeUtils.isArray([1, 2, 3]))
    })

    it('check class', () => {
      class FooBar {}
      assert.ok(!TypeUtils.isArray(new FooBar()))
    })
  })

  describe('isBuffer()', () => {
    it('check string object', () => {
      assert.ok(!TypeUtils.isBuffer(new String('I am a string object'))) // eslint-disable-line no-new-wrappers
    })

    it('check string literal', () => {
      assert.ok(!TypeUtils.isBuffer('I am a string literal'))
    })

    it('check number', () => {
      assert.ok(!TypeUtils.isBuffer(1))
    })

    it('check object', () => {
      assert.ok(!TypeUtils.isBuffer({hello: 'world'}))
    })

    it('check boolean', () => {
      assert.ok(!TypeUtils.isBuffer(false))
    })

    it('check date', () => {
      assert.ok(!TypeUtils.isBuffer(new Date()))
    })

    it('check buffer', () => {
      assert.ok(TypeUtils.isBuffer(Buffer.from('Hello World')))
    })

    it('check array', () => {
      assert.ok(!TypeUtils.isBuffer([1, 2, 3]))
    })

    it('check class', () => {
      class FooBar {}
      assert.ok(!TypeUtils.isBuffer(new FooBar()))
    })
  })

  describe('isBase64()', () => {
    it('check string object', () => {
      assert.ok(!TypeUtils.isBase64(new String('I am a string object'))) // eslint-disable-line no-new-wrappers
    })

    it('check string literal', () => {
      assert.ok(!TypeUtils.isBase64('I am a string literal'))
    })

    it('check base64 string', () => {
      assert.ok(!TypeUtils.isBase64(1))
    })

    it('check base64 string', () => {
      assert.ok(TypeUtils.isBase64(Buffer.from('Hello World').toString('base64')))
    })

    it('check base64 image', () => {
      assert.ok(
        TypeUtils.isBase64(
          'iVBORw0KGgoAAAANSUhEUgAABQAAAALQAQMAAAD1s08VAAAAA1BMVEX/AAAZ4gk3AAAAh0lEQVR42u3BMQEAAADCoPVPbQlPoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB4GsTfAAGc95RKAAAAAElFTkSuQmCC',
        ),
      )
    })
  })

  describe('has()', () => {
    it('check empty object', () => {
      assert.ok(!TypeUtils.has(null, 'hello'))
    })

    it('check single property', () => {
      const testObject = {hello: 'world'}
      assert.ok(TypeUtils.has(testObject, 'hello'))
    })

    it('check multiple properties', () => {
      const testObject = {hello: 'world', world: 'hello'}
      assert.ok(TypeUtils.has(testObject, ['hello', 'world']))
    })

    it('check single missing property', () => {
      const testObject = {hello: 'world'}
      assert.ok(!TypeUtils.has(testObject, 'world'))
    })

    it('check multiple missing properties', () => {
      const testObject = {hello: 'world', world: 'hello'}
      assert.ok(!TypeUtils.has(testObject, ['hello', 'other']))
    })
  })

  describe('isUrl()', () => {
    it('check if string is url', () => {
      assert.ok(!TypeUtils.isUrl('mypath/image123.png'))
    })

    it('check if string is url http', () => {
      assert.ok(TypeUtils.isUrl('http://helloworld.com/anypage'))
    })

    it('check if string is url //', () => {
      assert.ok(TypeUtils.isUrl('//example.com/dsasa'))
    })
  })

  describe('getOrDefault()', () => {
    it('should return default value', () => {
      assert.ok(TypeUtils.getOrDefault(undefined, true))
    })

    it('should return value (true)', () => {
      assert.ok(TypeUtils.getOrDefault(true, false))
    })

    it('should return value (false)', () => {
      assert.ok(!TypeUtils.getOrDefault(false, true))
    })
  })
})
