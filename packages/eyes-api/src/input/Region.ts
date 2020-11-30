import * as utils from '@applitools/utils'
import {Location} from './Location'
import {RectangleSize} from './RectangleSize'

type Offset = {
  left: number
  top: number
}

export type Region = (Location | Offset) & RectangleSize

export default class RegionData implements Required<Offset & Location & RectangleSize> {
  private _x: number
  private _y: number
  private _width: number
  private _height: number

  constructor(region: Region)
  constructor(location: Location | Offset, size: RectangleSize)
  constructor(x: number, y: number, width: number, height: number)
  constructor(
    regionOrLocationOrX: Region | Location | Offset | number,
    sizeOrY?: RectangleSize | number,
    width?: number,
    height?: number,
  ) {
    if (utils.type.isNumber(regionOrLocationOrX)) {
      const x: number = regionOrLocationOrX
      const y = sizeOrY as number
      return new RegionData({x, y, width, height})
    } else if (!utils.type.has(regionOrLocationOrX, 'width')) {
      const {x, y} = utils.type.has(regionOrLocationOrX, 'left')
        ? {x: regionOrLocationOrX.left, y: regionOrLocationOrX.top}
        : regionOrLocationOrX
      const {width, height} = sizeOrY as RectangleSize
      return new RegionData({x, y, width, height})
    }
    const region = regionOrLocationOrX
    if (utils.type.has(region, 'x')) {
      this.x = region.x
      this.y = region.y
    } else {
      this.x = region.left
      this.y = region.top
    }
    this.width = region.width
    this.height = region.height
  }

  get x(): number {
    return this._x
  }
  set x(x: number) {
    utils.guard.isNumber(x, {name: 'x'})
    this._x = x
  }
  getX(): number {
    return this._x
  }
  setX(x: number) {
    this.x = x
  }

  get y(): number {
    return this._y
  }
  set y(y: number) {
    utils.guard.isNumber(y, {name: 'y'})
    this._y = y
  }
  getY(): number {
    return this._y
  }
  setY(y: number) {
    this.y = y
  }

  get left(): number {
    return this.x
  }
  set left(left: number) {
    this.x = left
  }
  getLeft(): number {
    return this.x
  }
  setLeft(left: number) {
    this.x = left
  }

  get top(): number {
    return this.y
  }
  set top(top: number) {
    this.y = top
  }
  getTop(): number {
    return this.y
  }
  setTop(top: number) {
    this.y = top
  }

  get width(): number {
    return this._width
  }
  set width(width: number) {
    utils.guard.isNumber(width, {name: 'width', gte: 0})
    this._width = width
  }
  getWidth() {
    return this._width
  }
  setWidth(width: number) {
    this.width = width
  }

  get height(): number {
    return this._height
  }
  set height(height: number) {
    utils.guard.isNumber(height, {name: 'height', gte: 0})
    this._height = height
  }
  getHeight() {
    return this._height
  }
  setHeight(height: number) {
    this.height = height
  }
}
