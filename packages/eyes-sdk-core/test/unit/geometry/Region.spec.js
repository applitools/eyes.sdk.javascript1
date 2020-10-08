'use strict'

const assert = require('assert')

const {RectangleSize, Location, Region} = require('../../../index')

describe('Region', () => {
  const top = 1
  const left = 2
  const width = 3
  const height = 4

  it('simple constructor', () => {
    let region = new Region(left, top, width, height)
    assert.strictEqual(region.getLeft(), left, 'left')
    assert.strictEqual(region.getTop(), top, 'top')
    assert.strictEqual(region.getWidth(), width, 'width')
    assert.strictEqual(region.getHeight(), height, 'height')

    // This should still be ok

    region = new Region(1, 2, 0, 0)

    // Making sure negative positions are valid.
    try {
      region = new Region(-1, 2, 3, 4)
    } catch (ignore) {
      assert.fail('Left can be <= 0')
    }

    try {
      region = new Region(1, -2, 3, 4)
    } catch (ignore) {
      assert.fail('Top can be <= 0')
    }

    try {
      region = new Region(1, 2, -1, 0)
      assert.fail('Width must be >=0')
    } catch (ignore) {
      // ignore
    }

    try {
      region = new Region(1, 2, 3, -1)
      assert.fail('Height must be >=0')
    } catch (ignore) {
      // ignore
    }

    try {
      region = new Region(null, new RectangleSize({width: 3, height: 4}))
      assert.fail('Location must not be null!')
    } catch (ignore) {
      // ignore
    }

    try {
      region = new Region(new Location({x: left, y: top}), null)
      assert.fail('Size must not be null!')
    } catch (ignore) {
      // ignore
    }
  })

  it('copy constructor', () => {
    const original = new Region(left, top, width, height)
    const other = new Region(original)

    assert.strictEqual(original.getLeft(), other.getLeft(), 'left')
    assert.strictEqual(original.getTop(), other.getTop(), 'top')
    assert.strictEqual(original.getWidth(), other.getWidth(), 'width')
    assert.strictEqual(original.getHeight(), other.getHeight(), 'height')

    assert.deepStrictEqual(original, other, 'Region objects should be equal!')
    assert.notStrictEqual(original, other, 'original and other should not be the same object')
  })

  it('object constructor', () => {
    const object = {
      left,
      top,
      width,
      height,
    }
    const other = new Region(object)

    assert.strictEqual(object.left, other.getLeft(), 'left')
    assert.strictEqual(object.top, other.getTop(), 'top')
    assert.strictEqual(object.width, other.getWidth(), 'width')
    assert.strictEqual(object.height, other.getHeight(), 'height')
  })

  it('location and size constructor', () => {
    const original = new Region(left, top, width, height)
    const other = new Region(new Location({x: left, y: top}), new RectangleSize(width, height))

    assert.strictEqual(original.getLeft(), other.getLeft(), 'left')
    assert.strictEqual(original.getTop(), other.getTop(), 'top')
    assert.strictEqual(original.getWidth(), other.getWidth(), 'width')
    assert.strictEqual(original.getHeight(), other.getHeight(), 'height')

    assert.deepStrictEqual(original, other, 'Region objects should be equal!')
    assert.notStrictEqual(original, other, 'original and other should not be the same object')
  })

  it('getLocation()', () => {
    const region = new Region(left, top, width, height)
    assert.deepStrictEqual(
      region.getLocation(),
      new Location({x: left, y: top}),
      'invalid location',
    )

    region.setLocation(new Location({x: 5, y: 6}))
    assert.deepStrictEqual(region.getLocation(), new Location(5, 6), 'invalid location')
  })

  it('getSize()', () => {
    const region = new Region(left, top, width, height)
    assert.deepStrictEqual(region.getSize(), new RectangleSize({width, height}), 'invalid location')

    region.setSize(new RectangleSize({width: 5, height: 6}))
    assert.deepStrictEqual(
      region.getSize(),
      new RectangleSize({width: 5, height: 6}),
      'invalid location',
    )
  })

  it('equals()', () => {
    const r1 = new Region(1, 2, 3, 4)
    const r2 = new Region(r1)
    assert.strictEqual(r1.equals(r2), true, 'Regions should be equal!')

    r2.makeEmpty()
    assert.strictEqual(r1.equals(r2), false, 'Regions should be differ!')
  })

  it('getMiddleOffset()', () => {
    const region = new Region(1, 1, 10, 20)
    const middleOffset = region.getMiddleOffset()
    assert.strictEqual(5, middleOffset.getX(), 'X middle is not correct!')
    assert.strictEqual(10, middleOffset.getY(), 'Y middle is not correct!')
  })

  it('getSubRegions()', () => {
    const region = new Region(1, 1, 10, 10)
    const expectedSubRegions = [
      new Region(1, 1, 7, 5),
      new Region(8, 1, 3, 5),
      new Region(1, 6, 7, 5),
      new Region(8, 6, 3, 5),
    ]

    assert.deepStrictEqual(
      region.getSubRegions(new RectangleSize({width: 7, height: 5})),
      expectedSubRegions,
    )
  })

  it('contains()', () => {
    const region = new Region(1, 1, 10, 10)
    const containedRegion = new Region(2, 2, 5, 5)
    const outsideRegion = new Region(8, 5, 5, 5)
    const containedLocation = new Location({x: 2, y: 5})
    const outsideLocation = new Location({x: 20, y: 5})

    assert.strictEqual(region.contains(containedRegion), true, 'region contains containedRegion')
    assert.strictEqual(region.contains(outsideRegion), false, "region doesn't contain region")
    assert.strictEqual(
      region.contains(containedLocation),
      true,
      'region contains containedLocation',
    )
    assert.strictEqual(region.contains(outsideLocation), false, "region doesn't contain location")
  })

  it('intersect()', () => {
    const l1 = new Location({x: 10, y: 10})
    const l2 = new Location({x: 20, y: 30})
    const s1 = new RectangleSize({width: 50, height: 100})
    const s2 = new RectangleSize({width: 100, height: 50})

    const region1 = new Region({
      left: l1.getX(),
      top: l1.getY(),
      width: s1.getWidth(),
      height: s1.getHeight(),
    })
    const region2 = new Region({
      left: l2.getX(),
      top: l2.getY(),
      width: s2.getWidth(),
      height: s2.getHeight(),
    })

    region1.intersect(region2)
    assert.strictEqual(20, region1.getLeft(), 'intersected x')
    assert.strictEqual(30, region1.getTop(), 'intersected y')
    assert.strictEqual(40, region1.getWidth(), 'intersected width')
    assert.strictEqual(50, region1.getHeight(), 'intersected height')

    // Regions which don't intersect should return an empty region.
    region2.intersect(new Region(5, 5, 10, 10))
    assert.deepStrictEqual(region2, Region.EMPTY, 'no overlap')
  })

  it('toString()', () => {
    const region = new Region(0, 0, 1, 1)
    assert.strictEqual(`${region}`, '(0, 0) 1x1')
  })

  it('toJSON()', () => {
    const expectedSerialization = `{"left":${left},"top":${top},"width":${width},"height":${height},"coordinatesType":"SCREENSHOT_AS_IS"}`

    const region = new Region(left, top, width, height)
    const actualSerialization = JSON.stringify(region)

    assert.strictEqual(
      expectedSerialization,
      actualSerialization,
      'Region serialization does not match!',
    )
  })
})
