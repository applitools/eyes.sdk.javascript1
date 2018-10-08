'use strict';

const assert = require('assert');

const { ImageUtils } = require('../../index');
const { makeImageMock } = require('../helpers');

describe('ImageUtils', function () {
  this.timeout(60 * 1000);

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

  describe('rotateImage()', () => {
    it('should rotate image for 90 degrees', async () => {
      const expectedImage = makeImageMock(
        'roygbiv',
        'roygbiv',
        'roygbiv'
      );

      const rotatedImage = await ImageUtils.rotateImage(originalImage, 90);
      assert.deepEqual(rotatedImage, originalImage); // because we also update original image
      assert.deepEqual(rotatedImage, expectedImage);
    });

    it('should rotate image for -90 degrees', async () => {
      const expectedImage = makeImageMock(
        'vibgyor',
        'vibgyor',
        'vibgyor'
      );

      const rotatedImage = await ImageUtils.rotateImage(originalImage, -90);
      assert.deepEqual(rotatedImage, expectedImage);
    });

    it('should rotate image for 115 degrees (90 degrees)', async () => {
      const expectedImage = makeImageMock(
        'roygbiv',
        'roygbiv',
        'roygbiv'
      );

      const rotatedImage = await ImageUtils.rotateImage(originalImage, 115);
      assert.deepEqual(rotatedImage, expectedImage);
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
      assert.deepEqual(rotatedImage, expectedImage);
    });
  });
});
