'use strict'
const TypeUtils = require('../utils/TypeUtils')

/**
 * @typedef ElementAndIds
 * @prop {EyesElement[]} elements
 * @prop {String[]} elementIds
 */

/**
 * @param {Object} object
 * @param {CheckSettings<TElement, TSelector>} object.checkSettings
 * @param {EyesContext<TElement, TSelector>} context
 * @returns {Promise<ElementAndIds>} all element ID's to be marked in the DOM
 */
async function resolveAllRegionElements({checkSettings, context}) {
  const targetArr = checkSettings.getTargetProvider() ? [checkSettings.getTargetProvider()] : []
  return {
    ...(await resolveElements(checkSettings.getIgnoreRegions())),
    ...(await resolveElements(checkSettings.getFloatingRegions())),
    ...(await resolveElements(checkSettings.getStrictRegions())),
    ...(await resolveElements(checkSettings.getLayoutRegions())),
    ...(await resolveElements(checkSettings.getContentRegions())),
    ...(await resolveElements(checkSettings.getAccessibilityRegions())),
    ...(await resolveElements(targetArr)),
  }

  async function resolveElements(regions) {
    const elementsById = {}
    for (const region of regions) {
      const regionElementsById = await region.resolveElements(context)
      Object.assign(elementsById, regionElementsById)
    }
    return elementsById
  }
}

function toCheckWindowConfiguration({checkSettings, configuration}) {
  const config = {
    ignore: persistRegions(checkSettings.getIgnoreRegions()),
    floating: persistRegions(checkSettings.getFloatingRegions()),
    strict: persistRegions(checkSettings.getStrictRegions()),
    layout: persistRegions(checkSettings.getLayoutRegions()),
    content: persistRegions(checkSettings.getContentRegions()),
    accessibility: persistRegions(checkSettings.getAccessibilityRegions()),
    target: !checkSettings._targetRegion && !checkSettings._targetElement ? 'window' : 'region',
    fully: configuration.getForceFullPageScreenshot() || checkSettings.getStitchContent(),
    tag: checkSettings.getName(),
    scriptHooks: checkSettings.getScriptHooks(),
    sendDom: configuration.getSendDom() || checkSettings.getSendDom(), // this is wrong, but kept for backwards compatibility,
    ignoreDisplacements: checkSettings.getIgnoreDisplacements(),
    matchLevel: TypeUtils.getOrDefault(
      checkSettings.getMatchLevel(),
      configuration.getMatchLevel(),
    ),
    visualGridOptions: TypeUtils.getOrDefault(
      checkSettings.getVisualGridOptions(),
      configuration.getVisualGridOptions(),
    ),
  }

  if (config.target === 'region') {
    const type = checkSettings._targetRegion ? 'region' : 'selector'
    config[type] = checkSettings.getTargetProvider().toPersistedRegions()[0]
  }

  return config

  function persistRegions(regions = []) {
    return regions.reduce((persisted, region) => persisted.concat(region.toPersistedRegions()), [])
  }
}

module.exports = {
  resolveAllRegionElements,
  toCheckWindowConfiguration,
}
