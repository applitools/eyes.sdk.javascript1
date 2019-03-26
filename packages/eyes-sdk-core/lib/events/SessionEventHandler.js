'use strict';

/* eslint-disable no-unused-vars */

/**
 * The base class for session event handler. Specific implementations should use this class as abstract.
 *
 * @abstract
 */
class SessionEventHandler {
  /**
   * Called when the data gathering for creating a session phase had started.
   *
   * @return {Promise}
   */
  initStarted() {}

  /**
   * Called when the data gathering phase had ended.
   *
   * @return {Promise}
   */
  initEnded() {}

  /**
   * Called when setting the size of the application window is about to start.
   *
   * @param {RectangleSize} sizeToSet - an object with 'width' and 'height' properties.
   * @return {Promise}
   */
  setSizeWillStart(sizeToSet) {}

  /**
   * Called 'set size' operation has ended (either failed/success).
   *
   * @return {Promise}
   */
  setSizeEnded() {}

  /**
   * Called after a session had started.
   *
   * @param {string} autSessionId - The AUT session ID.
   * @return {Promise}
   */
  testStarted(autSessionId) {}

  /**
   * Called after a session had ended.
   *
   * @param {string} autSessionId - The AUT session ID.
   * @param {TestResults} testResults - The test results.
   * @return {Promise}
   */
  testEnded(autSessionId, testResults) {}

  /**
   * Called before a new validation will be started.
   *
   * @param {string} autSessionId - The AUT session ID.
   * @param {ValidationInfo} validationInfo - The validation parameters.
   * @return {Promise}
   */
  validationWillStart(autSessionId, validationInfo) {}

  /**
   * Called when a validation had ended.
   *
   * @param {string} autSessionId - The AUT session ID.
   * @param {number} validationId - The ID of the validation which had ended.
   * @param {ValidationResult} validationResult - The validation results.
   * @return {Promise}
   */
  validationEnded(autSessionId, validationId, validationResult) {}
}

exports.SessionEventHandler = SessionEventHandler;
