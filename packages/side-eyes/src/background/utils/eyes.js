import { ConsoleLogHandler, Eyes } from '@applitools/eyes-images'
import { makeVisualGridClient } from '@applitools/visual-grid-client'
import { parseApiServer } from './parsers.js'
import { browserName } from './userAgent'
import { getCurrentProject } from './ide-project'
import { parseBrowsers, parseMatchLevel, isExperimentalBrowser } from './parsers'
import storage from '../../IO/storage'
import manifest from '../../manifest.json'

const DEFAULT_EYES_API_SERVER = 'https://eyesapi.applitools.com'
const eyes = {}
let lastResults = {
  url: '',
  batchId: '',
}

function createDefaultSettings() {
  return {
    enableVisualGrid: false,
  }
}

export async function getExtensionSettings() {
  const { apiKey, eyesServer, projectSettings, eulaSignDate, isFree, experimentalEnabled } = await storage.get([
    'apiKey',
    'eyesServer',
    'projectSettings',
    'eulaSignDate',
    'isFree',
    'experimentalEnabled',
  ])
  const { id } = await getCurrentProject()
  let settings = projectSettings && projectSettings[id]
  if (!settings) {
    settings = createDefaultSettings()
  }
  return {
    apiKey,
    eyesServer,
    projectSettings: settings,
    isFree,
    eulaSignDate,
    experimentalEnabled,
  }
}

export async function makeEyes(id, batchId, appName, batchName, testName, options = {}) {
  if (hasEyes(id)) return eyes[id]
  if (lastResults.batchId !== batchId) {
    lastResults.batchId = batchId
    lastResults.url = ''
  }
  const settings = await getExtensionSettings()
  if (!settings.apiKey) {
    throw new Error('No API key was provided, please set one in the options page')
  }
  const eyesApiServerUrl = settings.eyesServer ? parseApiServer(settings.eyesServer) : undefined
  const branch = (settings ? settings.projectSettings.branch : '') || ''
  const parentBranch = (settings ? settings.projectSettings.parentBranch : '') || ''
  let eye

  if (settings.projectSettings.enableVisualGrid && !options.useNativeOverride) {
    let filteredBrowsers = settings.projectSettings ? settings.projectSettings.selectedBrowsers : undefined
    if (!settings.experimentalEnabled) {
      filteredBrowsers = filteredBrowsers.filter(b => !isExperimentalBrowser(b.toLowerCase()))
    }

    eye = await createVisualGridEyes(
      batchId,
      appName,
      batchName,
      testName,
      eyesApiServerUrl,
      settings.apiKey,
      branch,
      parentBranch,
      filteredBrowsers,
      settings.projectSettings ? settings.projectSettings.selectedViewportSizes : undefined,
      settings.projectSettings ? settings.projectSettings.selectedDevices : undefined,
      settings.projectSettings ? settings.projectSettings.selectedDeviceOrientations : undefined,
      options.baselineEnvName,
      settings.isFree,
      settings.eulaSignDate
    )
  } else {
    eye = await createImagesEyes(
      batchId,
      appName,
      batchName,
      testName,
      eyesApiServerUrl,
      settings.apiKey,
      branch,
      parentBranch,
      options.baselineEnvName
    )
  }
  eyes[id] = eye
  return eye
}

function makeAgentId(runningLocation) {
  return `eyes.seleniumide.${browserName.toLowerCase()}.${runningLocation}/${manifest.version} `
}

async function createImagesEyes(
  batchId,
  appName,
  batchName,
  testName,
  eyesServer,
  apiKey,
  branch,
  parentBranch,
  baselineEnvName
) {
  const eyes = new Eyes(eyesServer)
  eyes.setLogHandler(new ConsoleLogHandler(true))
  eyes.setApiKey(apiKey)
  eyes.setBranchName(branch)
  eyes.setParentBranchName(parentBranch)
  eyes.getBaseAgentId = () => makeAgentId('local')
  eyes.setAgentId(makeAgentId('local'))
  eyes.setInferredEnvironment(`useragent:${navigator.userAgent}`)
  eyes.setBatch(batchName, batchId)
  if (baselineEnvName) eyes.setBaselineEnvName(baselineEnvName)
  decorateEyes(eyes)

  if (await isPatternsDomEnabled()) {
    eyes.setEnablePatterns(true)
    eyes.setUseDom(true)
    eyes.setSendDom(true)
  }

  const accessibilitySettings = await getAccessibilitySettings()
  if (accessibilitySettings) {
    const config = eyes.getConfiguration()
    config.setAccessibilityValidation(accessibilitySettings)
    eyes.setConfiguration(config)
  }

  await eyes.open(appName, testName)
  return eyes
}

export function hasValidVisualGridSettings(settings) {
  if (!settings) return false
  if (
    settings.selectedBrowsers ||
    settings.selectedViewportSizes ||
    settings.selectedDevices ||
    settings.selectedDeviceOrientations
  ) {
    // projectSettings object passed in,
    // assign values to the correct keys
    settings.browsers = settings.selectedBrowsers
    settings.viewports = settings.selectedViewportSizes
    settings.devices = settings.selectedDevices
    settings.orientations = settings.selectedDeviceOrientations
  }
  let count = [
    settings.browsers ? !!settings.browsers.length : false,
    settings.viewports ? !!settings.viewports.length : false,
    settings.devices ? !!settings.devices.length : false,
    settings.orientations ? !!settings.orientations.length : false,
  ]
  switch (count.join()) {
    case 'true,true,false,false':
    case 'false,false,true,true':
    case 'true,true,true,true':
      return true
    default:
      return false
  }
}

export async function isPatternsDomEnabled() {
  const settings = await getExtensionSettings()
  return !!(settings.projectSettings.enablePatternsDom && settings.experimentalEnabled)
}

export function makeAccessibilitySettings(settings) {
  if (settings.projectSettings.enableAccessibilityValidations) {
    return {
      level: settings.projectSettings.accessibilityLevel,
      guidelinesVersion: `WCAG_${settings.projectSettings.accessibilityVersion.replace(/\./, '_')}`,
    }
  }
}

async function getAccessibilitySettings() {
  const settings = await getExtensionSettings()
  return makeAccessibilitySettings(settings)
}

async function createVisualGridEyes(
  batchId,
  appName,
  batchName,
  testName,
  serverUrl,
  apiKey,
  branchName,
  parentBranchName,
  browsers,
  viewports,
  devices,
  orientations,
  baselineEnvName,
  isFree,
  eulaSignDate
) {
  if (
    (!isFree && !eulaSignDate) ||
    !hasValidVisualGridSettings({
      browsers,
      viewports,
      devices,
      orientations,
    })
  )
    throw new Error('Incomplete visual grid settings')
  const { matrix, _didRemoveResolution } = parseBrowsers(browsers, viewports, devices, orientations)
  let useDom
  let enablePatterns

  if (await isPatternsDomEnabled()) {
    useDom = true
    enablePatterns = true
  }

  const accessibilitySettings = await getAccessibilitySettings()

  const eyes = await makeVisualGridClient({
    apiKey,
    serverUrl,
    agentId: makeAgentId('visualgrid'),
    showLogs: true,
    useDom,
    enablePatterns,
    accessibilitySettings,
  }).openEyes({
    appName,
    batchName,
    batchId,
    testName,
    branchName,
    parentBranchName,
    ignoreCaret: true,
    browser: matrix,
    baselineEnvName,
  })
  await decorateVisualEyes(eyes, batchId, appName, batchName, testName, serverUrl, apiKey, branchName, parentBranchName)
  window.e = eyes
  return eyes
}

export function hasEyes(id) {
  return !!eyes[id]
}

export function getEyes(id) {
  return new Promise((res, rej) => {
    if (!eyes[id]) {
      rej('No eyes session found')
    } else {
      res(eyes[id])
    }
  })
}

export async function closeEyes(id) {
  const eye = eyes[id]
  eyes[id] = undefined

  try {
    let results = await eye.close(false)
    // set it to the results in the hopes that it isn't a visual grid result
    let firstFailingResultOrLast = results,
      found = false
    // get the first failing test if available from visual grid
    if (Array.isArray(results) && eye.isVisualGrid) {
      for (let i = 0; i < results.length; i++) {
        let result = results[i]
        if (result._status !== 'Passed' || result._isNew) {
          firstFailingResultOrLast = result
          found = true
          break
        }
      }
      // set it to the first test since none failed
      if (!found) firstFailingResultOrLast = results[0]
    }
    // eslint-disable-next-line no-console
    console.log(results)

    if (firstFailingResultOrLast._status) {
      // checking the length because we might not necessarily have checkpoints
      lastResults.url =
        eye.commands.length && (firstFailingResultOrLast._status !== 'Passed' || firstFailingResultOrLast._isNew)
          ? firstFailingResultOrLast._appUrls._session
          : lastResults.url
    } else {
      lastResults.url = ''
      lastResults.batchId = ''
    }
    return { results, firstFailingResultOrLast }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    await eye.abortIfNotClosed().catch(e => {
      // eslint-disable-next-line no-console
      console.error(e)
    })
    throw e
  }
}

export function getResultsUrl() {
  return lastResults.url
}

export function getCommandsForEyes(id) {
  return eyes[id] ? eyes[id].commands : undefined
}

function decorateEyes(eyes) {
  eyes.isVisualGrid = false
  eyes.commands = []
  const setMatchLevel = eyes.setMatchLevel.bind(eyes)
  eyes.setMatchLevel = level => {
    verifyMatchLevel(level)
    setMatchLevel(parseMatchLevel(level))
  }
}

async function decorateVisualEyes(
  eyes,
  _batchId,
  appName,
  batchName,
  testName,
  serverUrl = DEFAULT_EYES_API_SERVER,
  _apiKey,
  branchName,
  _parentBranchName
) {
  eyes.isVisualGrid = true
  eyes.commands = []
  eyes.getPreRenderHook = () => eyes.preRenderHook
  eyes.setPreRenderHook = snippet => (eyes.preRenderHook = snippet)
  eyes.getMatchLevel = () => eyes.matchLevel
  eyes.setMatchLevel = level => {
    verifyMatchLevel(level)
    eyes.matchLevel = parseMatchLevel(level)
  }
  eyes.getServerUrl = () => serverUrl
  eyes.getBranchName = () => branchName
  eyes.getTestName = () => testName
  eyes.getBatch = () => ({ name: batchName })
  eyes.getAppName = () => appName
  eyes.abortIfNotClosed = eyes.abort
}

function verifyMatchLevel(level) {
  if (!/^(Layout|Layout2|Content|Strict|Exact)$/i.test(level)) {
    throw new Error('Match level must be one of: Exact, Strict, Content or Layout.')
  }
}
