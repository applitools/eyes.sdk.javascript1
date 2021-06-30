import type {Mutable} from '@applitools/utils'
import * as utils from '@applitools/utils'

export type SessionUrls = {
  readonly batch?: string
  readonly session?: string
}

export class SessionUrlsData implements Required<SessionUrls> {
  private _urls: Mutable<SessionUrls> = {} as any

  /** @internal */
  constructor(urls?: SessionUrls) {
    if (!urls) return this
    this._urls = urls instanceof SessionUrlsData ? urls.toJSON() : urls
  }

  get batch(): string {
    return this._urls.batch
  }
  getBatch(): string {
    return this.batch
  }
  /** @deprecated */
  setBatch(batch: string) {
    this._urls.batch = batch
  }

  get session(): string {
    return this._urls.session
  }
  getSession(): string {
    return this.session
  }
  /** @deprecated */
  setSession(session: string) {
    this._urls.session = session
  }

  /** @internal */
  toObject(): SessionUrls {
    return this._urls
  }

  /** @internal */
  toJSON(): SessionUrls {
    return utils.general.toJSON(this._urls)
  }

  /** @internal */
  toString(): string {
    return utils.general.toString(this)
  }
}
