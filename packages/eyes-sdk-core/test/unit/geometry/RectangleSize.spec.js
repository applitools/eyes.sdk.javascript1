'use strict'

const assert = require('assert')

const {RectangleSize} = require('../../../index')

describe('RectangleSize', () => {
  const width = 4
  const height = 5

  it('simple constructor', () => {
    const size = new RectangleSize({width, height})
    assert.strictEqual(size.getWidth(), width, 'width')
    assert.strictEqual(size.getHeight(), height, 'height')
  })

  it('copy constructor', () => {
    const original = new RectangleSize({width, height})
    const other = new RectangleSize(original)

    assert.strictEqual(other.getWidth(), width, 'width')
    assert.strictEqual(other.getHeight(), height, 'height')

    assert.deepStrictEqual(original, other, 'RectangleSize objects should be equal!')
    assert.notStrictEqual(original, other, 'original and other should not be the same object')
  })

  it('object constructor', () => {
    const object = {width, height}
    const other = new RectangleSize(object)

    assert.strictEqual(other.getWidth(), width, 'width')
    assert.strictEqual(other.getHeight(), height, 'height')
  })

  it('parse()', () => {
    const string = `${width}x${height}`
    const other = RectangleSize.parse(string)

    assert.strictEqual(other.getWidth(), width, 'width')
    assert.strictEqual(other.getHeight(), height, 'height')
  })

  it('equals()', () => {
    const l1 = new RectangleSize({width: 1, height: 2})
    let l2 = new RectangleSize(l1)
    assert.strictEqual(l1.equals(l2), true, 'RectangleSizes should be equal!')

    l2 = l2.scale(2)
    assert.strictEqual(l1.equals(l2), false, 'RectangleSizes should be differ!')
  })

  it('scale()', () => {
    let size = new RectangleSize({width, height})
    size = size.scale(2)
    assert.strictEqual(size.getWidth(), width * 2, 'width')
    assert.strictEqual(size.getHeight(), height * 2, 'height')
  })

  it('toJSON()', () => {
    const expectedSerialization = `{"width":${width},"height":${height}}`

    const size = new RectangleSize({width, height})
    const actualSerialization = JSON.stringify(size)

    assert.strictEqual(
      expectedSerialization,
      actualSerialization,
      'RectangleSize serialization does not match!',
    )
  })
})
