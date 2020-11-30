import * as utils from '@applitools/utils'
import SessionType from '../enums/SessionType'
import StitchMode from '../enums/StitchMode'
import MatchLevel from '../enums/MatchLevel'
import BrowserName from '../enums/BrowserName'
import DeviceName from '../enums/DeviceName'
import ScreenOrientation from '../enums/ScreenOrientation'
import RectangleSizeData, {RectangleSize} from './RectangleSize'
import ProxySettingsData, {ProxySettings} from './ProxySettings'
import BatchInfoData, {BatchInfo} from './BatchInfo'
import CustomPropertyData, {CustomProperty} from './CustomProperty'
import ImageMatchSettingsData, {ImageMatchSettings} from './ImageMatchSettings'
import {AccessibilitySettings} from './AccessibilitySettings'
import {RenderInfo} from './RenderInfo'

export type GeneralConfig = {
  showLogs?: boolean
  agentId?: string
  apiKey?: string
  serverUrl?: string
  proxy?: ProxySettings
  connectionTimeout?: number
  removeSession?: boolean
  isDisabled?: boolean
}

export type OpenConfig = {
  appName?: string
  testName?: string
  displayName?: string
  viewportSize?: RectangleSize
  sessionType?: SessionType
  properties?: CustomProperty[]
  batch?: BatchInfo
  defaultMatchSettings?: ImageMatchSettings
  hostApp?: string
  hostOS?: string
  hostAppInfo?: string
  hostOSInfo?: string
  deviceInfo?: string
  baselineEnvName?: string
  environmentName?: string
  branchName?: string
  parentBranchName?: string
  baselineBranchName?: string
  compareWithParentBranch?: boolean
  ignoreBaseline?: boolean
  saveFailedTests?: boolean
  saveNewTests?: boolean
  saveDiffs?: boolean
  dontCloseBatches?: boolean
}

export type CheckConfig = {
  sendDom?: boolean
  matchTimeout?: number
  forceFullPageScreenshot?: boolean
}

export type ClassicConfig = {
  waitBeforeScreenshots?: number
  stitchMode?: StitchMode
  hideScrollbars?: boolean
  hideCaret?: boolean
  stitchOverlap?: number
}

export type VGConfig = {
  concurrentSessions?: number
  browsersInfo?: RenderInfo[]
  visualGridOptions?: Record<string, any>
  layoutBreakpoints?: boolean | number[]
  disableBrowserFetching?: boolean
}

export type Config = GeneralConfig & OpenConfig & CheckConfig & ClassicConfig & VGConfig

export default class ConfigData implements Required<Config> {
  private _showLogs: boolean
  private _appName: string
  private _testName: string
  private _displayName: string
  private _isDisabled: boolean
  private _matchTimeout: number
  private _sessionType: SessionType
  private _viewportSize: RectangleSizeData
  private _agentId: string
  private _apiKey: string
  private _serverUrl: string
  private _proxy: ProxySettingsData
  private _connectionTimeout: number
  private _removeSession: boolean
  private _batch: BatchInfoData
  private _properties: CustomPropertyData[]
  private _baselineEnvName: string
  private _environmentName: string
  private _branchName: string
  private _parentBranchName: string
  private _baselineBranchName: string
  private _compareWithParentBranch: boolean
  private _ignoreBaseline: boolean
  private _saveFailedTests: boolean
  private _saveNewTests: boolean
  private _saveDiffs: boolean
  private _sendDom: boolean
  private _hostApp: string
  private _hostOS: string
  private _hostAppInfo: string
  private _hostOSInfo: string
  private _deviceInfo: string
  private _defaultMatchSettings: ImageMatchSettingsData
  private _forceFullPageScreenshot: boolean
  private _waitBeforeScreenshots: number
  private _stitchMode: StitchMode
  private _hideScrollbars: boolean
  private _hideCaret: boolean
  private _stitchOverlap: number
  private _concurrentSessions: number
  private _browsersInfo: RenderInfo[]
  private _visualGridOptions: {[key: string]: any}
  private _layoutBreakpoints: boolean | number[]
  private _disableBrowserFetching: boolean
  private _dontCloseBatches: boolean

  constructor(config?: Config) {
    if (!config) return this
    const self = this as any
    for (const [key, value] of Object.entries(config)) {
      if (key in this && !key.startsWith('_')) {
        self[key] = value
      }
    }
  }

  get general(): GeneralConfig {
    return utils.general.toJSON(this, [
      'showLogs',
      'agentId',
      'apiKey',
      'serverUrl',
      'proxy',
      'connectionTimeout',
      'removeSession',
      'isDisabled',
    ])
  }

  get open(): OpenConfig {
    return utils.general.toJSON(this, [
      'appName',
      'testName',
      'displayName',
      'viewportSize',
      'sessionType',
      'properties',
      'batch',
      'defaultMatchSettings',
      'hostApp',
      'hostOS',
      'hostAppInfo',
      'hostOSInfo',
      'deviceInfo',
      'baselineEnvName',
      'environmentName',
      'branchName',
      'parentBranchName',
      'baselineBranchName',
      'compareWithParentBranch',
      'ignoreBaseline',
      'saveFailedTests',
      'saveNewTests',
      'saveDiffs',
      'dontCloseBatches',
    ])
  }

  get check(): CheckConfig {
    return utils.general.toJSON(this, ['sendDom', 'matchTimeout', 'forceFullPageScreenshot'])
  }

  get classic(): ClassicConfig {
    return utils.general.toJSON(this, [
      'waitBeforeScreenshots',
      'stitchMode',
      'hideScrollbars',
      'hideCaret',
      'stitchOverlap',
    ])
  }

  get vg(): VGConfig {
    return utils.general.toJSON(this, [
      'concurrentSessions',
      'browsersInfo',
      'visualGridOptions',
      'layoutBreakpoints',
      'disableBrowserFetching',
    ])
  }

  get showLogs(): boolean {
    return this._showLogs
  }
  set showLogs(showLogs: boolean) {
    utils.guard.isBoolean(showLogs, {name: 'showLogs'})
    this._showLogs = showLogs
  }
  getShowLogs(): boolean {
    return this._showLogs
  }
  setShowLogs(showLogs: boolean): this {
    this.showLogs = showLogs
    return this
  }

  get appName(): string {
    return this._appName
  }
  set appName(appName: string) {
    utils.guard.isString(appName, {name: 'appName', strict: false})
    this._appName = appName
  }
  getAppName(): string {
    return this._appName
  }
  setAppName(appName: string): this {
    this.appName = appName
    return this
  }

  get testName(): string {
    return this._testName
  }
  set testName(testName: string) {
    utils.guard.isString(testName, {name: 'testName', strict: false})
    this._testName = testName
  }
  getTestName(): string {
    return this._testName
  }
  setTestName(testName: string): this {
    this.testName = testName
    return this
  }

  get displayName(): string {
    return this._displayName
  }
  set displayName(displayName: string) {
    utils.guard.isString(displayName, {name: 'displayName', strict: false})
    this._displayName = displayName
  }
  getDisplayName(): string {
    return this._displayName
  }
  setDisplayName(displayName: string): this {
    this.displayName = displayName
    return this
  }

  get isDisabled(): boolean {
    return this._isDisabled
  }
  set isDisabled(isDisabled: boolean) {
    utils.guard.isBoolean(isDisabled, {name: 'isDisabled', strict: false})
    this._isDisabled = isDisabled
  }
  getIsDisabled(): boolean {
    return this._isDisabled
  }
  setIsDisabled(isDisabled: boolean): this {
    this.isDisabled = isDisabled
    return this
  }

  get matchTimeout(): number {
    return this._matchTimeout
  }
  set matchTimeout(matchTimeout: number) {
    utils.guard.isInteger(matchTimeout, {name: 'matchTimeout'})
    this._matchTimeout = matchTimeout
  }
  getMatchTimeout(): number {
    return this._matchTimeout
  }
  setMatchTimeout(matchTimeout: number): this {
    this.matchTimeout = matchTimeout
    return this
  }

  get sessionType(): SessionType {
    return this._sessionType
  }
  set sessionType(sessionType: SessionType) {
    this._sessionType = sessionType
  }
  getSessionType(): SessionType {
    return this._sessionType
  }
  setSessionType(sessionType: SessionType): this {
    this.sessionType = sessionType
    return this
  }

  get viewportSize(): RectangleSize {
    return this._viewportSize
  }
  set viewportSize(viewportSize: RectangleSize) {
    if (!viewportSize) this._viewportSize = undefined
    this._viewportSize = new RectangleSizeData(viewportSize)
  }
  getViewportSize(): RectangleSize {
    return this._viewportSize
  }
  setViewportSize(viewportSize: RectangleSize | RectangleSizeData): this {
    this.viewportSize = viewportSize
    return this
  }

  get agentId(): string {
    return this._agentId
  }
  set agentId(agentId: string) {
    utils.guard.isString(agentId, {name: 'agentId'})
    this._agentId = agentId
  }
  getAgentId(): string {
    return this._agentId
  }
  setAgentId(agentId: string): this {
    this.agentId = agentId
    return this
  }

  get apiKey(): string {
    return this._apiKey
  }
  set apiKey(apiKey: string) {
    utils.guard.isString(apiKey, {name: 'apiKey', alpha: true, numeric: true})
    this._apiKey = apiKey
  }
  getApiKey(): string {
    return this._apiKey
  }
  setApiKey(apiKey: string): this {
    this.apiKey = apiKey
    return this
  }

  get serverUrl(): string {
    return this._serverUrl
  }
  set serverUrl(serverUrl: string) {
    utils.guard.isString(serverUrl, {name: 'serverUrl', strict: false})
    this._serverUrl = serverUrl
  }
  getServerUrl(): string {
    return this._serverUrl
  }
  setServerUrl(serverUrl: string): this {
    this.serverUrl = serverUrl
    return this
  }

  get proxy(): ProxySettings {
    return this._proxy
  }
  set proxy(proxy: ProxySettings) {
    if (!proxy) this._proxy = undefined
    this._proxy = new ProxySettingsData(proxy)
  }
  getProxy(): ProxySettingsData {
    return this._proxy
  }
  setProxy(proxy: ProxySettings | ProxySettingsData): this
  setProxy(isDisabled: true): this
  setProxy(url: string, username?: string, password?: string, isHttpOnly?: boolean): this
  setProxy(
    proxyOrUrlOrIsDisabled: ProxySettings | ProxySettingsData | string | true,
    username?: string,
    password?: string,
    isHttpOnly?: boolean,
  ): this {
    if (proxyOrUrlOrIsDisabled === true) {
      this.proxy = undefined
    } else if (utils.type.isString(proxyOrUrlOrIsDisabled)) {
      this.proxy = {url: proxyOrUrlOrIsDisabled, username, password, isHttpOnly}
    } else {
      this.proxy = proxyOrUrlOrIsDisabled
    }
    return this
  }

  get connectionTimeout(): number {
    return this._connectionTimeout
  }
  set connectionTimeout(connectionTimeout: number) {
    utils.guard.isInteger(connectionTimeout, {name: 'connectionTimeout', gte: 0})
    this._connectionTimeout = connectionTimeout
  }
  getConnectionTimeout(): number {
    return this._connectionTimeout
  }
  setConnectionTimeout(connectionTimeout: number): this {
    this.connectionTimeout = connectionTimeout
    return this
  }

  get removeSession(): boolean {
    return this._removeSession
  }
  set removeSession(removeSession: boolean) {
    utils.guard.isBoolean(removeSession, {name: 'removeSession'})
    this._removeSession = removeSession
  }
  getRemoveSession(): boolean {
    return this._removeSession
  }
  setRemoveSession(removeSession: boolean): this {
    this.removeSession = removeSession
    return this
  }

  get batch(): BatchInfo {
    return this._batch
  }
  set batch(batch: BatchInfo) {
    if (!batch) this._batch = undefined
    this._batch = new BatchInfoData(batch)
  }
  getBatch(): BatchInfoData {
    return this._batch
  }
  setBatch(batch: BatchInfo | BatchInfoData): this {
    this.batch = batch
    return this
  }

  get properties(): CustomProperty[] {
    return this._properties
  }
  set properties(properties: CustomProperty[]) {
    utils.guard.isArray(properties, {name: 'properties'})
    this._properties = properties.map(prop => new CustomPropertyData(prop))
  }
  getProperties(): CustomPropertyData[] {
    return this._properties
  }
  setProperties(properties: CustomProperty[] | CustomPropertyData[]): this {
    this.properties = properties
    return this
  }
  addProperty(name: string, value: string): this
  addProperty(prop: CustomProperty | CustomPropertyData): this
  addProperty(propOrName: CustomProperty | CustomPropertyData | string, value?: string): this {
    const prop = utils.type.isString(propOrName)
      ? new CustomPropertyData({name: propOrName, value})
      : new CustomPropertyData(propOrName)
    this._properties.push(prop)
    return this
  }

  get baselineEnvName(): string {
    return this._baselineEnvName
  }
  set baselineEnvName(baselineEnvName: string) {
    utils.guard.isString(baselineEnvName, {name: 'baselineEnvName', strict: false})
    this._baselineEnvName = baselineEnvName ? baselineEnvName.trim() : undefined
  }
  getBaselineEnvName(): string {
    return this._baselineEnvName
  }
  setBaselineEnvName(baselineEnvName: string): this {
    this.baselineEnvName = baselineEnvName
    return this
  }

  get environmentName(): string {
    return this._environmentName
  }
  set environmentName(environmentName: string) {
    utils.guard.isString(environmentName, {name: 'environmentName', strict: false})
    this._environmentName = environmentName ? environmentName.trim() : undefined
  }
  getEnvironmentName(): string {
    return this._environmentName
  }
  setEnvironmentName(environmentName: string): this {
    this.environmentName = environmentName
    return this
  }

  get branchName(): string {
    return this._branchName
  }
  set branchName(branchName: string) {
    utils.guard.isString(branchName, {name: 'branchName'})
    this._branchName = branchName
  }
  getBranchName(): string {
    return this._branchName
  }
  setBranchName(branchName: string): this {
    this.branchName = branchName
    return this
  }

  get parentBranchName(): string {
    return this._parentBranchName
  }
  set parentBranchName(parentBranchName: string) {
    utils.guard.isString(parentBranchName, {name: 'parentBranchName'})
    this._parentBranchName = parentBranchName
  }
  getParentBranchName(): string {
    return this._parentBranchName
  }
  setParentBranchName(parentBranchName: string): this {
    this.parentBranchName = parentBranchName
    return this
  }

  get baselineBranchName(): string {
    return this._baselineBranchName
  }
  set baselineBranchName(baselineBranchName: string) {
    utils.guard.isString(baselineBranchName, {name: 'baselineBranchName'})
    this._baselineBranchName = baselineBranchName
  }
  getBaselineBranchName(): string {
    return this._baselineBranchName
  }
  setBaselineBranchName(baselineBranchName: string): this {
    this.baselineBranchName = baselineBranchName
    return this
  }

  get compareWithParentBranch(): boolean {
    return this._compareWithParentBranch
  }
  set compareWithParentBranch(compareWithParentBranch: boolean) {
    utils.guard.isBoolean(compareWithParentBranch, {name: 'compareWithParentBranch'})
    this._compareWithParentBranch = compareWithParentBranch
  }
  getCompareWithParentBranch(): boolean {
    return this._compareWithParentBranch
  }
  setCompareWithParentBranch(compareWithParentBranch: boolean): this {
    this.compareWithParentBranch = compareWithParentBranch
    return this
  }

  get ignoreBaseline(): boolean {
    return this._ignoreBaseline
  }
  set ignoreBaseline(ignoreBaseline: boolean) {
    utils.guard.isBoolean(ignoreBaseline, {name: 'ignoreBaseline'})
    this._ignoreBaseline = ignoreBaseline
  }
  getIgnoreBaseline(): boolean {
    return this._ignoreBaseline
  }
  setIgnoreBaseline(ignoreBaseline: boolean): this {
    this.ignoreBaseline = ignoreBaseline
    return this
  }

  get saveFailedTests(): boolean {
    return this._saveFailedTests
  }
  set saveFailedTests(saveFailedTests: boolean) {
    utils.guard.isBoolean(saveFailedTests, {name: 'saveFailedTests'})
    this._saveFailedTests = saveFailedTests
  }
  getSaveFailedTests(): boolean {
    return this._saveFailedTests
  }
  setSaveFailedTests(saveFailedTests: boolean): this {
    this.saveFailedTests = saveFailedTests
    return this
  }

  get saveNewTests(): boolean {
    return this._saveNewTests
  }
  set saveNewTests(saveNewTests: boolean) {
    utils.guard.isBoolean(saveNewTests, {name: 'saveNewTests'})
    this._saveNewTests = saveNewTests
  }
  getSaveNewTests(): boolean {
    return this._saveNewTests
  }
  setSaveNewTests(saveNewTests: boolean): this {
    this.saveNewTests = saveNewTests
    return this
  }

  get saveDiffs(): boolean {
    return this._saveDiffs
  }
  set saveDiffs(saveDiffs: boolean) {
    utils.guard.isBoolean(saveDiffs, {name: 'saveDiffs'})
    this._saveDiffs = saveDiffs
  }
  getSaveDiffs(): boolean {
    return this._saveDiffs
  }
  setSaveDiffs(saveDiffs: boolean): this {
    this.saveDiffs = saveDiffs
    return this
  }

  get sendDom(): boolean {
    return this._sendDom
  }
  set sendDom(sendDom: boolean) {
    utils.guard.isBoolean(sendDom, {name: 'sendDom'})
    this._sendDom = sendDom
  }
  getSendDom(): boolean {
    return this._sendDom
  }
  setSendDom(sendDom: boolean): this {
    this.sendDom = sendDom
    return this
  }

  get hostApp(): string {
    return this._hostApp
  }
  set hostApp(hostApp: string) {
    this._hostApp = hostApp ? hostApp.trim() : undefined
  }
  getHostApp(): string {
    return this._hostApp
  }
  setHostApp(hostApp: string): this {
    this.hostApp = hostApp
    return this
  }

  get hostOS(): string {
    return this._hostOS
  }
  set hostOS(hostOS: string) {
    this._hostOS = hostOS ? hostOS.trim() : undefined
  }
  getHostOS(): string {
    return this._hostOS
  }
  setHostOS(hostOS: string): this {
    this.hostOS = hostOS
    return this
  }

  get hostAppInfo(): string {
    return this._hostAppInfo
  }
  set hostAppInfo(hostAppInfo: string) {
    this._hostAppInfo = hostAppInfo ? hostAppInfo.trim() : undefined
  }
  getHostAppInfo(): string {
    return this._hostAppInfo
  }
  setHostAppInfo(hostAppInfo: string): this {
    this.hostAppInfo = hostAppInfo
    return this
  }

  get hostOSInfo(): string {
    return this._hostOSInfo
  }
  set hostOSInfo(hostOSInfo: string) {
    this._hostOSInfo = hostOSInfo ? hostOSInfo.trim() : undefined
  }
  getHostOSInfo(): string {
    return this.hostOSInfo
  }
  setHostOSInfo(hostOSInfo: string): this {
    this.hostOSInfo = hostOSInfo
    return this
  }

  get deviceInfo(): string {
    return this._deviceInfo
  }
  set deviceInfo(deviceInfo: string) {
    this._deviceInfo = deviceInfo ? deviceInfo.trim() : undefined
  }
  getDeviceInfo(): string {
    return this._deviceInfo
  }
  setDeviceInfo(deviceInfo: string): this {
    this.deviceInfo = deviceInfo
    return this
  }

  get defaultMatchSettings(): ImageMatchSettings {
    return this._defaultMatchSettings
  }
  set defaultMatchSettings(defaultMatchSettings: ImageMatchSettings) {
    utils.guard.notNull(defaultMatchSettings, {name: 'defaultMatchSettings'})
    this._defaultMatchSettings = new ImageMatchSettingsData(defaultMatchSettings)
  }
  getDefaultMatchSettings(): ImageMatchSettings {
    return this._defaultMatchSettings
  }
  setDefaultMatchSettings(defaultMatchSettings: ImageMatchSettings | ImageMatchSettingsData): this {
    this.defaultMatchSettings = defaultMatchSettings
    return this
  }
  getMatchLevel(): MatchLevel {
    return this._defaultMatchSettings.matchLevel
  }
  setMatchLevel(matchLevel: MatchLevel): this {
    this._defaultMatchSettings.matchLevel = matchLevel
    return this
  }
  getAccessibilityValidation(): AccessibilitySettings {
    return this._defaultMatchSettings.accessibilitySettings
  }
  setAccessibilityValidation(accessibilityValidation: AccessibilitySettings): this {
    this._defaultMatchSettings.accessibilitySettings = accessibilityValidation
    return this
  }
  getUseDom(): boolean {
    return this._defaultMatchSettings.useDom
  }
  setUseDom(useDom: boolean): this {
    this._defaultMatchSettings.useDom = useDom
    return this
  }
  getEnablePatterns(): boolean {
    return this._defaultMatchSettings.enablePatterns
  }
  setEnablePatterns(enablePatterns: boolean): this {
    this._defaultMatchSettings.enablePatterns = enablePatterns
    return this
  }
  getIgnoreDisplacements(): boolean {
    return this._defaultMatchSettings.ignoreDisplacements
  }
  setIgnoreDisplacements(ignoreDisplacements: boolean): this {
    this._defaultMatchSettings.ignoreDisplacements = ignoreDisplacements
    return this
  }
  getIgnoreCaret(): boolean {
    return this._defaultMatchSettings.ignoreCaret
  }
  setIgnoreCaret(ignoreCaret: boolean): this {
    this._defaultMatchSettings.ignoreCaret = ignoreCaret
    return this
  }

  get forceFullPageScreenshot(): boolean {
    return this._forceFullPageScreenshot
  }
  set forceFullPageScreenshot(forceFullPageScreenshot: boolean) {
    this._forceFullPageScreenshot = forceFullPageScreenshot
  }
  getForceFullPageScreenshot(): boolean {
    return this._forceFullPageScreenshot
  }
  setForceFullPageScreenshot(forceFullPageScreenshot: boolean): this {
    this.forceFullPageScreenshot = forceFullPageScreenshot
    return this
  }

  get waitBeforeScreenshots(): number {
    return this._waitBeforeScreenshots
  }
  set waitBeforeScreenshots(waitBeforeScreenshots: number) {
    utils.guard.isInteger(waitBeforeScreenshots, {name: 'waitBeforeScreenshots', gt: 0})
    this._waitBeforeScreenshots = waitBeforeScreenshots
  }
  getWaitBeforeScreenshots(): number {
    return this._waitBeforeScreenshots
  }
  setWaitBeforeScreenshots(waitBeforeScreenshots: number): this {
    this.waitBeforeScreenshots = waitBeforeScreenshots
    return this
  }

  get stitchMode(): StitchMode {
    return this._stitchMode
  }
  set stitchMode(stitchMode: StitchMode) {
    utils.guard.isEnumValue(stitchMode, StitchMode, {name: 'stitchMode'})
    this._stitchMode = stitchMode
  }
  getStitchMode(): StitchMode {
    return this._stitchMode
  }
  setStitchMode(stitchMode: StitchMode): this {
    this.stitchMode = stitchMode
    return this
  }

  get hideScrollbars(): boolean {
    return this._hideScrollbars
  }
  set hideScrollbars(hideScrollbars: boolean) {
    this._hideScrollbars = hideScrollbars
  }
  getHideScrollbars(): boolean {
    return this._hideScrollbars
  }
  setHideScrollbars(hideScrollbars: boolean): this {
    this.hideScrollbars = hideScrollbars
    return this
  }

  get hideCaret(): boolean {
    return this._hideCaret
  }
  set hideCaret(hideCaret: boolean) {
    this._hideCaret = hideCaret
  }
  getHideCaret(): boolean {
    return this._hideCaret
  }
  setHideCaret(hideCaret: boolean): this {
    this.hideCaret = hideCaret
    return this
  }

  get stitchOverlap(): number {
    return this._stitchOverlap
  }
  set stitchOverlap(stitchOverlap: number) {
    utils.guard.isInteger(stitchOverlap, {name: 'stitchOverlap', strict: false})
    this._stitchOverlap = stitchOverlap
  }
  getStitchOverlap(): number {
    return this._stitchOverlap
  }
  setStitchOverlap(stitchOverlap: number): this {
    this.stitchOverlap = stitchOverlap
    return this
  }

  get concurrentSessions(): number {
    return this._concurrentSessions
  }
  set concurrentSessions(concurrentSessions: number) {
    this._concurrentSessions = concurrentSessions
  }
  getConcurrentSessions(): number {
    return this._concurrentSessions
  }
  setConcurrentSessions(concurrentSessions: number): this {
    this.concurrentSessions = concurrentSessions
    return this
  }

  get browsersInfo(): RenderInfo[] {
    return this._browsersInfo
  }
  set browsersInfo(browsersInfo: RenderInfo[]) {
    utils.guard.isArray(browsersInfo, {name: 'browsersInfo'})
    this._browsersInfo = browsersInfo
  }
  getBrowsersInfo(): RenderInfo[] {
    return this.browsersInfo
  }
  setBrowsersInfo(browsersInfo: RenderInfo[]): this {
    this.browsersInfo = browsersInfo
    return this
  }
  addBrowsers(...browsersInfo: RenderInfo[]) {
    for (const [index, browserInfo] of browsersInfo.entries()) {
      utils.guard.isObject(browserInfo, {name: `addBrowsers( arg${index} )`})
    }
    if (!this._browsersInfo) {
      this._browsersInfo = []
    }
    this._browsersInfo.push(...browsersInfo)
    return this
  }
  addBrowser(browserInfo: RenderInfo): this
  addBrowser(width: number, height: number, name?: BrowserName): this
  addBrowser(browserInfoOrWidth: RenderInfo | number, height?: number, name: BrowserName = BrowserName.CHROME) {
    if (utils.type.isObject(browserInfoOrWidth)) {
      return this.addBrowsers(browserInfoOrWidth)
    } else {
      return this.addBrowsers({width: browserInfoOrWidth, height, name})
    }
  }
  addDeviceEmulation(deviceName: DeviceName, screenOrientation = ScreenOrientation.PORTRAIT) {
    if (!this._browsersInfo) {
      this._browsersInfo = []
    }
    this._browsersInfo.push({deviceName, screenOrientation})
    return this
  }

  get visualGridOptions(): {[key: string]: any} {
    return this._visualGridOptions
  }
  set visualGridOptions(visualGridOptions: {[key: string]: any}) {
    this._visualGridOptions = visualGridOptions
  }
  getVisualGridOptions(): {[key: string]: any} {
    return this._visualGridOptions
  }
  setVisualGridOptions(visualGridOptions: {[key: string]: any}): this {
    this.visualGridOptions = visualGridOptions
    return this
  }
  setVisualGridOption(key: string, value: any): this {
    if (!this._visualGridOptions) {
      this._visualGridOptions = {}
    }
    this._visualGridOptions[key] = value
    return this
  }

  get layoutBreakpoints(): boolean | number[] {
    return this._layoutBreakpoints
  }
  set layoutBreakpoints(layoutBreakpoints: boolean | number[]) {
    utils.guard.notNull(layoutBreakpoints, {name: 'layoutBreakpoints'})
    if (!utils.type.isArray(layoutBreakpoints)) {
      this._layoutBreakpoints = layoutBreakpoints
    } else if (layoutBreakpoints.length === 0) {
      this._layoutBreakpoints = false
    } else {
      this._layoutBreakpoints = Array.from(new Set(layoutBreakpoints)).sort((a, b) => (a < b ? 1 : -1))
    }
    this._layoutBreakpoints = layoutBreakpoints
  }
  getLayoutBreakpoints(): boolean | number[] {
    return this._layoutBreakpoints
  }
  setLayoutBreakpoints(layoutBreakpoints: boolean | number[]): this {
    this.layoutBreakpoints = layoutBreakpoints
    return this
  }

  get disableBrowserFetching(): boolean {
    return this._disableBrowserFetching
  }
  set disableBrowserFetching(disableBrowserFetching: boolean) {
    this._disableBrowserFetching = disableBrowserFetching
  }
  getDisableBrowserFetching(): boolean {
    return this._disableBrowserFetching
  }
  setDisableBrowserFetching(disableBrowserFetching: boolean): this {
    this.disableBrowserFetching = disableBrowserFetching
    return this
  }

  get dontCloseBatches(): boolean {
    return this._dontCloseBatches
  }
  set dontCloseBatches(dontCloseBatches: boolean) {
    this._dontCloseBatches = dontCloseBatches
  }
  getDontCloseBatches(): boolean {
    return this.dontCloseBatches
  }
  setDontCloseBatches(dontCloseBatches: boolean): this {
    this.dontCloseBatches = dontCloseBatches
    return this
  }

  toJSON(): Config {
    return utils.general.toJSON(this, [
      'showLogs',
      'appName',
      'testName',
      'displayName',
      'isDisabled',
      'matchTimeout',
      'sessionType',
      'viewportSize',
      'agentId',
      'apiKey',
      'serverUrl',
      'proxy',
      'connectionTimeout',
      'removeSession',
      'batch',
      'properties',
      'baselineEnvName',
      'environmentName',
      'branchName',
      'parentBranchName',
      'baselineBranchName',
      'compareWithParentBranch',
      'ignoreBaseline',
      'saveFailedTests',
      'saveNewTests',
      'saveDiffs',
      'sendDom',
      'hostApp',
      'hostOS',
      'hostAppInfo',
      'hostOSInfo',
      'deviceInfo',
      'defaultMatchSettings',
      'forceFullPageScreenshot',
      'waitBeforeScreenshots',
      'stitchMode',
      'hideScrollbars',
      'hideCaret',
      'stitchOverlap',
      'concurrentSessions',
      'browsersInfo',
      'visualGridOptions',
      'layoutBreakpoints',
      'disableBrowserFetching',
      'dontCloseBatches',
    ])
  }

  toString() {
    return utils.general.toString(this)
  }
}
