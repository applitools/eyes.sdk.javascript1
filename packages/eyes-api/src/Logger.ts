import type * as logger from '@applitools/logger'
import * as utils from '@applitools/utils'
import makeLogger from '@applitools/logger'
import {
  LogHandler,
  LogHandlerData,
  FileLogHandlerData,
  ConsoleLogHandlerData,
  NullLogHandlerData,
} from './input/LogHandler'

export class Logger implements logger.Logger {
  private _logger: logger.Logger
  private _handler: LogHandler
  private _show: boolean
  private _label: string

  private _makeLogger() {
    return makeLogger({
      handler: this._handler instanceof LogHandlerData ? this._handler.toJSON() : undefined,
      level: this._show ? 'info' : 'silent',
      label: this._label,
    })
  }

  /** @internal */
  readonly isLogger = true

  /** @internal */
  constructor(logger?: logger.Logger)
  constructor(options?: {show?: boolean; label?: string; handler?: LogHandler})
  constructor(show?: boolean)
  constructor(
    loggerOrOptionsOrShow: logger.Logger | {show?: boolean; label?: string; handler?: LogHandler} | boolean = false,
  ) {
    if (utils.types.isBoolean(loggerOrOptionsOrShow)) {
      return new Logger({show: loggerOrOptionsOrShow})
    } else if (utils.types.has(loggerOrOptionsOrShow, ['log', 'console'])) {
      this._logger = loggerOrOptionsOrShow
    } else {
      this._show = loggerOrOptionsOrShow.show
      this._label = loggerOrOptionsOrShow.label
      this._handler = loggerOrOptionsOrShow.handler
    }
  }

  /** @internal */
  get console() {
    return this._logger.console
  }

  getLogHandler(): LogHandlerData {
    if (!this._handler) {
      return new NullLogHandlerData()
    } else if (!utils.types.has(this._handler, 'type')) {
      return this._handler as LogHandlerData
    } else if (this._handler.type === 'file') {
      return new FileLogHandlerData(true, this._handler.filename, this._handler.append)
    } else if (this._handler.type === 'console') {
      return new ConsoleLogHandlerData(true)
    }
  }
  setLogHandler(handler: LogHandler) {
    this._handler = handler
  }

  verbose(...messages: any[]) {
    if (!this._logger) this._logger = this._makeLogger()
    messages.forEach(message => this._logger.log(message))
  }

  log(...messages: any[]) {
    if (!this._logger) this._logger = this._makeLogger()
    messages.forEach(message => this._logger.log(message))
  }

  warn(...messages: any[]) {
    if (!this._logger) this._logger = this._makeLogger()
    messages.forEach(message => this._logger.warn(message))
  }

  error(...messages: any[]) {
    if (!this._logger) this._logger = this._makeLogger()
    messages.forEach(message => this._logger.error(message))
  }

  fatal(...messages: any[]) {
    if (!this._logger) this._logger = this._makeLogger()
    messages.forEach(message => this._logger.fatal(message))
  }

  open() {
    this._logger.open()
  }

  close() {
    this._logger.open()
  }

  extend(label?: string, color?: logger.Style | logger.Style[]): Logger {
    if (this._logger) return new Logger(this._logger.extend(label, color))
    return new Logger({show: this._show, label, handler: this._handler})
  }
}
