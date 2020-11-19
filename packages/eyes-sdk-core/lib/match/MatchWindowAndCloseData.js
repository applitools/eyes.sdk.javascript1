'use strict'

const GeneralUtils = require('../utils/GeneralUtils')
const MatchWindowData = require('./MatchWindowData')

/**
 * Encapsulates the data to be sent to the agent on a "matchWindow" command.
 *
 * @ignore
 */
class MatchWindowAndCloseData extends MatchWindowData {
  /**
   * @param {Trigger[]} userInputs - A list of triggers between the previous matchWindow call and the current matchWindow
   *   call. Can be array of size 0, but MUST NOT be null.
   * @param {AppOutput} appOutput - The appOutput for the current matchWindow call.
   * @param {string} tag - The tag of the window to be matched.
   * @param {boolean} [ignoreMismatch]
   * @param {Options} [options]
   */
  constructor({
    userInputs,
    appOutput,
    tag,
    ignoreMismatch,
    options,
    updateBaselineIfNew,
    removeSessionIfMatching,
  } = {}) {
    if (arguments.length > 1) {
      throw new TypeError('Please, use object as a parameter to the constructor!')
    }

    super({userInputs, appOutput, tag, ignoreMismatch, options})

    this._updateBaseline = false
    this._updateBaselineIfDifferent = false
    this._updateBaselineIfNew = updateBaselineIfNew
    this._removeSession = false
    this._removeSessionIfMatching = removeSessionIfMatching
    /** @type {string} */
    this._agentId = undefined
  }

  /**
   * @return {SessionStartInfo}
   */
  getStartInfo() {
    return this._startInfo
  }

  /**
   * @param {SessionStartInfo} startInfo
   */
  setStartInfo(startInfo) {
    this._startInfo = startInfo
  }

  /**
   * @return {boolean}
   */
  getUpdateBaseline() {
    return this._updateBaseline
  }

  /**
   * @param {boolean} updateBaseline
   */
  setUpdateBaseline(updateBaseline) {
    this._updateBaseline = updateBaseline
  }

  /**
   * @return {boolean}
   */
  getUpdateBaselineIfDifferent() {
    return this._updateBaselineIfDifferent
  }

  /**
   * @param {boolean} updateBaselineIfDifferent
   */
  setUpdateBaselineIfDifferent(updateBaselineIfDifferent) {
    this._updateBaselineIfDifferent = updateBaselineIfDifferent
  }

  /**
   * @return {boolean}
   */
  getUpdateBaselineIfNew() {
    return this._updateBaselineIfNew
  }

  /**
   * @param {boolean} updateBaselineIfNew
   */
  setUpdateBaselineIfNew(updateBaselineIfNew) {
    this._updateBaselineIfNew = updateBaselineIfNew
  }

  /**
   * @return {boolean}
   */
  getRemoveSession() {
    return this._removeSession
  }

  /**
   * @param {boolean} removeSession
   */
  setRemoveSession(removeSession) {
    this._removeSession = removeSession
  }

  /**
   * @return {boolean}
   */
  getRemoveSessionIfMatching() {
    return this._removeSessionIfMatching
  }

  /**
   * @param {boolean} removeSessionIfMatching
   */
  setRemoveSessionIfMatching(removeSessionIfMatching) {
    this._removeSessionIfMatching = removeSessionIfMatching
  }

  /**
   * @return {string}
   */
  getAgentId() {
    return this._agentId
  }

  /**
   * @param {string} agentId
   */
  setAgentId(agentId) {
    this._agentId = agentId
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

    return `MatchWindowAndCloseData { ${JSON.stringify(object)} }`
  }
}

module.exports = MatchWindowAndCloseData
