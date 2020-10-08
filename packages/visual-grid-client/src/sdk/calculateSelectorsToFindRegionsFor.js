'use strict'

function calculateSelectorsToFindRegionsFor({
  sizeMode,
  selector,
  noOffsetSelectors,
  offsetSelectors,
}) {
  let selectorsToFindRegionsFor = sizeMode === 'selector' ? [selector] : undefined
  if (noOffsetSelectors.every(s => !s) && offsetSelectors.every(s => !s)) {
    return selectorsToFindRegionsFor
  }

  const noOffsetCombined = noOffsetSelectors.reduce(
    (combined, arr) => combined.concat(arr || []),
    [],
  )
  const offsetCombined = offsetSelectors.reduce((combined, arr) => combined.concat(arr || []), [])
  const selectors = noOffsetCombined
    .concat(offsetCombined)
    .filter(region => region.selector)
    .map(({type, selector}) => (type === 'xpath' || type === 'css' ? {type, selector} : selector))

  // NOTE: in rare cases there might be duplicates here. Intentionally not removing them because later we map `selectorsToFindRegionsFor` to `selectorRegions`.
  return (selectorsToFindRegionsFor || []).concat(selectors)
}

module.exports = calculateSelectorsToFindRegionsFor
