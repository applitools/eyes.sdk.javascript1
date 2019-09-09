'use strict';

const { TestCafeCheckSettings } = require('./TestCafeCheckSettings');

class Target {
  /**
   * Validate current window
   *
   * @return {TestCafeCheckSettings}
   * @constructor
   */
  static window() {
    return new TestCafeCheckSettings();
  }

  /**
   * Validate region (in current window or frame) using region's rect, Selector or css selector string
   *
   * @param {Region|RegionObject|Selector|string} region - The region to validate.
   * @return {TestCafeCheckSettings}
   * @constructor
   */
  static region(region) {
    return new TestCafeCheckSettings(region);
  }
}

exports.Target = Target;
