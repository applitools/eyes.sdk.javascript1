'use strict';

function calculateMatchRegions({
  noOffsetSelectors,
  offsetSelectors,
  selectorRegions,
  imageLocationRegion,
}) {
  let selectorRegionIndex = imageLocationRegion ? 1 : 0;
  const noOffsetRegions = noOffsetSelectors.map(selection =>
    mapSelectionToRegions(selection, false),
  );
  const offsetRegions = offsetSelectors.map(selection => mapSelectionToRegions(selection, true));

  return {
    noOffsetRegions,
    offsetRegions,
  };

  function mapSelectionToRegions(selection, addOffset) {
    if (selection) {
      const regionObjects = Array.isArray(selection) ? selection : [selection];

      let region;
      const regions = [];
      for (const regionObj of regionObjects) {
        region = selectorObjToRegion(regionObj, addOffset);
        if (region) {
          regions.push(region);
        }
      }
      return regions.length === 0 ? undefined : regions;
    }

    return selection;
  }

  function selectorObjToRegion(selectorObj, addOffset) {
    if (selectorObj.selector) {
      const selectorRegion = selectorRegions[selectorRegionIndex++];
      if (selectorRegion.getError()) {
        return null;
      }

      let ret = imageLocationRegion
        ? {
            width: selectorRegion.getWidth(),
            height: selectorRegion.getHeight(),
            left: Math.max(0, selectorRegion.getLeft() - imageLocationRegion.getLeft()),
            top: Math.max(0, selectorRegion.getTop() - imageLocationRegion.getTop()),
          }
        : selectorRegion.toJSON();

      if (addOffset) {
        ret = Object.assign(ret, {
          maxUpOffset: selectorObj.maxUpOffset,
          maxDownOffset: selectorObj.maxDownOffset,
          maxLeftOffset: selectorObj.maxLeftOffset,
          maxRightOffset: selectorObj.maxRightOffset,
        });
      }
      if (selectorObj.accessibilityType) {
        ret.accessibilityType = selectorObj.accessibilityType;
      }

      return ret;
    } else {
      return selectorObj;
    }
  }
}

module.exports = calculateMatchRegions;
