'use strict'

const {promisify} = require('util')
const express = require('express')
const UAParser = require('ua-parser-js')
const fs = require('fs')
const path = require('path')
const filenamify = require('filenamify')
const uuid = require('uuid/v4')
const fetch = require('node-fetch')

function startFakeEyesServer({
  matchMode = 'fair', // fair|always|never
  expectedFolder,
  updateFixtures,
  port,
  logger = console,
  hangUp,
} = {}) {
  const runningSessions = {}
  let serverUrl
  let renderCounter = 0
  const renderings = {}
  const resources = {}

  const app = express()
  const jsonMiddleware = express.json()
  const rawMiddleware = express.raw({limit: '100MB', type: '*/*'})

  app.use((req, _res, next) => {
    if (hangUp) {
      req.socket.destroy()
    } else {
      next()
    }
  })

  // renderInfo
  app.get('/api/sessions/renderinfo', (_req, res) => {
    res.send({
      serviceUrl: serverUrl,
      accessToken: 'access-token',
      resultsUrl: `${serverUrl}/api/resources/__random__`,
    })
  })

  // render
  app.post('/render', jsonMiddleware, (req, res) => {
    res.send(
      req.body.map(renderRequest => {
        const renderId = renderRequest.renderId || `r${renderCounter++}`
        renderings[renderId] = renderRequest
        const screenshotEntry = Object.entries(renderRequest.resources).find(
          ([_url, {contentType}]) => contentType === 'application/x-applitools-screenshot',
        )
        if (
          renderRequest.renderInfo.emulationInfo &&
          renderRequest.renderInfo.emulationInfo.deviceName === 'non-existent'
        ) {
          renderings[renderId].error = 'non existent device'
        }
        return {
          renderId,
          renderStatus: renderRequest.renderId ? 'rendering' : 'need-more-resources',
          needMoreDom: !renderRequest.renderId,
          needMoreResources:
            screenshotEntry && !renderRequest.renderId ? [screenshotEntry[0]] : undefined,
        }
      }),
    )
  })

  // render status
  app.post('/render-status', jsonMiddleware, async (req, res) => {
    res.send(
      await Promise.all(
        req.body.map(async renderId => {
          const rendering = renderings[renderId]
          if (rendering) {
            if (rendering.error) {
              return {status: 'error', error: rendering.error}
            }
            const regions = rendering.selectorsToFindRegionsFor || []
            const imageResource = Object.values(rendering.resources).find(
              ({contentType}) => contentType === 'application/x-applitools-screenshot',
            )
            const imageLocation = `${serverUrl}/api/resources/image_${renderId}`
            const domLocation = `${serverUrl}/api/resources/dom_${renderId}`
            await fetch(imageLocation, {
              method: 'PUT',
              headers: {
                'Content-Type': imageResource ? 'image/png' : 'text/plain',
              },
              body: imageResource ? resources[imageResource.hash] : `image_${renderId}`,
            })
            await fetch(domLocation, {method: 'PUT', body: `dom_${renderId}`})
            return {
              status: 'rendered',
              imageLocation,
              domLocation,
              userAgent:
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36',
              selectorRegions: regions.map(() => ({x: 1, y: 2, width: 3, height: 4})),
            }
          }
        }),
      ),
    )
  })

  // put resource
  app.put('/resources/sha256/:hash', rawMiddleware, (req, res) => {
    resources[req.params.hash] = req.body
    res.send({success: true})
  })

  app.get('/user-agents', (_req, res) => {
    res.send({
      chrome: 'chrome-ua',
      'chrome-1': 'chrome-1-ua',
      'chrome-2': 'chrome-2-ua',
      firefox: 'firefox-ua',
      'firefox-1': 'firefox-1-ua',
      'firefox-2': 'firefox-2-ua',
      safari: 'safari-ua',
      'safari-2': 'safari-2-ua',
      'safari-1': 'safari-1-ua',
      edge: 'edge-ua',
      ie: 'ie-ua',
      ie10: 'ie10-ua',
    })
  })

  // matchSingleWindow
  app.post('/api/sessions', jsonMiddleware, (req, res) => {
    const {startInfo} = req.body
    const matchWindowData = JSON.parse(JSON.stringify(req.body))
    delete matchWindowData.startInfo
    const runningSession = createRunningSessionFromStartInfo(startInfo)
    runningSession.steps = [{asExpected: true, matchWindowData}]
    runningSessions[runningSession.id] = runningSession
    res.set(
      'location',
      `${serverUrl}/api/tasks/matchsingle/${encodeURIComponent(runningSession.id)}`,
    )
    res.status(202).send({success: true})
  })

  app.get('/api/tasks/:method/:id', (req, res) => {
    res.set(
      'location',
      `${serverUrl}/api/tasks/${req.params.method}/${encodeURIComponent(req.params.id)}`,
    )
    res.status(201).send({success: true})
  })

  app.delete('/api/tasks/:method/:id', (req, res) => {
    const runningSessionId = decodeURIComponent(req.params.id)
    const runningSession = runningSessions[runningSessionId]
    const testResults = createTestResultFromRunningSession(runningSession)
    res.send(testResults)
  })

  // startSession
  app.post('/api/sessions/running', jsonMiddleware, (req, res) => {
    try {
      const runningSession = createRunningSessionFromStartInfo(req.body.startInfo)
      runningSessions[runningSession.id] = runningSession

      const {id, sessionId, batchId, baselineId, url, isNew} = runningSession
      res.send({id, sessionId, batchId, baselineId, url, isNew})
    } catch (ex) {
      logger.log('bad request for startSession', ex.message)
      res.status(400).send(ex.message)
    }
  })

  function createRunningSessionFromStartInfo(startInfo) {
    const {appIdOrName, scenarioIdOrName, batchInfo, environment} = startInfo
    const {displaySize, inferred} = environment
    const {id: batchId, name: _batchName} = batchInfo
    const {browser, os} = UAParser(inferred)

    const sessionId = `${appIdOrName}__${scenarioIdOrName}`
    const runningSessionId = `${sessionId}__running`
    const baselineId = `${sessionId}__baseline`
    const url = `${sessionId}__url`

    if (!displaySize) {
      throw new Error('missing displaySize')
    }

    return {
      id: runningSessionId,
      startInfo,
      baselineId,
      sessionId,
      url,
      steps: [],
      hostOS: `${os.name}${os.version ? `@${os.version}` : ''}`,
      hostApp: `${browser.name}@${browser.major}`,
      batchId,
      isNew: true, // TODO make configurable
    }
  }

  // postDomSnapshot
  app.post('/api/sessions/running/data', rawMiddleware, (req, res) => {
    const id = uuid()
    resources[id] = req.body
    res.set('location', `${serverUrl}/api/resources/${id}`)
    res.send({success: true})
  })

  app.put('/api/resources/:id', rawMiddleware, (req, res) => {
    resources[req.params.id] = req.body
    res.status(201).send()
  })

  app.get('/api/resources/:id', (req, res) => {
    const resource = resources[req.params.id]
    if (!resource) {
      res.status(404).send()
    } else {
      res.send(resource)
    }
  })

  // matchWindow
  app.post(
    '/api/sessions/running/:id',
    (req, res, next) => {
      if (req.headers['content-type'] === 'application/octet-stream') {
        return rawMiddleware(req, res, next)
      } else {
        return jsonMiddleware(req, res, next)
      }
    },
    async (req, res) => {
      const runningSession = runningSessions[req.params.id]
      const {steps, hostOS, hostApp} = runningSession
      const {matchWindowData, screenshot} = await getMatchWindowDataFromRequest(req)
      logger.log('matchWindowData', matchWindowData)
      const {appOutput: _appOutput} = matchWindowData

      let asExpected = matchMode === 'always'
      if (matchMode === 'fair') {
        const expectedPath = path.resolve(
          expectedFolder,
          `${filenamify(`${req.params.id}__${hostOS}__${hostApp}`)}.png`,
        )

        if (updateFixtures) {
          logger.log('[sdk-fake-eyes-server] updating fixture at', expectedPath)
          fs.writeFileSync(expectedPath, screenshot)
        }

        const expectedBuff = fs.readFileSync(expectedPath)
        asExpected = screenshot.compare(expectedBuff) === 0
      }
      steps.push({matchWindowData, asExpected})
      res.send({asExpected})
    },
  )

  async function getMatchWindowDataFromRequest(req) {
    if (Buffer.isBuffer(req.body)) {
      const buff = req.body
      const len = buff.slice(0, 4).readUInt32BE()
      const matchWindowData = JSON.parse(buff.slice(4, len + 4))
      const screenshot = buff.slice(len + 4)
      return {matchWindowData, screenshot}
    } else {
      const {appOutput} = req.body
      const {screenshotUrl} = appOutput
      const screenshot = await fetch(screenshotUrl).then(r => r.buffer())
      return {matchWindowData: req.body, screenshot}
    }
  }

  // for testing purposes
  app.get('/api/sessions/running/:id', jsonMiddleware, (req, res) => {
    const runningSession = runningSessions[req.params.id]

    if (runningSession) {
      res.send(runningSession)
    } else {
      res.status(404).send()
    }
  })

  // API to get session (normally requires read permissions)
  app.get('/api/sessions/batches/:batchId/:sessionId', (req, res) => {
    const runningSession = Object.values(runningSessions).find(runningSession => {
      if (
        runningSession.batchId === decodeURIComponent(req.params.batchId) &&
        runningSession.sessionId === decodeURIComponent(req.params.sessionId)
      ) {
        return runningSession
      }
    })
    if (runningSession) {
      res.send({
        ...runningSession,
        id: runningSession.sessionId,
      })
    } else {
      res.status(404).send()
    }
  })

  // stopSession
  app.delete('/api/sessions/running/:id', (req, res) => {
    const {aborted: _aborted, updateBaseline: _updateBaseline} = req.query
    const runningSession = runningSessions[req.params.id]

    res.send(createTestResultFromRunningSession(runningSession))
  })

  app.delete('/api/sessions/batches/:batchPointerId/close/bypointerid', (_req, res) => {
    res.status(200).send()
  })

  app.get('/api/sessions/batches/:batchId/config/bypointerId', (req, res) => {
    res.status(200).send({
      scmSourceBranch: `scmSourceBranch_${req.params.batchId}`,
      scmTargetBranch_: `scmTargetBranch_${req.params.batchId}`,
    })
  })

  function createTestResultFromRunningSession(runningSession) {
    const status = runningSession.steps.every(x => !!x.asExpected)
      ? 'Passed' // TestResultsStatus.Passed
      : 'Unresolved' //TestResultsStatus.Unresolved
    // TODO TestResultsStatus.Failed

    const stepsInfo = runningSession.steps.map(({matchWindowData, asExpected}) => {
      return {
        name: matchWindowData.tag,
        isDifferent: asExpected,
        hasBaselineImage: true,
        hasCurrentImage: true,
        apiUrls: {
          currentImage: matchWindowData.appOutput.screenshotUrl,
        },
      }
    })
    return {
      name: runningSession.startInfo.scenarioIdOrName,
      secretToken: 'bla',
      id: runningSession.sessionId,
      status,
      appName: runningSession.startInfo.appIdOrName,
      baselineId: runningSession.baselineId,
      batchName: runningSession.startInfo.batchInfo.name,
      batchId: runningSession.startInfo.batchInfo.id,
      hostOS: runningSession.hostOS,
      hostApp: runningSession.hostApp,
      hostDisplaySize: runningSession.startInfo.environment.displaySize || {width: 7, height: 8},
      startedAt: runningSession.startedAt, // TODO
      isNew: false, // TODO
      isDifferent: false, // TODO
      isAborted: false, // TODO
      defaultMatchSettings: runningSession.startInfo.defaultMatchSettings,
      appUrls: [], // TODO
      apiUrls: [], // TODO
      stepsInfo,
      steps: stepsInfo.length,
      matches: 0, // TODO
      mismatches: 0, // TODO
      missing: 0, // TODO
      new: 0, // TODO
      exactMatches: 0, // TODO
      strictMatches: 0, // TODO
      contentMatches: 0, // TODO
      layoutMatches: 0, // TODO
      noneMatches: 0, // TODO
      accessibilityStatus: runningSession.startInfo.defaultMatchSettings.accessibilitySettings
        ? {
            status: 'Passed',
            ...runningSession.startInfo.defaultMatchSettings.accessibilitySettings,
          }
        : undefined, // TODO return only if checkpoints had accessibility regions
    }
  }

  return new Promise(resolve => {
    const server = app.listen(port || 0, () => {
      const serverPort = server.address().port
      logger.log('fake eyes server listening on port', serverPort)
      const close = promisify(server.close.bind(server))
      serverUrl = `http://localhost:${serverPort}`
      resolve({port: serverPort, close})
    })
  })
}

module.exports = {startFakeEyesServer}
