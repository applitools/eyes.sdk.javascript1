'use strict';

/**
 * Encapsulates cutting logic.
 *
 * @interface
 */
class CutProvider {

    /**
     * @abstract
     * @param {MutableImage} image The image to cut.
     * @return {Promise.<MutableImage>} A new cut image.
     */
    cut(image) {}

    /**
     * Get a scaled version of the cut provider.
     *
     * @abstract
     * @param {Number} scaleRatio The ratio by which to scale the current cut parameters.
     * @return {CutProvider} A new scale cut provider instance.
     */
    scale(scaleRatio) {}
}

module.exports = CutProvider;
