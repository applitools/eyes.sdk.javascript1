import * as utils from '@applitools/utils'

export type AppUrls = {
  step?: string
  stepEditor?: string
}

export default class AppUrlsData implements Required<AppUrls> {
  private _step: string
  private _stepEditor: string

  constructor(appUrls?: AppUrls) {
    if (!appUrls) return this
    this.step = appUrls.step
    this.stepEditor = appUrls.stepEditor
  }

  get step(): string {
    return this._step
  }
  set step(step: string) {
    this._step = step
  }
  getStep(): string {
    return this._step
  }
  setStep(step: string) {
    this.step = step
  }

  get stepEditor(): string {
    return this._stepEditor
  }
  set stepEditor(stepEditor: string) {
    this._stepEditor = stepEditor
  }
  getStepEditor(): string {
    return this._stepEditor
  }
  setStepEditor(stepEditor: string) {
    this.stepEditor = stepEditor
  }

  toJSON(): AppUrls {
    return utils.general.toJSON(this, ['step', 'stepEditor'])
  }

  toString() {
    return utils.general.toString(this)
  }
}
