import * as utils from '@applitools/utils'
import TestResultsStatus from '../enums/TestResultsStatus'
import AccessibilityLevel from '../enums/AccessibilityLevel'
import AccessibilityGuidelinesVersion from '../enums/AccessibilityGuidelinesVersion'
import AccessibilityStatus from '../enums/AccessibilityStatus'
import RectangleSizeData, {RectangleSize} from '../input/RectangleSize'
import SessionUrlsData, {SessionUrls} from './SessionUrls'
import StepInfoData, {StepInfo} from './StepInfo'

export type TestAccessibilityStatus = {
  level: AccessibilityLevel
  version: AccessibilityGuidelinesVersion
  status: AccessibilityStatus
}

export type TestResults = {
  id?: string
  name?: string
  secretToken?: string
  status?: TestResultsStatus
  appName?: string
  batchName?: string
  batchId?: string
  branchName?: string
  hostOS?: string
  hostApp?: string
  hostDisplaySize?: RectangleSize
  accessibilityStatus?: TestAccessibilityStatus
  startedAt?: string
  duration?: number
  isNew?: boolean
  isDifferent?: boolean
  isAborted?: boolean
  appUrls?: SessionUrls
  apiUrls?: SessionUrls
  stepsInfo?: StepInfo[]
  steps?: number
  matches?: number
  mismatches?: number
  missing?: number
  exactMatches?: number
  strictMatches?: number
  contentMatches?: number
  layoutMatches?: number
  noneMatches?: number
  url?: string
}

export default class TestResultsData implements Required<TestResults> {
  private _id: string
  private _name: string
  private _secretToken: string
  private _status: TestResultsStatus
  private _appName: string
  private _batchName: string
  private _batchId: string
  private _branchName: string
  private _hostOS: string
  private _hostApp: string
  private _hostDisplaySize: RectangleSizeData
  private _accessibilityStatus: TestAccessibilityStatus
  private _startedAt: Date
  private _duration: number
  private _isNew: boolean
  private _isDifferent: boolean
  private _isAborted: boolean
  private _appUrls: SessionUrlsData
  private _apiUrls: SessionUrlsData
  private _stepsInfo: StepInfoData[]
  private _steps: number
  private _matches: number
  private _mismatches: number
  private _missing: number
  private _exactMatches: number
  private _strictMatches: number
  private _contentMatches: number
  private _layoutMatches: number
  private _noneMatches: number
  private _url: string

  constructor(results?: TestResults) {
    if (!results) return this
    const self = this as any
    for (const [key, value] of Object.entries(results)) {
      if (key in this && !key.startsWith('_')) {
        self[key] = value
      }
    }
  }

  get id(): string {
    return this._id
  }
  set id(id: string) {
    this._id = id
  }
  getId(): string {
    return this._id
  }
  setId(id: string) {
    this.id = id
  }

  get name(): string {
    return this._name
  }
  set name(name: string) {
    this._name = name
  }
  getName(): string {
    return this._name
  }
  setName(name: string) {
    this.name = name
  }

  get secretToken(): string {
    return this._secretToken
  }
  set secretToken(secretToken: string) {
    this._secretToken = secretToken
  }
  getSecretToken(): string {
    return this._secretToken
  }
  setSecretToken(secretToken: string) {
    this.secretToken = secretToken
  }

  get status(): TestResultsStatus {
    return this._status
  }
  set status(status: TestResultsStatus) {
    this._status = status
  }
  getStatus(): TestResultsStatus {
    return this._status
  }
  setStatus(status: TestResultsStatus) {
    this.status = status
  }

  get appName(): string {
    return this._appName
  }
  set appName(appName: string) {
    this._appName = appName
  }
  getAppName(): string {
    return this._appName
  }
  setAppName(appName: string) {
    this.appName = appName
  }

  get batchName(): string {
    return this._batchName
  }
  set batchName(batchName: string) {
    this._batchName = batchName
  }
  getBatchName(): string {
    return this._batchName
  }
  setBatchName(batchName: string) {
    this.batchName = batchName
  }

  get batchId(): string {
    return this._batchId
  }
  set batchId(batchId: string) {
    this._batchId = batchId
  }
  getBatchId(): string {
    return this._batchId
  }
  setBatchId(batchId: string) {
    this.batchId = batchId
  }

  get branchName(): string {
    return this._batchName
  }
  set branchName(branchName: string) {
    this._batchName = branchName
  }
  getBranchName(): string {
    return this._branchName
  }
  setBranchName(branchName: string) {
    this.branchName = branchName
  }

  get hostOS(): string {
    return this._hostOS
  }
  set hostOS(hostOS: string) {
    this._hostOS = hostOS
  }
  getHostOS(): string {
    return this._hostOS
  }
  setHostOS(hostOS: string) {
    this.hostOS = hostOS
  }

  get hostApp(): string {
    return this._hostApp
  }
  set hostApp(hostApp: string) {
    this._hostApp = hostApp
  }
  getHostApp(): string {
    return this._hostApp
  }
  setHostApp(hostApp: string) {
    this.hostApp = hostApp
  }

  get hostDisplaySize(): RectangleSize {
    return this._hostDisplaySize
  }
  set hostDisplaySize(hostDisplaySize: RectangleSize) {
    this._hostDisplaySize = new RectangleSizeData(hostDisplaySize)
  }
  getHostDisplaySize(): RectangleSizeData {
    return this._hostDisplaySize
  }
  setHostDisplaySize(hostDisplaySize: RectangleSize | RectangleSizeData) {
    this.hostDisplaySize = hostDisplaySize
  }

  get accessibilityStatus(): TestAccessibilityStatus {
    return this._accessibilityStatus
  }
  set accessibilityStatus(accessibilityStatus: TestAccessibilityStatus) {
    this._accessibilityStatus = accessibilityStatus
  }
  getAccessibilityStatus(): TestAccessibilityStatus {
    return this._accessibilityStatus
  }
  setAccessibilityStatus(accessibilityStatus: TestAccessibilityStatus) {
    this.accessibilityStatus = accessibilityStatus
  }

  get startedAt(): string {
    return this._startedAt.toISOString()
  }
  set startedAt(startedAt: string) {
    this._startedAt = new Date(startedAt)
  }
  getStartedAt(): Date {
    return this._startedAt
  }
  setStartedAt(startedAt: Date | string) {
    this._startedAt = new Date(startedAt)
  }

  get duration(): number {
    return this._duration
  }
  set duration(duration: number) {
    this._duration = duration
  }
  getDuration(): number {
    return this._duration
  }
  setDuration(duration: number) {
    this.duration = duration
  }

  get isNew(): boolean {
    return this._isNew
  }
  set isNew(isNew: boolean) {
    this._isNew = isNew
  }
  getIsNew(): boolean {
    return this._isNew
  }
  setIsNew(isNew: boolean) {
    this.isNew = isNew
  }

  get isDifferent(): boolean {
    return this._isDifferent
  }
  set isDifferent(isDifferent: boolean) {
    this._isDifferent = isDifferent
  }
  getIsDifferent(): boolean {
    return this._isDifferent
  }
  setIsDifferent(isDifferent: boolean) {
    this.isDifferent = isDifferent
  }

  get isAborted(): boolean {
    return this._isAborted
  }
  set isAborted(isAborted: boolean) {
    this._isAborted = isAborted
  }
  getIsAborted(): boolean {
    return this._isAborted
  }
  setIsAborted(isAborted: boolean) {
    this.isAborted = isAborted
  }

  get appUrls(): SessionUrls {
    return this._appUrls
  }
  set appUrls(appUrls: SessionUrls) {
    this._appUrls = new SessionUrlsData(appUrls)
  }
  getAppUrls(): SessionUrlsData {
    return this._appUrls
  }
  setAppUrls(appUrls: SessionUrls | SessionUrlsData) {
    this.appUrls = appUrls
  }

  get apiUrls(): SessionUrls {
    return this._apiUrls
  }
  set apiUrls(apiUrls: SessionUrls) {
    this._apiUrls = new SessionUrlsData(apiUrls)
  }
  getApiUrls(): SessionUrlsData {
    return this._apiUrls
  }
  setApiUrls(apiUrls: SessionUrls | SessionUrlsData) {
    this.apiUrls = apiUrls
  }

  get stepsInfo(): StepInfo[] {
    return this._stepsInfo
  }
  set stepsInfo(stepInfo: StepInfo[]) {
    this._stepsInfo = stepInfo.map(info => new StepInfoData(info))
  }
  getStepsInfo(): StepInfoData[] {
    return this._stepsInfo
  }
  setStepsInfo(stepInfo: StepInfo[] | StepInfoData[]) {
    this.stepsInfo = stepInfo
  }

  get steps(): number {
    return this._steps
  }
  set steps(steps: number) {
    this._steps = steps
  }
  getSteps(): number {
    return this._steps
  }
  setSteps(steps: number) {
    this.steps = steps
  }

  get matches(): number {
    return this._matches
  }
  set matches(matches: number) {
    this._matches = matches
  }
  getMatches(): number {
    return this._matches
  }
  setMatches(matches: number) {
    this.matches = matches
  }

  get mismatches(): number {
    return this._mismatches
  }
  set mismatches(mismatches: number) {
    this._mismatches = mismatches
  }
  getMismatches(): number {
    return this._mismatches
  }
  setMismatches(mismatches: number) {
    this.mismatches = mismatches
  }

  get missing(): number {
    return this._missing
  }
  set missing(missing: number) {
    this._missing = missing
  }
  getMissing(): number {
    return this._missing
  }
  setMissing(missing: number) {
    this.missing = missing
  }

  get exactMatches(): number {
    return this._exactMatches
  }
  set exactMatches(exactMatches: number) {
    this._exactMatches = exactMatches
  }
  getExactMatches(): number {
    return this._exactMatches
  }
  setExactMatches(exactMatches: number) {
    this.exactMatches = exactMatches
  }

  get strictMatches(): number {
    return this._strictMatches
  }
  set strictMatches(strictMatches: number) {
    this._strictMatches = strictMatches
  }
  getStrictMatches(): number {
    return this._strictMatches
  }
  setStrictMatches(strictMatches: number) {
    this.strictMatches = strictMatches
  }

  get contentMatches(): number {
    return this._contentMatches
  }
  set contentMatches(contentMatches: number) {
    this._contentMatches = contentMatches
  }
  getContentMatches(): number {
    return this._contentMatches
  }
  setContentMatches(contentMatches: number) {
    this.contentMatches = contentMatches
  }

  get layoutMatches(): number {
    return this._layoutMatches
  }
  set layoutMatches(layoutMatches: number) {
    this._layoutMatches = layoutMatches
  }
  getLayoutMatches(): number {
    return this._layoutMatches
  }
  setLayoutMatches(layoutMatches: number) {
    this.layoutMatches = layoutMatches
  }

  get noneMatches(): number {
    return this._noneMatches
  }
  set noneMatches(noneMatches: number) {
    this._noneMatches = noneMatches
  }
  getNoneMatches(): number {
    return this._noneMatches
  }
  setNoneMatches(noneMatches: number) {
    this.noneMatches = noneMatches
  }

  get url(): string {
    return this._url
  }
  set url(url: string) {
    this._url = url
  }
  getUrl(): string {
    return this._url
  }
  setUrl(url: string) {
    this.url = url
  }

  isPassed(): boolean {
    return this._status === TestResultsStatus.Passed
  }

  toJSON(): TestResults {
    return utils.general.toJSON(this, [
      'id',
      'name',
      'status',
      'appName',
      'batchName',
      'batchId',
      'branchName',
      'hostOS',
      'hostApp',
      'hostDisplaySize',
      'accessibilityStatus',
      'startedAt',
      'duration',
      'isNew',
      'isDifferent',
      'isAborted',
      'appUrls',
      'apiUrls',
      'stepsInfo',
      'steps',
      'matches',
      'mismatches',
      'missing',
      'exactMatches',
      'strictMatches',
      'contentMatches',
      'layoutMatches',
      'noneMatches',
      'url',
    ])
  }

  toString() {
    return utils.general.toString(this)
  }
}
