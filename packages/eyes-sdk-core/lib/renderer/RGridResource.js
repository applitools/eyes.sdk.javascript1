'use strict';

const crypto = require('crypto');

const { GeneralUtils, ArgumentGuard } = require('@applitools/eyes-common');

class RGridResource {
  /**
   * @param {string} [url]
   * @param {string} [contentType]
   * @param {Buffer} [content]
   */
  constructor({ url, contentType, content } = {}) {
    this._url = url;
    this._contentType = contentType;
    this._content = content;

    /** @type {string} */
    this._sha256hash = undefined;
  }

  /**
   * @return {string} - The url of the current resource.
   */
  getUrl() {
    return this._url;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} value - The resource's url
   */
  setUrl(value) {
    ArgumentGuard.notNull(value, 'url');
    this._url = value;
  }

  /**
   * @return {string} - The contentType of the current resource.
   */
  getContentType() {
    return this._contentType;
  }

  /**
   * @param {string} value - The resource's contentType
   */
  setContentType(value) {
    ArgumentGuard.notNull(value, 'contentType');
    this._contentType = value;
  }

  /**
   * @return {Buffer} - The content of the current resource.
   */
  getContent() {
    return this._content;
  }

  /**
   * @param {Buffer} value - The resource's content
   */
  setContent(value) {
    ArgumentGuard.notNull(value, 'content');
    this._content = value;
  }

  getSha256Hash() {
    if (!this._sha256hash) {
      this._sha256hash = crypto
        .createHash('sha256')
        .update(this._content)
        .digest('hex');
    }

    return this._sha256hash;
  }

  getHashAsObject() {
    return {
      hashFormat: 'sha256',
      hash: this.getSha256Hash(),
      contentType: this.getContentType(),
    };
  }

  /**
   * @override
   */
  toJSON() {
    return GeneralUtils.toPlain(this, ['_sha256hash']);
  }

  /**
   * @override
   */
  toString() {
    return `RGridResource { ${JSON.stringify(this)} }`;
  }
}

exports.RGridResource = RGridResource;
