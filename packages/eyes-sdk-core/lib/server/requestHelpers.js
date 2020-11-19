const getTunnelAgentFromProxy = require('./getTunnelAgentFromProxy')

const DateTimeUtils = require('../utils/DateTimeUtils')
const TypeUtils = require('../utils/TypeUtils')
const GeneralUtils = require('../utils/GeneralUtils')

const HTTP_STATUS_CODES = {
  CREATED: 201,
  ACCEPTED: 202,
  OK: 200,
  GONE: 410,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
}

const HTTP_FAILED_CODES = [
  HTTP_STATUS_CODES.NOT_FOUND,
  HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
  HTTP_STATUS_CODES.BAD_GATEWAY,
  HTTP_STATUS_CODES.SERVICE_UNAVAILABLE,
  HTTP_STATUS_CODES.GATEWAY_TIMEOUT,
]

const REQUEST_FAILED_CODES = ['ECONNRESET', 'ECONNABORTED', 'ETIMEDOUT', 'ENOTFOUND', 'EAI_AGAIN']

const CUSTOM_HEADER_NAMES = {
  REQUEST_ID: 'x-applitools-eyes-client-request-id',
  AGENT_ID: 'x-applitools-eyes-client',
  EYES_EXPECT: 'Eyes-Expect',
  EYES_DATE: 'Eyes-Date',
}

function configAxiosProxy({axiosConfig, proxy, logger}) {
  const proxyObject = proxy.toProxyObject()
  if (proxy.getIsHttpOnly()) {
    axiosConfig.httpsAgent = getTunnelAgentFromProxy(proxyObject)
    axiosConfig.proxy = false // don't use the proxy, we use tunnel.
    logger.log('proxy is set as http only, using tunnel', proxyObject.host, proxyObject.port)
  } else {
    axiosConfig.proxy = proxyObject
    logger.log('using proxy', axiosConfig.proxy.host, axiosConfig.proxy.port)
  }
}

function configureAxios({axiosConfig, configuration, agentId, logger}) {
  axiosConfig.params = axiosConfig.params || {}
  if (axiosConfig.withApiKey && !('apiKey' in axiosConfig.params)) {
    axiosConfig.params.apiKey = configuration.getApiKey()
  }
  if (!('removeSession' in axiosConfig.params)) {
    const removeSession = configuration.getRemoveSession()
    if (TypeUtils.isNotNull(removeSession)) {
      axiosConfig.params.removeSession = removeSession
    }
  }
  if (!('timeout' in axiosConfig)) {
    const timeout = configuration.getConnectionTimeout()
    if (TypeUtils.isNotNull(timeout)) {
      axiosConfig.timeout = timeout
    }
  }
  if (!('proxy' in axiosConfig)) {
    const proxy = configuration.getProxy()
    if (TypeUtils.isNotNull(proxy)) {
      configAxiosProxy({axiosConfig, proxy, logger})
    }
  }

  axiosConfig.headers = axiosConfig.headers || {}
  if (!(CUSTOM_HEADER_NAMES.AGENT_ID in axiosConfig.headers)) {
    axiosConfig.headers[CUSTOM_HEADER_NAMES.AGENT_ID] = agentId
  }
  if (!(CUSTOM_HEADER_NAMES.REQUEST_ID in axiosConfig.headers)) {
    axiosConfig.headers[CUSTOM_HEADER_NAMES.REQUEST_ID] = axiosConfig.requestId
  }
  // TODO remove when Eyes server stops being backwards compatible with old SDK's that don't support long running tasks
  if (!axiosConfig.isPollingRequest) {
    axiosConfig.headers[CUSTOM_HEADER_NAMES.EYES_EXPECT] = '202+location'
    axiosConfig.headers[CUSTOM_HEADER_NAMES.EYES_DATE] = DateTimeUtils.toRfc1123DateTime(
      axiosConfig.timestamp,
    )
  }
  // ---
}

async function delayRequest({axiosConfig, logger}) {
  if (axiosConfig.delay) {
    logger.verbose(
      `axios request interceptor - ${axiosConfig.name} request delayed for ${axiosConfig.delay} ms.`,
    )
    await GeneralUtils.sleep(axiosConfig.delay)
  }
}

async function handleRequestResponse({response, axios, logger}) {
  const {config} = response

  logger.verbose(
    `axios response interceptor - ${config.name} [${config.requestId}] - result ${response.statusText}, status code ${response.status}, url ${config.url}`,
  )

  if (isLongRequest(response)) {
    return startPollingRequest({url: response.headers.location, config, axios})
  }

  if (config.isPollingRequest) {
    if (response.status === HTTP_STATUS_CODES.OK) {
      config.repeat += 1
      config.delay = TypeUtils.isArray(config.delayBeforePolling)
        ? config.delayBeforePolling[Math.min(config.repeat, config.delayBeforePolling.length - 1)]
        : config.delayBeforePolling
      return axios.request(config)
    }
  }

  return response
}
function isLongRequest(response) {
  return response.status === HTTP_STATUS_CODES.ACCEPTED && Boolean(response.headers.location)
}
function isConcurrencyBlockedRequest(response) {
  return response.status === HTTP_STATUS_CODES.SERVICE_UNAVAILABLE
}
async function startPollingRequest({url, config, axios}) {
  const pollingConfig = {
    name: config.name,
    isPollingRequest: true,
    delayBeforePolling: config.delayBeforePolling,
    delay: TypeUtils.isArray(config.delayBeforePolling)
      ? config.delayBeforePolling[0]
      : config.delayBeforePolling,
    method: 'GET',
    url,
    repeat: 0,
  }
  const response = await axios.request(pollingConfig)
  switch (response.status) {
    case HTTP_STATUS_CODES.OK:
      return response
    case HTTP_STATUS_CODES.CREATED:
      const {config} = response
      const nextConfig = {
        name: config.name,
        method: 'DELETE', // TODO should be changed to GET when Eyes server will be updated to 10.9
        url: response.headers.location,
        headers: {
          [CUSTOM_HEADER_NAMES.EYES_DATE]: DateTimeUtils.toRfc1123DateTime(),
        },
      }
      return axios.request(nextConfig)
    case HTTP_STATUS_CODES.GONE:
      throw new Error('The server task has gone.')
    default:
      throw new Error(`Unknown error during long request: ${JSON.stringify(response)}`)
  }
}

async function handleRequestError({err, axios, logger}) {
  if (!err.config) {
    throw err
  }
  const {response, config} = err
  const reason = `${err.message}${response ? `(${response.statusText})` : ''}`

  logger.log(
    `axios error interceptor - ${config.name} [${config.requestId}] - ${
      config.method
    } request failed. reason=${reason} | url=${config.url} ${
      response ? `| status=${response.status} ` : ''
    }| params=${JSON.stringify(config.params)}`,
  )

  if (response && response.data) {
    logger.verbose(`axios error interceptor - ${config.name} - failure body:\n${response.data}`)
  }

  if (response && response.status === HTTP_STATUS_CODES.NOT_FOUND && config.dontRetryOn404) {
    throw err
  }

  if (response && isConcurrencyBlockedRequest(response)) {
    let backoffIndex, repeat
    if (config.isConcurrencyPolling) {
      backoffIndex = Math.min(config.repeat, config.concurrencyBackoff.length - 1)
      repeat = config.repeat + 1
    } else {
      backoffIndex = 0
      repeat = 0
    }

    return axios.request({
      ...config,
      delay: config.concurrencyBackoff[backoffIndex],
      repeat,
      isConcurrencyPolling: true,
    })
  }

  if (
    config.retry > 0 &&
    ((response && HTTP_FAILED_CODES.includes(response.status)) ||
      REQUEST_FAILED_CODES.includes(err.code))
  ) {
    logger.verbose(
      `axios error interceptor retrying request with delay ${config.delayBeforeRetry}...`,
    )

    if (config.delayBeforeRetry) {
      config.delay = config.delayBeforeRetry
    }
    config.originalRequestId = config.originalRequestId || config.requestId
    config.repeat += 1
    config.retry -= 1
    return axios.request(config)
  }
  throw new Error(reason)
}

exports.configAxiosProxy = configAxiosProxy
exports.configureAxios = configureAxios
exports.delayRequest = delayRequest

exports.handleRequestResponse = handleRequestResponse

exports.handleRequestError = handleRequestError
