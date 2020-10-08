'use strict'

const assert = require('assert')

const {Location} = require('../../../index')

describe('Location', () => {
  const top = 1
  const left = 2

  it('simple constructor', () => {
    const location = new Location(left, top)
    assert.strictEqual(location.getX(), left, 'x')
    assert.strictEqual(location.getY(), top, 'y')
  })

  it('copy constructor', () => {
    const original = new Location(left, top)
    const other = new Location(original)

    assert.strictEqual(other.getX(), left, 'x')
    assert.strictEqual(other.getY(), top, 'y')

    assert.deepStrictEqual(original, other, 'Location objects should be equal!')
    assert.notStrictEqual(original, other, 'original and other should not be the same object')
  })

  it('object constructor', () => {
    const object = {x: left, y: top}
    const other = new Location(object)

    assert.strictEqual(other.getX(), left, 'x')
    assert.strictEqual(other.getY(), top, 'y')
  })

  it('equals()', () => {
    const l1 = new Location({x: 1, y: 2})
    let l2 = new Location(l1)
    assert.strictEqual(l1.equals(l2), true, 'Locations should be equal!')

    l2 = l2.scale(2)
    assert.strictEqual(l1.equals(l2), false, 'Locations should be differ!')
  })

  it('offset()', () => {
    let location = new Location({x: left, y: top})
    location = location.offset(5, 5)
    assert.strictEqual(location.getX(), left + 5, 'x')
    assert.strictEqual(location.getY(), top + 5, 'y')
  })

  it('scale()', () => {
    let location = new Location({x: left, y: top})
    location = location.scale(2)
    assert.strictEqual(location.getX(), left * 2, 'x')
    assert.strictEqual(location.getY(), top * 2, 'y')
  })

  it('toJSON()', () => {
    const expectedSerialization = `{"x":${left},"y":${top}}`

    const location = new Location({x: left, y: top})
    const actualSerialization = JSON.stringify(location)

    assert.strictEqual(
      expectedSerialization,
      actualSerialization,
      'Location serialization does not match!',
    )
  })
})
