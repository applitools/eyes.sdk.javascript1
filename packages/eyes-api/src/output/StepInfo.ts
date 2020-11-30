import * as utils from '@applitools/utils'
import AppUrlsData, {AppUrls} from './AppUrls'
import ApiUrlsData, {ApiUrls} from './ApiUrls'

export type StepInfo = {
  name?: string
  isDifferent?: boolean
  hasBaselineImage?: boolean
  hasCurrentImage?: boolean
  appUrls?: AppUrls
  apiUrls?: ApiUrls
  renderId?: string[]
}

export default class StepInfoData implements Required<StepInfo> {
  private _name: string
  private _isDifferent: boolean
  private _hasBaselineImage: boolean
  private _hasCurrentImage: boolean
  private _appUrls: AppUrlsData
  private _apiUrls: ApiUrlsData
  private _renderId: string[]

  constructor(stepInfo?: StepInfo) {
    if (!stepInfo) return this
    const self = this as any
    for (const [key, value] of Object.entries(stepInfo)) {
      if (key in this && !key.startsWith('_')) {
        self[key] = value
      }
    }
  }

  get name(): string {
    return this._name
  }
  set name(value: string) {
    this._name = value
  }
  getName(): string {
    return this._name
  }
  setName(value: string) {
    this.name = value
  }

  get isDifferent(): boolean {
    return this._isDifferent
  }
  set isDifferent(value: boolean) {
    this._isDifferent = value
  }
  getIsDifferent(): boolean {
    return this._isDifferent
  }
  setIsDifferent(value: boolean) {
    this.isDifferent = value
  }

  get hasBaselineImage(): boolean {
    return this._hasBaselineImage
  }
  set hasBaselineImage(value: boolean) {
    this._hasBaselineImage = value
  }
  getHasBaselineImage(): boolean {
    return this._hasBaselineImage
  }
  setHasBaselineImage(value: boolean) {
    this.hasBaselineImage = value
  }

  get hasCurrentImage(): boolean {
    return this._hasCurrentImage
  }
  set hasCurrentImage(hasCurrentImage: boolean) {
    this._hasCurrentImage = hasCurrentImage
  }
  getHasCurrentImage(): boolean {
    return this._hasCurrentImage
  }
  setHasCurrentImage(hasCurrentImage: boolean) {
    this.hasCurrentImage = hasCurrentImage
  }

  get appUrls(): AppUrls {
    return this._appUrls
  }
  set appUrls(appUrls: AppUrls) {
    this._appUrls = new AppUrlsData(appUrls)
  }
  getAppUrls(): AppUrlsData {
    return this._appUrls
  }
  setAppUrls(appUrls: AppUrls | AppUrlsData) {
    this.appUrls = appUrls
  }

  get apiUrls(): ApiUrls {
    return this._apiUrls
  }
  set apiUrls(apiUrls: ApiUrls) {
    this._apiUrls = new ApiUrlsData(apiUrls)
  }
  getApiUrls(): ApiUrlsData {
    return this._apiUrls
  }
  setApiUrls(apiUrls: ApiUrls | ApiUrlsData) {
    this.apiUrls = apiUrls
  }

  get renderId(): string[] {
    return this._renderId
  }
  set renderId(renderId: string[]) {
    this._renderId = renderId
  }
  getRenderId(): string[] {
    return this._renderId
  }
  setRenderId(renderId: string[]) {
    this.renderId = renderId
  }

  toJSON(): StepInfo {
    return utils.general.toJSON(this, [
      'name',
      'isDifferent',
      'hasBaselineImage',
      'hasCurrentImage',
      'appUrls',
      'apiUrls',
      'renderId',
    ])
  }

  toString() {
    return utils.general.toString(this)
  }
}
