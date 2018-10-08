'use strict';

/**
 * Encapsulates a callback which returns an application output.
 *
 * @abstract
 */
class AppOutputProvider {
  // noinspection JSMethodCanBeStatic, JSUnusedGlobalSymbols
  /**
   * @param {Region} region
   * @param {EyesScreenshot} lastScreenshot
   * @return {Promise<AppOutputWithScreenshot>}
   */
  getAppOutput(region, lastScreenshot) {
    throw new TypeError('The method `getAppOutput` from `AppOutputProvider` should be implemented!');
  }
}

exports.AppOutputProvider = AppOutputProvider;
