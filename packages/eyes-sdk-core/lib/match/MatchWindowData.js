'use strict';

const { GeneralUtils, ArgumentGuard } = require('@applitools/eyes-common');

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
  constructor({ name, renderId, userInputs, ignoreMismatch, ignoreMatch, forceMismatch, forceMatch, imageMatchSettings, source } = {}) {
    if (arguments.length > 1) {
      throw new TypeError('Please, use object as a parameter to the constructor!');
    }

    ArgumentGuard.notNull(userInputs, 'userInputs');

    this._name = name;
    this._renderId = renderId;
    this._userInputs = userInputs;
    this._ignoreMismatch = ignoreMismatch;
    this._ignoreMatch = ignoreMatch;
    this._forceMismatch = forceMismatch;
    this._forceMatch = forceMatch;
    this._imageMatchSettings = imageMatchSettings;
    this._source = source;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getName() {
    return this._name;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getRenderId() {
    return this._renderId;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {Trigger[]}
   */
  getUserInputs() {
    return this._userInputs;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean}
   */
  getIgnoreMismatch() {
    return this._ignoreMismatch;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean}
   */
  getIgnoreMatch() {
    return this._ignoreMatch;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean}
   */
  getForceMismatch() {
    return this._forceMismatch;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean}
   */
  getForceMatch() {
    return this._forceMatch;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {ImageMatchSettings}
   */
  getImageMatchSettings() {
    return this._imageMatchSettings;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getSource() {
    return this._source;
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
    return `Options { ${JSON.stringify(this)} }`;
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
  constructor({ userInputs, appOutput, tag, ignoreMismatch, options } = {}) {
    if (arguments.length > 1) {
      throw new TypeError('Please, use object as a parameter to the constructor!');
    }

    ArgumentGuard.notNull(userInputs, 'userInputs');

    this._userInputs = userInputs;
    this._appOutput = appOutput;
    this._tag = tag;
    this._ignoreMismatch = ignoreMismatch;
    this._options = options;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {Trigger[]}
   */
  getUserInputs() {
    return this._userInputs;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {AppOutput}
   */
  getAppOutput() {
    return this._appOutput;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getTag() {
    return this._tag;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {?boolean}
   */
  getIgnoreMismatch() {
    return this._ignoreMismatch;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {?Options}
   */
  getOptions() {
    return this._options;
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

    return `MatchWindowData { ${JSON.stringify(object)} }`;
  }
}

exports.Options = Options;
exports.MatchWindowData = MatchWindowData;
