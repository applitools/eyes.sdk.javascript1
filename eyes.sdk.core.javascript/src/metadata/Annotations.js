'use strict';

const GeneralUtils = require('../utils/GeneralUtils');

class Annotations {

    constructor() {
        this._floating = null;
        this._ignore = null;
        this._strict = null;
        this._content = null;
        this._layout = null;
    }

    /**
     * @param {Object} object
     * @return {Annotations}
     **/
    static fromObject(object) {
        return GeneralUtils.assignTo(new Annotations(), object);
    };

    //noinspection JSUnusedGlobalSymbols
    /** @return {FloatingMatchSettings[]} */
    getFloating() {
        return this._floating;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {FloatingMatchSettings[]} value */
    setFloating(value) {
        this._floating = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {Region[]} */
    getIgnore() {
        return this._ignore;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {Region[]} value */
    setIgnore(value) {
        this._ignore = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {Region[]} */
    getStrict() {
        return this._strict;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {Region[]} value */
    setStrict(value) {
        this._strict = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {Region[]} */
    getContent() {
        return this._content;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {Region[]} value */
    setContent(value) {
        this._content = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {Region[]} */
    getLayout() {
        return this._layout;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {Region[]} value */
    setLayout(value) {
        this._layout = value;
    }

    /** @override */
    toJSON() {
        return GeneralUtils.toPlain(this);
    }

    /** @override */
    toString() {
        return `Annotations { ${JSON.stringify(this)} }`;
    }
}

module.exports = Annotations;
