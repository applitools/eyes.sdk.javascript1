'use strict';
const EyesWrapper = require('./EyesWrapper');
const {BatchInfo, RectangleSize} = require('@applitools/eyes-sdk-core');

function initWrappers({count, apiKey, logHandler}) {
  return Array.from(new Array(count), () => new EyesWrapper({apiKey, logHandler}));
}

function validateAndAddProperties(wrapper, properties) {
  if (properties) {
    if (Array.isArray(properties)) {
      properties.forEach(prop => {
        if (typeof prop === 'object') {
          wrapper.addProperty(prop.name, prop.value);
        } else {
          throw new Error(`${propertiesFailMsg}. Type of property inside array was ${typeof prop}`);
        }
      });
    } else {
      throw new Error(`${propertiesFailMsg}. Type of properties argument was ${typeof properties}`);
    }
  }
}

function configureWrappers({
  wrappers,
  browsers,
  isDisabled,
  displayName,
  batchSequenceName,
  batchName,
  batchId,
  properties,
  baselineBranchName,
  baselineEnvName,
  baselineName,
  envName,
  ignoreCaret,
  matchLevel,
  accessibilityLevel,
  parentBranchName,
  branchName,
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
  assumeEnvironment,
  notifyOnCompletion,
}) {
  const batchInfo = new BatchInfo({
    id: batchId,
    name: batchName,
    sequenceName: batchSequenceName,
    notifyOnCompletion,
  });

  for (let i = 0, ii = wrappers.length; i < ii; i++) {
    const wrapper = wrappers[i];
    const browser = browsers[i];

    const deviceInfo = browser.deviceName ? `${browser.deviceName} (Chrome emulation)` : 'Desktop';
    wrapper.setDeviceInfo(deviceInfo);

    validateAndAddProperties(wrapper, properties);
    wrapper.setBatch(batchInfo);

    displayName !== undefined && wrapper.setDisplayName(displayName);
    baselineBranchName !== undefined && wrapper.setBaselineBranchName(baselineBranchName);
    baselineEnvName !== undefined && wrapper.setBaselineEnvName(baselineEnvName);
    baselineName !== undefined && wrapper.setBaselineName(baselineName);
    envName !== undefined && wrapper.setEnvName(envName);
    ignoreCaret !== undefined && wrapper.setIgnoreCaret(ignoreCaret);
    isDisabled !== undefined && wrapper.setIsDisabled(isDisabled);
    matchLevel !== undefined && wrapper.setMatchLevel(matchLevel);
    accessibilityLevel !== undefined && wrapper.setAccessibilityValidation(accessibilityLevel);
    useDom !== undefined && wrapper.setUseDom(useDom);
    enablePatterns !== undefined && wrapper.setEnablePatterns(enablePatterns);
    ignoreDisplacements !== undefined && wrapper.setIgnoreDisplacements(ignoreDisplacements);
    parentBranchName !== undefined && wrapper.setParentBranchName(parentBranchName);
    branchName !== undefined && wrapper.setBranchName(branchName);
    proxy !== undefined && wrapper.setProxy(proxy);
    saveFailedTests !== undefined && wrapper.setSaveFailedTests(saveFailedTests);
    saveNewTests !== undefined && wrapper.setSaveNewTests(saveNewTests);
    compareWithParentBranch !== undefined &&
      wrapper.setCompareWithParentBranch(compareWithParentBranch);
    ignoreBaseline !== undefined && wrapper.setIgnoreBaseline(ignoreBaseline);
    serverUrl !== undefined && wrapper.setServerUrl(serverUrl);
    agentId !== undefined && wrapper.setBaseAgentId(agentId);

    const env = assumeEnvironment(browser);
    wrapper.setAssumedConfiguration(env);
  }
}

function openWrappers({wrappers, browsers, appName, testName, eyesTransactionThroat}) {
  const openPromisesAndResolves = wrappers.map(() => {
    let resolve;
    const promise = new Promise(r => (resolve = r));
    return {promise, resolve};
  });
  return wrappers
    .map((wrapper, i) => {
      const viewportSize = browsers[i].width && new RectangleSize(browsers[i]);
      return eyesTransactionThroat(() =>
        wrapper.open(appName, testName, viewportSize).then(openPromisesAndResolves[i].resolve),
      );
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
    );
}

function createRenderWrapper({serverUrl, apiKey, logHandler, proxy, agentId}) {
  const wrapper = new EyesWrapper({apiKey, logHandler});
  serverUrl !== undefined && wrapper.setServerUrl(serverUrl);
  proxy !== undefined && wrapper.setProxy(proxy);
  agentId !== undefined && wrapper.setBaseAgentId(agentId);
  return wrapper;
}

const apiKeyFailMsg =
  'APPLITOOLS_API_KEY env variable is missing. It is required to define this variable for Applitools visual tests to run successfully.';

const propertiesFailMsg =
  'Argument "properties" should be an array of objects, each one with a "name" and "value" properties';

const appNameFailMsg =
  'Argument "appName" is missing. It\'s possible to specify "appName" in either the config file, an env variable or by passing to the open method.';

const authorizationErrMsg = 'Unauthorized access to Eyes server. Please check your API key.';

const blockedAccountErrMsg =
  'Unable to access Eyes server. This might mean that your account is blocked. Please contact Applitools support.';

const badRequestErrMsg =
  'Unable to process request to Eyes server. This might mean that a proxy server is misconfigured. It\'s possible to specify "proxy" in either the config file or as an env variable.';

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
};
