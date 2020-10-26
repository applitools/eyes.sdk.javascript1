const fetch = require('node-fetch')
const {delay} = require('@applitools/functional-commons')

async function waitForDockerBrowsers(
  {remoteUrl = process.env.CVG_TESTS_REMOTE, retries = 50} = {
    remoteUrl: process.env.CVG_TESTS_REMOTE,
    retries: 50,
  },
) {
  if (retries === 0) {
    throw new Error('browsers docker containers failed to start before running tests')
  }
  try {
    await fetch(remoteUrl)
  } catch (_ex) {
    await delay(100)
    return waitForDockerBrowsers({remoteUrl, retries: retries - 1})
  }
}

module.exports = waitForDockerBrowsers
