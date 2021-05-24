import * as utils from '@applitools/utils'
import SessionType from '../enums/SessionType'
import StitchMode from '../enums/StitchMode'
import MatchLevel from '../enums/MatchLevel'
import BrowserName from '../enums/BrowserName'
import DeviceName from '../enums/DeviceName'
import ScreenOrientation from '../enums/ScreenOrientation'
import {AccessibilitySettings} from './AccessibilitySettings'
import {DesktopBrowserInfo, ChromeEmulationInfo, IOSDeviceInfo} from './RenderInfo'
import {CutProvider} from './CutProvider'
import {LogHandler} from './LogHandler'
import {DebugScreenshotProvider} from './DebugScreenshotProvider'
import {RectangleSize, RectangleSizeData} from './RectangleSize'
import {ImageRotation, ImageRotationData} from './ImageRotation'
import {ProxySettings, ProxySettingsData} from './ProxySettings'
import {BatchInfo, BatchInfoData} from './BatchInfo'
import {PropertyData, PropertyDataData} from './PropertyData'
import {ImageMatchSettings, ImageMatchSettingsData} from './ImageMatchSettings'

type RenderInfo = DesktopBrowserInfo | ChromeEmulationInfo | IOSDeviceInfo

type ConfigurationSpec<TElement, TSelector> = {
  isElement(element: any): element is TElement
  isSelector(selector: any): selector is TSelector
}

export type GeneralConfiguration = {
  /** @undocumented */
  logs?: {show: boolean; handler?: LogHandler}
  /** @undocumented */
  debugScreenshots?: DebugScreenshotProvider
  agentId?: string
  apiKey?: string
  serverUrl?: string
  proxy?: ProxySettings
  isDisabled?: boolean
  /** @undocumented */
  connectionTimeout?: number
  /** @undocumented */
  removeSession?: boolean
  /** @undocumented */
  remoteEvents?: {serverUrl: string; accessKey?: string; timeout?: number}
}

export type OpenConfiguration = {
  appName?: string
  testName?: string
  displayName?: string
  viewportSize?: RectangleSize
  sessionType?: SessionType
  properties?: PropertyData[]
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
  /** @undocumented */
  dontCloseBatches?: boolean
}

export type CheckConfiguration = {
  sendDom?: boolean
  matchTimeout?: number
  forceFullPageScreenshot?: boolean
}

export type ClassicConfiguration<TElement = unknown, TSelector = unknown> = {
  waitBeforeScreenshots?: number
  stitchMode?: StitchMode
  hideScrollbars?: boolean
  hideCaret?: boolean
  stitchOverlap?: number
  scrollRootElement?: TElement | TSelector
  cut?: CutProvider
  rotation?: ImageRotation
  scaleRatio?: number
}

export type VGConfiguration = {
  /** @undocumented */
  concurrentSessions?: number
  browsersInfo?: RenderInfo[]
  visualGridOptions?: Record<string, any>
  layoutBreakpoints?: boolean | number[]
  disableBrowserFetching?: boolean
}

export type Configuration<TElement = unknown, TSelector = unknown> = GeneralConfiguration &
  OpenConfiguration &
  CheckConfiguration &
  ClassicConfiguration<TElement, TSelector> &
  VGConfiguration

export class ConfigurationData<TElement = unknown, TSelector = unknown>
  implements Required<Configuration<TElement, TSelector>>
{
  protected readonly _spec: ConfigurationSpec<TElement, TSelector>

  private _config: Configuration<TElement, TSelector> = {}

  constructor(config?: Configuration<TElement, TSelector>) {
    if (!config) return this
    if (config instanceof ConfigurationData) config = config.toJSON()

    for (const [key, value] of Object.entries(config)) {
      ;(this as any)[key] = value
    }
  }

  /** @internal */
  get general(): Required<GeneralConfiguration> {
    return utils.general.toJSON(this, [
      'logs',
      'debugScreenshots',
      'agentId',
      'apiKey',
      'serverUrl',
      'proxy',
      'isDisabled',
      'connectionTimeout',
      'removeSession',
      'remoteEvents',
    ])
  }

  /** @internal */
  get open(): Required<OpenConfiguration> {
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

  /** @internal */
  get check(): Required<CheckConfiguration> {
    return utils.general.toJSON(this, ['sendDom', 'matchTimeout', 'forceFullPageScreenshot'])
  }

  /** @internal */
  get classic(): Required<ClassicConfiguration<TElement, TSelector>> {
    return utils.general.toJSON(this, [
      'waitBeforeScreenshots',
      'stitchMode',
      'hideScrollbars',
      'hideCaret',
      'stitchOverlap',
      'scrollRootElement',
      'cut',
      'rotation',
      'scaleRatio',
    ])
  }

  /** @internal */
  get vg(): Required<VGConfiguration> {
    return utils.general.toJSON(this, [
      'concurrentSessions',
      'browsersInfo',
      'visualGridOptions',
      'layoutBreakpoints',
      'disableBrowserFetching',
    ])
  }

  /** @undocumented */
  get logs(): {show: boolean; handler?: LogHandler} {
    return this._config.logs
  }
  /** @undocumented */
  set logs(logs: {show: boolean; handler?: LogHandler}) {
    this._config.logs = logs
  }
  /** @undocumented */
  getShowLogs(): boolean {
    return this.logs?.show ?? false
  }
  /** @undocumented */
  setShowLogs(show: boolean): this {
    this.logs = {...this.logs, show}
    return this
  }
  /** @undocumented */
  getLogHandler(): LogHandler {
    return this.logs?.handler
  }
  /** @undocumented */
  setLogHandler(handler: LogHandler): this {
    this.logs = {...this.logs, handler}
    return this
  }

  /** @undocumented */
  get debugScreenshots(): DebugScreenshotProvider {
    return this._config.debugScreenshots
  }
  /** @undocumented */
  set debugScreenshots(debugScreenshots: DebugScreenshotProvider) {
    this._config.debugScreenshots = debugScreenshots
  }
  /** @undocumented */
  getSaveDebugScreenshots(): boolean {
    return this.debugScreenshots?.save ?? false
  }
  /** @undocumented */
  setSaveDebugScreenshots(save: boolean): this {
    this.debugScreenshots = {...this.debugScreenshots, save}
    return this
  }
  /** @undocumented */
  getDebugScreenshotsPath(): string {
    return this.debugScreenshots?.path
  }
  /** @undocumented */
  setDebugScreenshotsPath(path: string): this {
    this.debugScreenshots = {...this.debugScreenshots, path}
    return this
  }
  /** @undocumented */
  getDebugScreenshotsPrefix(): string {
    return this.debugScreenshots?.prefix
  }
  /** @undocumented */
  setDebugScreenshotsPrefix(prefix: string): this {
    this.debugScreenshots = {...this.debugScreenshots, prefix}
    return this
  }

  get appName(): string {
    return this._config.appName
  }
  set appName(appName: string) {
    utils.guard.isString(appName, {name: 'appName', strict: false})
    this._config.appName = appName
  }
  getAppName(): string {
    return this.appName
  }
  setAppName(appName: string): this {
    this.appName = appName
    return this
  }

  get testName(): string {
    return this._config.testName
  }
  set testName(testName: string) {
    utils.guard.isString(testName, {name: 'testName', strict: false})
    this._config.testName = testName
  }
  getTestName(): string {
    return this.testName
  }
  setTestName(testName: string): this {
    this.testName = testName
    return this
  }

  get displayName(): string {
    return this._config.displayName
  }
  set displayName(displayName: string) {
    utils.guard.isString(displayName, {name: 'displayName', strict: false})
    this._config.displayName = displayName
  }
  getDisplayName(): string {
    return this.displayName
  }
  setDisplayName(displayName: string): this {
    this.displayName = displayName
    return this
  }

  get isDisabled(): boolean {
    return this._config.isDisabled
  }
  set isDisabled(isDisabled: boolean) {
    utils.guard.isBoolean(isDisabled, {name: 'isDisabled', strict: false})
    this._config.isDisabled = isDisabled
  }
  getIsDisabled(): boolean {
    return this.isDisabled
  }
  setIsDisabled(isDisabled: boolean): this {
    this.isDisabled = isDisabled
    return this
  }

  get matchTimeout(): number {
    return this._config.matchTimeout
  }
  set matchTimeout(matchTimeout: number) {
    utils.guard.isInteger(matchTimeout, {name: 'matchTimeout'})
    this._config.matchTimeout = matchTimeout
  }
  getMatchTimeout(): number {
    return this.matchTimeout
  }
  setMatchTimeout(matchTimeout: number): this {
    this.matchTimeout = matchTimeout
    return this
  }

  get sessionType(): SessionType {
    return this._config.sessionType
  }
  set sessionType(sessionType: SessionType) {
    this._config.sessionType = sessionType
  }
  getSessionType(): SessionType {
    return this.sessionType
  }
  setSessionType(sessionType: SessionType): this {
    this.sessionType = sessionType
    return this
  }

  get viewportSize(): RectangleSize {
    return this._config.viewportSize
  }
  set viewportSize(viewportSize: RectangleSize) {
    this._config.viewportSize = viewportSize
  }
  getViewportSize(): RectangleSizeData {
    return this.viewportSize && new RectangleSizeData(this.viewportSize)
  }
  setViewportSize(viewportSize: RectangleSize): this {
    this.viewportSize = viewportSize
    return this
  }

  get agentId(): string {
    return this._config.agentId
  }
  set agentId(agentId: string) {
    utils.guard.isString(agentId, {name: 'agentId'})
    this._config.agentId = agentId
  }
  getAgentId(): string {
    return this.agentId
  }
  setAgentId(agentId: string): this {
    this.agentId = agentId
    return this
  }

  get apiKey(): string {
    return this._config.apiKey
  }
  set apiKey(apiKey: string) {
    utils.guard.isString(apiKey, {name: 'apiKey', alpha: true, numeric: true})
    this._config.apiKey = apiKey
  }
  getApiKey(): string {
    return this.apiKey
  }
  setApiKey(apiKey: string): this {
    this.apiKey = apiKey
    return this
  }

  get serverUrl(): string {
    return this._config.serverUrl
  }
  set serverUrl(serverUrl: string) {
    utils.guard.isString(serverUrl, {name: 'serverUrl', strict: false})
    this._config.serverUrl = serverUrl
  }
  getServerUrl(): string {
    return this.serverUrl
  }
  setServerUrl(serverUrl: string): this {
    this.serverUrl = serverUrl
    return this
  }

  get proxy(): ProxySettings {
    return this._config.proxy
  }
  set proxy(proxy: ProxySettings) {
    this._config.proxy = proxy
  }
  getProxy(): ProxySettingsData {
    return new ProxySettingsData(this.proxy)
  }
  setProxy(proxy: ProxySettings): this
  setProxy(url: string, username?: string, password?: string, isHttpOnly?: boolean): this
  setProxy(isEnabled: false): this
  setProxy(
    proxyOrUrlOrIsEnabled: ProxySettings | string | false,
    username?: string,
    password?: string,
    isHttpOnly?: boolean,
  ): this {
    if (proxyOrUrlOrIsEnabled === false) {
      this.proxy = undefined
    } else if (utils.types.isString(proxyOrUrlOrIsEnabled)) {
      this.proxy = {url: proxyOrUrlOrIsEnabled, username, password, isHttpOnly}
    } else {
      this.proxy = proxyOrUrlOrIsEnabled
    }
    return this
  }

  /** @undocumented */
  get connectionTimeout(): number {
    return this._config.connectionTimeout
  }
  /** @undocumented */
  set connectionTimeout(connectionTimeout: number) {
    utils.guard.isInteger(connectionTimeout, {name: 'connectionTimeout', gte: 0})
    this._config.connectionTimeout = connectionTimeout
  }
  /** @undocumented */
  getConnectionTimeout(): number {
    return this.connectionTimeout
  }
  /** @undocumented */
  setConnectionTimeout(connectionTimeout: number): this {
    this.connectionTimeout = connectionTimeout
    return this
  }

  /** @undocumented */
  get removeSession(): boolean {
    return this._config.removeSession
  }
  /** @undocumented */
  set removeSession(removeSession: boolean) {
    utils.guard.isBoolean(removeSession, {name: 'removeSession'})
    this._config.removeSession = removeSession
  }
  /** @undocumented */
  getRemoveSession(): boolean {
    return this.removeSession
  }
  /** @undocumented */
  setRemoveSession(removeSession: boolean): this {
    this.removeSession = removeSession
    return this
  }

  /** @undocumented */
  get remoteEvents(): {serverUrl: string; accessKey?: string; timeout?: number} {
    return this._config.remoteEvents
  }
  /** @undocumented */
  set remoteEvents(remoteEvents: {serverUrl: string; accessKey?: string; timeout?: number}) {
    this._config.remoteEvents = remoteEvents
  }
  /** @undocumented */
  getRemoteEvents(): {serverUrl: string; accessKey?: string; timeout?: number} {
    return this.remoteEvents
  }
  /** @undocumented */
  setRemoteEvents(remoteEvents: {serverUrl: string; accessKey?: string; timeout?: number}): this {
    this.remoteEvents = remoteEvents
    return this
  }

  get batch(): BatchInfo {
    return this._config.batch
  }
  set batch(batch: BatchInfo) {
    this._config.batch = batch
  }
  getBatch(): BatchInfoData {
    return new BatchInfoData(this.batch)
  }
  setBatch(batch: BatchInfo): this {
    this.batch = batch
    return this
  }

  get properties(): PropertyData[] {
    return this._config.properties
  }
  set properties(properties: PropertyData[]) {
    utils.guard.isArray(properties, {name: 'properties'})
    this._config.properties = properties
  }
  getProperties(): PropertyDataData[] {
    return this.properties?.map(property => new PropertyDataData(property)) ?? []
  }
  setProperties(properties: PropertyData[]): this {
    this.properties = properties
    return this
  }
  addProperty(name: string, value: string): this
  addProperty(prop: PropertyData): this
  addProperty(propOrName: PropertyData | string, value?: string): this {
    const property = utils.types.isString(propOrName) ? {name: propOrName, value} : propOrName
    if (!this.properties) this.properties = []
    this.properties.push(property)
    return this
  }
  clearProperties(): this {
    this.properties = []
    return this
  }

  get baselineEnvName(): string {
    return this._config.baselineEnvName
  }
  set baselineEnvName(baselineEnvName: string) {
    utils.guard.isString(baselineEnvName, {name: 'baselineEnvName', strict: false})
    this._config.baselineEnvName = baselineEnvName ? baselineEnvName.trim() : undefined
  }
  getBaselineEnvName(): string {
    return this.baselineEnvName
  }
  setBaselineEnvName(baselineEnvName: string): this {
    this.baselineEnvName = baselineEnvName
    return this
  }

  get environmentName(): string {
    return this._config.environmentName
  }
  set environmentName(environmentName: string) {
    utils.guard.isString(environmentName, {name: 'environmentName', strict: false})
    this._config.environmentName = environmentName ? environmentName.trim() : undefined
  }
  getEnvironmentName(): string {
    return this.environmentName
  }
  setEnvironmentName(environmentName: string): this {
    this.environmentName = environmentName
    return this
  }

  get branchName(): string {
    return this._config.branchName
  }
  set branchName(branchName: string) {
    utils.guard.isString(branchName, {name: 'branchName'})
    this._config.branchName = branchName
  }
  getBranchName(): string {
    return this.branchName
  }
  setBranchName(branchName: string): this {
    this.branchName = branchName
    return this
  }

  get parentBranchName(): string {
    return this._config.parentBranchName
  }
  set parentBranchName(parentBranchName: string) {
    utils.guard.isString(parentBranchName, {name: 'parentBranchName'})
    this._config.parentBranchName = parentBranchName
  }
  getParentBranchName(): string {
    return this.parentBranchName
  }
  setParentBranchName(parentBranchName: string): this {
    this.parentBranchName = parentBranchName
    return this
  }

  get baselineBranchName(): string {
    return this._config.baselineBranchName
  }
  set baselineBranchName(baselineBranchName: string) {
    utils.guard.isString(baselineBranchName, {name: 'baselineBranchName'})
    this._config.baselineBranchName = baselineBranchName
  }
  getBaselineBranchName(): string {
    return this.baselineBranchName
  }
  setBaselineBranchName(baselineBranchName: string): this {
    this.baselineBranchName = baselineBranchName
    return this
  }

  get compareWithParentBranch(): boolean {
    return this._config.compareWithParentBranch
  }
  set compareWithParentBranch(compareWithParentBranch: boolean) {
    utils.guard.isBoolean(compareWithParentBranch, {name: 'compareWithParentBranch'})
    this._config.compareWithParentBranch = compareWithParentBranch
  }
  getCompareWithParentBranch(): boolean {
    return this.compareWithParentBranch
  }
  setCompareWithParentBranch(compareWithParentBranch: boolean): this {
    this.compareWithParentBranch = compareWithParentBranch
    return this
  }

  get ignoreBaseline(): boolean {
    return this._config.ignoreBaseline
  }
  set ignoreBaseline(ignoreBaseline: boolean) {
    utils.guard.isBoolean(ignoreBaseline, {name: 'ignoreBaseline'})
    this._config.ignoreBaseline = ignoreBaseline
  }
  getIgnoreBaseline(): boolean {
    return this.ignoreBaseline
  }
  setIgnoreBaseline(ignoreBaseline: boolean): this {
    this.ignoreBaseline = ignoreBaseline
    return this
  }

  get saveFailedTests(): boolean {
    return this._config.saveFailedTests
  }
  set saveFailedTests(saveFailedTests: boolean) {
    utils.guard.isBoolean(saveFailedTests, {name: 'saveFailedTests'})
    this._config.saveFailedTests = saveFailedTests
  }
  getSaveFailedTests(): boolean {
    return this.saveFailedTests
  }
  setSaveFailedTests(saveFailedTests: boolean): this {
    this.saveFailedTests = saveFailedTests
    return this
  }

  get saveNewTests(): boolean {
    return this._config.saveNewTests
  }
  set saveNewTests(saveNewTests: boolean) {
    utils.guard.isBoolean(saveNewTests, {name: 'saveNewTests'})
    this._config.saveNewTests = saveNewTests
  }
  getSaveNewTests(): boolean {
    return this.saveNewTests
  }
  setSaveNewTests(saveNewTests: boolean): this {
    this.saveNewTests = saveNewTests
    return this
  }

  get saveDiffs(): boolean {
    return this._config.saveDiffs
  }
  set saveDiffs(saveDiffs: boolean) {
    utils.guard.isBoolean(saveDiffs, {name: 'saveDiffs'})
    this._config.saveDiffs = saveDiffs
  }
  getSaveDiffs(): boolean {
    return this.saveDiffs
  }
  setSaveDiffs(saveDiffs: boolean): this {
    this.saveDiffs = saveDiffs
    return this
  }

  get sendDom(): boolean {
    return this._config.sendDom
  }
  set sendDom(sendDom: boolean) {
    utils.guard.isBoolean(sendDom, {name: 'sendDom'})
    this._config.sendDom = sendDom
  }
  getSendDom(): boolean {
    return this.sendDom
  }
  setSendDom(sendDom: boolean): this {
    this.sendDom = sendDom
    return this
  }

  get hostApp(): string {
    return this._config.hostApp
  }
  set hostApp(hostApp: string) {
    this._config.hostApp = hostApp ? hostApp.trim() : undefined
  }
  getHostApp(): string {
    return this.hostApp
  }
  setHostApp(hostApp: string): this {
    this.hostApp = hostApp
    return this
  }

  get hostOS(): string {
    return this._config.hostOS
  }
  set hostOS(hostOS: string) {
    this._config.hostOS = hostOS ? hostOS.trim() : undefined
  }
  getHostOS(): string {
    return this.hostOS
  }
  setHostOS(hostOS: string): this {
    this.hostOS = hostOS
    return this
  }

  get hostAppInfo(): string {
    return this._config.hostAppInfo
  }
  set hostAppInfo(hostAppInfo: string) {
    this._config.hostAppInfo = hostAppInfo ? hostAppInfo.trim() : undefined
  }
  getHostAppInfo(): string {
    return this.hostAppInfo
  }
  setHostAppInfo(hostAppInfo: string): this {
    this.hostAppInfo = hostAppInfo
    return this
  }

  get hostOSInfo(): string {
    return this._config.hostOSInfo
  }
  set hostOSInfo(hostOSInfo: string) {
    this._config.hostOSInfo = hostOSInfo ? hostOSInfo.trim() : undefined
  }
  getHostOSInfo(): string {
    return this.hostOSInfo
  }
  setHostOSInfo(hostOSInfo: string): this {
    this.hostOSInfo = hostOSInfo
    return this
  }

  get deviceInfo(): string {
    return this._config.deviceInfo
  }
  set deviceInfo(deviceInfo: string) {
    this._config.deviceInfo = deviceInfo ? deviceInfo.trim() : undefined
  }
  getDeviceInfo(): string {
    return this._config.deviceInfo
  }
  setDeviceInfo(deviceInfo: string): this {
    this.deviceInfo = deviceInfo
    return this
  }

  get defaultMatchSettings(): ImageMatchSettings {
    return this._config.defaultMatchSettings
  }
  set defaultMatchSettings(defaultMatchSettings: ImageMatchSettings) {
    utils.guard.notNull(defaultMatchSettings, {name: 'defaultMatchSettings'})
    this._config.defaultMatchSettings = defaultMatchSettings
  }
  getDefaultMatchSettings(): ImageMatchSettings {
    return new ImageMatchSettingsData(this.defaultMatchSettings)
  }
  setDefaultMatchSettings(defaultMatchSettings: ImageMatchSettings): this {
    this.defaultMatchSettings = defaultMatchSettings
    return this
  }
  getMatchLevel(): MatchLevel {
    return this.defaultMatchSettings?.matchLevel
  }
  setMatchLevel(matchLevel: MatchLevel): this {
    if (!this.defaultMatchSettings) this.defaultMatchSettings = {}
    this.defaultMatchSettings.matchLevel = matchLevel
    return this
  }
  getAccessibilityValidation(): AccessibilitySettings {
    return this.defaultMatchSettings?.accessibilitySettings
  }
  setAccessibilityValidation(accessibilityValidation: AccessibilitySettings): this {
    if (!this.defaultMatchSettings) this.defaultMatchSettings = {}
    this.defaultMatchSettings.accessibilitySettings = accessibilityValidation
    return this
  }
  getUseDom(): boolean {
    return this.defaultMatchSettings?.useDom
  }
  setUseDom(useDom: boolean): this {
    if (!this.defaultMatchSettings) this.defaultMatchSettings = {}
    this.defaultMatchSettings.useDom = useDom
    return this
  }
  getEnablePatterns(): boolean {
    return this.defaultMatchSettings?.enablePatterns
  }
  setEnablePatterns(enablePatterns: boolean): this {
    if (!this.defaultMatchSettings) this.defaultMatchSettings = {}
    this.defaultMatchSettings.enablePatterns = enablePatterns
    return this
  }
  getIgnoreDisplacements(): boolean {
    return this.defaultMatchSettings?.ignoreDisplacements
  }
  setIgnoreDisplacements(ignoreDisplacements: boolean): this {
    if (!this.defaultMatchSettings) this.defaultMatchSettings = {}
    this.defaultMatchSettings.ignoreDisplacements = ignoreDisplacements
    return this
  }
  getIgnoreCaret(): boolean {
    return this.defaultMatchSettings?.ignoreCaret
  }
  setIgnoreCaret(ignoreCaret: boolean): this {
    if (!this.defaultMatchSettings) this.defaultMatchSettings = {}
    this.defaultMatchSettings.ignoreCaret = ignoreCaret
    return this
  }

  get forceFullPageScreenshot(): boolean {
    return this._config.forceFullPageScreenshot
  }
  set forceFullPageScreenshot(forceFullPageScreenshot: boolean) {
    this._config.forceFullPageScreenshot = forceFullPageScreenshot
  }
  getForceFullPageScreenshot(): boolean {
    return this.forceFullPageScreenshot
  }
  setForceFullPageScreenshot(forceFullPageScreenshot: boolean): this {
    this.forceFullPageScreenshot = forceFullPageScreenshot
    return this
  }

  get waitBeforeScreenshots(): number {
    return this._config.waitBeforeScreenshots
  }
  set waitBeforeScreenshots(waitBeforeScreenshots: number) {
    utils.guard.isInteger(waitBeforeScreenshots, {name: 'waitBeforeScreenshots', gt: 0})
    this._config.waitBeforeScreenshots = waitBeforeScreenshots
  }
  getWaitBeforeScreenshots(): number {
    return this.waitBeforeScreenshots
  }
  setWaitBeforeScreenshots(waitBeforeScreenshots: number): this {
    this.waitBeforeScreenshots = waitBeforeScreenshots
    return this
  }

  get stitchMode(): StitchMode {
    return this._config.stitchMode
  }
  set stitchMode(stitchMode: StitchMode) {
    utils.guard.isEnumValue(stitchMode, StitchMode, {name: 'stitchMode'})
    this._config.stitchMode = stitchMode
  }
  getStitchMode(): StitchMode {
    return this.stitchMode
  }
  setStitchMode(stitchMode: StitchMode): this {
    this.stitchMode = stitchMode
    return this
  }

  get hideScrollbars(): boolean {
    return this._config.hideScrollbars
  }
  set hideScrollbars(hideScrollbars: boolean) {
    this._config.hideScrollbars = hideScrollbars
  }
  getHideScrollbars(): boolean {
    return this.hideScrollbars
  }
  setHideScrollbars(hideScrollbars: boolean): this {
    this.hideScrollbars = hideScrollbars
    return this
  }

  get hideCaret(): boolean {
    return this._config.hideCaret
  }
  set hideCaret(hideCaret: boolean) {
    this._config.hideCaret = hideCaret
  }
  getHideCaret(): boolean {
    return this.hideCaret
  }
  setHideCaret(hideCaret: boolean): this {
    this.hideCaret = hideCaret
    return this
  }

  get stitchOverlap(): number {
    return this._config.stitchOverlap
  }
  set stitchOverlap(stitchOverlap: number) {
    utils.guard.isInteger(stitchOverlap, {name: 'stitchOverlap', strict: false})
    this._config.stitchOverlap = stitchOverlap
  }
  getStitchOverlap(): number {
    return this.stitchOverlap
  }
  setStitchOverlap(stitchOverlap: number): this {
    this.stitchOverlap = stitchOverlap
    return this
  }

  get scrollRootElement(): TElement | TSelector {
    return this._config.scrollRootElement
  }
  set scrollRootElement(scrollRootElement: TElement | TSelector) {
    utils.guard.custom(scrollRootElement, value => this._spec.isElement(value) || this._spec.isSelector(value), {
      name: 'scrollRootElement',
      message: 'must be element or selector',
      strict: false,
    })
    this._config.scrollRootElement = scrollRootElement
  }
  getScrollRootElement(): TElement | TSelector {
    return this.scrollRootElement
  }
  setScrollRootElement(scrollRootElement: TElement | TSelector): this {
    this.scrollRootElement = scrollRootElement
    return this
  }

  get cut(): CutProvider {
    return this._config.cut
  }
  set cut(cut: CutProvider) {
    this._config.cut = cut
  }
  getCut(): CutProvider {
    return this._config.cut
  }
  setCut(cut: CutProvider): this {
    this.cut = cut
    return this
  }

  get rotation(): ImageRotation {
    return this._config.rotation
  }
  set rotation(rotation: ImageRotation) {
    this._config.rotation = rotation
  }
  getRotation(): ImageRotationData {
    return new ImageRotationData(this.rotation)
  }
  setRotation(rotation: ImageRotation | ImageRotationData): this {
    this.rotation = utils.types.isNumber(rotation) ? rotation : rotation.rotation
    return this
  }

  get scaleRatio(): number {
    return this._config.scaleRatio
  }
  set scaleRatio(scaleRatio: number) {
    utils.guard.isNumber(scaleRatio, {name: 'scaleRatio', strict: false})
    this._config.scaleRatio = scaleRatio
  }
  getScaleRatio(): number {
    return this.scaleRatio
  }
  setScaleRatio(scaleRatio: number): this {
    this.scaleRatio = scaleRatio
    return this
  }

  /** @undocumented */
  get concurrentSessions(): number {
    return this._config.concurrentSessions
  }
  /** @undocumented */
  set concurrentSessions(concurrentSessions: number) {
    this._config.concurrentSessions = concurrentSessions
  }
  /** @undocumented */
  getConcurrentSessions(): number {
    return this.concurrentSessions
  }
  /** @undocumented */
  setConcurrentSessions(concurrentSessions: number): this {
    this.concurrentSessions = concurrentSessions
    return this
  }

  get browsersInfo(): RenderInfo[] {
    return this._config.browsersInfo
  }
  set browsersInfo(browsersInfo: RenderInfo[]) {
    utils.guard.isArray(browsersInfo, {name: 'browsersInfo'})
    this._config.browsersInfo = browsersInfo
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
    if (!this.browsersInfo) this.browsersInfo = []
    this.browsersInfo.push(...browsersInfo)
    return this
  }
  addBrowser(browserInfo: RenderInfo): this
  addBrowser(width: number, height: number, name?: BrowserName): this
  addBrowser(browserInfoOrWidth: RenderInfo | number, height?: number, name: BrowserName = BrowserName.CHROME) {
    if (utils.types.isObject(browserInfoOrWidth)) return this.addBrowsers(browserInfoOrWidth)
    else return this.addBrowsers({width: browserInfoOrWidth, height, name})
  }
  addDeviceEmulation(deviceName: DeviceName, screenOrientation = ScreenOrientation.PORTRAIT) {
    if (!this.browsersInfo) this.browsersInfo = []
    this.browsersInfo.push({deviceName, screenOrientation})
    return this
  }

  get visualGridOptions(): {[key: string]: any} {
    return this._config.visualGridOptions
  }
  set visualGridOptions(visualGridOptions: {[key: string]: any}) {
    this._config.visualGridOptions = visualGridOptions
  }
  getVisualGridOptions(): {[key: string]: any} {
    return this.visualGridOptions
  }
  setVisualGridOptions(visualGridOptions: {[key: string]: any}): this {
    this.visualGridOptions = visualGridOptions
    return this
  }
  setVisualGridOption(key: string, value: any): this {
    if (!this.visualGridOptions) this.visualGridOptions = {}
    this.visualGridOptions[key] = value
    return this
  }

  get layoutBreakpoints(): boolean | number[] {
    return this._config.layoutBreakpoints
  }
  set layoutBreakpoints(layoutBreakpoints: boolean | number[]) {
    utils.guard.notNull(layoutBreakpoints, {name: 'layoutBreakpoints'})
    if (utils.types.isArray(layoutBreakpoints)) {
      this._config.layoutBreakpoints = layoutBreakpoints.length > 0 ? layoutBreakpoints : false
    } else {
      this._config.layoutBreakpoints = layoutBreakpoints
    }
  }
  getLayoutBreakpoints(): boolean | number[] {
    return this.layoutBreakpoints
  }
  setLayoutBreakpoints(layoutBreakpoints: boolean | number[]): this {
    this.layoutBreakpoints = layoutBreakpoints
    return this
  }

  get disableBrowserFetching(): boolean {
    return this._config.disableBrowserFetching
  }
  set disableBrowserFetching(disableBrowserFetching: boolean) {
    this._config.disableBrowserFetching = disableBrowserFetching
  }
  getDisableBrowserFetching(): boolean {
    return this.disableBrowserFetching
  }
  setDisableBrowserFetching(disableBrowserFetching: boolean): this {
    this.disableBrowserFetching = disableBrowserFetching
    return this
  }

  /** @undocumented */
  get dontCloseBatches(): boolean {
    return this._config.dontCloseBatches
  }
  /** @undocumented */
  set dontCloseBatches(dontCloseBatches: boolean) {
    this._config.dontCloseBatches = dontCloseBatches
  }
  /** @undocumented */
  getDontCloseBatches(): boolean {
    return this.dontCloseBatches
  }
  /** @undocumented */
  setDontCloseBatches(dontCloseBatches: boolean): this {
    this.dontCloseBatches = dontCloseBatches
    return this
  }

  /** @internal */
  toObject(): Configuration<TElement, TSelector> {
    return this._config
  }

  /** @internal */
  toJSON(): Configuration<TElement, TSelector> {
    return utils.general.toJSON(this._config)
  }

  /** @internal */
  toString() {
    return utils.general.toString(this)
  }
}
