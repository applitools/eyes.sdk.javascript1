import type {Mutable} from '@applitools/utils'
import * as utils from '@applitools/utils'

export type MatchResult = {
  readonly asExpected?: boolean
  readonly windowId?: number
}

export class MatchResultData implements Required<MatchResult> {
  private _result: Mutable<MatchResult> = {} as any

  /** @internal */
  constructor(result?: MatchResult) {
    if (!result) return this
    this._result = result instanceof MatchResultData ? result.toJSON() : result
  }

  get asExpected(): boolean {
    return this._result.asExpected
  }
  getAsExpected(): boolean {
    return this.asExpected
  }
  /** @deprecated */
  setAsExpected(asExpected: boolean) {
    this._result.asExpected = asExpected
  }

  get windowId(): number {
    return this._result.windowId
  }
  getWindowId(): number {
    return this.windowId
  }
  /** @deprecated */
  setWindowId(windowId: number) {
    this._result.windowId = windowId
  }

  /** @internal */
  toObject(): MatchResult {
    return this._result
  }

  /** @internal */
  toJSON(): MatchResult {
    return utils.general.toJSON(this._result)
  }

  /** @internal */
  toString(): string {
    return utils.general.toString(this)
  }
}
