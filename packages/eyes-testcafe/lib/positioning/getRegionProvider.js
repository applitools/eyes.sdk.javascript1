'use strict';

/** *********
 * This is a small code-style proof of concept, to stay away from OOP code in favor of more pure functional.
 * The goal is to have code that is easier to reason about - if this function was a method on an Eyes instance, then it wouldn't be clear
 * what state is important for the decision what region provider to use, as well as whether this function mutates the instance in any way
 * or whether this state should be cleared.
 *
 * Next step would be to stay away from the need to define different "Region Providers" and instead just supply a "getRegion" function.
 * So ultimately this would be called "makeGetRegion" and would return a function to get the region.
 *
 * Another code-style outliar here is assigning the function into module.exports, which doesn't create an unnecessary object with the function name
 */

const {
  RegionProvider,
  NullRegionProvider,
} = require('@applitools/eyes-sdk-core');

const { SelectorRegionProvider } = require('./SelectorRegionProvider');

/**
 * @param {TestCafeCheckSettings} checkSettings
 * @return {RegionProvider}
 */
function getRegionProvider({ checkSettings, t }) {
  const targetRegion = checkSettings.getTargetRegion();
  const targetSelector = checkSettings.getTargetSelector();

  let regionProvider;
  if (targetRegion) {
    regionProvider = new RegionProvider(targetRegion);
  } else if (targetSelector) {
    regionProvider = new SelectorRegionProvider({ selector: targetSelector, t });
  } else {
    regionProvider = new NullRegionProvider();
  }

  return regionProvider;
}

module.exports = getRegionProvider; // eslint-disable-line node/exports-style
