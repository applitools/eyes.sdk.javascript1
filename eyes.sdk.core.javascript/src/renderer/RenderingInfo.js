'use strict';

const GeneralUtils = require('../utils/GeneralUtils');

class RenderingInfo {

    constructor() {
        this._serviceUrl = null;
        this._accessToken = null;
        this._resultsUrl = null;
    }

    /**
     * @param {Object} object
     * @return {RenderingInfo}
     **/
    static fromObject(object) {
        return GeneralUtils.assignTo(new RenderingInfo(), object);
    };

    /** @return {String} */
    getServiceUrl() {
        return this._serviceUrl;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setServiceUrl(value) {
        this._serviceUrl = value;
    }

    /** @return {String} */
    getAccessToken() {
        return this._accessToken;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setAccessToken(value) {
        this._accessToken = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getResultsUrl() {
        return this._resultsUrl;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setResultsUrl(value) {
        this._resultsUrl = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {{sub: string, exp: int, iss: string}} */
    getDecodedAccessToken() {
        if (this._payload) {
            this._payload = GeneralUtils.jwtDecode(this._accessToken);
        }
        return this._payload;
    }

    /** @override */
    toJSON() {
        return GeneralUtils.toPlain(this, ['_payload']);
    }

    /** @override */
    toString() {
        return `RenderingInfo { ${JSON.stringify(this)} }`;
    }
}

module.exports = RenderingInfo;
