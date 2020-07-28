'use strict'
const tunnel = require('tunnel')

// TODO proper types
/**
 * @typedef {import('../config/ProxySettings').ProxyObject} ProxyObject
 */

/**
 * @param {proxyObject} proxyObject
 * @return {Agent}
 */
function getTunnelAgentFromProxy(proxyObject) {
  if (tunnel.httpsOverHttp === undefined) {
    throw new Error('http only proxy is not supported in the browser')
  }

  const proxyAuth =
    proxyObject.auth && proxyObject.auth.username
      ? `${proxyObject.auth.username}:${proxyObject.auth.password}`
      : undefined

  return tunnel.httpsOverHttp({
    proxy: {
      host: proxyObject.host,
      port: proxyObject.port || 8080,
      proxyAuth,
    },
  })
}

module.exports = getTunnelAgentFromProxy
