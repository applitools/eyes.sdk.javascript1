'use strict';

const UnscaledFixedCutProvider = require('./UnscaledFixedCutProvider');

class NullCutProvider extends UnscaledFixedCutProvider {
    constructor() {
        super(0, 0, 0, 0);
    }

    /**
     * @override
     */
    scale(scaleRatio) {
        return this;
    }
}

module.exports = NullCutProvider;
