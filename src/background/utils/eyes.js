const { Eyes } = window.EyesImages;

const promiseFactory = {
  makePromise: (p) => (new Promise(p)),
  resolve: Promise.resolve.bind(Promise),
  reject: Promise.reject.bind(Promise)
};

const eyes = {};

function makeEyes() {
  const eyesApiServerUrl = undefined;
  const eyes = new Eyes(eyesApiServerUrl, undefined, promiseFactory);
  eyes.setApiKey(process.env.API_KEY);
  eyes.setAgentId(navigator.userAgent);
  eyes.setInferredEnvironment(`useragent:${navigator.userAgent}`);
  eyes.setBatch("projectname");
  eyes.commands = [];

  return eyes.open("Selenium IDE", "test name").then(() => (eyes));
}

export function hasEyes(runId) {
  return !!eyes[runId];
}

export function getEyes(runId) {
  if (!eyes[runId]) {
    return makeEyes().then(eye => {
      eyes[runId] = eye;
      return eye;
    });
  } else {
    return Promise.resolve(eyes[runId]);
  }
}

export function closeEyes(runId) {
  const eye = eyes[runId];
  eyes[runId] = undefined;

  return eye.close(false).then(results => {
    results.commands = eye.commands;
    return results;
  }).catch((e) => {
    console.error(e);
    eye.abortIfNotClosed();
  });
}
