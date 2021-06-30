import * as utils from '@applitools/utils'
import {MatchLevel, MatchLevelEnum} from '../enums/MatchLevel'
import {AccessibilityLevelEnum} from '../enums/AccessibilityLevel'
import {AccessibilityGuidelinesVersionEnum} from '../enums/AccessibilityGuidelinesVersion'
import {ExactMatchSettings, ExactMatchSettingsData} from './ExactMatchSettings'
import {FloatingMatchSettings, FloatingMatchSettingsData} from './FloatingMatchSettings'
import {AccessibilityMatchSettings, AccessibilityMatchSettingsData} from './AccessibilityMatchSettings'
import {Region, RegionData} from './Region'
import {AccessibilitySettings} from './AccessibilitySettings'

/** @undocumented */
export type ImageMatchSettings = {
  exact?: ExactMatchSettings
  matchLevel?: MatchLevel
  ignoreCaret?: boolean
  useDom?: boolean
  enablePatterns?: boolean
  ignoreDisplacements?: boolean
  ignoreRegions?: Region[]
  layoutRegions?: Region[]
  strictRegions?: Region[]
  contentRegions?: Region[]
  floatingRegions?: (Region | FloatingMatchSettings)[]
  accessibilityRegions?: (Region | AccessibilityMatchSettings)[]
  accessibilitySettings?: AccessibilitySettings
}

/** @undocumented */
export class ImageMatchSettingsData implements Required<ImageMatchSettings> {
  private _settings: ImageMatchSettings = {}

  constructor(settings?: ImageMatchSettings) {
    if (!settings) return this
    if (settings instanceof ImageMatchSettingsData) settings = settings.toJSON()

    for (const [key, value] of Object.entries(settings)) {
      ;(this as any)[key] = value
    }
  }

  get exact(): ExactMatchSettings {
    return this._settings.exact
  }
  set exact(exact: ExactMatchSettings) {
    this._settings.exact = exact
  }
  getExact(): ExactMatchSettingsData {
    return new ExactMatchSettingsData(this.exact)
  }
  setExact(exact: ExactMatchSettings) {
    this.exact = exact
  }

  get matchLevel(): MatchLevel {
    return this._settings.matchLevel
  }
  set matchLevel(matchLevel: MatchLevel) {
    utils.guard.isEnumValue(matchLevel, MatchLevelEnum, {name: 'matchLevel'})
    this._settings.matchLevel = matchLevel
  }
  getMatchLevel(): MatchLevelEnum {
    return this.matchLevel as MatchLevelEnum
  }
  setMatchLevel(matchLevel: MatchLevelEnum) {
    this.matchLevel = matchLevel
  }

  get ignoreCaret(): boolean {
    return this._settings.ignoreCaret
  }
  set ignoreCaret(ignoreCaret: boolean) {
    utils.guard.isBoolean(ignoreCaret, {name: 'ignoreCaret', strict: false})
    this._settings.ignoreCaret = ignoreCaret
  }
  getIgnoreCaret(): boolean {
    return this.ignoreCaret
  }
  setIgnoreCaret(ignoreCaret: boolean) {
    this.ignoreCaret = ignoreCaret
  }

  get useDom(): boolean {
    return this._settings.useDom
  }
  set useDom(useDom: boolean) {
    utils.guard.isBoolean(useDom, {name: 'useDom', strict: false})
    this._settings.useDom = useDom
  }
  getUseDom(): boolean {
    return this.useDom
  }
  setUseDom(useDom: boolean) {
    this.useDom = useDom
  }

  get enablePatterns(): boolean {
    return this._settings.enablePatterns
  }
  set enablePatterns(enablePatterns: boolean) {
    utils.guard.isBoolean(enablePatterns, {name: 'enablePatterns', strict: false})
    this._settings.enablePatterns = enablePatterns
  }
  getEnablePatterns(): boolean {
    return this.enablePatterns
  }
  setEnablePatterns(enablePatterns: boolean) {
    this.enablePatterns = enablePatterns
  }

  get ignoreDisplacements(): boolean {
    return this._settings.ignoreDisplacements
  }
  set ignoreDisplacements(ignoreDisplacements: boolean) {
    utils.guard.isBoolean(ignoreDisplacements, {name: 'ignoreDisplacements', strict: false})
    this._settings.ignoreDisplacements = ignoreDisplacements
  }
  getIgnoreDisplacements(): boolean {
    return this.ignoreDisplacements
  }
  setIgnoreDisplacements(ignoreDisplacements: boolean) {
    this.ignoreDisplacements = ignoreDisplacements
  }

  get ignoreRegions(): Region[] {
    return this._settings.ignoreRegions
  }
  set ignoreRegions(ignoreRegions: Region[]) {
    utils.guard.isArray(ignoreRegions, {name: 'ignoreRegions', strict: false})
    this._settings.ignoreRegions = ignoreRegions ?? []
  }
  getIgnoreRegions(): RegionData[] {
    return this.ignoreRegions?.map(region => new RegionData(region)) ?? []
  }
  setIgnoreRegions(ignoreRegions: Region[]) {
    this.ignoreRegions = ignoreRegions
  }

  get layoutRegions(): Region[] {
    return this._settings.layoutRegions
  }
  set layoutRegions(layoutRegions: Region[]) {
    utils.guard.isArray(layoutRegions, {name: 'layoutRegions', strict: false})
    this._settings.layoutRegions = layoutRegions ?? []
  }
  get layout(): Region[] {
    return this.layoutRegions
  }
  set layout(layoutRegions: Region[]) {
    this.layoutRegions = layoutRegions
  }
  getLayoutRegions(): RegionData[] {
    return this.layoutRegions?.map(region => new RegionData(region)) ?? []
  }
  setLayoutRegions(layoutRegions: Region[]) {
    this.layoutRegions = layoutRegions
  }

  get strictRegions(): Region[] {
    return this._settings.strictRegions
  }
  set strictRegions(strictRegions: Region[]) {
    utils.guard.isArray(strictRegions, {name: 'strictRegions', strict: false})
    this._settings.strictRegions = strictRegions ?? []
  }
  get strict(): Region[] {
    return this.strictRegions
  }
  set strict(strictRegions: Region[]) {
    this.strictRegions = strictRegions
  }
  getStrictRegions(): RegionData[] {
    return this.strictRegions?.map(region => new RegionData(region)) ?? []
  }
  setStrictRegions(strictRegions: Region[]) {
    this.strictRegions = strictRegions
  }

  get contentRegions(): Region[] {
    return this._settings.contentRegions
  }
  set contentRegions(contentRegions: Region[]) {
    utils.guard.isArray(contentRegions, {name: 'contentRegions', strict: false})
    this._settings.contentRegions = contentRegions ?? []
  }
  get content(): Region[] {
    return this.contentRegions
  }
  set content(contentRegions: Region[]) {
    this.contentRegions = contentRegions
  }
  getContentRegions(): RegionData[] {
    return this.contentRegions?.map(region => new RegionData(region)) ?? []
  }
  setContentRegions(contentRegions: Region[]) {
    this.contentRegions = contentRegions
  }

  get floatingRegions(): (Region | FloatingMatchSettings)[] {
    return this._settings.floatingRegions
  }
  set floatingRegions(floatingRegions: (Region | FloatingMatchSettings)[]) {
    utils.guard.isArray(floatingRegions, {name: 'floatingRegions', strict: false})
    this._settings.floatingRegions = floatingRegions ?? []
  }
  get floating(): (Region | FloatingMatchSettings)[] {
    return this.floatingRegions
  }
  set floating(floatingRegions: (Region | FloatingMatchSettings)[]) {
    this.floatingRegions = floatingRegions
  }
  getFloatingRegions(): FloatingMatchSettingsData[] {
    return this.floatingRegions?.map(region => new FloatingMatchSettingsData(region as FloatingMatchSettings)) ?? []
  }
  setFloatingRegions(floatingRegions: FloatingMatchSettings[]) {
    this.floatingRegions = floatingRegions
  }

  get accessibilityRegions(): (Region | AccessibilityMatchSettings)[] {
    return this._settings.accessibilityRegions
  }
  set accessibilityRegions(accessibilityRegions: (Region | AccessibilityMatchSettings)[]) {
    utils.guard.isArray(accessibilityRegions, {name: 'accessibilityRegions', strict: false})
    this._settings.accessibilityRegions = accessibilityRegions ?? []
  }
  get accessibility(): (Region | AccessibilityMatchSettings)[] {
    return this.accessibilityRegions
  }
  set accessibility(accessibilityRegions: (Region | AccessibilityMatchSettings)[]) {
    this.accessibilityRegions = accessibilityRegions
  }
  getAccessibilityRegions(): AccessibilityMatchSettingsData[] {
    return (
      this.accessibilityRegions?.map(
        region => new AccessibilityMatchSettingsData(region as AccessibilityMatchSettings),
      ) ?? []
    )
  }
  setAccessibilityRegions(accessibilityRegions: AccessibilityMatchSettings[]) {
    this.accessibilityRegions = accessibilityRegions
  }

  get accessibilitySettings(): AccessibilitySettings {
    return this._settings.accessibilitySettings
  }
  set accessibilitySettings(accessibilitySettings: AccessibilitySettings) {
    if (accessibilitySettings) {
      const {level, guidelinesVersion} = accessibilitySettings
      utils.guard.isEnumValue(level, AccessibilityLevelEnum, {name: 'accessibilitySettings.level'})
      utils.guard.isEnumValue(guidelinesVersion, AccessibilityGuidelinesVersionEnum, {
        name: 'accessibilitySettings.guidelinesVersion',
      })
    }
    this._settings.accessibilitySettings = accessibilitySettings
  }
  getAccessibilitySettings(): AccessibilitySettings {
    return this.accessibilitySettings
  }
  setAccessibilitySettings(accessibilitySettings: AccessibilitySettings) {
    this.accessibilitySettings = accessibilitySettings
  }

  /** @internal */
  toObject(): ImageMatchSettings {
    return this._settings
  }

  /** @internal */
  toJSON(): ImageMatchSettings {
    return utils.general.toJSON(this._settings)
  }

  /** @internal */
  toString() {
    return utils.general.toString(this)
  }
}
