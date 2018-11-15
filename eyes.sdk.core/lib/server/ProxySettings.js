'use strict';

const url = require('url');
const { ArgumentGuard } = require('../ArgumentGuard');

/**
 * Encapsulates settings for sending Eyes communication via proxy.
 */
class ProxySettings {
  /**
   * @param {string} uri - The proxy's URI.
   * @param {string} [username] - The username to be sent to the proxy.
   * @param {string} [password] - The password to be sent to the proxy.
   */
  constructor(uri, username, password) {
    ArgumentGuard.notNull(uri, 'uri');

    this._uri = uri;
    this._username = username;
    this._password = password;

    this._url = url.parse(uri.includes('://') ? uri : `http://${uri}`);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getUri() {
    return this._uri;
  }

  // noinspection JSUnusedGlobalSymbols
   /**
   * @return {string}
   */
  getUsername() {
    return this._username;
  }

  // noinspection JSUnusedGlobalSymbols
   /**
   * @return {string}
   */
  getPassword() {
    return this._password;
  }

  // noinspection FunctionWithMoreThanThreeNegationsJS
  /**
   * @protected
   * @return {{protocol: string, host: string, port: number, auth: {username: string, password: string}}}
   */
  toProxyObject() {
    const proxy = {};

    proxy.protocol = this._url.protocol;
    proxy.host = this._url.hostname;
    proxy.port = this._url.port;

    if (!this._username && this._url.auth) {
      const i = this._url.auth.indexOf(':');
      if (i !== -1) {
        proxy.auth = {
          username: this._url.auth.slice(0, i),
          password: this._url.auth.slice(i + 1),
        };
      }
    } else if (this._username) {
      proxy.auth = {
        username: this._username,
        password: this._password,
      };
    }

    return proxy;
  }
}

exports.ProxySettings = ProxySettings;
