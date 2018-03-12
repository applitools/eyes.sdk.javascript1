'use strict';

const MatchLevel = require('./MatchLevel');

/**
 * Encapsulates match settings for the a session.
 */
class ImageMatchSettings {

    /**
     * @param {MatchLevel} matchLevel The "strictness" level to use.
     * @param {ExactMatchSettings} [exact] Additional threshold parameters when the {@code Exact} match level is used.
     * @param {Boolean} [ignoreCaret]
     **/
    constructor(matchLevel = MatchLevel.Strict, exact, ignoreCaret) {
        this._matchLevel = matchLevel;
        this._exact = exact;
        this._ignoreCaret = ignoreCaret;
        /** @type {Region[]} */
        this._ignoreRegions = [];
        /** @type {FloatingMatchSettings[]} */
        this._floatingMatchSettings = [];
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @return {MatchLevel} The match level to use.
     */
    getMatchLevel() {
        return this._matchLevel;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @param {MatchLevel} value The match level to use.
     */
    setMatchLevel(value) {
        this._matchLevel = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @return {ExactMatchSettings} The additional threshold parameters when the {@code Exact} match level is used, if any.
     */
    getExact() {
        return this._exact;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @param {ExactMatchSettings} value The additional threshold parameters when the {@code Exact} match level is used.
     */
    setExact(value) {
        this._exact = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @return {Boolean} The parameters for the "IgnoreCaret" match settings.
     */
    getIgnoreCaret() {
        return this._ignoreCaret;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @param {Boolean} value The parameters for the "ignoreCaret" match settings.
     */
    setIgnoreCaret(value) {
        this._ignoreCaret = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Returns the array of regions to ignore.
     * @return {Region[]} the array of regions to ignore.
     */
    getIgnoreRegions() {
        return this._ignoreRegions;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Sets an array of regions to ignore.
     * @param {Region[]} value The array of regions to ignore.
     */
    setIgnoreRegions(value) {
        this._ignoreRegions = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Returns an array of floating regions.
     * @return {FloatingMatchSettings[]} an array of floating regions.
     */
    getFloatingRegions() {
        return this._floatingMatchSettings;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Sets an array of floating regions.
     * @param {FloatingMatchSettings[]} value The array of floating regions.
     */
    setFloatingRegions(value) {
        this._floatingMatchSettings = value;
    }

    /** @override */
    toJSON() {
        return {
            matchLevel: this._matchLevel,
            exact: this._exact,
            ignoreCaret: this._ignoreCaret,
            ignore: this._ignoreRegions,
            floating: this._floatingMatchSettings
        };
    }

    /** @override */
    toString() {
        return `ImageMatchSettings { ${JSON.stringify(this)} }`;
    }
}

module.exports = ImageMatchSettings;
