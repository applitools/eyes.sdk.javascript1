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
          renderStatus: renderRequest.renderId ? 'rendering' : 'need-more-resources',
          needMoreDom: !renderRequest.renderId,
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

  // put resource
  app.put('/resources/sha256/:hash', (_req, res) => {
    res.send({success: true});
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

  app.get('/api/tasks/:method/:id', (req, res) => {
    res.set(
      'location',
      `${serverUrl}/api/tasks/${req.params.method}/${encodeURIComponent(req.params.id)}`,
    );
    res.status(201).send({success: true});
  });

  app.delete('/api/tasks/:method/:id', (req, res) => {
    const runningSessionId = decodeURIComponent(req.params.id);
    const runningSession = runningSessions[runningSessionId];
    const testResults = createTestResultFromRunningSession(runningSession);
    res.send(testResults);
  });

  // startSession
  app.post('/api/sessions/running', (req, res) => {
    const runningSession = createRunningSessionFromStartInfo(req.body.startInfo);
    runningSessions[runningSession.id] = runningSession;

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
    const buff = req.body;
    const len = buff.slice(0, 4).readUInt32BE();
    const matchWindowData = JSON.parse(buff.slice(4, len + 4));
    console.log(matchWindowData);
    const imgBuff = buff.slice(len + 4);
    const {appOutput: _appOutput} = matchWindowData;

    const expectedPath = path.resolve(
      expectedFolder,
      `${filenamify(`${req.params.id}__${hostOS}__${hostApp}`)}.png`,
    );

    if (updateFixtures) {
      console.log('[fake-eyes-server] updating fixture at', expectedPath);
      fs.writeFileSync(expectedPath, imgBuff);
    }

    const expectedBuff = fs.readFileSync(expectedPath);
    const asExpected = imgBuff.compare(expectedBuff) === 0;
    runningSession.steps.push({matchWindowData, asExpected});
    res.send({asExpected});
  });

  // stopSession
  app.delete('/api/sessions/running/:id', (req, res) => {
    const {aborted: _aborted, updateBaseline: _updateBaseline} = req.body;
    const runningSession = runningSessions[req.params.id];

    res.send(createTestResultFromRunningSession(runningSession));
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
