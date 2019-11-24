'use strict';

const assert = require('assert');

const { ImageUtils, MutableImage } = require('../../../index');
const { makeImageMock, getResource } = require('../../testUtils');

describe('ImageUtils', function () {
  ['1-2', '1-3', '2-3', '1-4'].forEach(async (baseName) => {
    it(`TestScaleDownImage (${baseName})`, async () => {
      const src = new MutableImage(getResource(`${baseName}_orig.png`));
      const expected = new MutableImage(getResource(`${baseName}_scaled.png`));
      const destImage = await ImageUtils.scaleImage(await src.getImageData(), expected.getWidth() / src.getWidth());
      const expectedImage = await expected.getImageData();
      assert.ok(expectedImage.data.equals(destImage.data));
    });
  });

  it('TestScaleDownImage', async () => {
    const src = new MutableImage(getResource('SrcImage.png'));
    const expected = new MutableImage(getResource('ScaledDownImage.png'));
    const destImage = await ImageUtils.scaleImage(await src.getImageData(), expected.getWidth() / src.getWidth());
    const expectedImage = await expected.getImageData();
    assert.ok(expectedImage.data.equals(destImage.data));
  });

  it('TestScaleDownImage2', async () => {
    const src = new MutableImage(getResource('scale_bug_to_540x768.png'));
    const expected = new MutableImage(getResource('ScaledDownTo540x768Image.png'));
    const destImage = await ImageUtils.scaleImage(await src.getImageData(), 540 / src.getWidth());
    const expectedImage = await expected.getImageData();
    assert.ok(expectedImage.data.equals(destImage.data));
  });

  describe('rotateImage()', () => {
    let originalImage;
    beforeEach(() => {
      originalImage = makeImageMock(
        'vvv',
        'iii',
        'bbb',
        'ggg',
        'yyy',
        'ooo',
        'rrr'
      );
    });

    it('should rotate image for 90 degrees', async () => {
      const expectedImage = makeImageMock(
        'roygbiv',
        'roygbiv',
        'roygbiv'
      );

      const rotatedImage = await ImageUtils.rotateImage(originalImage, 90);
      assert.deepStrictEqual(rotatedImage, originalImage); // because we also update original image
      assert.deepStrictEqual(rotatedImage, expectedImage);
    });

    it('should rotate image for -90 degrees', async () => {
      const expectedImage = makeImageMock(
        'vibgyor',
        'vibgyor',
        'vibgyor'
      );

      const rotatedImage = await ImageUtils.rotateImage(originalImage, -90);
      assert.deepStrictEqual(rotatedImage, expectedImage);
    });

    it('should rotate image for 115 degrees (90 degrees)', async () => {
      const expectedImage = makeImageMock(
        'roygbiv',
        'roygbiv',
        'roygbiv'
      );

      const rotatedImage = await ImageUtils.rotateImage(originalImage, 115);
      assert.deepStrictEqual(rotatedImage, expectedImage);
    });

    it('should rotate image for 180 degrees', async () => {
      const expectedImage = makeImageMock(
        'rrr',
        'ooo',
        'yyy',
        'ggg',
        'bbb',
        'iii',
        'vvv'
      );

      const rotatedImage = await ImageUtils.rotateImage(originalImage, 180);
      assert.deepStrictEqual(rotatedImage, expectedImage);
    });
  });
});
