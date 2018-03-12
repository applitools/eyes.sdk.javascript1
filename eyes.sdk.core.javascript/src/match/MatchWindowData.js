'use strict';

const GeneralUtils = require('../utils/GeneralUtils');
const ArgumentGuard = require('../ArgumentGuard');

/**
 * Encapsulates the "Options" section of the MatchExpectedOutput body data.
 */
class Options {
    /**
     * @param {String} name The tag of the window to be matched.
     * @param {Trigger[]} userInputs A list of triggers between the previous matchWindow call and the current matchWindow call. Can be array of size 0, but MUST NOT be null.
     * @param {Boolean} ignoreMismatch Tells the server whether or not to store a mismatch for the current window as window in the session.
     * @param {Boolean} ignoreMatch Tells the server whether or not to store a match for the current window as window in the session.
     * @param {Boolean} forceMismatch Forces the server to skip the comparison process and mark the current window as a mismatch.
     * @param {Boolean} forceMatch Forces the server to skip the comparison process and mark the current window as a match.
     * @param {ImageMatchSettings} imageMatchSettings
     */
    constructor(name, userInputs, ignoreMismatch, ignoreMatch, forceMismatch, forceMatch, imageMatchSettings) {
        ArgumentGuard.notNull(userInputs, "userInputs");

        this._name = name;
        this._userInputs = userInputs;
        this._ignoreMismatch = ignoreMismatch;
        this._ignoreMatch = ignoreMatch;
        this._forceMismatch = forceMismatch;
        this._forceMatch = forceMatch;
        this._imageMatchSettings = imageMatchSettings;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getName() {
        return this._name;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {Trigger[]} */
    getUserInputs() {
        return this._userInputs;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {Boolean} */
    getIgnoreMismatch() {
        return this._ignoreMismatch;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {Boolean} */
    getIgnoreMatch() {
        return this._ignoreMatch;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {Boolean} */
    getForceMismatch() {
        return this._forceMismatch;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {Boolean} */
    getForceMatch() {
        return this._forceMatch;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {ImageMatchSettings} */
    getImageMatchSettings() {
        return this._imageMatchSettings;
    }

    /** @override */
    toJSON() {
        return GeneralUtils.toPlain(this);
    }

    /** @override */
    toString() {
        return `Options { ${JSON.stringify(this)} }`;
    }
}

/**
 * Encapsulates the data to be sent to the agent on a "matchWindow" command.
 */
class MatchWindowData {

    /**
     * @param {Trigger[]} userInputs A list of triggers between the previous matchWindow call and the current matchWindow call.
     *                      Can be array of size 0, but MUST NOT be null.
     * @param {AppOutput} appOutput The appOutput for the current matchWindow call.
     * @param {String} tag The tag of the window to be matched.
     * @param {?Boolean} ignoreMismatch
     * @param {?Options} options
     */
    constructor(userInputs, appOutput, tag, ignoreMismatch, options) {
        ArgumentGuard.notNull(userInputs, "userInputs");

        this._userInputs = userInputs;
        this._appOutput = appOutput;
        this._tag = tag;
        this._ignoreMismatch = ignoreMismatch;
        this._options = options;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {Trigger[]} */
    getUserInputs() {
        return this._userInputs;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {AppOutput} */
    getAppOutput() {
        return this._appOutput;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getTag() {
        return this._tag;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {?Boolean} */
    getIgnoreMismatch() {
        return this._ignoreMismatch;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {?Options} */
    getOptions() {
        return this._options;
    }

    /** @override */
    toJSON() {
        return GeneralUtils.toPlain(this);
    }

    /** @override */
    toString() {
        const object = this.toJSON();

        // noinspection JSUnresolvedVariable
        if (object.appOutput.screenshot64) {
            // noinspection JSUnresolvedVariable
            object.appOutput.screenshot64 = "REMOVED_FROM_OUTPUT";
        }

        return `MatchWindowData { ${JSON.stringify(object)} }`;
    }
}

MatchWindowData.Options = Options;
module.exports = MatchWindowData;
