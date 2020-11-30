export type ExactMatchSettings = {
  minDiffIntensity: number
  minDiffWidth: number
  minDiffHeight: number
  matchThreshold: number
}

export default class ExactMatchSettingsData implements Required<ExactMatchSettings> {
  private _minDiffIntensity: number
  private _minDiffWidth: number
  private _minDiffHeight: number
  private _matchThreshold: number

  constructor(settings: ExactMatchSettings) {
    this._minDiffIntensity = settings.minDiffIntensity || 0
    this._minDiffWidth = settings.minDiffWidth || 0
    this._minDiffHeight = settings.minDiffHeight || 0
    this._matchThreshold = settings.matchThreshold || 0
  }

  get minDiffIntensity(): number {
    return this._minDiffIntensity
  }
  set minDiffIntensity(value: number) {
    this._minDiffIntensity = value
  }
  getMinDiffIntensity(): number {
    return this._minDiffIntensity
  }
  setMinDiffIntensity(value: number) {
    this._minDiffIntensity = value
  }

  get minDiffWidth(): number {
    return this._minDiffWidth
  }
  set minDiffWidth(value: number) {
    this._minDiffWidth = value
  }
  getMinDiffWidth() {
    return this._minDiffWidth
  }
  setMinDiffWidth(value: number) {
    this._minDiffWidth = value
  }

  get minDiffHeight(): number {
    return this._minDiffHeight
  }
  set minDiffHeight(value: number) {
    this._minDiffHeight = value
  }
  getMinDiffHeight() {
    return this._minDiffHeight
  }
  setMinDiffHeight(value: number) {
    this._minDiffHeight = value
  }

  get matchThreshold(): number {
    return this._matchThreshold
  }
  set matchThreshold(value: number) {
    this._matchThreshold = value
  }
  getMatchThreshold() {
    return this._matchThreshold
  }
  setMatchThreshold(value: number) {
    this._matchThreshold = value
  }
}
