'use strict';

const makeOpenEyes = require('./openEyes');

function makeTestWindow(openConfig) {
  const openEyes = makeOpenEyes({...openConfig, isSingleWindow: true});
  return async ({openParams, checkParams, throwEx = true}) => {
    const {checkWindow, close} = await openEyes(openParams);
    checkWindow(checkParams);
    return close(throwEx);
  };
}

module.exports = makeTestWindow;
