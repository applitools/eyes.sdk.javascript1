'use strict';

const GeneralUtils = require('../utils/GeneralUtils');

class ActualAppOutput {

    constructor() {
        this._image = null;
        this._thumbprint = null;
        this._imageMatchSettings = null;
        this._ignoreExpectedOutputSettings = null;
        this._isMatching = null;
        this._areImagesMatching = null;

        this._occurredAt = null;

        this._userInputs = null;
        this._windowTitle = null;
        this._tag = null;
        this._isPrimary = null;
    }

    /**
     * @param {Object} object
     * @return {ActualAppOutput}
     **/
    static fromObject(object) {
        return GeneralUtils.assignTo(new ActualAppOutput(), object);
    };

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
    /** @return {ImageMatchSettings} */
    getImageMatchSettings() {
        return this._imageMatchSettings;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {ImageMatchSettings} value */
    setImageMatchSettings(value) {
        this._imageMatchSettings = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {Boolean} */
    getIgnoreExpectedOutputSettings() {
        return this._ignoreExpectedOutputSettings;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {Boolean} value */
    setIgnoreExpectedOutputSettings(value) {
        this._ignoreExpectedOutputSettings = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {Boolean} */
    getIsMatching() {
        return this._isMatching;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {Boolean} value */
    setIsMatching(value) {
        this._isMatching = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {Boolean} */
    getAreImagesMatching() {
        return this._areImagesMatching;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {Boolean} value */
    setAreImagesMatching(value) {
        this._areImagesMatching = value;
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
    /** @return {Object[]} */
    getUserInputs() {
        return this._userInputs;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {Object[]} value */
    setUserInputs(value) {
        this._userInputs = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getWindowTitle() {
        return this._windowTitle;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setWindowTitle(value) {
        this._windowTitle = value;
    }

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
    /** @return {Boolean} */
    getIsPrimary() {
        return this._isPrimary;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {Boolean} value */
    setIsPrimary(value) {
        this._isPrimary = value;
    }

    /** @override */
    toJSON() {
        return GeneralUtils.toPlain(this);
    }

    /** @override */
    toString() {
        return `ActualAppOutput { ${JSON.stringify(this)} }`;
    }
}

module.exports = ActualAppOutput;
