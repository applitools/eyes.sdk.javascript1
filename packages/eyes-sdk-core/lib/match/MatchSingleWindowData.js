'use strict';

const { GeneralUtils } = require('@applitools/eyes-common');

const { MatchWindowData, Options } = require('./MatchWindowData');

/**
 * Encapsulates the data to be sent to the agent on a "matchWindow" command.
 *
 * @ignore
 */
class MatchSingleWindowData extends MatchWindowData {
  /**
   * @param {SessionStartInfo} startInfo - The start parameters for the session.
   * @param {Trigger[]} userInputs - A list of triggers between the previous matchWindow call and the current matchWindow
   *   call. Can be array of size 0, but MUST NOT be null.
   * @param {AppOutput} appOutput - The appOutput for the current matchWindow call.
   * @param {string} tag - The tag of the window to be matched.
   * @param {boolean} [ignoreMismatch]
   * @param {Options} [options]
   */
  constructor({ startInfo, userInputs, appOutput, tag, ignoreMismatch, options } = {}) {
    if (arguments.length > 1) {
      throw new TypeError('Please, use object as a parameter to the constructor!');
    }

    super(userInputs, appOutput, tag, ignoreMismatch, options);

    this._startInfo = startInfo;
    this._updateBaseline = false;
    this._updateBaselineIfDifferent = false;
    this._updateBaselineIfNew = true;
    this._removeSession = false;
    this._removeSessionIfMatching = false;
    /** @type {string} */
    this._agentId = undefined;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {SessionStartInfo}
   */
  getStartInfo() {
    return this._startInfo;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {SessionStartInfo} startInfo
   */
  setStartInfo(startInfo) {
    this._startInfo = startInfo;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean}
   */
  getUpdateBaseline() {
    return this._updateBaseline;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {boolean} updateBaseline
   */
  setUpdateBaseline(updateBaseline) {
    this._updateBaseline = updateBaseline;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean}
   */
  getUpdateBaselineIfDifferent() {
    return this._updateBaselineIfDifferent;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {boolean} updateBaselineIfDifferent
   */
  setUpdateBaselineIfDifferent(updateBaselineIfDifferent) {
    this._updateBaselineIfDifferent = updateBaselineIfDifferent;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean}
   */
  getUpdateBaselineIfNew() {
    return this._updateBaselineIfNew;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {boolean} updateBaselineIfNew
   */
  setUpdateBaselineIfNew(updateBaselineIfNew) {
    this._updateBaselineIfNew = updateBaselineIfNew;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean}
   */
  getRemoveSession() {
    return this._removeSession;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {boolean} removeSession
   */
  setRemoveSession(removeSession) {
    this._removeSession = removeSession;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean}
   */
  getRemoveSessionIfMatching() {
    return this._removeSessionIfMatching;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {boolean} removeSessionIfMatching
   */
  setRemoveSessionIfMatching(removeSessionIfMatching) {
    this._removeSessionIfMatching = removeSessionIfMatching;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getAgentId() {
    return this._agentId;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} agentId
   */
  setAgentId(agentId) {
    this._agentId = agentId;
  }

  /**
   * @override
   */
  toJSON() {
    return GeneralUtils.toPlain(this);
  }

  /**
   * @override
   */
  toString() {
    const object = this.toJSON();

    // noinspection JSUnresolvedVariable
    if (object.appOutput.screenshot64) {
      // noinspection JSUnresolvedVariable
      object.appOutput.screenshot64 = 'REMOVED_FROM_OUTPUT';
    }

    return `MatchSingleWindowData { ${JSON.stringify(object)} }`;
  }
}

exports.Options = Options;
exports.MatchSingleWindowData = MatchSingleWindowData;
