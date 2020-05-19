'use strict'
const EyesWrapper = require('./EyesWrapper')
const {RectangleSize, TypeUtils} = require('@applitools/eyes-sdk-core')
const getDeviceInfoFromBrowserConfig = require('./getDeviceInfoFromBrowserConfig')

function initWrappers({count, apiKey, logHandler, getBatchInfoWithCache}) {
  return Array.from(
    new Array(count),
    () => new EyesWrapper({apiKey, logHandler, getBatchInfoWithCache}),
  )
}

function validateAndAddProperties(wrapper, properties) {
  if (properties) {
    if (Array.isArray(properties)) {
      properties.forEach(prop => {
        if (typeof prop === 'object') {
          if (TypeUtils.hasMethod(prop, ['getName', 'getValue'])) {
            wrapper.addProperty(prop.getName(), prop.getValue())
          } else {
            wrapper.addProperty(prop.name, prop.value)
          }
        } else {
          throw new Error(`${propertiesFailMsg}. Type of property inside array was ${typeof prop}`)
        }
      })
    } else {
      throw new Error(`${propertiesFailMsg}. Type of properties argument was ${typeof properties}`)
    }
  }
}

function configureWrappers({
  wrappers,
  browsers,
  isDisabled,
  displayName,
  batch,
  properties,
  baselineBranch,
  baselineEnvName,
  baselineName,
  envName,
  ignoreCaret,
  matchLevel,
  accessibilitySettings,
  parentBranch,
  branch,
  proxy,
  saveFailedTests,
  saveNewTests,
  compareWithParentBranch,
  ignoreBaseline,
  serverUrl,
  agentId,
  useDom,
  enablePatterns,
  ignoreDisplacements,
}) {
  for (let i = 0, ii = wrappers.length; i < ii; i++) {
    const wrapper = wrappers[i]
    const browser = browsers[i]

    const deviceInfo = getDeviceInfoFromBrowserConfig(browser)
    wrapper.setDeviceInfo(deviceInfo)

    validateAndAddProperties(wrapper, properties)
    wrapper.setBatch(batch)

    displayName !== undefined && wrapper.setDisplayName(displayName)
    baselineBranch !== undefined && wrapper.setBaselineBranchName(baselineBranch)
    baselineEnvName !== undefined && wrapper.setBaselineEnvName(baselineEnvName)
    baselineName !== undefined && wrapper.setBaselineName(baselineName)
    envName !== undefined && wrapper.setEnvName(envName)
    ignoreCaret !== undefined && wrapper.setIgnoreCaret(ignoreCaret)
    isDisabled !== undefined && wrapper.setIsDisabled(isDisabled)
    matchLevel !== undefined && wrapper.setMatchLevel(matchLevel)
    accessibilitySettings !== undefined && wrapper.setAccessibilityValidation(accessibilitySettings)
    useDom !== undefined && wrapper.setUseDom(useDom)
    enablePatterns !== undefined && wrapper.setEnablePatterns(enablePatterns)
    ignoreDisplacements !== undefined && wrapper.setIgnoreDisplacements(ignoreDisplacements)
    parentBranch !== undefined && wrapper.setParentBranchName(parentBranch)
    branch !== undefined && wrapper.setBranchName(branch)
    proxy !== undefined && wrapper.setProxy(proxy)
    saveFailedTests !== undefined && wrapper.setSaveFailedTests(saveFailedTests)
    saveNewTests !== undefined && wrapper.setSaveNewTests(saveNewTests)
    compareWithParentBranch !== undefined &&
      wrapper.setCompareWithParentBranch(compareWithParentBranch)
    ignoreBaseline !== undefined && wrapper.setIgnoreBaseline(ignoreBaseline)
    serverUrl !== undefined && wrapper.setServerUrl(serverUrl)
    agentId !== undefined && wrapper.setBaseAgentId(agentId)
  }
}

function openWrappers({
  wrappers,
  browsers,
  appName,
  testName,
  eyesTransactionThroat,
  skipStartingSession,
}) {
  const openPromisesAndResolves = wrappers.map(() => {
    let resolve
    const promise = new Promise(r => (resolve = r))
    return {promise, resolve}
  })
  return wrappers
    .map((wrapper, i) => {
      const viewportSize = browsers[i].width && new RectangleSize(browsers[i])
      return eyesTransactionThroat(() =>
        wrapper
          .open({appName, testName, viewportSize, skipStartingSession})
          .then(openPromisesAndResolves[i].resolve),
      )
    })
    .reduce(
      (acc, {resolve}, i) => ({
        openEyesPromises: [...acc.openEyesPromises, openPromisesAndResolves[i].promise],
        resolveTests: [...acc.resolveTests, resolve],
      }),
      {
        openEyesPromises: [],
        resolveTests: [], // resolve hooks for jobs in eyesTransactionThroat
      },
    )
}

function createRenderWrapper({serverUrl, apiKey, logHandler, proxy, agentId}) {
  const wrapper = new EyesWrapper({apiKey, logHandler})
  serverUrl !== undefined && wrapper.setServerUrl(serverUrl)
  proxy !== undefined && wrapper.setProxy(proxy)
  agentId !== undefined && wrapper.setBaseAgentId(agentId)
  return wrapper
}

const apiKeyFailMsg =
  'APPLITOOLS_API_KEY env variable is missing. It is required to define this variable for Applitools visual tests to run successfully.'

const propertiesFailMsg =
  'Argument "properties" should be an array of objects, each one with a "name" and "value" properties'

const appNameFailMsg =
  'Argument "appName" is missing. It\'s possible to specify "appName" in either the config file, an env variable or by passing to the open method.'

const authorizationErrMsg = 'Unauthorized access to Eyes server. Please check your API key.'

const blockedAccountErrMsg =
  'Unable to access Eyes server. This might mean that your account is blocked. Please contact Applitools support.'

const badRequestErrMsg =
  'Unable to process request to Eyes server. This might mean that a proxy server is misconfigured. It\'s possible to specify "proxy" in either the config file or as an env variable.'

module.exports = {
  initWrappers,
  configureWrappers,
  openWrappers,
  createRenderWrapper,
  apiKeyFailMsg,
  propertiesFailMsg,
  authorizationErrMsg,
  appNameFailMsg,
  blockedAccountErrMsg,
  badRequestErrMsg,
}
