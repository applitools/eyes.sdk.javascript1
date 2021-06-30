import type {Driver, Context, Element, Selector} from './spec-driver'
import * as api from '@applitools/eyes-api'
import {UniversalClient} from './universal-client'

const spec = new UniversalClient()

export {Driver, Context, Element, Selector}

export * from '@applitools/eyes-api'

export class Eyes extends api.Eyes<Driver, Element, Selector> {
  protected static readonly _spec = spec
  static setViewportSize: (driver: Driver, viewportSize: api.RectangleSize) => Promise<void>
}

export type ConfigurationPlain = api.ConfigurationPlain<Element, Selector>

export class Configuration extends api.Configuration<Element, Selector> {
  protected static readonly _spec = spec
}

export type OCRRegion = api.OCRRegion<Element, Selector>

export type CheckSettingsPlain = api.CheckSettingsPlain<Element, Selector>

export class CheckSettings extends api.CheckSettings<Element, Selector> {
  protected static readonly _spec = spec
}

export const Target: api.Target<Element, Selector> = CheckSettings as any

export class BatchClose extends api.BatchClose {
  protected static readonly _spec = spec
}
