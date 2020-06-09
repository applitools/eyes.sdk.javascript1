'use strict'

const {GeneralUtils, ArgumentGuard} = require('../..')

/**
 * Encapsulates the "Options" section of the MatchExpectedOutput body data.
 *
 * @ignore
 */
class Options {
  /**
   * @param {string} name - The tag of the window to be matched.
   * @param {string} renderId - The render ID of the screenshot to match.
   * @param {Trigger[]} userInputs - A list of triggers between the previous matchWindow call and the current matchWindow
   *   call. Can be array of size 0, but MUST NOT be null.
   * @param {boolean} ignoreMismatch - Tells the server whether or not to store a mismatch for the current window as
   *   window in the session.
   * @param {boolean} ignoreMatch - Tells the server whether or not to store a match for the current window as window in
   *   the session.
   * @param {boolean} forceMismatch - Forces the server to skip the comparison process and mark the current window as a
   *   mismatch.
   * @param {boolean} forceMatch - Forces the server to skip the comparison process and mark the current window as a
   *   match.
   * @param {ImageMatchSettings} imageMatchSettings - Settings specifying how the server should compare the image.
   * @param {string} source
   */
  constructor({
    name,
    renderId,
    userInputs,
    ignoreMismatch,
    ignoreMatch,
    forceMismatch,
    forceMatch,
    imageMatchSettings,
    source,
  } = {}) {
    if (arguments.length > 1) {
      throw new TypeError('Please, use object as a parameter to the constructor!')
    }

    ArgumentGuard.notNull(userInputs, 'userInputs')

    this._name = name
    this._renderId = renderId
    this._userInputs = userInputs
    this._ignoreMismatch = ignoreMismatch
    this._ignoreMatch = ignoreMatch
    this._forceMismatch = forceMismatch
    this._forceMatch = forceMatch
    this._imageMatchSettings = imageMatchSettings
    this._source = source
  }

  /**
   * @return {string}
   */
  getName() {
    return this._name
  }

  /**
   * @return {string}
   */
  getRenderId() {
    return this._renderId
  }

  /**
   * @return {Trigger[]}
   */
  getUserInputs() {
    return this._userInputs
  }

  /**
   * @return {boolean}
   */
  getIgnoreMismatch() {
    return this._ignoreMismatch
  }

  /**
   * @return {boolean}
   */
  getIgnoreMatch() {
    return this._ignoreMatch
  }

  /**
   * @return {boolean}
   */
  getForceMismatch() {
    return this._forceMismatch
  }

  /**
   * @return {boolean}
   */
  getForceMatch() {
    return this._forceMatch
  }

  /**
   * @return {ImageMatchSettings}
   */
  getImageMatchSettings() {
    return this._imageMatchSettings
  }

  /**
   * @return {string}
   */
  getSource() {
    return this._source
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
    return `Options { ${JSON.stringify(this)} }`
  }
}

/**
 * Encapsulates the data to be sent to the agent on a "matchWindow" command.
 */
class MatchWindowData {
  /**
   * @param {Trigger[]} userInputs - A list of triggers between the previous matchWindow call and the current matchWindow
   *   call. Can be array of size 0, but MUST NOT be null.
   * @param {AppOutput} appOutput - The appOutput for the current matchWindow call.
   * @param {string} tag - The tag of the window to be matched.
   * @param {boolean} [ignoreMismatch]
   * @param {Options} [options]
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

exports.Options = Options
exports.ImageMatchOptions = Options
exports.MatchWindowData = MatchWindowData
