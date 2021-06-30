import type {Mutable} from '@applitools/utils'
import * as utils from '@applitools/utils'
import {RenderingInfo, RenderingInfoData} from './RenderingInfo'

export type RunningSession = {
  readonly id: string
  readonly sessionId: string
  readonly batchId: string
  readonly baselineId: string
  readonly url: string
  readonly isNew: boolean
  readonly renderingInfo: RenderingInfo
}

export class RunningSessionData implements Required<RunningSession> {
  private _session: Mutable<RunningSession> = {} as any

  /** @internal */
  constructor(session: RunningSession) {
    this._session = session instanceof RunningSessionData ? session.toJSON() : session
  }

  get id(): string {
    return this._session.id
  }
  getId(): string {
    return this.id
  }
  setId(id: string) {
    this._session.id = id
  }

  get sessionId(): string {
    return this._session.sessionId
  }
  getSessionId(): string {
    return this.sessionId
  }
  /** @deprecated */
  setSessionId(sessionId: string) {
    this._session.sessionId = sessionId
  }

  get batchId(): string {
    return this._session.batchId
  }
  getBatchId(): string {
    return this.batchId
  }
  /** @deprecated */
  setBatchId(batchId: string) {
    this._session.batchId = batchId
  }

  get baselineId(): string {
    return this._session.baselineId
  }
  getBaselineId(): string {
    return this.baselineId
  }
  /** @deprecated */
  setBaselineId(baselineId: string) {
    this._session.baselineId = baselineId
  }

  get url(): string {
    return this._session.url
  }
  getUrl(): string {
    return this.url
  }
  /** @deprecated */
  setUrl(url: string) {
    this._session.url = url
  }

  get isNew(): boolean {
    return this._session.isNew
  }
  getIsNew(): boolean {
    return this.isNew
  }
  /** @deprecated */
  setIsNew(isNew: boolean) {
    this._session.isNew = isNew
  }

  get renderingInfo(): RenderingInfo {
    return this._session.renderingInfo
  }
  getRenderingInfo(): RenderingInfoData {
    return new RenderingInfoData(this.renderingInfo)
  }
  /** @deprecated */
  setRenderingInfo(renderingInfo: RenderingInfo) {
    this._session.renderingInfo = renderingInfo
  }

  /** @internal */
  toObject(): RunningSession {
    return this._session
  }

  /** @internal */
  toJSON(): RunningSession {
    return utils.general.toJSON(this._session)
  }

  /** @internal */
  toString(): string {
    return utils.general.toString(this)
  }
}
