import type {Mutable} from '@applitools/utils'
import * as utils from '@applitools/utils'

export type RenderingInfo = {
  readonly accessToken: string
  readonly serviceUrl: string
  readonly resultsUrl: string
  readonly stitchingServiceUrl: string
}

export class RenderingInfoData {
  private _info: Mutable<RenderingInfo> = {} as any

  /** @internal */
  constructor(info: RenderingInfo) {
    this._info = info instanceof RenderingInfoData ? info.toJSON() : info
  }

  get accessToken(): string {
    return this._info.accessToken
  }
  getAccessToken(): string {
    return this.accessToken
  }
  getDecodedAccessToken(): {sub: string; exp: number; iss: string} {
    return utils.general.jwtDecode(this._info.accessToken) as {sub: string; exp: number; iss: string}
  }
  /** @deprecated */
  setAccessToken(accessToken: string) {
    this._info.accessToken = accessToken
  }

  get serviceUrl(): string {
    return this._info.serviceUrl
  }
  getServiceUrl(): string {
    return this.serviceUrl
  }
  /** @deprecated */
  setServiceUrl(serviceUrl: string) {
    this._info.serviceUrl = serviceUrl
  }

  get resultsUrl(): string {
    return this._info.resultsUrl
  }
  getResultsUrl(): string {
    return this.resultsUrl
  }
  /** @deprecated */
  setResultsUrl(resultsUrl: string) {
    this._info.resultsUrl = resultsUrl
  }

  get stitchingServiceUrl(): string {
    return this._info.stitchingServiceUrl
  }
  getStitchingServiceUrl(): string {
    return this.stitchingServiceUrl
  }
  /** @deprecated */
  setStitchingServiceUrl(stitchingServiceUrl: string) {
    this._info.stitchingServiceUrl = stitchingServiceUrl
  }

  /** @internal */
  toObject(): RenderingInfo {
    return this._info
  }

  /** @internal */
  toJSON(): RenderingInfo {
    return utils.general.toJSON(this._info)
  }

  /** @internal */
  toString(): string {
    return utils.general.toString(this)
  }
}
