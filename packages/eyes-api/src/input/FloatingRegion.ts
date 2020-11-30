import * as utils from '@applitools/utils'
import RegionData, {Region} from './Region'

export type FloatingRegion = {
  region: Region
  maxUpOffset: number
  maxDownOffset: number
  maxLeftOffset: number
  maxRightOffset: number
}

export default class FloatingRegionData implements Required<FloatingRegion> {
  private _region: RegionData
  private _maxUpOffset: number
  private _maxDownOffset: number
  private _maxLeftOffset: number
  private _maxRightOffset: number

  constructor(floatingRegion: FloatingRegion)
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    maxUpOffset: number,
    maxDownOffset: number,
    maxLeftOffset: number,
    maxRightOffset: number,
  )
  constructor(
    floatingRegionOrX: FloatingRegion | number,
    y?: number,
    width?: number,
    height?: number,
    maxUpOffset?: number,
    maxDownOffset?: number,
    maxLeftOffset?: number,
    maxRightOffset?: number,
  ) {
    if (utils.type.isNumber(floatingRegionOrX)) {
      return new FloatingRegionData({
        region: {x: floatingRegionOrX, y, width, height},
        maxUpOffset,
        maxDownOffset,
        maxLeftOffset,
        maxRightOffset,
      })
    }
    this.region = floatingRegionOrX.region
    this.maxUpOffset = maxUpOffset
    this.maxDownOffset = maxDownOffset
    this.maxLeftOffset = maxLeftOffset
    this.maxRightOffset = maxRightOffset
  }

  get region(): Region {
    return this._region
  }
  set region(region: Region) {
    utils.guard.isObject(region, {name: 'region'})
    this._region = new RegionData(region)
  }
  getRegion(): RegionData {
    return this._region
  }
  setRegion(region: Region | RegionData) {
    this.region = region
  }
  getLeft(): number {
    return this._region.getLeft()
  }
  setLeft(left: number) {
    this._region.setLeft(left)
  }
  retTop(): number {
    return this._region.getTop()
  }
  setTop(top: number) {
    this._region.setTop(top)
  }
  getWidth(): number {
    return this._region.getWidth()
  }
  setWidth(width: number) {
    this._region.setWidth(width)
  }
  getHeight(): number {
    return this._region.getHeight()
  }
  setHeight(height: number) {
    this._region.setHeight(height)
  }

  get maxUpOffset(): number {
    return this._maxUpOffset
  }
  set maxUpOffset(maxUpOffset: number) {
    utils.guard.isNumber(maxUpOffset, {name: 'maxUpOffset'})
    this._maxUpOffset = maxUpOffset
  }
  getMaxUpOffset(): number {
    return this._maxUpOffset
  }
  setMaxUpOffset(maxUpOffset: number) {
    this.maxUpOffset = maxUpOffset
  }

  get maxDownOffset(): number {
    return this._maxDownOffset
  }
  set maxDownOffset(maxDownOffset: number) {
    utils.guard.isNumber(maxDownOffset, {name: 'maxDownOffset'})
    this._maxDownOffset = maxDownOffset
  }
  getMaxDownOffset(): number {
    return this._maxDownOffset
  }
  setMaxDownOffset(maxDownOffset: number) {
    this.maxDownOffset = maxDownOffset
  }

  get maxLeftOffset(): number {
    return this._maxLeftOffset
  }
  set maxLeftOffset(maxLeftOffset: number) {
    utils.guard.isNumber(maxLeftOffset, {name: 'maxLeftOffset'})
    this._maxLeftOffset = maxLeftOffset
  }
  getMaxLeftOffset(): number {
    return this._maxLeftOffset
  }
  setMaxLeftOffset(maxLeftOffset: number) {
    this.maxLeftOffset = maxLeftOffset
  }

  get maxRightOffset(): number {
    return this._maxRightOffset
  }
  set maxRightOffset(maxRightOffset: number) {
    utils.guard.isNumber(maxRightOffset, {name: 'maxRightOffset'})
    this._maxRightOffset = maxRightOffset
  }
  getMaxRightOffset(): number {
    return this._maxRightOffset
  }
  setMaxRightOffset(maxRightOffset: number) {
    this.maxRightOffset = maxRightOffset
  }
}
