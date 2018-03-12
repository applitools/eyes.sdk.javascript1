'use strict';

const GeneralUtils = require('./utils/GeneralUtils');

/**
 * Encapsulates the information for the validation about to execute.
 */
class ValidationInfo {

    constructor() {
        this._validationId = null;
        this._tag = null;
    }

    setValidationId(value) {
        this._validationId = value;
    }

    getValidationId() {
        return this._validationId;
    }

    setTag(value) {
        this._tag = value;
    }

    getTag() {
        return this._tag;
    }

    //noinspection JSUnusedGlobalSymbols
    toObject() {
        return {
            validationId: this._validationId,
            tag: this._tag
        };
    }
}

GeneralUtils.defineStandardProperty(ValidationInfo.prototype, "validationId");
GeneralUtils.defineStandardProperty(ValidationInfo.prototype, "tag");

/**
 * Encapsulates the information for the validation about to execute.
 */
class ValidationResult {
    constructor() {
        this._asExpected = null;
    }

    setAsExpected(value) {
        this._asExpected = value;
    }

    getAsExpected() {
        return this._asExpected;
    }
}

GeneralUtils.defineStandardProperty(ValidationResult.prototype, "asExpected");

//noinspection JSLint
/**
 * The base object for session event handler. Specific implementations should use this object as prototype (via
 * the factory method).
 *
 * @type {{testStarted: _baseSessionEventHandler.testStarted, testEnded: _baseSessionEventHandler.testEnded, validationWillStart: _baseSessionEventHandler.validationWillStart, validationEnded: _baseSessionEventHandler.validationEnded}}
 * @private
 */
const _baseSessionEventHandler = {
    /**
     * Called when the data gathering for creating a session phase had started.
     *
     */
    initStarted() {},

    /**
     * Called when the data garthering phase had ended.
     *
     */
    initEnded() {},

    /**
     * Called when setting the size of the appolication window is about to start.
     *
     * @param sizeToSet {Object} an object with 'width' and 'height' properties.
     */
    setSizeWillStart(sizeToSet) {},

    /**
     * Called 'set size' operation has ended (either failed/success).
     *
     */
    setSizeEnded() {},

    /**
     * Called after a session had started.
     *
     * @param autSessionId {String} The AUT session ID.
     */
    testStarted(autSessionId) {},

    /**
     * Called after a session had ended.
     *
     * @param autSessionId {String} The AUT session ID.
     * @param testResults {Object} The test results.
     */
    testEnded(autSessionId, testResults) {},

    /**
     * Called before a new validation will be started.
     *
     * @param autSessionId {String} The AUT session ID.
     * @param validationInfo {ValidationInfo} The validation parameters.
     */
    validationWillStart(autSessionId, validationInfo) {},

    /**
     * Called when a validation had ended.
     *
     * @param autSessionId {String} The AUT session ID.
     * @param validationId {String} The ID of the validation which had ended.
     * @param validationResult {ValidationResult} The validation results.
     */
    validationEnded(autSessionId, validationId, validationResult) {}
};

// get/set promiseFactory
GeneralUtils.defineStandardProperty(_baseSessionEventHandler, "promiseFactory");

// Factory
const createSessionEventHandler = () => Object.create(_baseSessionEventHandler);

module.exports.ValidationInfo = ValidationInfo;
module.exports.ValidationResult = ValidationResult;
module.exports.createSessionEventHandler = createSessionEventHandler;
