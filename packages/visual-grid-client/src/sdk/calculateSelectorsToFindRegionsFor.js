'use strict'

function selectorObject({selector, type}) {
  return type === 'xpath' || type === 'css' ? {type, selector} : selector
}

function calculateSelectorsToFindRegionsFor({
  sizeMode,
  selector,
  ignore,
  layout,
  strict,
  content,
  accessibility,
  floating,
}) {
  let selectorsToFindRegionsFor = sizeMode === 'selector' ? [selector] : undefined
  const userRegions = Object.entries({
    ignore,
    layout,
    strict,
    content,
    accessibility,
    floating,
  }).reduce((entries, [name, regions]) => {
    if (regions) {
      entries.set(name, Array.isArray(regions) ? regions : [regions])
    }
    return entries
  }, new Map())

  if (userRegions.size === 0) {
    return {selectorsToFindRegionsFor, getMatchRegions}
  }

  const selectors = Array.from(userRegions.values()).reduce((prev, regions) => {
    prev.push(...regions.filter(region => region.selector).map(selectorObject))
    return prev
  }, [])

  // NOTE: in rare cases there might be duplicates here. Intentionally not removing them because later we map `selectorsToFindRegionsFor` to `selectorRegions`.
  return {
    selectorsToFindRegionsFor: (selectorsToFindRegionsFor || []).concat(selectors),
    getMatchRegions,
  }

  function getMatchRegions({selectorRegions}) {
    const imageLocationRegion = sizeMode === 'selector' ? selectorRegions[0][0] : undefined
    let selectorRegionIndex = imageLocationRegion ? 1 : 0
    return Array.from(userRegions.entries()).reduce(
      (allRegions, [regionName, userInput]) => {
        const regionValues = userInput.reduce((regions, userRegion) => {
          const codedRegions = userRegion.selector
            ? selectorRegions[selectorRegionIndex++]
            : [userRegion]

          if (codedRegions && codedRegions.length > 0) {
            codedRegions.forEach(region => {
              const regionObject = regionify({region, imageLocationRegion})
              regions.push(regionWithUserInput({regionObject, userRegion, regionName}))
            })
          }

          return regions
        }, [])
        allRegions[regionName] = regionValues
        return allRegions
      },
      {imageLocationRegion},
    )
  }
}

function regionify({region, imageLocationRegion}) {
  if (imageLocationRegion && region['getWidth']) {
    return {
      width: region.getWidth(),
      height: region.getHeight(),
      left: Math.max(0, region.getLeft() - imageLocationRegion.getLeft()),
      top: Math.max(0, region.getTop() - imageLocationRegion.getTop()),
    }
  } else {
    return region['toJSON'] ? region.toJSON() : region
  }
}

function regionWithUserInput({regionObject, userRegion, regionName}) {
  // accesibility regions
  if (regionName === 'accessibility') {
    Object.assign(regionObject, {
      accessibilityType: userRegion.accessibilityType,
    })
  }
  // floating region
  if (regionName === 'floating') {
    Object.assign(regionObject, {
      maxUpOffset: userRegion.maxUpOffset,
      maxDownOffset: userRegion.maxDownOffset,
      maxLeftOffset: userRegion.maxLeftOffset,
      maxRightOffset: userRegion.maxRightOffset,
    })
  }

  return regionObject
}

module.exports = calculateSelectorsToFindRegionsFor
