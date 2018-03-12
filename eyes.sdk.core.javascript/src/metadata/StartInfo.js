'use strict';

const GeneralUtils = require('../utils/GeneralUtils');

class StartInfo {

    constructor() {
        this._sessionType = null;
        this._isTransient = null;
        this._ignoreBaseline = null;
        this._appIdOrName = null;
        this._compareWithParentBranch = null;
        this._scenarioIdOrName = null;
        this._batchInfo = null;
        this._environment = null;
        this._matchLevel = null;
        this._defaultMatchSettings = null;
        this._agentId = null;
        this._properties = null;
    }

    /**
     * @param {Object} object
     * @return {StartInfo}
     **/
    static fromObject(object) {
        return GeneralUtils.assignTo(new StartInfo(), object);
    };

    //noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getSessionType() {
        return this._sessionType;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setSessionType(value) {
        this._sessionType = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {Boolean} */
    getIsTransient() {
        return this._isTransient;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {Boolean} value */
    setIsTransient(value) {
        this._isTransient = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getAppIdOrName() {
        return this._appIdOrName;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setAppIdOrName(value) {
        this._appIdOrName = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {Boolean} */
    getCompareWithParentBranch() {
        return this._compareWithParentBranch;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {Boolean} value */
    setCompareWithParentBranch(value) {
        this._compareWithParentBranch = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getScenarioIdOrName() {
        return this._scenarioIdOrName;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setScenarioIdOrName(value) {
        this._scenarioIdOrName = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {BatchInfo} */
    getBatchInfo() {
        return this._batchInfo;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {BatchInfo} value */
    setBatchInfo(value) {
        this._batchInfo = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {AppEnvironment} */
    getEnvironment() {
        return this._environment;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {AppEnvironment} value */
    setEnvironment(value) {
        this._environment = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getMatchLevel() {
        return this._matchLevel;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setMatchLevel(value) {
        this._matchLevel = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {ImageMatchSettings} */
    getDefaultMatchSettings() {
        return this._defaultMatchSettings;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {ImageMatchSettings} value */
    setDefaultMatchSettings(value) {
        this._defaultMatchSettings = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getAgentId() {
        return this._agentId;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setAgentId(value) {
        this._agentId = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {Object[]} */
    getProperties() {
        return this._properties;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {Object[]} value */
    setProperties(value) {
        this._properties = value;
    }

    /** @override */
    toJSON() {
        return GeneralUtils.toPlain(this);
    }

    /** @override */
    toString() {
        return `StartInfo { ${JSON.stringify(this)} }`;
    }
}

module.exports = StartInfo;
