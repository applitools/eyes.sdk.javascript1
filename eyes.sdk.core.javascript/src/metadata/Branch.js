'use strict';

const GeneralUtils = require('../utils/GeneralUtils');

class Branch {

    constructor() {
        this._id = null;
        this._name = null;
        this._isDeleted = null;
    }

    /**
     * @param {Object} object
     * @return {Branch}
     **/
    static fromObject(object) {
        return GeneralUtils.assignTo(new Branch(), object);
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
    /** @return {Boolean} */
    getIsDeleted() {
        return this._isDeleted;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {Boolean} value */
    setIsDeleted(value) {
        this._isDeleted = value;
    }

    /** @override */
    toJSON() {
        return GeneralUtils.toPlain(this);
    }

    /** @override */
    toString() {
        return `Branch { ${JSON.stringify(this)} }`;
    }
}

module.exports = Branch;
