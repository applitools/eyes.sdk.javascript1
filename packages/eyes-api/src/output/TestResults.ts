import type {Mutable} from '@applitools/utils'
import * as utils from '@applitools/utils'
import {TestResultsStatus, TestResultsStatusEnum} from '../enums/TestResultsStatus'
import {RectangleSize, RectangleSizeData} from '../input/RectangleSize'
import {TestAccessibilityStatus} from './TestAccessibilityStatus'
import {SessionUrls, SessionUrlsData} from './SessionUrls'
import {StepInfo, StepInfoData} from './StepInfo'

export type TestResults = {
  readonly testId?: string
  readonly name?: string
  readonly secretToken?: string
  readonly status?: TestResultsStatus
  readonly appName?: string
  readonly batchId?: string
  readonly batchName?: string
  readonly branchName?: string
  readonly hostOS?: string
  readonly hostApp?: string
  readonly hostDisplaySize?: RectangleSize
  readonly accessibilityStatus?: TestAccessibilityStatus
  readonly startedAt?: Date | string
  readonly duration?: number
  readonly isNew?: boolean
  readonly isDifferent?: boolean
  readonly isAborted?: boolean
  readonly appUrls?: SessionUrls
  readonly apiUrls?: SessionUrls
  readonly stepsInfo?: StepInfo[]
  readonly steps?: number
  readonly matches?: number
  readonly mismatches?: number
  readonly missing?: number
  readonly exactMatches?: number
  readonly strictMatches?: number
  readonly contentMatches?: number
  readonly layoutMatches?: number
  readonly noneMatches?: number
  readonly url?: string
}

export class TestResultsData implements Required<TestResults> {
  private _results: Mutable<TestResults> = {} as any
  private readonly _deleteTest: (options: {testId: string; batchId: string; secretToken: string}) => Promise<void>

  /** @internal */
  constructor(
    results?: TestResults,
    deleteTest?: (options: {testId: string; batchId: string; secretToken: string}) => Promise<void>,
  ) {
    this._deleteTest = deleteTest
    if (!results) return this
    this._results = results instanceof TestResultsData ? results.toJSON() : results
  }

  get testId(): string {
    return this._results.testId
  }
  getId(): string {
    return this.testId
  }
  /** @deprecated */
  setId(id: string) {
    this._results.testId = id
  }

  get name(): string {
    return this._results.name
  }
  getName(): string {
    return this.name
  }
  /** @deprecated */
  setName(name: string) {
    this._results.name = name
  }

  get secretToken(): string {
    return this._results.secretToken
  }
  getSecretToken(): string {
    return this.secretToken
  }
  /** @deprecated */
  setSecretToken(secretToken: string) {
    this._results.secretToken = secretToken
  }

  get status(): TestResultsStatus {
    return this._results.status
  }
  getStatus(): TestResultsStatusEnum {
    return this.status as TestResultsStatusEnum
  }
  /** @deprecated */
  setStatus(status: TestResultsStatusEnum) {
    this._results.status = status
  }

  get appName(): string {
    return this._results.appName
  }
  getAppName(): string {
    return this.appName
  }
  /** @deprecated */
  setAppName(appName: string) {
    this._results.appName = appName
  }

  get batchName(): string {
    return this._results.batchName
  }
  getBatchName(): string {
    return this.batchName
  }
  /** @deprecated */
  setBatchName(batchName: string) {
    this._results.batchName = batchName
  }

  get batchId(): string {
    return this._results.batchId
  }
  getBatchId(): string {
    return this.batchId
  }
  /** @deprecated */
  setBatchId(batchId: string) {
    this._results.batchId = batchId
  }

  get branchName(): string {
    return this._results.batchName
  }
  getBranchName(): string {
    return this.branchName
  }
  /** @deprecated */
  setBranchName(branchName: string) {
    this._results.branchName = branchName
  }

  get hostOS(): string {
    return this._results.hostOS
  }
  getHostOS(): string {
    return this.hostOS
  }
  /** @deprecated */
  setHostOS(hostOS: string) {
    this._results.hostOS = hostOS
  }

  get hostApp(): string {
    return this._results.hostApp
  }
  getHostApp(): string {
    return this.hostApp
  }
  /** @deprecated */
  setHostApp(hostApp: string) {
    this._results.hostApp = hostApp
  }

  get hostDisplaySize(): RectangleSize {
    return this._results.hostDisplaySize
  }
  getHostDisplaySize(): RectangleSizeData {
    return new RectangleSizeData(this.hostDisplaySize)
  }
  /** @deprecated */
  setHostDisplaySize(hostDisplaySize: RectangleSize) {
    this._results.hostDisplaySize = hostDisplaySize
  }

  get accessibilityStatus(): TestAccessibilityStatus {
    return this._results.accessibilityStatus
  }
  getAccessibilityStatus(): TestAccessibilityStatus {
    return this.accessibilityStatus
  }
  /** @deprecated */
  setAccessibilityStatus(accessibilityStatus: TestAccessibilityStatus) {
    this._results.accessibilityStatus = accessibilityStatus
  }

  get startedAt(): Date | string {
    return this._results.startedAt
  }
  getStartedAt(): Date {
    return new Date(this.startedAt)
  }
  /** @deprecated */
  setStartedAt(startedAt: Date | string) {
    this._results.startedAt = startedAt
  }

  get duration(): number {
    return this._results.duration
  }
  getDuration(): number {
    return this.duration
  }
  /** @deprecated */
  setDuration(duration: number) {
    this._results.duration = duration
  }

  get isNew(): boolean {
    return this._results.isNew
  }
  getIsNew(): boolean {
    return this.isNew
  }
  /** @deprecated */
  setIsNew(isNew: boolean) {
    this._results.isNew = isNew
  }

  get isDifferent(): boolean {
    return this._results.isDifferent
  }
  getIsDifferent(): boolean {
    return this.isDifferent
  }
  /** @deprecated */
  setIsDifferent(isDifferent: boolean) {
    this._results.isDifferent = isDifferent
  }

  get isAborted(): boolean {
    return this._results.isAborted
  }
  getIsAborted(): boolean {
    return this.isAborted
  }
  /** @deprecated */
  setIsAborted(isAborted: boolean) {
    this._results.isAborted = isAborted
  }

  get appUrls(): SessionUrls {
    return this._results.appUrls
  }
  getAppUrls(): SessionUrlsData {
    return new SessionUrlsData(this.appUrls)
  }
  /** @deprecated */
  setAppUrls(appUrls: SessionUrls) {
    this._results.appUrls = appUrls
  }

  get apiUrls(): SessionUrls {
    return this._results.apiUrls
  }
  getApiUrls(): SessionUrlsData {
    return new SessionUrlsData(this.apiUrls)
  }
  /** @deprecated */
  setApiUrls(apiUrls: SessionUrls) {
    this._results.apiUrls = apiUrls
  }

  get stepsInfo(): StepInfo[] {
    return this._results.stepsInfo
  }
  getStepsInfo(): StepInfoData[] {
    return this.stepsInfo.map(info => new StepInfoData(info))
  }
  /** @deprecated */
  setStepsInfo(stepInfo: StepInfo[]) {
    this._results.stepsInfo = stepInfo
  }

  get steps(): number {
    return this._results.steps
  }
  getSteps(): number {
    return this.steps
  }
  /** @deprecated */
  setSteps(steps: number) {
    this._results.steps = steps
  }

  get matches(): number {
    return this._results.matches
  }
  getMatches(): number {
    return this.matches
  }
  /** @deprecated */
  setMatches(matches: number) {
    this._results.matches = matches
  }

  get mismatches(): number {
    return this._results.mismatches
  }
  getMismatches(): number {
    return this.mismatches
  }
  /** @deprecated */
  setMismatches(mismatches: number) {
    this._results.mismatches = mismatches
  }

  get missing(): number {
    return this._results.missing
  }
  getMissing(): number {
    return this.missing
  }
  /** @deprecated */
  setMissing(missing: number) {
    this._results.missing = missing
  }

  get exactMatches(): number {
    return this._results.exactMatches
  }
  getExactMatches(): number {
    return this.exactMatches
  }
  /** @deprecated */
  setExactMatches(exactMatches: number) {
    this._results.exactMatches = exactMatches
  }

  get strictMatches(): number {
    return this._results.strictMatches
  }
  getStrictMatches(): number {
    return this.strictMatches
  }
  /** @deprecated */
  setStrictMatches(strictMatches: number) {
    this._results.strictMatches = strictMatches
  }

  get contentMatches(): number {
    return this._results.contentMatches
  }
  getContentMatches(): number {
    return this.contentMatches
  }
  /** @deprecated */
  setContentMatches(contentMatches: number) {
    this._results.contentMatches = contentMatches
  }

  get layoutMatches(): number {
    return this._results.layoutMatches
  }
  getLayoutMatches(): number {
    return this.layoutMatches
  }
  /** @deprecated */
  setLayoutMatches(layoutMatches: number) {
    this._results.layoutMatches = layoutMatches
  }

  get noneMatches(): number {
    return this._results.noneMatches
  }
  getNoneMatches(): number {
    return this.noneMatches
  }
  /** @deprecated */
  setNoneMatches(noneMatches: number) {
    this._results.noneMatches = noneMatches
  }

  get url(): string {
    return this._results.url
  }
  getUrl(): string {
    return this.url
  }
  /** @deprecated */
  setUrl(url: string) {
    this._results.url = url
  }

  isPassed(): boolean {
    return this._results.status === TestResultsStatusEnum.Passed
  }

  async delete(): Promise<void> {
    if (!this._deleteTest) return
    return this._deleteTest({testId: this.testId, batchId: this.batchId, secretToken: this.secretToken})
  }
  /** @deprecated */
  async deleteSession(): Promise<void> {
    await this.delete()
  }

  /** @internal */
  toObject(): TestResults {
    return this._results
  }

  /** @internal */
  toJSON(): TestResults {
    return utils.general.toJSON(this._results)
  }

  /** @internal */
  toString() {
    return utils.general.toString(this)
  }
}
