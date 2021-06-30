import type {Mutable} from '@applitools/utils'
import * as utils from '@applitools/utils'
import {AppUrls, AppUrlsData} from './AppUrls'
import {ApiUrls, ApiUrlsData} from './ApiUrls'

export type StepInfo = {
  readonly name?: string
  readonly isDifferent?: boolean
  readonly hasBaselineImage?: boolean
  readonly hasCurrentImage?: boolean
  readonly appUrls?: AppUrls
  readonly apiUrls?: ApiUrls
  readonly renderId?: string[]
}

export class StepInfoData implements Required<StepInfo> {
  private _info: Mutable<StepInfo> = {} as any

  /** @internal */
  constructor(info?: StepInfo) {
    if (!info) return this
    this._info = info instanceof StepInfoData ? info.toJSON() : info
  }

  get name(): string {
    return this._info.name
  }
  getName(): string {
    return this.name
  }
  /** @deprecated */
  setName(value: string) {
    this._info.name = value
  }

  get isDifferent(): boolean {
    return this._info.isDifferent
  }
  getIsDifferent(): boolean {
    return this.isDifferent
  }
  /** @deprecated */
  setIsDifferent(value: boolean) {
    this._info.isDifferent = value
  }

  get hasBaselineImage(): boolean {
    return this._info.hasBaselineImage
  }
  getHasBaselineImage(): boolean {
    return this.hasBaselineImage
  }
  /** @deprecated */
  setHasBaselineImage(value: boolean) {
    this._info.hasBaselineImage = value
  }

  get hasCurrentImage(): boolean {
    return this._info.hasCurrentImage
  }
  getHasCurrentImage(): boolean {
    return this.hasCurrentImage
  }
  /** @deprecated */
  setHasCurrentImage(hasCurrentImage: boolean) {
    this._info.hasCurrentImage = hasCurrentImage
  }

  get appUrls(): AppUrls {
    return this._info.appUrls
  }
  getAppUrls(): AppUrlsData {
    return new AppUrlsData(this.appUrls)
  }
  /** @deprecated */
  setAppUrls(appUrls: AppUrls) {
    this._info.appUrls = appUrls
  }

  get apiUrls(): ApiUrls {
    return this._info.apiUrls
  }
  getApiUrls(): ApiUrlsData {
    return new ApiUrlsData(this.apiUrls)
  }
  /** @deprecated */
  setApiUrls(apiUrls: ApiUrls) {
    this._info.apiUrls = apiUrls
  }

  get renderId(): string[] {
    return this._info.renderId
  }
  getRenderId(): string[] {
    return this.renderId
  }
  /** @deprecated */
  setRenderId(renderId: string[]) {
    this._info.renderId = renderId
  }

  /** @internal */
  toObject(): StepInfo {
    return this._info
  }

  /** @internal */
  toJSON(): StepInfo {
    return utils.general.toJSON(this._info)
  }

  /** @internal */
  toString(): string {
    return utils.general.toString(this)
  }
}
