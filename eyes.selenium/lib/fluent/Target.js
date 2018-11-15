'use strict';

const { SeleniumCheckSettings } = require('./SeleniumCheckSettings');

class Target {
  /**
   * Validate current window
   *
   * @return {SeleniumCheckSettings}
   * @constructor
   */
  static window() {
    return new SeleniumCheckSettings();
  }

  /**
   * Validate region (in current window or frame) using region's rect, element or element's locator
   *
   * @param {Region|RegionObject|By|WebElement} region - The region to validate.
   * @param {Integer|string|By|WebElement} [frame] - The element which is the frame to switch to.
   * @return {SeleniumCheckSettings}
   * @constructor
   */
  static region(region, frame) {
    return new SeleniumCheckSettings(region, frame);
  }

  /**
   * Validate frame
   *
   * @param {Integer|string|By|WebElement} frame - The element which is the frame to switch to.
   * @return {SeleniumCheckSettings}
   * @constructor
   */
  static frame(frame) {
    return new SeleniumCheckSettings(null, frame);
  }
}

exports.Target = Target;
