const assert = require('assert')
const generateDockerComposeConfig = require('../src/generate-docker-compose-config')

describe('generate-docker-compose-config', () => {
  it('linux', () => {
    const expected =
      '{"version":"3.4","services":{"chrome":{"image":"selenium/standalone-chrome:3.141.59-20200515","volumes":["/dev/shm:/dev/shm"],"network_mode":"host"},"firefox":{"image":"selenium/standalone-firefox","volumes":["/dev/shm:/dev/shm"],"ports":["4445:4444"]}}}'
    assert(generateDockerComposeConfig({platform: 'linux'}), expected)
  })
  it('mac', () => {
    const expected =
      '{"version":"3.4","services":{"chrome":{"image":"selenium/standalone-chrome:3.141.59-20200515","volumes":["/dev/shm:/dev/shm"],"ports":["4444:4444",{"target":"5555","protocol":"tcp","mode":"host"},{"target":"5556","protocol":"tcp","mode":"host"},{"target":"5557","protocol":"tcp","mode":"host"}]},"firefox":{"image":"selenium/standalone-firefox","volumes":["/dev/shm:/dev/shm"],"ports":["4445:4444"]}}}'
    assert(generateDockerComposeConfig({platform: 'darwin'}), expected)
  })
})
