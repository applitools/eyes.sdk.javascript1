'use strict';

const GeneralUtils = require('../utils/GeneralUtils');

/**
 * Encapsulates data for the render currently running in the client.
 */
class RunningRender {

    constructor() {
        this._renderId = false;
        this._jobId = false;

        this._renderStatus = null;
        this._needMoreResources = null;
        this._needMoreDom = null;
    }

    /**
     * @param {Object} object
     * @return {RunningRender}
     **/
    static fromObject(object) {
        return GeneralUtils.assignTo(new RunningRender(), object);
    };

    /** @return {String} */
    getRenderId() {
        return this._renderId;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setRenderId(value) {
        this._renderId = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getJobId() {
        return this._jobId;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setJobId(value) {
        this._jobId = value;
    }

    /** @return {RenderStatus} */
    getRenderStatus() {
        return this._renderStatus;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {RenderStatus} value */
    setRenderStatus(value) {
        this._renderStatus = value;
    }

    /** @return {String[]} */
    getNeedMoreResources() {
        return this._needMoreResources;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {String[]} value */
    setNeedMoreResources(value) {
        this._needMoreResources = value;
    }

    /** @return {Boolean} */
    getNeedMoreDom() {
        return this._needMoreDom;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {Boolean} value */
    setNeedMoreDom(value) {
        this._needMoreDom = value;
    }

    /** @override */
    toJSON() {
        return GeneralUtils.toPlain(this);
    }

    /** @override */
    toString() {
        return `RunningRender { ${JSON.stringify(this)} }`;
    }
}

module.exports = RunningRender;
