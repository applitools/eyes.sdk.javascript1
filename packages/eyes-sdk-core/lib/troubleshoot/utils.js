/* eslint-disable no-console */

'use strict'

const {URL} = require('url')
const {exec} = require('child_process')
const {promisify: p} = require('util')
const {ServerConnector} = require('../../index')
const {ConfigUtils, Configuration} = require('../../index')

const _userConfig = ConfigUtils.getConfig({configParams: ['apiKey', 'serverUrl', 'proxy']})
const _configuration = new Configuration(_userConfig)

const Utils = {
  userConfig: _userConfig,
  configuration: _configuration,
  pexec: p(exec),
  presult: promise =>
    promise.then(
      v => [undefined, v],
      err => [err],
    ),
  apiKey: _configuration.getApiKey(),
  getProxyStr: proxy => {
    if (!proxy) {
      return
    }
    // HTTP_PROXY and HTTPS_PROXY are read by cURL.
    let proxyParam = new URL(proxy.constructor.name === 'String' ? proxy : proxy.url)
    if (proxy.username) {
      proxyParam.username = proxy.username
    }
    if (proxyParam.password) {
      proxyParam.password = proxy.password
    }
    return proxyParam.href
  },
  getServer: (() => {
    let server
    return () => {
      if (!server) {
        server = new ServerConnector({
          logger: {verbose: () => {}, log: () => {}},
          configuration: _configuration,
          getAgentId: () => 'core/util',
        })
      }
      return server
    }
  })(),
  ptimeoutWithError: async (promiseOrPromiseFunc, timeout, err) => {
    let promiseResolved = false
    const hasAborted = () => promiseResolved

    const promise = promiseOrPromiseFunc.then
      ? promiseOrPromiseFunc
      : promiseOrPromiseFunc(hasAborted)

    let cancel
    const v = await Promise.race([
      promise.then(
        v => ((promiseResolved = true), cancel && clearTimeout(cancel), v),
        err => ((promiseResolved = true), cancel && clearTimeout(cancel), Promise.reject(err)),
      ),
      new Promise(
        res =>
          (cancel = setTimeout(() => {
            if (promiseResolved) res(undefined)
            else {
              cancel = undefined
              promiseResolved = true
              res(Promise.reject(err))
            }
          }, timeout)),
      ),
    ])
    return v
  },
}

module.exports = Utils
