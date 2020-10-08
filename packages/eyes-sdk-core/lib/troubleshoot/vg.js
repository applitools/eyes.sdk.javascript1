/* eslint-disable no-console */

'use strict'

const {URL} = require('url')
const https = require('https')
const axios = require('axios')
const {RGridResource, RunningRender} = require('../../index')
const {pexec, presult, getServer, getProxyStr, userConfig} = require('./utils')
const {url: renderInfoUrl} = require('./eyes')
require('@applitools/isomorphic-fetch')

const VG_URL = 'https://render-wus.applitools.com'

const validateVgResult = (res, sha) => {
  if (!res || res.hash !== sha) {
    throw new Error(`bad VG result ${res}`)
  }
}

const getAuthToken = (() => {
  let accessToken, didRun
  return async () => {
    if (didRun) {
      return accessToken
    }

    didRun = true
    try {
      const proxyParam = getProxyStr(userConfig.proxy) ? `-x ${getProxyStr(userConfig.proxy)}` : ''
      const {stdout} = await pexec(`curl -s ${renderInfoUrl.href} ${proxyParam}`, {
        maxBuffer: 10000000,
      })
      accessToken = JSON.parse(stdout).accessToken
    } catch (_e) {}
    return accessToken
  }
})()

const getResource = () => {
  const content = Buffer.from(
    JSON.stringify({
      resources: {},
      domNodes: [],
    }),
  )
  return new RGridResource({content, contentType: 'x-applitools-html/cdt'})
}

const getPutUrl = () => {
  const resource = getResource()
  return `${VG_URL}/sha256/${resource.getSha256Hash()}?render-id=fake`
}

const VG = {
  testFetch: async () => {
    const resource = getResource()
    const authToken = await getAuthToken()
    const url = getPutUrl()
    const response = await global.fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'x-applitools-html/cdt',
        'X-Auth-Token': authToken,
      },
      body: resource.getContent(),
    })
    const res = await response.json()
    validateVgResult(res, resource.getSha256Hash())
  },
  getCurlCmd: async () => {
    const resource = getResource()
    const data = resource.getContent()
    const url = getPutUrl()
    const authToken = await getAuthToken()
    const proxyParam = getProxyStr(userConfig.proxy) ? `-x ${getProxyStr(userConfig.proxy)}` : ''
    return `curl -X PUT -H "Content-Type: application/json" -H "X-Auth-Token: ${authToken}" -d '${data}' ${url} ${proxyParam}`
  },
  testCurl: async () => {
    const resource = getResource()
    const cmd = await VG.getCurlCmd()
    const {stdout} = await pexec(cmd, {maxBuffer: 10000000})
    validateVgResult(JSON.parse(stdout), resource.getSha256Hash())
  },
  testAxios: async () => {
    const resource = getResource()
    const authToken = await getAuthToken()
    const url = getPutUrl()
    const options = {
      method: 'PUT',
      url,
      headers: {
        'X-Auth-Token': authToken,
        'Content-Type': 'x-applitools-html/cdt',
      },
      params: {
        'render-id': 'fake',
      },
      data: resource.getContent(),
    }
    const [err, res] = await presult(axios(options))
    if (err) {
      throw err
    }
    validateVgResult(res.data, resource.getSha256Hash())
  },
  testServer: async () => {
    const resource = getResource()
    const rr = new RunningRender({renderId: 'fake'})
    const server = getServer() // Note: the vg url here comes from the server
    const [err, res] = await presult(server.renderPutResource(rr, resource))
    if (err || !res) {
      throw new Error(`bad VG result ${err}`)
    }
  },
  testHttps: async () => {
    let res, rej
    const p = new Promise((_res, _rej) => ((res = _res), (rej = _rej)))

    const authToken = await getAuthToken()
    const url = new URL(getPutUrl())
    const resource = getResource()
    const options = {
      host: url.host,
      path: `${url.pathname}${url.search}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'x-applitools-html/cdt',
        'X-Auth-Token': authToken,
      },
    }

    const req = https.request(options, resp => {
      let data = ''
      resp.on('data', chunk => {
        data += chunk
      })
      resp.on('end', () => {
        try {
          validateVgResult(data)
          res()
        } catch (e) {
          rej(e)
        }
      })
    })

    req.on('error', rej)
    req.write(resource.getContent())
    req.end()
    return p
  },
  url: new URL(VG_URL),
}

module.exports = VG
