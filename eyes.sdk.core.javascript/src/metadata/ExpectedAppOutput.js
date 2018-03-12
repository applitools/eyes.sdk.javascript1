'use strict';

const GeneralUtils = require('../utils/GeneralUtils');

class ExpectedAppOutput {

    constructor() {
        this._tag = null;
        this._image = null;
        this._thumbprint = null;
        this._occurredAt = null;
        this._annotations = null;
    }

    /**
     * @param {Object} object
     * @return {ExpectedAppOutput}
     **/
    static fromObject(object) {
        return GeneralUtils.assignTo(new ExpectedAppOutput(), object);
    };

    //noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getTag() {
        return this._tag;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setTag(value) {
        this._tag = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {Image} */
    getImage() {
        return this._image;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {Image} value */
    setImage(value) {
        this._image = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {Image} */
    getThumbprint() {
        return this._thumbprint;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {Image} value */
    setThumbprint(value) {
        this._thumbprint = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {Date} */
    getOccurredAt() {
        return this._occurredAt;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {Date} value */
    setOccurredAt(value) {
        this._occurredAt = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {Annotations} */
    getAnnotations() {
        return this._annotations;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {Annotations} value */
    setAnnotations(value) {
        this._annotations = value;
    }

    /** @override */
    toJSON() {
        return GeneralUtils.toPlain(this);
    }

    /** @override */
    toString() {
        return `ExpectedAppOutput { ${JSON.stringify(this)} }`;
    }
}

module.exports = ExpectedAppOutput;
