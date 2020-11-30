import * as utils from '@applitools/utils'

export type Location = {
  x: number
  y: number
}

export default class LocationData implements Required<Location> {
  private _x: number
  private _y: number

  constructor(location: Location)
  constructor(x: number, y: number)
  constructor(locationOrX: Location | number, y?: number) {
    if (utils.type.isNumber(locationOrX)) {
      return new LocationData({x: locationOrX, y})
    }
    this.x = locationOrX.x
    this.y = locationOrX.y
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
}
