import * as utils from '@applitools/utils'
import {Region, RegionData} from './Region'

/** @undocumented */
export type FloatingMatchSettings = {
  region: Region
  maxUpOffset?: number
  maxDownOffset?: number
  maxLeftOffset?: number
  maxRightOffset?: number
}

/** @undocumented */
export class FloatingMatchSettingsData implements Required<FloatingMatchSettings> {
  private _settings: FloatingMatchSettings

  constructor(settings: FloatingMatchSettings)
  constructor(region: Region)
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    maxUpOffset?: number,
    maxDownOffset?: number,
    maxLeftOffset?: number,
    maxRightOffset?: number,
  )
  constructor(
    settingsOrRegionOrX: FloatingMatchSettings | Region | number,
    y?: number,
    width?: number,
    height?: number,
    maxUpOffset?: number,
    maxDownOffset?: number,
    maxLeftOffset?: number,
    maxRightOffset?: number,
  ) {
    if (utils.types.isNumber(settingsOrRegionOrX)) {
      return new FloatingMatchSettingsData({
        region: {x: settingsOrRegionOrX, y, width, height},
        maxUpOffset,
        maxDownOffset,
        maxLeftOffset,
        maxRightOffset,
      })
    } else if (!utils.types.has(settingsOrRegionOrX, 'region')) {
      return new FloatingMatchSettingsData({region: settingsOrRegionOrX})
    }
    this.region = settingsOrRegionOrX.region
    this.maxUpOffset = maxUpOffset
    this.maxDownOffset = maxDownOffset
    this.maxLeftOffset = maxLeftOffset
    this.maxRightOffset = maxRightOffset
  }

  get region(): Region {
    return this._settings.region
  }
  set region(region: Region) {
    utils.guard.isObject(region, {name: 'region'})
    this._settings.region = new RegionData(region)
  }
  getRegion(): RegionData {
    return new RegionData(this.region)
  }
  setRegion(region: Region) {
    this.region = region
  }
  getLeft(): number {
    return this.region.x
  }
  setLeft(left: number) {
    this.region.x = left
  }
  getTop(): number {
    return this.region.y
  }
  setTop(top: number) {
    this.region.y = top
  }
  getWidth(): number {
    return this.region.width
  }
  setWidth(width: number) {
    this.region.width = width
  }
  getHeight(): number {
    return this.region.height
  }
  setHeight(height: number) {
    this.region.height = height
  }

  get maxUpOffset(): number {
    return this._settings.maxUpOffset
  }
  set maxUpOffset(maxUpOffset: number) {
    utils.guard.isNumber(maxUpOffset, {name: 'maxUpOffset'})
    this._settings.maxUpOffset = maxUpOffset
  }
  getMaxUpOffset(): number {
    return this.maxUpOffset
  }
  setMaxUpOffset(maxUpOffset: number) {
    this.maxUpOffset = maxUpOffset
  }

  get maxDownOffset(): number {
    return this._settings.maxDownOffset
  }
  set maxDownOffset(maxDownOffset: number) {
    utils.guard.isNumber(maxDownOffset, {name: 'maxDownOffset'})
    this._settings.maxDownOffset = maxDownOffset
  }
  getMaxDownOffset(): number {
    return this.maxDownOffset
  }
  setMaxDownOffset(maxDownOffset: number) {
    this.maxDownOffset = maxDownOffset
  }

  get maxLeftOffset(): number {
    return this._settings.maxLeftOffset
  }
  set maxLeftOffset(maxLeftOffset: number) {
    utils.guard.isNumber(maxLeftOffset, {name: 'maxLeftOffset'})
    this._settings.maxLeftOffset = maxLeftOffset
  }
  getMaxLeftOffset(): number {
    return this.maxLeftOffset
  }
  setMaxLeftOffset(maxLeftOffset: number) {
    this.maxLeftOffset = maxLeftOffset
  }

  get maxRightOffset(): number {
    return this._settings.maxRightOffset
  }
  set maxRightOffset(maxRightOffset: number) {
    utils.guard.isNumber(maxRightOffset, {name: 'maxRightOffset'})
    this._settings.maxRightOffset = maxRightOffset
  }
  getMaxRightOffset(): number {
    return this.maxRightOffset
  }
  setMaxRightOffset(maxRightOffset: number) {
    this.maxRightOffset = maxRightOffset
  }

  /** @internal */
  toObject(): FloatingMatchSettings {
    return this._settings
  }

  /** @internal */
  toJSON(): FloatingMatchSettings {
    return utils.general.toJSON(this._settings)
  }

  /** @internal */
  toString(): string {
    return utils.general.toString(this)
  }
}
