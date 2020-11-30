import * as utils from '@applitools/utils'

export type RectangleSize = {
  width: number
  height: number
}

export default class RectangleSizeData implements Required<RectangleSize> {
  private _width: number
  private _height: number

  constructor(size: RectangleSize)
  constructor(width: number, height: number)
  constructor(sizeOrWidth: RectangleSize | number, height?: number) {
    if (utils.type.isNumber(sizeOrWidth)) {
      return new RectangleSizeData({width: sizeOrWidth, height})
    }
    const size = sizeOrWidth
    this.width = size.width
    this.height = size.height
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
