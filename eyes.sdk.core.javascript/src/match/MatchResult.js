'use strict';

const GeneralUtils = require('../utils/GeneralUtils');

/**
 * The result of a window match by the agent.
 */
class MatchResult {

    constructor() {
        this._asExpected = null;
        this._windowId = null;
    }

    /**
     * @param {Object} object
     * @return {MatchResult}
     **/
    static fromObject(object) {
        return GeneralUtils.assignTo(new MatchResult(), object);
    };

    /** @return {boolean} */
    getAsExpected() {
        return this._asExpected;
    }

    /** @param {boolean} value */
    setAsExpected(value) {
        this._asExpected = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {number} */
    getWindowId() {
        return this._windowId;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {number} value */
    setWindowId(value) {
        this._windowId = value;
    }

    /** @override */
    toJSON() {
        return GeneralUtils.toPlain(this);
    }

    /** @override */
    toString() {
        return `MatchResult { ${JSON.stringify(this)} }`;
    }
}

module.exports = MatchResult;
