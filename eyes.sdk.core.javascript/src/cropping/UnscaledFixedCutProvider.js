'use strict';

const Region = require('../geometry/Region');
const CutProvider = require('./CutProvider');

class UnscaledFixedCutProvider extends CutProvider {

    /**
     * @param {Number} header The header to cut in pixels.
     * @param {Number} footer The footer to cut in pixels.
     * @param {Number} left The left to cut in pixels.
     * @param {Number} right The right to cut in pixels.
     */
    constructor(header, footer, left, right) {
        super();

        this._header = header;
        this._footer = footer;
        this._left = left;
        this._right = right;
    }

    /**
     *
     * @param {MutableImage} image The image to cut.
     * @return {Promise.<MutableImage>} A new cut image.
     */
    cut(image) {
        const that = this;
        let promise = image.resolve();

        if (this._header > 0) {
            promise = promise.then(() => {
                const region = new Region(0, that._header, image.getWidth(), image.getHeight() - that._header);
                return image.crop(region);
            });
        }

        if (this._footer > 0) {
            promise = promise.then(() => {
                const region = new Region(0, 0, image.getWidth(), image.getHeight() - that._footer);
                return image.crop(region);
            });
        }

        if (this._left > 0) {
            promise = promise.then(() => {
                const region = new Region(that._left, 0, image.getWidth() - that._left, image.getHeight());
                return image.crop(region);
            });
        }

        if (this._right > 0) {
            promise = promise.then(() => {
                const region = new Region(0, 0, image.getWidth() - that._right, image.getHeight());
                return image.crop(region);
            });
        }

        return promise;
    }

    /**
     * Get a scaled version of the cut provider.
     *
     * @param {Number} scaleRatio The ratio by which to scale the current cut parameters.
     * @return {CutProvider} A new scale cut provider instance.
     */
    scale(scaleRatio) {
        return new UnscaledFixedCutProvider(this._header, this._footer, this._left, this._right);
    }
}

module.exports = UnscaledFixedCutProvider;
