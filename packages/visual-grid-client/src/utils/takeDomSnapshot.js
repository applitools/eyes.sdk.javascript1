'use strict';

const {
  getProcessPageAndSerializePoll,
  getProcessPageAndSerializePollForIE,
} = require('@applitools/dom-snapshot');
const {GeneralUtils} = require('@applitools/eyes-common');

const PULL_TIMEOUT = 200; // ms
const CAPTURE_DOM_TIMEOUT_MS = 5 * 60 * 1000; // 5 min

let captureScript, captureScriptIE;

async function getScript() {
  if (!captureScript) {
    const scriptBody = await getProcessPageAndSerializePoll();
    captureScript = `${scriptBody} return __processPageAndSerializePoll();`;
  }

  return captureScript;
}

async function getScriptForIE() {
  if (!captureScriptIE) {
    const scriptBody = await getProcessPageAndSerializePollForIE();
    captureScriptIE = `${scriptBody} return __processPageAndSerializePollForIE();`;
  }

  return captureScriptIE;
}

async function takeDomSnapshot({executeScript, startTime = Date.now(), browser}) {
  const processPageAndPollScript = browser === 'IE' ? await getScriptForIE() : await getScript();
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
