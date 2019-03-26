'use strict';

/**
 * A container for a AppOutput along with the screenshot used for creating it.
 * (We specifically avoid inheritance so we don't have to deal with serialization issues).
 *
 * @ignore
 */
class AppOutputWithScreenshot {
  /**
   * @param {AppOutput} appOutput
   * @param {EyesScreenshot} screenshot
   */
  constructor(appOutput, screenshot) {
    this._appOutput = appOutput;
    this._screenshot = screenshot;
  }

  /**
   * @return {AppOutput}
   */
  getAppOutput() {
    return this._appOutput;
  }

  /**
   * @return {EyesScreenshot}
   */
  getScreenshot() {
    return this._screenshot;
  }
}

exports.AppOutputWithScreenshot = AppOutputWithScreenshot;
