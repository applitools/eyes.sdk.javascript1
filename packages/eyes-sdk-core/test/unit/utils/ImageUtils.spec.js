'use strict'

const assert = require('assert')

const {ImageUtils, MutableImage} = require('../../../index')
const {makeImageMock, getResource} = require('../../testUtils')

describe('ImageUtils', function() {
  ;['1-2', '1-3', '2-3', '1-4'].forEach(async baseName => {
    it.skip(`TestScaleDownImage (${baseName})`, async () => {
      const src = new MutableImage(getResource(`${baseName}_orig.png`))
      const expected = new MutableImage(getResource(`${baseName}_scaled.png`))
      const destImage = await ImageUtils.scaleImage(
        await src.getImageData(),
        expected.getWidth() / src.getWidth(),
      )
      const expectedImage = await expected.getImageData()
      assert.ok(expectedImage.data.equals(destImage.data))
    })
  })

  it.skip('TestScaleDownImage', async () => {
    const src = new MutableImage(getResource('SrcImage.png'))
    const expected = new MutableImage(getResource('ScaledDownImage.png'))
    const destImage = await ImageUtils.scaleImage(
      await src.getImageData(),
      expected.getWidth() / src.getWidth(),
    )
    const expectedImage = await expected.getImageData()
    assert.ok(expectedImage.data.equals(destImage.data))
  })

  it.skip('TestScaleDownImage2', async () => {
    const src = new MutableImage(getResource('scale_bug_to_540x768.png'))
    const expected = new MutableImage(getResource('ScaledDownTo540x768Image.png'))
    const destImage = await ImageUtils.scaleImage(await src.getImageData(), 540 / src.getWidth())
    const expectedImage = await expected.getImageData()
    assert.ok(expectedImage.data.equals(destImage.data))
  })

  describe('rotateImage()', () => {
    let originalImage
    beforeEach(() => {
      originalImage = makeImageMock('vvv', 'iii', 'bbb', 'ggg', 'yyy', 'ooo', 'rrr')
    })

    it('should rotate image for 90 degrees', async () => {
      const expectedImage = makeImageMock('roygbiv', 'roygbiv', 'roygbiv')

      const rotatedImage = await ImageUtils.rotateImage(originalImage, 90)
      assert.deepStrictEqual(rotatedImage, originalImage) // because we also update original image
      assert.deepStrictEqual(rotatedImage, expectedImage)
    })

    it('should rotate image for -90 degrees', async () => {
      const expectedImage = makeImageMock('vibgyor', 'vibgyor', 'vibgyor')

      const rotatedImage = await ImageUtils.rotateImage(originalImage, -90)
      assert.deepStrictEqual(rotatedImage, expectedImage)
    })

    it('should rotate image for 115 degrees (90 degrees)', async () => {
      const expectedImage = makeImageMock('roygbiv', 'roygbiv', 'roygbiv')

      const rotatedImage = await ImageUtils.rotateImage(originalImage, 115)
      assert.deepStrictEqual(rotatedImage, expectedImage)
    })

    it('should rotate image for 180 degrees', async () => {
      const expectedImage = makeImageMock('rrr', 'ooo', 'yyy', 'ggg', 'bbb', 'iii', 'vvv')

      const rotatedImage = await ImageUtils.rotateImage(originalImage, 180)
      assert.deepStrictEqual(rotatedImage, expectedImage)
    })
  })

  describe('findMarkerPosition()', () => {
    const fixtures = [
      {name: 'iPhone_5S_landscape', position: {x: 0, y: 100}, pixelRatio: 2},
      {name: 'iPhone_X_perfecto_portrait', position: {x: 0, y: 297}, pixelRatio: 3},
      {name: 'iPhone_XR_perfecto_landscape', position: {x: 88, y: 100}, pixelRatio: 2},
      {name: 'iPhone_XS_Max_perfecto_landscape', position: {x: 132, y: 150}, pixelRatio: 3},
      {name: 'iPhone_XS_landscape', position: {x: 132, y: 150}, pixelRatio: 3},
      {name: 'iPhone_XS_portrait', position: {x: 0, y: 282}, pixelRatio: 3},
      {name: 'iPad_Air_portrait', position: {x: 0, y: 140}, pixelRatio: 2},
      {name: 'iPhone_XS_portrait_nomarker', position: null, pixelRatio: 3},
    ]

    fixtures.forEach(({name, position, pixelRatio}) => {
      it(name, async () => {
        const img = new MutableImage(getResource(`./ios-devices/${name}.png`))
        const result = ImageUtils.findMarkerPosition(await img.getImageData(), {
          offset: 1 * pixelRatio,
          size: 3 * pixelRatio,
          mask: [0, 1, 0],
        })
        assert.deepStrictEqual(result, position)
      })
    })
  })
})
