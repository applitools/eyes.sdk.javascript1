/* eslint-disable no-console */

'use strict'

const {URL} = require('url')
const https = require('https')
const axios = require('axios')
const {ProxySettings, TypeUtils, GeneralUtils} = require('../../index')
const {
  presult,
  userConfig,
  pexec,
  getProxyStr,
  getServer,
  configuration,
  apiKey,
} = require('./utils')
const {configAxiosProxy} = require('../server/requestHelpers')
require('@applitools/isomorphic-fetch')

const RENDER_INFO_URL = GeneralUtils.urlConcat(
  configuration.getServerUrl(),
  '/api/sessions/renderinfo',
  `?apiKey=${apiKey}`,
)

const validateRednerInfoResult = res => {
  if (!res || !res.accessToken || !res.resultsUrl) {
    throw new Error(`bad render info result ${JSON.stringify(res)}`)
  }
}

const Eyes = {
  testFetch: () =>
    global
      .fetch(RENDER_INFO_URL)
      .then(r => r.json())
      .then(res => validateRednerInfoResult(res)),
  getCurlCmd: () => {
    const proxyParam = getProxyStr(userConfig.proxy) ? `-x ${getProxyStr(userConfig.proxy)}` : ''
    return `curl -s ${RENDER_INFO_URL} ${proxyParam}`
  },
  testCurl: async () => {
    const cmd = await Eyes.getCurlCmd()
    const {stdout} = await pexec(cmd, {maxBuffer: 10000000})
    const result = JSON.parse(stdout)
    validateRednerInfoResult(result)
  },
  testAxios: async () => {
    const config = {
      method: 'GET',
      url: RENDER_INFO_URL,
      proxy: false,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-applitools-eyes-client-request-id': '1--111-222-333-444',
      },
      responseType: 'json',
    }

    const {proxy} = userConfig
    if (proxy) {
      let proxySettings
      if (TypeUtils.isString(proxy)) {
        proxySettings = new ProxySettings(proxy)
      } else {
        proxySettings = new ProxySettings(
          proxy.url,
          proxy.username,
          proxy.password,
          proxy.isHttpOnly,
        )
      }
      configAxiosProxy({axiosConfig: config, proxy: proxySettings, logger: {log: () => {}}})
    }

    const [err, res] = await presult(axios(config))
    if (err) {
      throw err
    }
    validateRednerInfoResult(res.data)
  },
  testServer: async () => {
    const server = getServer()
    const res = await server.renderInfo()
    validateRednerInfoResult(res.toJSON())
  },
  testHttps: async () => {
    let res, rej
    const p = new Promise((_res, _rej) => ((res = _res), (rej = _rej)))
    https
      .get(RENDER_INFO_URL, resp => {
        let data = ''
        resp.on('data', chunk => {
          data += chunk
        })
        resp.on('end', () => {
          try {
            validateRednerInfoResult(JSON.parse(data))
            res()
          } catch (e) {
            rej(e)
          }
        })
      })
      .on('error', rej)
    return p
  },
  url: new URL(RENDER_INFO_URL),
}

module.exports = Eyes
