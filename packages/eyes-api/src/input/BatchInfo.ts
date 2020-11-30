import * as utils from '@applitools/utils'

export type BatchInfo = {
  id?: string
  name?: string
  startedAt?: Date
  sequenceName?: string
  notifyOnCompletion?: boolean
  isCompleted?: boolean
  isGeneratedId?: boolean
}

export default class BatchInfoData implements Required<BatchInfo> {
  private _id: string
  private _name: string
  private _startedAt: Date
  private _sequenceName: string
  private _notifyOnCompletion: boolean
  private _isCompleted: boolean
  private _isGeneratedId: boolean

  constructor()
  constructor(batch: BatchInfo)
  constructor(name: string, startedAt?: Date | string, id?: string)
  constructor(batchOrName?: BatchInfo | string, startedAt?: Date | string, id?: string) {
    if (utils.type.isString(batchOrName)) {
      return new BatchInfoData({name: batchOrName, id, startedAt: new Date(startedAt)})
    }
    const batch = batchOrName || {}
    utils.guard.isString(batch.id, {name: 'batch.id', strict: false})
    utils.guard.isString(batch.name, {name: 'batch.batchName', strict: false})
    utils.guard.isString(batch.sequenceName, {name: 'batch.sequenceName', strict: false})
    utils.guard.isBoolean(batch.notifyOnCompletion, {
      name: 'batch.notifyOnCompletion',
      strict: false,
    })
    utils.guard.isBoolean(batch.isCompleted, {name: 'batch.isCompleted', strict: false})
    utils.guard.isBoolean(batch.isGeneratedId, {name: 'batch.isGeneratedId', strict: false})

    this._id = id || utils.general.getEnvValue('BATCH_ID')
    if (this._id) {
      this._isGeneratedId = Boolean(batch.isGeneratedId)
    } else {
      this._isGeneratedId = true
      this._id = utils.general.guid()
    }

    this._name = name || utils.general.getEnvValue('BATCH_NAME')

    if (batch.startedAt && !(batch.startedAt instanceof Date)) {
      utils.guard.isString(startedAt, {name: 'batch.startedAt', strict: false})
      this._startedAt = new Date(startedAt)
    } else {
      this._startedAt = batch.startedAt || new Date()
    }

    this._sequenceName = batch.sequenceName || utils.general.getEnvValue('BATCH_SEQUENCE', 'string')
    this._notifyOnCompletion = batch.notifyOnCompletion || utils.general.getEnvValue('BATCH_NOTIFY', 'boolean') || false
    this._isCompleted = Boolean(batch.isCompleted)
  }

  /**
   * A unique identifier for the batch. Sessions with batch info which includes the same ID will be grouped
   * together.
   */
  get id(): string {
    return this._id
  }
  set id(id: string) {
    utils.guard.notNull(id, {name: 'id'})
    this._id = id
  }
  getId(): string {
    return this._id
  }
  setId(id: string): this {
    this.id = id
    return this
  }

  get isGeneratedId(): boolean {
    return this._isGeneratedId
  }
  set isGeneratedId(isGeneratedId: boolean) {
    this._isGeneratedId = isGeneratedId
  }
  getIsGeneratedId() {
    return this._isGeneratedId
  }
  setIsGeneratedId(isGeneratedId: boolean): this {
    this.isGeneratedId = isGeneratedId
    return this
  }

  /**
   * The name of the batch or {@code null} if anonymous.
   */
  get name(): string {
    return this._name
  }
  set name(name: string) {
    this._name = name
  }
  getName(): string {
    return this._name
  }
  setName(name: string): this {
    this.name = name
    return this
  }

  /**
   * The batch start date.
   */
  get startedAt(): Date {
    return this._startedAt
  }
  set startedAt(startedAt: Date) {
    this._startedAt = startedAt
  }
  getStartedAt() {
    return this._startedAt
  }
  setStartedAt(startedAt: Date | string): this {
    this.startedAt = new Date(startedAt)
    return this
  }

  /**
   * The name of the sequence.
   */
  get sequenceName(): string {
    return this._sequenceName
  }
  set sequenceName(sequenceName: string) {
    this._sequenceName = sequenceName
  }
  getSequenceName(): string {
    return this._sequenceName
  }
  setSequenceName(sequenceName: string): this {
    this.sequenceName = sequenceName
    return this
  }

  /**
   * Indicate whether notification should be sent on this batch completion.
   */
  get notifyOnCompletion(): boolean {
    return this._notifyOnCompletion
  }
  set notifyOnCompletion(notifyOnCompletion: boolean) {
    this._notifyOnCompletion = notifyOnCompletion
  }
  getNotifyOnCompletion(): boolean {
    return this._notifyOnCompletion
  }
  setNotifyOnCompletion(notifyOnCompletion: boolean): this {
    this.notifyOnCompletion = notifyOnCompletion
    return this
  }

  get isCompleted(): boolean {
    return this._isCompleted
  }
  set isCompleted(isCompleted: boolean) {
    this._isCompleted = isCompleted
  }
  getIsCompleted(): boolean {
    return this._isCompleted
  }
  setIsCompleted(isCompleted: boolean): this {
    this.isCompleted = isCompleted
    return this
  }
}
