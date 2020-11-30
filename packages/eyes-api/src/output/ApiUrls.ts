import * as utils from '@applitools/utils'

export type ApiUrls = {
  baselineImage?: string
  currentImage?: string
  checkpointImage?: string
  checkpointImageThumbnail?: string
  diffImage?: string
}

export default class ApiUrlsData implements Required<ApiUrls> {
  private _baselineImage: string
  private _currentImage: string
  private _checkpointImage: string
  private _checkpointImageThumbnail: string
  private _diffImage: string

  constructor(appUrls?: ApiUrls) {
    if (appUrls) return this
    this.baselineImage = appUrls.baselineImage
    this.currentImage = appUrls.currentImage
    this.checkpointImage = appUrls.checkpointImage
    this.checkpointImageThumbnail = appUrls.checkpointImageThumbnail
    this.diffImage = appUrls.diffImage
  }

  get baselineImage(): string {
    return this._baselineImage
  }
  set baselineImage(value: string) {
    this._baselineImage = value
  }
  getBaselineImage(): string {
    return this._baselineImage
  }
  setBaselineImage(value: string) {
    this._baselineImage = value
  }

  get currentImage(): string {
    return this._currentImage
  }
  set currentImage(currentImage: string) {
    this._currentImage = currentImage
  }
  getCurrentImage(): string {
    return this._currentImage
  }
  setCurrentImage(currentImage: string) {
    this._currentImage = currentImage
  }

  get checkpointImage(): string {
    return this._checkpointImage
  }
  set checkpointImage(checkpointImage: string) {
    this._checkpointImage = checkpointImage
  }
  getCheckpointImage(): string {
    return this._checkpointImage
  }
  setCheckpointImage(checkpointImage: string) {
    this._checkpointImage = checkpointImage
  }

  get checkpointImageThumbnail(): string {
    return this._checkpointImageThumbnail
  }
  set checkpointImageThumbnail(checkpointImageThumbnail: string) {
    this._checkpointImageThumbnail = checkpointImageThumbnail
  }
  getCheckpointImageThumbnail(): string {
    return this._checkpointImageThumbnail
  }
  setCheckpointImageThumbnail(checkpointImageThumbnail: string) {
    this.checkpointImageThumbnail = checkpointImageThumbnail
  }

  get diffImage(): string {
    return this._diffImage
  }
  set diffImage(diffImage: string) {
    this._diffImage = diffImage
  }
  getDiffImage(): string {
    return this._diffImage
  }
  setDiffImage(diffImage: string) {
    this.diffImage = diffImage
  }

  toJSON(): ApiUrls {
    return utils.general.toJSON(this, [
      'baselineImage',
      'currentImage',
      'checkpointImage',
      'checkpointImageThumbnail',
      'diffImage',
    ])
  }

  toString() {
    return utils.general.toString(this)
  }
}
