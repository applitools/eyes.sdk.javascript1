'use strict';

const {
  CheckSettings,
  Region,
  GetRegion,
  GetFloatingRegion,
  GetAccessibilityRegion,
} = require('@applitools/eyes-sdk-core');

function createCheckSettings({
  ignore,
  floating,
  layout,
  strict,
  content,
  accessibility,
  useDom,
  enablePatterns,
  ignoreDisplacements,
  renderId,
  matchLevel,
  accessibilityLevel,
}) {
  const checkSettings = new CheckSettings(0);
  setEachRegion(ignore, checkSettings.ignoreRegions.bind(checkSettings));
  setEachRegion(layout, checkSettings.layoutRegions.bind(checkSettings));
  setEachRegion(strict, checkSettings.strictRegions.bind(checkSettings));
  setEachRegion(content, checkSettings.contentRegions.bind(checkSettings));

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
  
  if (accessibility) {
    accessibility = [].concat(accessibility);
    for (const region of accessibility) {
      if (region instanceof GetAccessibilityRegion) {
        checkSettings.accessibilityRegion(region);
      } else {
        checkSettings.accessibilityRegion(new Region(region), region.accessibilityType);
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
  if (matchLevel !== undefined) {
    checkSettings.matchLevel(matchLevel);
  }
  if (accessibilityLevel !== undefined) {
    checkSettings.accessibilityValidation(accessibilityLevel);
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
