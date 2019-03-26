'use strict';

/* eslint-disable no-unused-vars */

/**
 * Encapsulates a callback which returns an application output.
 *
 * @ignore
 * @abstract
 */
class AppOutputProvider {
  // noinspection JSMethodCanBeStatic, JSUnusedGlobalSymbols
  /**
   * @param {Region} region
   * @param {EyesScreenshot} lastScreenshot
   * @param {CheckSettings} checkSettings
   * @return {Promise<AppOutputWithScreenshot>}
   */
  getAppOutput(region, lastScreenshot, checkSettings) {
    throw new TypeError('The method is not implemented!');
  }
}

exports.AppOutputProvider = AppOutputProvider;
