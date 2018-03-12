'use strict';

/**
 * Represents the types of available stitch modes.
 *
 * @readonly
 * @enum {Number}
 */
const StitchMode = {
    /**
     * Standard JS scrolling.
     */
    SCROLL: 'Scroll',

    /**
     * CSS translation based stitching.
     */
    CSS: 'CSS'
};

Object.freeze(StitchMode);
module.exports = StitchMode;
