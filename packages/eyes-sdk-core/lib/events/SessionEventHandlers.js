'use strict'
const SessionEventHandler = require('./SessionEventHandler')

class SessionEventHandlers extends SessionEventHandler {
  constructor() {
    super()

    /** @type {SessionEventHandler[]} */
    this._eventHandlers = []
  }

  /**
   * @param {SessionEventHandler} handler
   */
  addEventHandler(handler) {
    if (handler === this) {
      return
    }

    this._eventHandlers.push(handler)
  }

  /**
   * @param {SessionEventHandler} handler
   */
  removeEventHandler(handler) {
    if (handler === this) {
      return
    }

    const index = this._eventHandlers.indexOf(handler)
    this._eventHandlers.splice(index, 1)
  }

  clearEventHandlers() {
    this._eventHandlers.length = 0
  }

  /**
   * Called when the data gathering for creating a session phase had started.
   *
   * @override
   * @return {Promise}
   */
  initStarted() {
    return Promise.all(this._eventHandlers.map(eventHandler => eventHandler.initStarted()))
  }

  /**
   * Called when the data gathering phase had ended.
   *
   * @override
   * @return {Promise}
   */
  initEnded() {
    return Promise.all(this._eventHandlers.map(eventHandler => eventHandler.initEnded()))
  }

  /**
   * Called when setting the size of the application window is about to start.
   *
   * @override
   * @param {RectangleSize} sizeToSet - an object with 'width' and 'height' properties.
   * @return {Promise}
   */
  setSizeWillStart(sizeToSet) {
    return Promise.all(
      this._eventHandlers.map(eventHandler => eventHandler.setSizeWillStart(sizeToSet)),
    )
  }

  /**
   * Called 'set size' operation has ended (either failed/success).
   *
   * @override
   * @return {Promise}
   */
  setSizeEnded() {
    return Promise.all(this._eventHandlers.map(eventHandler => eventHandler.setSizeEnded()))
  }

  /**
   * Called after a session had started.
   *
   * @override
   * @param {string} autSessionId - The AUT session ID.
   * @return {Promise}
   */
  testStarted(autSessionId) {
    return Promise.all(
      this._eventHandlers.map(eventHandler => eventHandler.testStarted(autSessionId)),
    )
  }

  /**
   * Called after a session had ended.
   *
   * @override
   * @param {string} autSessionId - The AUT session ID.
   * @param {TestResults} testResults - The test results.
   * @return {Promise}
   */
  testEnded(autSessionId, testResults) {
    return Promise.all(
      this._eventHandlers.map(eventHandler => eventHandler.testEnded(autSessionId, testResults)),
    )
  }

  /**
   * Called before a new validation will be started.
   *
   * @override
   * @param {string} autSessionId - The AUT session ID.
   * @param {ValidationInfo} validationInfo - The validation parameters.
   * @return {Promise}
   */
  validationWillStart(autSessionId, validationInfo) {
    return Promise.all(
      this._eventHandlers.map(eventHandler =>
        eventHandler.validationWillStart(autSessionId, validationInfo),
      ),
    )
  }

  /**
   * Called when a validation had ended.
   *
   * @override
   * @param {string} autSessionId - The AUT session ID.
   * @param {number} validationId - The ID of the validation which had ended.
   * @param {ValidationResult} validationResult - The validation results.
   * @return {Promise}
   */
  validationEnded(autSessionId, validationId, validationResult) {
    return Promise.all(
      this._eventHandlers.map(eventHandler =>
        eventHandler.validationEnded(autSessionId, validationId, validationResult),
      ),
    )
  }
}

module.exports = SessionEventHandlers
