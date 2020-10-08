const assert = require('assert')
const checkForDockerHostname = require('../src/check-for-docker-hostname')

describe('checkForDockerHostname', () => {
  it('does not run on Linux', () => {
    return assert.doesNotThrow(async () => {
      await checkForDockerHostname({platform: 'linux'})
    })
  })
})
