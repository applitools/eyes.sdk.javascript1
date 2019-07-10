'use strict';

const {CheckSettings, Region, GetRegion, GetFloatingRegion} = require('@applitools/eyes-sdk-core');

function createCheckSettings({
  ignore,
  floating,
  layout,
  strict,
  useDom,
  enablePatterns,
  ignoreDisplacements,
  renderId,
}) {
  const checkSettings = new CheckSettings(0);
  setEachRegion(ignore, checkSettings.ignoreRegions.bind(checkSettings));
  setEachRegion(layout, checkSettings.layoutRegions.bind(checkSettings));
  setEachRegion(strict, checkSettings.strictRegions.bind(checkSettings));

  if (floating) {
    floating = [].concat(floating);
    for (const region of floating) {
      if (region instanceof GetFloatingRegion) {
        checkSettings.floatingRegion(region);
      } else {
        checkSettings.floatingRegion(
          new Region(region),
          region.maxUpOffset,
          region.maxDownOffset,
          region.maxLeftOffset,
          region.maxRightOffset,
        );
      }
    }
  }
  if (useDom !== undefined) {
    checkSettings.useDom(useDom);
  }
  if (enablePatterns !== undefined) {
    checkSettings.enablePatterns(enablePatterns);
  }
  if (ignoreDisplacements !== undefined) {
    checkSettings.ignoreDisplacements(ignoreDisplacements);
  }
  if (renderId !== undefined) {
    checkSettings.renderId(renderId);
  }

  return checkSettings;

  function setEachRegion(regions, addToSettings) {
    if (regions) {
      regions = [].concat(regions);
      for (const region of regions) {
        if (region instanceof GetRegion) {
          addToSettings(region);
        } else {
          addToSettings(new Region(region));
        }
      }
    }
  }
}

module.exports = createCheckSettings;
