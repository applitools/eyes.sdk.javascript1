'use strict'
const ArgumentGuard = require('../utils/ArgumentGuard')
const GeneralUtils = require('../utils/GeneralUtils')

/**
 * Encapsulates the data to be sent to the agent on a "matchWindow" command.
 */
class MatchWindowData {
  /**
   * @param data
   * @param {Trigger[]} data.userInputs - A list of triggers between the previous matchWindow call and the current matchWindow
   *   call. Can be array of size 0, but MUST NOT be null.
   * @param {AppOutput} data.appOutput - The appOutput for the current matchWindow call.
   * @param {string} data.tag - The tag of the window to be matched.
   * @param {boolean} [data.ignoreMismatch]
   * @param {Options} [data.options]
   */
  constructor({userInputs, appOutput, tag, ignoreMismatch, options} = {}) {
    if (arguments.length > 1) {
      throw new TypeError('Please, use object as a parameter to the constructor!')
    }

    ArgumentGuard.notNull(appOutput, 'appOutput')

    this._userInputs = userInputs
    this._appOutput = appOutput
    this._tag = tag
    this._ignoreMismatch = ignoreMismatch
    this._options = options
  }

  /**
   * @return {Trigger[]}
   */
  getUserInputs() {
    return this._userInputs
  }

  /**
   * @return {AppOutput}
   */
  getAppOutput() {
    return this._appOutput
  }

  /**
   * @return {string}
   */
  getTag() {
    return this._tag
  }

  /**
   * @return {?boolean}
   */
  getIgnoreMismatch() {
    return this._ignoreMismatch
  }

  /**
   * @return {?Options}
   */
  getOptions() {
    return this._options
  }

  /**
   * @override
   */
  toJSON() {
    return GeneralUtils.toPlain(this)
  }

  /**
   * @override
   */
  toString() {
    const object = this.toJSON()

    if (object.appOutput.screenshot64) {
      object.appOutput.screenshot64 = 'REMOVED_FROM_OUTPUT'
    }

    return `MatchWindowData { ${JSON.stringify(object)} }`
  }
}

module.exports = MatchWindowData
