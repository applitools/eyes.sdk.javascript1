'use strict';

const { Region } = require('@applitools/eyes-common');

const { CutProvider } = require('./CutProvider');

class UnscaledFixedCutProvider extends CutProvider {
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
  scale(scaleRatio) { // eslint-disable-line no-unused-vars
    return new UnscaledFixedCutProvider(this._header, this._footer, this._left, this._right);
  }
}

exports.UnscaledFixedCutProvider = UnscaledFixedCutProvider;
