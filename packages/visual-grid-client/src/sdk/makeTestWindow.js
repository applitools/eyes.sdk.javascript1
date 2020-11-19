'use strict'

const makeOpenEyes = require('./openEyes')

function makeTestWindow(openConfig) {
  const openEyes = makeOpenEyes(openConfig)
  return async ({openParams, checkParams, throwEx = true}) => {
    const {checkWindow} = await openEyes(openParams)
    return checkWindow({...checkParams, closeAfterMatch: true, throwEx})
  }
}

module.exports = makeTestWindow
