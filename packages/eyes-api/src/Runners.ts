import * as utils from '@applitools/utils'
import Eyes from './Eyes'

export default class EyesRunner {
  private _eyes: Eyes[] = []

  attach(eyes: Eyes) {
    this._eyes.push(eyes)
  }

  async getAllTestResults(throwErr: boolean): Promise<any> {
    if (this._eyes.length > 0) {
      const results = await Promise.all(
        this._eyes.map(eyes => {
          return eyes.closeBatch().then(() => eyes.close())
        }),
      )

      return results
    }
  }
}

export class VisualGridRunner extends EyesRunner {
  private _legacyConcurrency: number
  private _testConcurrency: number

  constructor(options: {testConcurrency: number})
  /** @deprecated */
  constructor(legacyConcurrency: number)
  constructor(optionsOrLegacyConcurrency: {testConcurrency: number} | number) {
    super()
    if (utils.type.isNumber(optionsOrLegacyConcurrency)) {
      this._legacyConcurrency = optionsOrLegacyConcurrency
    } else {
      this._legacyConcurrency = optionsOrLegacyConcurrency.testConcurrency
    }
  }

  get legacyConcurrency() {
    return this._legacyConcurrency
  }

  get testConcurrency() {
    return this._testConcurrency
  }
}

export class ClassicRunner extends EyesRunner {}
