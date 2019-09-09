'use strict';

const { CheckSettings } = require('@applitools/eyes-sdk-core');
const { TypeUtils, Region } = require('@applitools/eyes-common');
const { Selector } = require('testcafe');


class TestCafeCheckSettings extends CheckSettings {
  constructor(region) {
    super();

    if (region) {
      this.region(region);
    }
  }

  region(region) {
    if (Region.isRegionCompatible(region)) {
      super.updateTargetRegion(region);
    } else if (TypeUtils.isString(region)) {
      this._targetSelector = Selector(region);
    } else {
      this._targetSelector = region;
    }

    return this;
  }

  getTargetSelector() {
    return this._targetSelector;
  }
}

exports.TestCafeCheckSettings = TestCafeCheckSettings;
