'use strict'
const {URL} = require('url')
const ArgumentGuard = require('../utils/ArgumentGuard')

/**
 * @typedef PlainProxySettings
 * @prop {string} url
 * @prop {string} [username]
 * @prop {string} [password]
 */

/**
 * @typedef ProxyObject
 * @param {string} protocol
 * @param {string} host
 * @param {number} port
 * @param {{username: string, password: string}} auth
 * @param {boolean} isHttpOnly
 */

/**
 * Encapsulates settings for sending Eyes communication via proxy.
 */
class ProxySettings {
  /**
   *
   * @param {string|boolean} uri - The proxy's URI or {@code false} to completely disable proxy.
   * @param {string} [username] - The username to be sent to the proxy.
   * @param {string} [password] - The password to be sent to the proxy.
   * @param {boolean} [isHttpOnly] - If the Proxy is an HTTP only and requires https over http tunneling.
   */
  constructor(uri, username, password, isHttpOnly) {
    ArgumentGuard.notNull(uri, 'uri')

    if (uri === false) {
      this._isDisabled = true
    } else {
      this._uri = uri
      this._username = username
      this._password = password
      this._isHttpOnly = isHttpOnly
      this._isDisabled = false

      this._url = new URL(uri.includes('://') ? uri : `http://${uri}`)
    }
  }

  getUri() {
    return this._uri
  }

  getUsername() {
    return this._username
  }

  getPassword() {
    return this._password
  }

  getIsHttpOnly() {
    return this._isHttpOnly
  }

  getIsDisabled() {
    return this._isDisabled
  }

  /**
   * @return {{protocol: string, host: string, port: number, auth: {username: string, password: string}, isHttpOnly: boolean}|boolean}
   */
  toProxyObject() {
    if (this._isDisabled) {
      return false
    }

    const proxy = {}

    proxy.protocol = this._url.protocol
    proxy.host = this._url.hostname
    proxy.port = this._url.port
    proxy.isHttpOnly = !!this._isHttpOnly

    if (!this._username && this._url.username) {
      proxy.auth = {
        username: this._url.username,
        password: this._url.password,
      }
    } else if (this._username) {
      proxy.auth = {
        username: this._username,
        password: this._password,
      }
    }

    return proxy
  }
}

module.exports = ProxySettings
