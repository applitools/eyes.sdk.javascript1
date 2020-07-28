'use strict'

const crypto = require('crypto')

const {GeneralUtils, ArgumentGuard} = require('../..')

const VISUAL_GRID_MAX_BUFFER_SIZE = 15 * 1000000

class RGridResource {
  /**
   * @param data
   * @param {string} [data.url]
   * @param {string} [data.contentType]
   * @param {Buffer} [data.content]
   */
  constructor({url, contentType, content, errorStatusCode} = {}) {
    this._url = url
    this._contentType = contentType
    this._content = content
    this._errorStatusCode = errorStatusCode

    /** @type {string} */
    this._sha256hash = undefined

    this._trimContent()
  }

  /**
   * @return {string} - The url of the current resource.
   */
  getUrl() {
    return this._url
  }

  /**
   * @param {string} value - The resource's url
   */
  setUrl(value) {
    ArgumentGuard.notNull(value, 'url')
    this._url = value
  }

  /**
   * @return {string} - The contentType of the current resource.
   */
  getContentType() {
    return this._contentType
  }

  /**
   * @param {string} value - The resource's contentType
   */
  setContentType(value) {
    ArgumentGuard.notNull(value, 'contentType')
    this._contentType = value
  }

  /**
   * @return {Buffer} - The content of the current resource.
   */
  getContent() {
    return this._content
  }

  /**
   * @param {Buffer} value - The resource's content
   */
  setContent(value) {
    ArgumentGuard.notNull(value, this._url ? `content (of ${this._url})` : 'content')
    this._content = value
    this._sha256hash = undefined

    this._trimContent()
  }

  _trimContent() {
    if (this._content && this._content.length > VISUAL_GRID_MAX_BUFFER_SIZE) {
      this._content = this._content.slice(0, VISUAL_GRID_MAX_BUFFER_SIZE - 100000)
    }
  }

  getErrorStatusCode() {
    return this._errorStatusCode
  }

  setErrorStatusCode(errorStatusCode) {
    this._errorStatusCode = errorStatusCode
  }

  getSha256Hash() {
    if (!this._sha256hash) {
      this._sha256hash = crypto
        .createHash('sha256')
        .update(this._content)
        .digest('hex')
    }

    return this._sha256hash
  }

  // TODO: now that there's errorStatusCode, this function should be renamed to toPlainObject or prepareToSerialize or something
  getHashAsObject() {
    if (this._errorStatusCode) {
      return {errorStatusCode: this._errorStatusCode}
    } else {
      return {
        hashFormat: 'sha256',
        hash: this.getSha256Hash(),
        contentType: this.getContentType(),
      }
    }
  }

  /**
   * @override
   */
  toJSON() {
    return GeneralUtils.toPlain(this, ['_sha256hash'])
  }

  /**
   * @override
   */
  toString() {
    return `RGridResource { ${JSON.stringify(this)} }`
  }
}

module.exports = RGridResource
