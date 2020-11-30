import * as utils from '@applitools/utils'
import ExactMatchSettingsData, {ExactMatchSettings} from './ExactMatchSettings'
import RegionData, {Region} from './Region'
import FloatingRegionData, {FloatingRegion} from './FloatingRegion'
import AccessibilityRegionData, {AccessibilityRegion} from './AccessibilityRegion'
import {AccessibilitySettings} from './AccessibilitySettings'
import MatchLevel from '../enums/MatchLevel'
import AccessibilityLevel from '../enums/AccessibilityLevel'
import AccessibilityGuidelinesVersion from '../enums/AccessibilityGuidelinesVersion'

export type ImageMatchSettings = {
  exact?: ExactMatchSettings
  matchLevel?: MatchLevel
  ignoreCaret?: boolean
  useDom?: boolean
  enablePatterns?: boolean
  ignoreDisplacements?: boolean
  ignore?: Region[]
  ignoreRegions?: Region[]
  layout?: Region[]
  layoutRegions?: Region[]
  strict?: Region[]
  strictRegions?: Region[]
  content?: Region[]
  contentRegions?: Region[]
  floating?: FloatingRegion[]
  floatingRegions?: FloatingRegion[]
  accessibility?: AccessibilityRegion[]
  accessibilityRegions?: AccessibilityRegion[]
  accessibilitySettings?: AccessibilitySettings
}

export default class ImageMatchSettingsData implements Required<ImageMatchSettings> {
  private _exact: ExactMatchSettingsData
  private _matchLevel: MatchLevel = MatchLevel.Strict
  private _ignoreCaret = true
  private _useDom = false
  private _enablePatterns = false
  private _ignoreDisplacements = false
  private _ignoreRegions: RegionData[]
  private _layoutRegions: RegionData[]
  private _strictRegions: RegionData[]
  private _contentRegions: RegionData[]
  private _floatingRegions: FloatingRegionData[]
  private _accessibilityRegions: AccessibilityRegionData[]
  private _accessibilitySettings: AccessibilitySettings

  constructor(settings?: ImageMatchSettings) {
    if (!settings) return this
    const self = this as any
    for (const [key, value] of Object.entries(settings)) {
      if (key in this && !key.startsWith('_')) {
        self[key] = value
      }
    }
  }

  get exact(): ExactMatchSettings {
    return this._exact
  }
  set exact(exact: ExactMatchSettings) {
    this._exact = new ExactMatchSettingsData(exact)
  }
  getExact(): ExactMatchSettings {
    return this._exact
  }
  setExact(exact: ExactMatchSettings) {
    this.exact = exact
  }

  get matchLevel(): MatchLevel {
    return this._matchLevel
  }
  set matchLevel(matchLevel: MatchLevel) {
    utils.guard.isEnumValue(matchLevel, MatchLevel, {name: 'matchLevel'})
    this._matchLevel = matchLevel
  }
  getMatchLevel(): MatchLevel {
    return this._matchLevel
  }
  setMatchLevel(matchLevel: MatchLevel) {
    this.matchLevel = matchLevel
  }

  get ignoreCaret(): boolean {
    return this._ignoreCaret
  }
  set ignoreCaret(ignoreCaret: boolean) {
    utils.guard.isBoolean(ignoreCaret, {name: 'ignoreCaret', strict: false})
    this._ignoreCaret = ignoreCaret
  }
  getIgnoreCaret(): boolean {
    return this._ignoreCaret
  }
  setIgnoreCaret(ignoreCaret: boolean) {
    this.ignoreCaret = ignoreCaret
  }

  get useDom(): boolean {
    return this._useDom
  }
  set useDom(useDom: boolean) {
    utils.guard.isBoolean(useDom, {name: 'useDom', strict: false})
    this._useDom = useDom
  }
  getUseDom(): boolean {
    return this._useDom
  }
  setUseDom(useDom: boolean) {
    this.useDom = useDom
  }

  get enablePatterns(): boolean {
    return this._enablePatterns
  }
  set enablePatterns(enablePatterns: boolean) {
    utils.guard.isBoolean(enablePatterns, {name: 'enablePatterns', strict: false})
    this._enablePatterns = enablePatterns
  }
  getEnablePatterns(): boolean {
    return this._enablePatterns
  }
  setEnablePatterns(enablePatterns: boolean) {
    this.enablePatterns = enablePatterns
  }

  get ignoreDisplacements(): boolean {
    return this._ignoreDisplacements
  }
  set ignoreDisplacements(ignoreDisplacements: boolean) {
    utils.guard.isBoolean(ignoreDisplacements, {name: 'ignoreDisplacements', strict: false})
    this._ignoreDisplacements = ignoreDisplacements
  }
  getIgnoreDisplacements(): boolean {
    return this._ignoreDisplacements
  }
  setIgnoreDisplacements(ignoreDisplacements: boolean) {
    this.ignoreDisplacements = ignoreDisplacements
  }

  get ignoreRegions(): Region[] {
    return this._ignoreRegions
  }
  set ignoreRegions(ignoreRegions: Region[]) {
    utils.guard.isArray(ignoreRegions, {name: 'ignoreRegions', strict: false})
    this._ignoreRegions = ignoreRegions ? ignoreRegions.map(region => new RegionData(region)) : []
  }
  get ignore(): Region[] {
    return this.ignoreRegions
  }
  set ignore(ignoreRegions: Region[]) {
    this.ignoreRegions = ignoreRegions
  }
  getIgnoreRegions(): RegionData[] {
    return this._ignoreRegions
  }
  setIgnoreRegions(ignoreRegions: Region[] | RegionData[]) {
    this.ignoreRegions = ignoreRegions
  }

  get layoutRegions(): Region[] {
    return this._layoutRegions
  }
  set layoutRegions(layoutRegions: Region[]) {
    utils.guard.isArray(layoutRegions, {name: 'layoutRegions', strict: false})
    this._layoutRegions = layoutRegions ? layoutRegions.map(region => new RegionData(region)) : []
  }
  get layout(): Region[] {
    return this.layoutRegions
  }
  set layout(layoutRegions: Region[]) {
    this.layoutRegions = layoutRegions
  }
  getLayoutRegions(): RegionData[] {
    return this._layoutRegions
  }
  setLayoutRegions(layoutRegions: Region[] | RegionData[]) {
    this.layoutRegions = layoutRegions
  }

  get strictRegions(): Region[] {
    return this._strictRegions
  }
  set strictRegions(strictRegions: Region[]) {
    utils.guard.isArray(strictRegions, {name: 'strictRegions', strict: false})
    this._strictRegions = strictRegions ? strictRegions.map(region => new RegionData(region)) : []
  }
  get strict(): Region[] {
    return this.strictRegions
  }
  set strict(strictRegions: Region[]) {
    this.strictRegions = strictRegions
  }
  getStrictRegions(): RegionData[] {
    return this._strictRegions
  }
  setStrictRegions(strictRegions: Region[] | RegionData[]) {
    this.strictRegions = strictRegions
  }

  get contentRegions(): Region[] {
    return this._contentRegions
  }
  set contentRegions(contentRegions: Region[]) {
    utils.guard.isArray(contentRegions, {name: 'contentRegions', strict: false})
    this._contentRegions = contentRegions ? contentRegions.map(region => new RegionData(region)) : []
  }
  get content(): Region[] {
    return this.contentRegions
  }
  set content(contentRegions: Region[]) {
    this.contentRegions = contentRegions
  }
  getContentRegions(): RegionData[] {
    return this._contentRegions
  }
  setContentRegions(contentRegions: Region[] | RegionData[]) {
    this.contentRegions = contentRegions
  }

  get floatingRegions(): FloatingRegion[] {
    return this._floatingRegions
  }
  set floatingRegions(floatingRegions: FloatingRegion[]) {
    utils.guard.isArray(floatingRegions, {name: 'floatingRegions', strict: false})
    this._floatingRegions = floatingRegions ? floatingRegions.map(region => new FloatingRegionData(region)) : []
  }
  get floating(): FloatingRegion[] {
    return this.floatingRegions
  }
  set floating(floatingRegions: FloatingRegion[]) {
    this.floatingRegions = floatingRegions
  }
  getFloatingRegions(): FloatingRegionData[] {
    return this._floatingRegions
  }
  setFloatingRegions(floatingRegions: FloatingRegion[] | FloatingRegionData[]) {
    this.floatingRegions = floatingRegions
  }

  get accessibilityRegions(): AccessibilityRegion[] {
    return this._accessibilityRegions
  }
  set accessibilityRegions(accessibilityRegions: AccessibilityRegion[]) {
    utils.guard.isArray(accessibilityRegions, {name: 'accessibilityRegions', strict: false})
    this._accessibilityRegions = accessibilityRegions
      ? accessibilityRegions.map(region => new AccessibilityRegionData(region))
      : []
  }
  get accessibility(): AccessibilityRegion[] {
    return this.accessibilityRegions
  }
  set accessibility(accessibilityRegions: AccessibilityRegion[]) {
    this.accessibilityRegions = accessibilityRegions
  }
  getAccessibilityRegions(): AccessibilityRegionData[] {
    return this._accessibilityRegions
  }
  setAccessibilityRegions(accessibilityRegions: AccessibilityRegion[] | AccessibilityRegionData[]) {
    this.accessibilityRegions = accessibilityRegions
  }

  get accessibilitySettings(): AccessibilitySettings {
    return this._accessibilitySettings
  }
  set accessibilitySettings(accessibilitySettings: AccessibilitySettings) {
    if (accessibilitySettings) {
      const {level, guidelinesVersion} = accessibilitySettings
      utils.guard.isEnumValue(level, AccessibilityLevel, {name: 'accessibilitySettings.level'})
      utils.guard.isEnumValue(guidelinesVersion, AccessibilityGuidelinesVersion, {
        name: 'accessibilitySettings.guidelinesVersion',
      })
    }
    this._accessibilitySettings = accessibilitySettings
  }
  getAccessibilitySettings(): AccessibilitySettings {
    return this._accessibilitySettings
  }
  setAccessibilitySettings(accessibilitySettings: AccessibilitySettings) {
    this._accessibilitySettings = accessibilitySettings
  }
}
