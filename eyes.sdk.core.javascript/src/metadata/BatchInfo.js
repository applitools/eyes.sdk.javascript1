'use strict';

const GeneralUtils = require('../utils/GeneralUtils');

class BatchInfo {

    constructor() {
        this._id = null;
        this._name = null;
        this._startedAt = null;
    }

    /**
     * @param {Object} object
     * @return {BatchInfo}
     **/
    static fromObject(object) {
        return GeneralUtils.assignTo(new BatchInfo(), object);
    };

    //noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getId() {
        return this._id;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setId(value) {
        this._id = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getName() {
        return this._name;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setName(value) {
        this._name = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {Date} */
    getStartedAt() {
        return this._startedAt;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {Date} value */
    setStartedAt(value) {
        this._startedAt = value;
    }

    /** @override */
    toJSON() {
        return GeneralUtils.toPlain(this);
    }

    /** @override */
    toString() {
        return `BatchInfo { ${JSON.stringify(this)} }`;
    }
}

module.exports = BatchInfo;
