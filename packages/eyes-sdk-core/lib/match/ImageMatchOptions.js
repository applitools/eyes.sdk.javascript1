const ArgumentGuard = require('../utils/ArgumentGuard')
const GeneralUtils = require('../utils/GeneralUtils')

/**
 * Encapsulates the "Options" section of the MatchExpectedOutput body data.
 */
class ImageMatchOptions {
  /**
   * @param options
   * @param {string} options.name - The tag of the window to be matched.
   * @param {string} options.renderId - The render ID of the screenshot to match.
   * @param {Trigger[]} options.userInputs - A list of triggers between the previous matchWindow call and the current matchWindow
   *   call. Can be array of size 0, but MUST NOT be null.
   * @param {boolean} options.ignoreMismatch - Tells the server whether or not to store a mismatch for the current window as
   *   window in the session.
   * @param {boolean} options.ignoreMatch - Tells the server whether or not to store a match for the current window as window in
   *   the session.
   * @param {boolean} options.forceMismatch - Forces the server to skip the comparison process and mark the current window as a
   *   mismatch.
   * @param {boolean} options.forceMatch - Forces the server to skip the comparison process and mark the current window as a
   *   match.
   * @param {ImageMatchSettings} options.imageMatchSettings - Settings specifying how the server should compare the image.
   * @param {string} options.source
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

module.exports = ImageMatchOptions
