import * as utils from '@applitools/utils'

export type MatchResult = {
  asExpected?: boolean
  windowId?: number
}

export default class MatchResultData implements Required<MatchResult> {
  private _asExpected: boolean
  private _windowId: number

  constructor(result?: MatchResult) {
    if (!result) return this
    this.asExpected = result.asExpected
    this.windowId = result.windowId
  }

  get asExpected(): boolean {
    return this._asExpected
  }
  set asExpected(asExpected: boolean) {
    utils.guard.isBoolean(asExpected, {name: 'asExpected'})
    this._asExpected = asExpected
  }
  getAsExpected(): boolean {
    return this._asExpected
  }
  setAsExpected(asExpected: boolean) {
    this.asExpected = asExpected
  }

  get windowId(): number {
    return this._windowId
  }
  set windowId(windowId: number) {
    utils.guard.isNumber(windowId, {name: 'windowId'})
    this._windowId = windowId
  }
  getWindowId(): number {
    return this._windowId
  }
  setWindowId(windowId: number) {
    this.windowId = windowId
  }

  toJSON(): MatchResult {
    return utils.general.toJSON(this, ['asExpected', 'windowId'])
  }

  toString() {
    return utils.general.toString(this)
  }
}
