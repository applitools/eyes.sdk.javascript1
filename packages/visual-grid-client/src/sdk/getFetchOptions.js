'use strict'
const {getTunnelAgentFromProxy} = require('@applitools/eyes-sdk-core/shared')

function getFetchOptions({url, referer, userAgent, proxySettings, resourceCookies}) {
  const fetchOptions = {headers: {Referer: referer}}
  if (!/https:\/\/fonts.googleapis.com/.test(url)) {
    fetchOptions.headers['User-Agent'] = userAgent
  }

  if (proxySettings && proxySettings.getIsHttpOnly()) {
    fetchOptions.agent = getTunnelAgentFromProxy(proxySettings.toProxyObject())
  }

  if (resourceCookies) {
    fetchOptions.headers['Cookie'] = resourceCookies
  }

  return fetchOptions
}

module.exports = getFetchOptions
