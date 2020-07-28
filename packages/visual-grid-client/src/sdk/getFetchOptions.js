'use strict'
const {getTunnelAgentFromProxy} = require('@applitools/eyes-sdk-core')

function getFetchOptions({url, referer, userAgent, proxySettings}) {
  const fetchOptions = {headers: {Referer: referer}}
  if (!/https:\/\/fonts.googleapis.com/.test(url)) {
    fetchOptions.headers['User-Agent'] = userAgent
  }

  if (proxySettings && proxySettings.getIsHttpOnly()) {
    fetchOptions.agent = getTunnelAgentFromProxy(proxySettings.toProxyObject())
  }
  return fetchOptions
}

module.exports = getFetchOptions
