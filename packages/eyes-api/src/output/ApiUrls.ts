import type {Mutable} from '@applitools/utils'
import * as utils from '@applitools/utils'

export type ApiUrls = {
  readonly baselineImage?: string
  readonly currentImage?: string
  readonly checkpointImage?: string
  readonly checkpointImageThumbnail?: string
  readonly diffImage?: string
}

export class ApiUrlsData implements Required<ApiUrls> {
  private _urls: Mutable<ApiUrls> = {} as any

  /** @internal */
  constructor(urls?: ApiUrls) {
    if (!urls) return this
    this._urls = urls instanceof ApiUrlsData ? urls.toJSON() : urls
  }

  get baselineImage(): string {
    return this._urls.baselineImage
  }
  getBaselineImage(): string {
    return this.baselineImage
  }
  /** @deprecated */
  setBaselineImage(setBaselineImage: string) {
    this._urls.baselineImage = setBaselineImage
  }

  get currentImage(): string {
    return this._urls.currentImage
  }
  getCurrentImage(): string {
    return this.currentImage
  }
  /** @deprecated */
  setCurrentImage(currentImage: string) {
    this._urls.currentImage = currentImage
  }

  get checkpointImage(): string {
    return this._urls.checkpointImage
  }
  getCheckpointImage(): string {
    return this.checkpointImage
  }
  /** @deprecated */
  setCheckpointImage(checkpointImage: string) {
    this._urls.checkpointImage = checkpointImage
  }

  get checkpointImageThumbnail(): string {
    return this._urls.checkpointImageThumbnail
  }
  getCheckpointImageThumbnail(): string {
    return this.checkpointImageThumbnail
  }
  /** @deprecated */
  setCheckpointImageThumbnail(checkpointImageThumbnail: string) {
    this._urls.checkpointImageThumbnail = checkpointImageThumbnail
  }

  get diffImage(): string {
    return this._urls.diffImage
  }
  getDiffImage(): string {
    return this.diffImage
  }
  /** @deprecated */
  setDiffImage(diffImage: string) {
    this._urls.diffImage = diffImage
  }

  /** @internal */
  toObject(): ApiUrls {
    return this._urls
  }

  /** @internal */
  toJSON(): ApiUrls {
    return utils.general.toJSON(this._urls)
  }

  /** @internal */
  toString(): string {
    return utils.general.toString(this)
  }
}
