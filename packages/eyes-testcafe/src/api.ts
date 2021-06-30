import {makeSDK} from '@applitools/eyes-sdk-core'
import * as api from '@applitools/eyes-api'
import * as spec from './spec-driver'
import * as legacy from './legacy'
import type {Driver, Element, Selector} from './spec-driver'

process.env.APPLITOOLS_SCRIPT_RESULT_MAX_BYTE_LENGTH = '4718592' // 4.5 MB
process.env.APPLITOOLS_SCRIPT_REMOVE_REVERSE_PROXY_URL_PREFIXES = 'true'

const sdk = makeSDK({
  name: 'eyes.webdriverio',
  version: require('../package.json').version,
  spec,
  VisualGridClient: require('@applitools/visual-grid-client'),
})

export * from '@applitools/eyes-api'

export {TestCafeConfiguration, TestCafeCheckSettings} from './legacy'

export {Driver, Element, Selector}

export class Eyes extends legacy.TestCafeEyes(api.Eyes)<Driver, Element, Selector> {
  protected static readonly _spec = sdk
  static setViewportSize: (driver: Driver, viewportSize: api.RectangleSize) => Promise<void>
}

export type ConfigurationPlain = api.ConfigurationPlain<Element, Selector>

export class Configuration extends api.Configuration<Element, Selector> {
  protected static readonly _spec = sdk
}

export type OCRRegion = api.OCRRegion<Element, Selector>

export type CheckSettingsPlain = api.CheckSettingsPlain<Element, Selector>

export class CheckSettings extends api.CheckSettings<Element, Selector> {
  protected static readonly _spec = sdk
}

export const Target: api.Target<Element, Selector> = CheckSettings as any

export class BatchClose extends api.BatchClose {
  protected static readonly _spec = sdk
}
