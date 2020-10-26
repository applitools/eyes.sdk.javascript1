'use strict'
const CoordinatesTypes = require('../geometry/CoordinatesType')
const GeneralUtils = require('../utils/GeneralUtils')

/**
 * @internal
 * @template TSelector
 */
class FluentRegion {
  /**
   * @param {TSelector} selector
   */
  constructor({region, element, selector, options}) {
    this._region = region
    this._element = element
    this._selector = selector

    this._options = options
  }

  async getRegion(context, screenshot) {
    if (this._region) {
      return [
        {
          left: Math.round(this._region.getLeft()),
          top: Math.round(this._region.getTop()),
          width: Math.round(this._region.getWidth()),
          height: Math.round(this._region.getHeight()),
          ...this._options,
        },
      ]
    }

    const elementsById = await this.resolveElements(context)
    const elements = Object.values(elementsById)

    const regions = []
    for (const element of elements) {
      const rect = await element.getRect()
      const location = screenshot.convertLocation(
        rect.getLocation(),
        CoordinatesTypes.CONTEXT_RELATIVE,
        CoordinatesTypes.SCREENSHOT_AS_IS,
      )
      regions.push({
        left: Math.round(location.getX()),
        top: Math.round(location.getY()),
        width: Math.round(rect.getWidth()),
        height: Math.round(rect.getHeight()),
        ...this._options,
      })
    }
    return regions
  }

  async resolveElements(context) {
    let elements = []
    if (this._selector) {
      elements = await context.elements(this._selector)
    } else if (this._element) {
      elements = [await context.element(this._element)]
    }

    this._elementsById = elements.reduce(
      (elementsById, el) => Object.assign(elementsById, {[GeneralUtils.guid()]: el}),
      {},
    )
    return this._elementsById
  }

  toPersistedRegions() {
    if (this._region) {
      return [
        {
          left: Math.round(this._region.getLeft()),
          top: Math.round(this._region.getTop()),
          width: Math.round(this._region.getWidth()),
          height: Math.round(this._region.getHeight()),
          ...this._options,
        },
      ]
    } else {
      return Object.keys(this._elementsById).map(elementId => ({
        ...this._options,
        type: 'css',
        selector: `[data-applitools-marker~="${elementId}"]`,
      }))
    }
  }
}

module.exports = FluentRegion
