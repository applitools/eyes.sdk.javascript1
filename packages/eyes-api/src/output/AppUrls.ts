import type {Mutable} from '@applitools/utils'
import * as utils from '@applitools/utils'

export type AppUrls = {
  readonly step?: string
  readonly stepEditor?: string
}

export class AppUrlsData implements Required<AppUrls> {
  private _urls: Mutable<AppUrls> = {} as any

  /** @internal */
  constructor(urls?: AppUrls) {
    if (!urls) return this
    this._urls = urls instanceof AppUrlsData ? urls.toJSON() : urls
  }

  get step(): string {
    return this._urls.step
  }
  getStep(): string {
    return this.step
  }
  /** @deprecated */
  setStep(step: string) {
    this._urls.step = step
  }

  get stepEditor(): string {
    return this._urls.stepEditor
  }
  getStepEditor(): string {
    return this.stepEditor
  }
  /** @deprecated */
  setStepEditor(stepEditor: string) {
    this._urls.stepEditor = stepEditor
  }

  /** @internal */
  toObject(): AppUrls {
    return this._urls
  }

  /** @internal */
  toJSON(): AppUrls {
    return utils.general.toJSON(this._urls)
  }

  /** @internal */
  toString(): string {
    return utils.general.toString(this)
  }
}
