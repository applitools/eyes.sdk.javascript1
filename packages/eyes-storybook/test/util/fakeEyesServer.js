'use strict';

const {promisify} = require('util');
const express = require('express');
const UAParser = require('ua-parser-js');
const fs = require('fs');
const path = require('path');
const filenamify = require('filenamify');
const {TestResultsStatus} = require('@applitools/eyes-sdk-core');

function fakeEyesServer({expectedFolder, updateFixtures, port, hangUp: _hangUp} = {}) {
  const runningSessions = {};
  let serverUrl;
  let renderCounter = 0;
  const renderings = {};
  let currentlyRunning = 0;
  let maxRunning = 0;

  const app = express();
  app.use(express.json());

  // renderInfo
  app.get('/api/sessions/renderinfo', (_req, res) => {
    res.send({
      serviceUrl: serverUrl,
      accessToken: 'access-token',
      resultsUrl: `${serverUrl}/results`,
    });
  });

  // render
  app.post('/render', (req, res) => {
    res.send(
      req.body.map(renderRequest => {
        const renderId = renderRequest.renderId || `r${renderCounter++}`;
        renderings[renderId] = renderRequest;
        return {
          renderId,
          renderStatus: 'rendering',
          needMoreDom: false,
        };
      }),
    );
  });

  // render status
  app.post('/render-status', (req, res) => {
    res.send(
      req.body.map(renderId => {
        const rendering = renderings[renderId];
        if (rendering) {
          const regions = rendering.selectorsToFindRegionsFor || [];
          return {
            status: 'rendered',
            imageLocation: `imageLoc_${renderId}`,
            domLocation: `domLoc_${renderId}`,
            selectorRegions: regions.map(region => {
              try {
                return [JSON.parse(region)];
              } catch (ex) {}
              return [{x: 1, y: 2, width: 3, height: 4}];
            }),
          };
        }
      }),
    );
  });

  // check resources
  app.post('/resources/query/resources-exist/', (req, res) => {
    res.send(Array(req.body.length).fill(false));
  });

  // put resource
  app.put('/resources/sha256/:hash', (_req, res) => {
    res.send({success: true});
  });

  app.post('/job-info', (req, res) => {
    const requests = req.body;
    res.send(new Array(requests.length).fill().map(() => ({eyesEnvironment: {}, renderer: ''})));
  });

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
    });
  });

  // matchSingleWindow
  app.post('/api/sessions', (req, res) => {
    const {startInfo, appOutput, options} = req.body;
    const runningSession = createRunningSessionFromStartInfo(startInfo);
    runningSession.steps = [{asExpected: true, appOutput, options}]; // TODO
    runningSessions[runningSession.id] = runningSession;
    res.set(
      'location',
      `${serverUrl}/api/tasks/matchsingle/${encodeURIComponent(runningSession.id)}`,
    );
    res.status(202).send({success: true});
  });

  // matchWindowAndClose
  app.post('/api/sessions/running/:id/matchandend', async (req, res) => {
    const {appOutput, options} = req.body;
    const runningSession = runningSessions[req.params.id];
    runningSession.steps = [{asExpected: true, appOutput, options}]; // TODO
    res.set(
      'location',
      `${serverUrl}/api/tasks/matchsingle/${encodeURIComponent(runningSession.id)}`,
    );
    res.status(202).send({success: true});
  });

  app.get('/api/tasks/:method/:id', (req, res) => {
    res.set(
      'location',
      `${serverUrl}/api/tasks/${req.params.method}/${encodeURIComponent(req.params.id)}`,
    );
    res.status(201).send({success: true});
  });

  app.delete('/api/tasks/:method/:id', (req, res) => {
    currentlyRunning--;
    const runningSessionId = decodeURIComponent(req.params.id);
    const runningSession = runningSessions[runningSessionId];
    const testResults = createTestResultFromRunningSession(runningSession);
    res.send(testResults);
  });

  // startSession
  app.post('/api/sessions/running', (req, res) => {
    const runningSession = createRunningSessionFromStartInfo(req.body.startInfo);
    runningSessions[runningSession.id] = runningSession;
    currentlyRunning++;
    maxRunning = Math.max(maxRunning, currentlyRunning);

    const {id, sessionId, batchId, baselineId, url} = runningSession;
    res.send({id, sessionId, batchId, baselineId, url});
  });

  app.get('/api/sessions/batches/:batchId/:sessionId', (req, res) => {
    const runningSession = Object.values(runningSessions).find(runningSession => {
      if (
        runningSession.batchId === decodeURIComponent(req.params.batchId) &&
        runningSession.sessionId === decodeURIComponent(req.params.sessionId)
      ) {
        return runningSession;
      }
    });
    if (runningSession) {
      res.send(runningSession);
    } else {
      res.status(404).send();
    }
  });

  function createRunningSessionFromStartInfo(startInfo) {
    const {appIdOrName, scenarioIdOrName, batchInfo, environment} = startInfo;
    const {displaySize: _displaySize, inferred} = environment;
    const {id: batchId, name: _batchName} = batchInfo;
    const {browser, os} = UAParser(inferred);

    const sessionId = `${appIdOrName}__${scenarioIdOrName}`;
    const runningSessionId = `${sessionId}__running`;
    const baselineId = `${sessionId}__baseline`;
    const url = `${sessionId}__url`;

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
    };
  }

  // postDomSnapshot
  app.post('/api/sessions/running/data', (_req, res) => {
    res.set('location', 'bla');
    res.send({success: true});
  });

  // matchWindow
  app.post('/api/sessions/running/:id', express.raw({limit: '100MB'}), (req, res) => {
    const runningSession = runningSessions[req.params.id];
    const {steps: _steps, hostOS, hostApp} = runningSession;
    let matchWindowData, imageBuf;
    if (Buffer.isBuffer(req.body)) {
      const buff = req.body;
      const len = buff.slice(0, 4).readUInt32BE();
      matchWindowData = JSON.parse(buff.slice(4, len + 4));
      imageBuf = buff.slice(len + 4);
    } else {
      matchWindowData = req.body;
    }
    // console.log(matchWindowData);

    let asExpected = true;
    if (imageBuf) {
      const expectedPath = path.resolve(
        expectedFolder,
        `${filenamify(`${req.params.id}__${hostOS}__${hostApp}`)}.png`,
      );

      if (updateFixtures) {
        console.log('[fake-eyes-server] updating fixture at', expectedPath);
        fs.writeFileSync(expectedPath, imageBuf);
      }

      const expectedBuff = fs.readFileSync(expectedPath);
      asExpected = imageBuf.compare(expectedBuff) === 0;
    }
    runningSession.steps.push({matchWindowData, asExpected});
    res.send({asExpected});
  });

  // stopSession
  app.delete('/api/sessions/running/:id', (req, res) => {
    const {aborted: _aborted, updateBaseline: _updateBaseline} = req.body;
    const runningSession = runningSessions[req.params.id];

    res.send(createTestResultFromRunningSession(runningSession));
  });

  app.get('/api/usage', (_req, res) => {
    res.send({maxRunning});
  });

  function createTestResultFromRunningSession(runningSession) {
    const status = runningSession.steps.every(x => !!x.asExpected)
      ? TestResultsStatus.Passed
      : TestResultsStatus.Failed; // TODO TestResultsStatus.Unresolved

    const stepsInfo = runningSession.steps;
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
    };
  }

  return new Promise(resolve => {
    const server = app.listen(port || 0, () => {
      const serverPort = server.address().port;
      console.log('fake eyes server listening on port', serverPort);
      const close = promisify(server.close.bind(server));
      serverUrl = `http://localhost:${serverPort}`;
      resolve({port: serverPort, close});
    });
  });
}

module.exports = fakeEyesServer;
