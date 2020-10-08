const waitForDockerBrowsers = require('../../src/wait-for-docker-browsers')
const checkForDockerHostname = require('../../src/check-for-docker-hostname')

exports.mochaHooks = {
  async beforeAll() {
    await checkForDockerHostname()
    await waitForDockerBrowsers()
  },
}
