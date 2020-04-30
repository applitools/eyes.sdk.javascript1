;(function() {
  'use strict'

  var GeneralUtils = require('@applitools/eyes-common-legacy').GeneralUtils

  /**
   * Encapsulates the information for the validation about to execute.
   *
   * @constructor
   */
  function ValidationInfo() {
    this._validationId = null
    this._tag = null
  }

  // get/set validationId
  GeneralUtils.defineStandardProperty(ValidationInfo.prototype, 'validationId')

  // get/set tag
  GeneralUtils.defineStandardProperty(ValidationInfo.prototype, 'tag')

  //noinspection JSUnusedGlobalSymbols
  ValidationInfo.prototype.toObject = function() {
    return {
      validationId: this.validationId,
      tag: this.tag,
    }
  }

  /**
   * Encapsulates the information for the validation about to execute.
   *
   * @constructor
   */
  function ValidationResult() {
    this._asExpected = null
  }

  // get/set asExpected
  GeneralUtils.defineStandardProperty(ValidationResult.prototype, 'asExpected')

  //noinspection JSLint
  /**
   * The base object for session event handler. Specific implementations should use this object as prototype (via
   * the factory method).
   *
   * @type {{testStarted: _baseSessionEventHandler.testStarted, testEnded: _baseSessionEventHandler.testEnded, validationWillStart: _baseSessionEventHandler.validationWillStart, validationEnded: _baseSessionEventHandler.validationEnded}}
   * @private
   */
  var _baseSessionEventHandler = {
    /**
     * Called when the data gathering for creating a session phase had started.
     *
     */
    initStarted: function() {},

    /**
     * Called when the data garthering phase had ended.
     *
     */
    initEnded: function() {},

    /**
     * Called when setting the size of the appolication window is about to start.
     *
     * @param sizeToSet {{width: number, height: number}} an object with 'width' and 'height' properties.
     */
    setSizeWillStart: function(sizeToSet) {},

    /**
     * Called 'set size' operation has ended (either failed/success).
     *
     */
    setSizeEnded: function() {},

    /**
     * Called after a session had started.
     *
     * @param autSessionId {string} The AUT session ID.
     */
    testStarted: function(autSessionId) {},

    /**
     * Called after a session had ended.
     *
     * @param autSessionId {string} The AUT session ID.
     * @param testResults {TestResults} The test results.
     */
    testEnded: function(autSessionId, testResults) {},

    /**
     * Called before a new validation will be started.
     *
     * @param autSessionId {string} The AUT session ID.
     * @param validationInfo {ValidationInfo} The validation parameters.
     */
    validationWillStart: function(autSessionId, validationInfo) {},

    /**
     * Called when a validation had ended.
     *
     * @param autSessionId {string} The AUT session ID.
     * @param validationId {string} The ID of the validation which had ended.
     * @param validationResult {ValidationResult} The validation results.
     */
    validationEnded: function(autSessionId, validationId, validationResult) {},
  }

  // get/set promiseFactory
  GeneralUtils.defineStandardProperty(_baseSessionEventHandler, 'promiseFactory')

  // Factory
  var createSessionEventHandler = function() {
    return Object.create(_baseSessionEventHandler)
  }

  exports.ValidationInfo = ValidationInfo
  exports.ValidationResult = ValidationResult
  exports.createSessionEventHandler = createSessionEventHandler
})()
