import * as utils from '@applitools/utils'
import AccessibilityRegionType from '../enums/AccessibilityRegionType'
import RegionData, {Region} from './Region'

export type AccessibilityRegion = {
  region: Region
  type?: AccessibilityRegionType
}

export default class AccessibilityRegionData implements Required<AccessibilityRegion> {
  private _region: RegionData
  private _type: AccessibilityRegionType

  constructor(accessibilityRegion: AccessibilityRegion)
  constructor(x: number, y: number, width: number, height: number, type?: AccessibilityRegionType)
  constructor(
    accessibilityRegionOrX: AccessibilityRegion | number,
    y?: number,
    width?: number,
    height?: number,
    type?: AccessibilityRegionType,
  ) {
    if (utils.type.isNumber(accessibilityRegionOrX)) {
      return new AccessibilityRegionData({region: {x: accessibilityRegionOrX, y, width, height}, type})
    }
    this.region = accessibilityRegionOrX.region
    this.type = accessibilityRegionOrX.type
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

  get type(): AccessibilityRegionType {
    return this._type
  }
  set type(type: AccessibilityRegionType) {
    utils.guard.isEnumValue(type, AccessibilityRegionType, {name: 'type', strict: false})
    this._type = type
  }
  getType(): AccessibilityRegionType {
    return this._type
  }
  setType(type: AccessibilityRegionType) {
    this.type = type
  }
}
