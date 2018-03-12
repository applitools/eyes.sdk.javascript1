'use strict';

const GeneralUtils = require('../utils/GeneralUtils');

class SessionResults {

    constructor() {
        this._id = null;
        this._revision = null;
        this._runningSessionId = null;
        this._isAborted = null;
        this._isStarred = null;
        this._startInfo = null;
        this._batchId = null;
        this._secretToken = null;
        this._state = null;
        this._status = null;
        this._isDefaultStatus = null;
        this._startedAt = null;
        this._duration = null;
        this._isDifferent = null;
        this._env = null;
        this._branch = null;
        this._expectedAppOutput = null;
        this._actualAppOutput = null;
        this._baselineId = null;
        this._baselineRevId = null;
        this._scenarioId = null;
        this._scenarioName = null;
        this._appId = null;
        this._baselineModelId = null;
        this._baselineEnvId = null;
        this._baselineEnv = null;
        this._appName = null;
        this._baselineBranchName = null;
        this._isNew = null;
    }

    /**
     * @param {Object} object
     * @return {SessionResults}
     **/
    static fromObject(object) {
        return GeneralUtils.assignTo(new SessionResults(), object);
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
    /** @return {Integer} */
    getRevision() {
        return this._revision;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {Integer} value */
    setRevision(value) {
        this._revision = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getRunningSessionId() {
        return this._runningSessionId;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setRunningSessionId(value) {
        this._runningSessionId = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {Boolean} */
    getIsAborted() {
        return this._isAborted;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {Boolean} value */
    setIsAborted(value) {
        this._isAborted = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {Boolean} */
    getIsStarred() {
        return this._isStarred;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {Boolean} value */
    setIsStarred(value) {
        this._isStarred = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {StartInfo} */
    getStartInfo() {
        return this._startInfo;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {StartInfo} value */
    setStartInfo(value) {
        this._startInfo = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getBatchId() {
        return this._batchId;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setBatchId(value) {
        this._batchId = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getSecretToken() {
        return this._secretToken;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setSecretToken(value) {
        this._secretToken = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getState() {
        return this._state;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setState(value) {
        this._state = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getStatus() {
        return this._status;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setStatus(value) {
        this._status = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {Boolean} */
    getIsDefaultStatus() {
        return this._isDefaultStatus;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {Boolean} value */
    setIsDefaultStatus(value) {
        this._isDefaultStatus = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getStartedAt() {
        return this._startedAt;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setStartedAt(value) {
        this._startedAt = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {Integer} */
    getDuration() {
        return this._duration;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {Integer} value */
    setDuration(value) {
        this._duration = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {Boolean} */
    getIsDifferent() {
        return this._isDifferent;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {Boolean} value */
    setIsDifferent(value) {
        this._isDifferent = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {AppEnvironment} */
    getEnv() {
        return this._env;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {AppEnvironment} value */
    setEnv(value) {
        this._env = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {Branch} */
    getBranch() {
        return this._branch;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {Branch} value */
    setBranch(value) {
        this._branch = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {ExpectedAppOutput[]} */
    getExpectedAppOutput() {
        return this._expectedAppOutput;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {ExpectedAppOutput[]} value */
    setExpectedAppOutput(value) {
        this._expectedAppOutput = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {ActualAppOutput[]} */
    getActualAppOutput() {
        return this._actualAppOutput;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {ActualAppOutput[]} value */
    setActualAppOutput(value) {
        this._actualAppOutput = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getBaselineId() {
        return this._baselineId;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setBaselineId(value) {
        this._baselineId = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getBaselineRevId() {
        return this._baselineRevId;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setBaselineRevId(value) {
        this._baselineRevId = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getScenarioId() {
        return this._scenarioId;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setScenarioId(value) {
        this._scenarioId = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getScenarioName() {
        return this._scenarioName;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setScenarioName(value) {
        this._scenarioName = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getAppId() {
        return this._appId;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setAppId(value) {
        this._appId = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getBaselineModelId() {
        return this._baselineModelId;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setBaselineModelId(value) {
        this._baselineModelId = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getBaselineEnvId() {
        return this._baselineEnvId;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setBaselineEnvId(value) {
        this._baselineEnvId = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {AppEnvironment} */
    getBaselineEnv() {
        return this._baselineEnv;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {AppEnvironment} value */
    setBaselineEnv(value) {
        this._baselineEnv = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getAppName() {
        return this._appName;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setAppName(value) {
        this._appName = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getBaselineBranchName() {
        return this._baselineBranchName;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setBaselineBranchName(value) {
        this._baselineBranchName = value;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @return {Boolean} */
    getIsNew() {
        return this._isNew;
    }

    //noinspection JSUnusedGlobalSymbols
    /** @param {Boolean} value */
    setIsNew(value) {
        this._isNew = value;
    }

    /** @override */
    toJSON() {
        return GeneralUtils.toPlain(this);
    }

    /** @override */
    toString() {
        return `SessionResults { ${JSON.stringify(this)} }`;
    }
}

module.exports = SessionResults;
