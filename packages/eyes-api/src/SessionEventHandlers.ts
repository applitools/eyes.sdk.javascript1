import type {Eyes} from './Eyes'
import * as utils from '@applitools/utils'
import {RectangleSizeData} from './input/RectangleSize'
import {TestResultsData} from './output/TestResults'
import {ValidationInfoData} from './output/ValidationInfo'
import {ValidationResultData} from './output/ValidationResult'

/** @deprecated */
export abstract class SessionEventHandler {
  abstract initStarted(): any
  abstract initEnded(): any
  abstract setSizeWillStart(viewportSize: RectangleSizeData): any
  abstract setSizeEnded(): any
  abstract testStarted(sessionId: string): any
  abstract testEnded(sessionId: string, testResults: TestResultsData): any
  abstract validationWillStart(sessionId: string, validationInfo: ValidationInfoData): any
  abstract validationEnded(sessionId: string, validationId: number, validationResult: ValidationResultData): any

  private _detach: () => void

  /** @internal */
  attach(eyes: Eyes) {
    this._detach = eyes.on((name, data = {}) => {
      if (!utils.types.isFunction(this, name)) return
      const args = []
      if (name === 'setSizeWillStart') {
        args.push(new RectangleSizeData(data.viewportSize))
      } else if (['testStarted', 'validationWillStart', 'validationEnded', 'testEnded'].includes(name)) {
        args.push(data.sessionId)
        if (name === 'validationWillStart') {
          args.push(new ValidationInfoData(data.validationInfo))
        } else if (name === 'validationEnded') {
          args.push(data.validationId, new ValidationResultData(data.validationResult))
        } else if (name === 'testEnded') {
          args.push(new TestResultsData(data.testResults))
        }
      }
      this[name](...args)
    })
  }

  /** @internal */
  detach() {
    if (this._detach) this._detach()
  }
}

/** @deprecated */
export class SessionEventHandlers extends SessionEventHandler {
  private _handlers: Set<SessionEventHandler> = new Set()

  addEventHandler(handler: SessionEventHandler) {
    if (handler === this) return
    this._handlers.add(handler)
  }
  removeEventHandler(handler: SessionEventHandler) {
    if (handler === this) return
    this._handlers.delete(handler)
  }
  clearEventHandlers() {
    this._handlers.clear()
  }
  initStarted() {
    this._handlers.forEach(handler => handler.initStarted())
  }
  initEnded() {
    this._handlers.forEach(handler => handler.initEnded())
  }
  setSizeWillStart(viewportSize: RectangleSizeData) {
    this._handlers.forEach(handler => handler.setSizeWillStart(viewportSize))
  }
  setSizeEnded() {
    this._handlers.forEach(handler => handler.setSizeEnded())
  }
  testStarted(sessionId: string) {
    this._handlers.forEach(handler => handler.testStarted(sessionId))
  }
  testEnded(sessionId: string, testResults: TestResultsData) {
    this._handlers.forEach(handler => handler.testEnded(sessionId, testResults))
  }
  validationWillStart(sessionId: string, validationInfo: ValidationInfoData) {
    this._handlers.forEach(handler => handler.validationWillStart(sessionId, validationInfo))
  }
  validationEnded(sessionId: string, validationId: number, validationResult: ValidationResultData) {
    this._handlers.forEach(handler => handler.validationEnded(sessionId, validationId, validationResult))
  }
}

/**
 * @undocumented
 * @deprecated
 */
export class RemoteSessionEventHandler extends SessionEventHandler {
  private _serverUrl: string
  private _accessKey: string
  private _timeout: number

  constructor(options: {serverUrl: string; accessKey?: string; timeout?: number})
  constructor(serverUrl: string, accessKey?: string, timeout?: number)
  constructor(
    optionsOrServerUrl: {serverUrl: string; accessKey?: string; timeout?: number} | string,
    accessKey?: string,
    timeout?: number,
  ) {
    super()
    if (utils.types.isString(optionsOrServerUrl)) {
      return new RemoteSessionEventHandler({serverUrl: optionsOrServerUrl, accessKey, timeout})
    }
    this._serverUrl = optionsOrServerUrl.serverUrl
    this._accessKey = optionsOrServerUrl.accessKey
    this._timeout = optionsOrServerUrl.timeout
  }

  get serverUrl(): string {
    return this._serverUrl
  }
  set serverUrl(serverUrl: string) {
    this._serverUrl = serverUrl
  }
  getServerUrl() {
    return this._serverUrl
  }
  setServerUrl(serverUrl: string) {
    this.serverUrl = serverUrl
  }

  get accessKey(): string {
    return this._accessKey
  }
  set accessKey(accessKey: string) {
    this._accessKey = accessKey
  }
  getAccessKey(): string {
    return this.accessKey
  }
  setAccessKey(accessKey: string) {
    this._accessKey = accessKey
  }

  get timeout(): number {
    return this._timeout
  }
  set timeout(timeout: number) {
    this._timeout = timeout
  }
  setTimeout(timeout: number) {
    this._timeout = timeout
  }
  getTimeout(): number {
    return this._timeout
  }

  initStarted(): void {
    return undefined
  }
  initEnded(): void {
    return undefined
  }
  setSizeWillStart(): void {
    return undefined
  }
  setSizeEnded(): void {
    return undefined
  }
  testStarted(): void {
    return undefined
  }
  testEnded(): void {
    return undefined
  }
  validationWillStart(): void {
    return undefined
  }
  validationEnded(): void {
    return undefined
  }

  /** @internal */
  toJSON(): {serverUrl: string; accessKey: string} {
    return utils.general.toJSON(this, ['serverUrl', 'accessKey'])
  }

  /** @internal */
  toString(): string {
    return utils.general.toString(this)
  }
}
