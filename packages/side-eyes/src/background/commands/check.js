import browser from 'webextension-polyfill'
import Modes from '../../commons/modes'
import { sendMessage } from '../../IO/message-port'
import { getEyes, closeEyes, getCommandsForEyes, isPatternsDomEnabled } from '../utils/eyes'
import { getExternalState, setExternalState } from '../external-state'
import { parseEnvironment } from '../utils/parsers'
import ideLogger from '../utils/ide-logger'
import { getDomCapture, isDomCaptureEnabled } from '../dom-capture'
import { Target, ImageProvider } from '@applitools/eyes-images'
import { buildCheckWindowFullFunction, buildCheckRegionFunction } from '../image-strategies/css-stitching'
import { buildCheckUsingVisualGrid } from '../image-strategies/visual-grid'
import { isFirefox } from '../utils/userAgent'

const imageProvider = new ImageProvider()

export async function checkWindow(runId, testId, commandId, tabId, _windowId, stepName, viewport) {
  const eyes = await getEyes(`${runId}${testId}`)
  return await (eyes.isVisualGrid
    ? checkWithVisualGrid(eyes, commandId, tabId, stepName, viewport, buildCheckUsingVisualGrid(eyes, tabId), {
        sizeMode: 'full-page',
        scriptHooks: {
          beforeCaptureScreenshot: eyes.getPreRenderHook(),
        },
      })
    : check(
        eyes,
        commandId,
        tabId,
        stepName,
        viewport,
        buildCheckWindowFullFunction(eyes, tabId, await getDevicePixelRatio(tabId))
      ))
}

export async function checkRegion(runId, testId, commandId, tabId, _windowId, region, stepName, viewport) {
  if (!region || !region.x || !region.y || !region.width || !region.height)
    throw new Error('Invalid region. Region should be x: [number], y: [number], width: [number], height: [number]')
  const eyes = await getEyes(`${runId}${testId}`)

  return await (eyes.isVisualGrid
    ? checkWithVisualGrid(eyes, commandId, tabId, stepName, viewport, buildCheckUsingVisualGrid(eyes, tabId), {
        sizeMode: 'region',
        region: {
          top: region.y,
          left: region.x,
          width: region.width,
          height: region.height,
        },
      })
    : check(
        eyes,
        commandId,
        tabId,
        stepName,
        viewport,
        buildCheckRegionFunction(eyes, tabId, await getDevicePixelRatio(tabId), region)
      ))
}

export async function checkElement(
  runId,
  testId,
  commandId,
  frameId,
  tabId,
  _windowId,
  elementXPath,
  stepName,
  viewport
) {
  const eyes = await getEyes(`${runId}${testId}`)
  if (eyes.isVisualGrid) {
    return await checkWithVisualGrid(
      eyes,
      commandId,
      tabId,
      stepName,
      viewport,
      buildCheckUsingVisualGrid(eyes, tabId),
      {
        sizeMode: 'selector',
        selector: {
          type: 'xpath',
          selector: elementXPath,
        },
        scriptHooks: {
          beforeCaptureScreenshot: eyes.getPreRenderHook(),
        },
      }
    )
  } else {
    const region = await browser.tabs.sendMessage(
      tabId,
      {
        getElementRect: true,
        path: elementXPath,
      },
      { frameId }
    )
    return await check(
      eyes,
      commandId,
      tabId,
      stepName,
      viewport,
      buildCheckRegionFunction(eyes, tabId, await getDevicePixelRatio(tabId), region),
      { x: region.x, y: region.y }
    )
  }
}

async function check(eyes, commandId, tabId, stepName, viewport, checkFunction, location) {
  await preCheck(eyes, viewport)
  eyes.commands.push(commandId)
  eyes.setViewportSize(viewport)

  imageProvider.getImage = checkFunction
  const domCap = await getDomCapture(tabId)

  let pathname
  if (!stepName) {
    pathname = await getTabPathname(tabId)
  }

  const target = Target.image(imageProvider)
  if (domCap) {
    target.withDom(domCap)
    if (location) target.withLocation(location)
  }
  const imageResult = await eyes.check(stepName || pathname, target)
  return imageResult ? true : { status: 'undetermined' }
}

async function checkWithVisualGrid(eyes, commandId, tabId, stepName, viewport, checkFunction, params) {
  await preCheck(eyes, viewport)
  eyes.commands.push(commandId)

  let pathname
  if (!stepName) {
    pathname = await getTabPathname(tabId)
  }

  await checkFunction({
    tag: stepName || pathname,
    sendDOM: (await isDomCaptureEnabled()) || (await isPatternsDomEnabled()),
    matchLevel: eyes.getMatchLevel() || 'Strict',
    ...params,
  })

  return { status: 'awaiting' }
}

export function endTest(id) {
  const commands = getCommandsForEyes(id)
  return closeEyes(id)
    .then(({ results, firstFailingResultOrLast }) => {
      // eslint-disable-next-line
      console.log(results)
      return Promise.all(
        commands.map((commandId, index) => {
          let state
          if (results.length) {
            // check if at least one of the tests step failed
            state = results.find(
              result => (result._stepsInfo && result._stepsInfo[index] ? result._stepsInfo[index]._isDifferent : true) // returning true in case the image never made it to eyes for processing, thus is should fail
            )
              ? 'failed'
              : 'passed'
          } else {
            if (results._stepsInfo && results._stepsInfo[index]) {
              state = results._stepsInfo[index]._isDifferent ? 'failed' : 'passed'
            } else {
              // image never made it to eyes, thus should fail
              state = 'failed'
            }
          }
          return sendMessage({
            uri: '/playback/command',
            verb: 'post',
            payload: {
              commandId,
              state,
            },
          })
        })
      ).then(commandStates => {
        // eslint-disable-next-line
        console.log(commandStates)
        if (commandStates.length) {
          if (firstFailingResultOrLast._status) {
            return firstFailingResultOrLast._status === 'Passed'
              ? {
                  message: `All visual tests have passed,\nresults: ${firstFailingResultOrLast._appUrls._session}`,
                }
              : {
                  error: `Diffs were found in visual tests,\nresults: ${firstFailingResultOrLast._appUrls._session}`,
                }
          } else {
            const _msg = firstFailingResultOrLast.message
            const formattedMessage = _msg
              ? _msg.charAt(0).toUpperCase() + _msg.substring(1)
              : 'Failed to run visual test'
            return {
              error: formattedMessage,
            }
          }
        }
      })
    })
    .catch(e => {
      if (commands && commands.length) {
        return Promise.all(
          commands.map(commandId => {
            return sendMessage({
              uri: '/playback/command',
              verb: 'post',
              payload: {
                commandId,
                state: 'failed',
              },
            })
          })
        ).then(() => {
          throw e
        })
      } else {
        throw e
      }
    })
}

async function preCheck(eyes, viewport) {
  if (getExternalState().mode !== Modes.PLAYBACK) {
    let notification = `connecting to ${eyes.getServerUrl()}`
    if (eyes.getBranchName()) {
      notification += `, running on branch ${eyes.getBranchName()}`
    }
    await ideLogger.log(notification)
    await setExternalState({
      mode: Modes.PLAYBACK,
      playback: {
        testName: eyes.getTestName(),
        startTime: new Date().toString(),
        hasFailed: false,
        batchName: eyes.getBatch().name || eyes.getTestName(),
        appName: eyes.getAppName(),
        eyesServer: eyes.getServerUrl(),
        environment: eyes.isVisualGrid ? 'Ultrafast Grid' : parseEnvironment(navigator.userAgent, viewport),
        branch: eyes.getBranchName(),
      },
    })
  }
}

function getTabPathname(tab) {
  return browser.tabs.get(tab).then(data => new URL(data.url).pathname)
}

async function getDevicePixelRatio(tabId) {
  if (isFirefox) {
    return 1
  } else {
    const result = await browser.tabs.executeScript(tabId, {
      code: 'window.devicePixelRatio',
    })
    return result[0]
  }
}
