'use strict';

const { Region } = require('@applitools/eyes-common');

const { CutProvider } = require('./CutProvider');

class FixedCutProvider extends CutProvider {
  /**
   * @param {number} header - The header to cut in pixels.
   * @param {number} footer - The footer to cut in pixels.
   * @param {number} left - The left to cut in pixels.
   * @param {number} right - The right to cut in pixels.
   */
  constructor(header, footer, left, right) {
    super();

    this._header = header;
    this._footer = footer;
    this._left = left;
    this._right = right;
  }

  /**
   * @inheritDoc
   */
  async cut(image) {
    if (this._header > 0) {
      const region = new Region(0, this._header, image.getWidth(), image.getHeight() - this._header);
      await image.crop(region);
    }

    if (this._footer > 0) {
      const region = new Region(0, 0, image.getWidth(), image.getHeight() - this._footer);
      await image.crop(region);
    }

    if (this._left > 0) {
      const region = new Region(this._left, 0, image.getWidth() - this._left, image.getHeight());
      await image.crop(region);
    }

    if (this._right > 0) {
      const region = new Region(0, 0, image.getWidth() - this._right, image.getHeight());
      await image.crop(region);
    }

    return image;
  }

  /**
   * @inheritDoc
   */
  scale(scaleRatio) {
    const scaledHeader = Math.ceil(this._header * scaleRatio);
    const scaledFooter = Math.ceil(this._footer * scaleRatio);
    const scaledLeft = Math.ceil(this._left * scaleRatio);
    const scaledRight = Math.ceil(this._right * scaleRatio);

    return new FixedCutProvider(scaledHeader, scaledFooter, scaledLeft, scaledRight);
  }
}

exports.FixedCutProvider = FixedCutProvider;
