'use strict';

const RectangleSize = require('./geometry/RectangleSize');
const GeneralUtils = require('./utils/GeneralUtils');
const TestResultsStatus = require('./TestResultsStatus');

/**
 * Eyes test results.
 */
class TestResults {

    constructor() {
        this._name = null;
        this._secretToken = null;
        //this._id = null;
        this._status = null;
        this._appName = null;
        this._batchName = null;
        this._batchId = null;
        this._branchName = null;
        this._hostOS = null;
        this._hostApp = null;
        this._hostDisplaySize = null;
        this._startedAt = null;
        this._duration = null;
        this._isNew = null;
        this._isDifferent = null;
        this._isAborted = null;
        //this._defaultMatchSettings = null;
        this._appUrls = null;
        this._apiUrls = null;
        this._stepsInfo = null;
        this._steps = null;
        this._matches = null;
        this._mismatches = null;
        this._missing = null;
        this._exactMatches = null;
        this._strictMatches = null;
        this._contentMatches = null;
        this._layoutMatches = null;
        this._noneMatches = null;
        this._url = null;
    }

    /**
     * @param {Object} object
     * @return {TestResults}
     **/
    static fromObject(object) {
        return GeneralUtils.assignTo(new TestResults(), object, {
            hostDisplaySize: RectangleSize.fromObject,
            startedAt: GeneralUtils.fromISO8601DateTime,
            appUrls: SessionUrls.fromObject,
            apiUrls: SessionUrls.fromObject,
            stepsInfo: (steps) => Array.from(steps).map(step => StepInfo.fromObject(step))
        });
    };

    // noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getName() {
        return this._name;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setName(value) {
        this._name = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getSecretToken() {
        return this._secretToken;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setSecretToken(value) {
        this._secretToken = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {TestResultsStatus} */
    getStatus() {
        return this._status;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {TestResultsStatus} value */
    setStatus(value) {
        this._status = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getAppName() {
        return this._appName;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setAppName(value) {
        this._appName = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getBatchName() {
        return this._batchName;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setBatchName(value) {
        this._batchName = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getBatchId() {
        return this._batchId;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setBatchId(value) {
        this._batchId = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getBranchName() {
        return this._branchName;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setBranchName(value) {
        this._branchName = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getHostOS() {
        return this._hostOS;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setHostOS(value) {
        this._hostOS = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getHostApp() {
        return this._hostApp;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setHostApp(value) {
        this._hostApp = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {RectangleSize} */
    getHostDisplaySize() {
        return this._hostDisplaySize;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {RectangleSize} value */
    setHostDisplaySize(value) {
        this._hostDisplaySize = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {Date} */
    getStartedAt() {
        return this._startedAt;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {Date} value */
    setStartedAt(value) {
        this._startedAt = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {int} */
    getDuration() {
        return this._duration;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {int} value */
    setDuration(value) {
        this._duration = value;
    }

    /** @return {Boolean} Whether or not this is a new test. */
    getIsNew() {
        return this._isNew;
    }

    /** @param {Boolean} value Whether or not this test has an existing baseline. */
    setIsNew(value) {
        this._isNew = value;
    }

    /** @return {Boolean} */
    getIsDifferent() {
        return this._isDifferent;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {Boolean} value */
    setIsDifferent(value) {
        this._isDifferent = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {Boolean} */
    getIsAborted() {
        return this._isAborted;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {Boolean} value */
    setIsAborted(value) {
        this._isAborted = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {SessionUrls} */
    getAppUrls() {
        return this._appUrls;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {SessionUrls} value */
    setAppUrls(value) {
        this._appUrls = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {SessionUrls} */
    getApiUrls() {
        return this._apiUrls;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {SessionUrls} value */
    setApiUrls(value) {
        this._apiUrls = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {StepInfo[]} */
    getStepsInfo() {
        return this._stepsInfo;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {StepInfo[]} value */
    setStepsInfo(value) {
        this._stepsInfo = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {int} The total number of test steps. */
    getSteps() {
        return this._steps;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {int} value The number of visual checkpoints in the test. */
    setSteps(value) {
        this._steps = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {int} The total number of test steps that matched the baseline. */
    getMatches() {
        return this._matches;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param value {int} The number of visual matches in the test. */
    setMatches(value) {
        this._matches = value;
    }

    /** @return {int} The total number of test steps that did not match the baseline. */
    getMismatches() {
        return this._mismatches;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {int} value The number of mismatches in the test. */
    setMismatches(value) {
        this._mismatches = value;
    }

    /** @return {int} The total number of baseline test steps that were missing in the test. */
    getMissing() {
        return this._missing;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {int} value The number of visual checkpoints that were available in the baseline but were not found in the current test. */
    setMissing(value) {
        this._missing = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {int} The total number of test steps that exactly matched the baseline. */
    getExactMatches() {
        return this._exactMatches;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {int} value The number of matches performed with match level set to {@link MatchLevel#Exact} */
    setExactMatches(value) {
        this._exactMatches = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {int} The total number of test steps that strictly matched the baseline. */
    getStrictMatches() {
        return this._strictMatches;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {int} value The number of matches performed with match level set to {@link MatchLevel#Strict} */
    setStrictMatches(value) {
        this._strictMatches = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {int} The total number of test steps that matched the baseline by content. */
    getContentMatches() {
        return this._contentMatches;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {int} value The number of matches performed with match level set to {@link MatchLevel#Content} */
    setContentMatches(value) {
        this._contentMatches = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {int} The total number of test steps that matched the baseline by layout. */
    getLayoutMatches() {
        return this._layoutMatches;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {int} value The number of matches performed with match level set to {@link MatchLevel#Layout} */
    setLayoutMatches(value) {
        this._layoutMatches = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {int} The total number of test steps that matched the baseline without performing any comparison. */
    getNoneMatches() {
        return this._noneMatches;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {int} value The number of matches performed with match level set to {@link MatchLevel#None} */
    setNoneMatches(value) {
        this._noneMatches = value;
    }

    /** @return {String} The URL where test results can be viewed. */
    getUrl() {
        return this._url;
    }

    /** @param {String} value The URL of the test results. */
    setUrl(value) {
        this._url = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {Boolean} Whether or not this test passed. */
    isPassed() {
        return this._status === TestResultsStatus.Passed;
    }

    /** @override */
    toString() {
        const isNewTestStr = this._isNew ? "New test" : "Existing test";
        return `${isNewTestStr} [steps: ${this._steps}, matches: ${this._matches}, mismatches: ${this._mismatches}, missing: ${this._missing}] , URL: ${this._url}, status: ${this._status}`;
    }
}

class SessionUrls {

    constructor() {
        this._batch = null;
        this._session = null;
    }

    /**
     * @param {Object} object
     * @return {SessionUrls}
     **/
    static fromObject(object) {
        return GeneralUtils.assignTo(new SessionUrls(), object);
    };

    // noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getBatch() {
        return this._batch;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setBatch(value) {
        this._batch = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getSession() {
        return this._session;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setSession(value) {
        this._session = value;
    }
}

class StepInfo {

    constructor() {
        this._name = null;
        this._isDifferent = null;
        this._hasBaselineImage = null;
        this._hasCurrentImage = null;
        this._appUrls = null;
        this._apiUrls = null;
    }

    /**
     * @param {Object} object
     * @return {StepInfo}
     **/
    static fromObject(object) {
        return GeneralUtils.assignTo(new StepInfo(), object, {
            appUrls: AppUrls.fromObject,
            apiUrls: ApiUrls.fromObject
        });
    };

    // noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getName() {
        return this._name;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setName(value) {
        this._name = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {boolean} */
    getIsDifferent() {
        return this._isDifferent;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {boolean} value */
    setIsDifferent(value) {
        this._isDifferent = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {boolean} */
    getHasBaselineImage() {
        return this._hasBaselineImage;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {boolean} value */
    setHasBaselineImage(value) {
        this._hasBaselineImage = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {boolean} */
    getHasCurrentImage() {
        return this._hasCurrentImage;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {boolean} value */
    setHasCurrentImage(value) {
        this._hasCurrentImage = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {AppUrls} */
    getAppUrls() {
        return this._appUrls;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {AppUrls} value */
    setAppUrls(value) {
        this._appUrls = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {ApiUrls} */
    getApiUrls() {
        return this._apiUrls;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {ApiUrls} value */
    setApiUrls(value) {
        this._apiUrls = value;
    }
}

class ApiUrls {

    constructor() {
        this._baselineImage = null;
        this._currentImage = null;
        this._diffImage = null;
    }

    /**
     * @param {Object} object
     * @return {ApiUrls}
     **/
    static fromObject(object) {
        return GeneralUtils.assignTo(new ApiUrls(), object);
    };

    // noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getBaselineImage() {
        return this._baselineImage;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setBaselineImage(value) {
        this._baselineImage = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getCurrentImage() {
        return this._currentImage;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setCurrentImage(value) {
        this._currentImage = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getDiffImage() {
        return this._diffImage;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setDiffImage(value) {
        this._diffImage = value;
    }
}

class AppUrls {

    constructor() {
        this._step = null;
    }

    /**
     * @param {Object} object
     * @return {AppUrls}
     **/
    static fromObject(object) {
        return GeneralUtils.assignTo(new AppUrls(), object);
    };

    // noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getStep() {
        return this._step;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setStep(value) {
        this._step = value;
    }
}

module.exports = TestResults;
