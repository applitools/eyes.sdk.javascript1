'use strict';

const {getProcessPageAndSerializePoll} = require('@applitools/dom-snapshot');
const {GeneralUtils} = require('@applitools/eyes-common');

const PULL_TIMEOUT = 200; // ms
const CAPTURE_DOM_TIMEOUT_MS = 5 * 60 * 1000; // 5 min

let captureScript;
async function getScript() {
  if (!captureScript) {
    const processPageAndPollScript = await getProcessPageAndSerializePoll();
    captureScript = `${processPageAndPollScript} return __processPageAndPoll();`;
  }

  return captureScript;
}

async function takeDomSnapshot({executeScript, startTime = Date.now()}) {
  const processPageAndPollScript = await getScript();
  const resultAsString = await executeScript(processPageAndPollScript);

  const scriptResponse = JSON.parse(resultAsString);

  if (scriptResponse.status === 'SUCCESS') {
    return scriptResponse.value;
  } else if (scriptResponse.status === 'ERROR') {
    throw new Error(`Unable to process: ${scriptResponse.error}`);
  } else if (Date.now() - startTime >= CAPTURE_DOM_TIMEOUT_MS) {
    throw new Error('Timeout is reached.');
  }

  await GeneralUtils.sleep(PULL_TIMEOUT);
  return takeDomSnapshot({executeScript, startTime});
}

module.exports = takeDomSnapshot;
