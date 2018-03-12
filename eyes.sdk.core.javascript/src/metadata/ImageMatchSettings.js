'use strict';

const GeneralUtils = require('../utils/GeneralUtils');

class ImageMatchSettings {

    constructor() {
        this._matchLevel = null;
        this._ignore = null;
        this._strict = null;
        this._content = null;
        this._layout = null;
        this._floating = null;
        this._splitTopHeight = null;
        this._splitBottomHeight = null;
        this._ignoreCaret = null;
        this._scale = null;
        this._remainder = null;
    }

    /**
     * @param {Object} object
     * @return {ImageMatchSettings}
     **/
    static fromObject(object) {
        return GeneralUtils.assignTo(new ImageMatchSettings(), object);
    };

    //noinspection JSUnusedGlobalSymbols
    /** @return {MatchLevel} */
    getMatchLevel() {
        return this._matchLevel;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {MatchLevel} value */
    setMatchLevel(value) {
        this._matchLevel = value;
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
    /** @return {Integer} */
    getSplitTopHeight() {
        return this._splitTopHeight;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {Integer} value */
    setSplitTopHeight(value) {
        this._splitTopHeight = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {Integer} */
    getSplitBottomHeight() {
        return this._splitBottomHeight;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {Integer} value */
    setSplitBottomHeight(value) {
        this._splitBottomHeight = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {Boolean} */
    getIgnoreCaret() {
        return this._ignoreCaret;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {Boolean} value */
    setIgnoreCaret(value) {
        this._ignoreCaret = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {Integer} */
    getScale() {
        return this._scale;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {Integer} value */
    setScale(value) {
        this._scale = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {Integer} */
    getRemainder() {
        return this._remainder;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {Integer} value */
    setRemainder(value) {
        this._remainder = value;
    }

    /** @override */
    toJSON() {
        return GeneralUtils.toPlain(this);
    }

    /** @override */
    toString() {
        return `ImageMatchSettings { ${JSON.stringify(this)} }`;
    }
}

module.exports = ImageMatchSettings;
