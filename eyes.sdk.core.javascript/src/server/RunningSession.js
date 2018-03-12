'use strict';

const GeneralUtils = require('../utils/GeneralUtils');
const RenderingInfo = require('../renderer/RenderingInfo');

/**
 * Encapsulates data for the session currently running in the agent.
 */
class RunningSession {

    constructor() {
        this._id = null;
        this._sessionId = null;
        this._batchId = null;
        this._baselineId = null;
        this._url = null;
        this._renderingInfo = null;

        this._isNewSession = false;
    }

    /**
     * @param {Object} object
     * @return {RunningSession}
     **/
    static fromObject(object) {
        return GeneralUtils.assignTo(new RunningSession(), object, {
            renderingInfo: RenderingInfo.fromObject
        });
    };

    /** @return {String} */
    getId() {
        return this._id;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setId(value) {
        this._id = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getSessionId() {
        return this._sessionId;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setSessionId(value) {
        this._sessionId = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getBatchId() {
        return this._batchId;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setBatchId(value) {
        this._batchId = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getBaselineId() {
        return this._baselineId;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setBaselineId(value) {
        this._baselineId = value;
    }

    /** @return {String} */
    getUrl() {
        return this._url;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setUrl(value) {
        this._url = value;
    }

    /** @return {RenderingInfo} */
    getRenderingInfo() {
        return this._renderingInfo;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {RenderingInfo} value */
    setRenderingInfo(value) {
        this._renderingInfo = value;
    }

    /** @return {Boolean} */
    getIsNewSession() {
        return this._isNewSession;
    }

    /** @param {Boolean} value */
    setNewSession(value) {
        this._isNewSession = value;
    }

    /** @override */
    toJSON() {
        return GeneralUtils.toPlain(this);
    }

    /** @override */
    toString() {
        return `RunningSession { ${JSON.stringify(this)} }`;
    }
}

module.exports = RunningSession;
