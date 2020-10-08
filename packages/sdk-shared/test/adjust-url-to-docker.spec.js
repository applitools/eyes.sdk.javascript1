const assert = require('assert')
const adjustUrlToDocker = require('../coverage-tests/util/adjust-url-to-docker')

describe('adjustUrlToDocker', () => {
  it('does not run on Linux', () => {
    assert.deepStrictEqual(
      adjustUrlToDocker('http://localhost', {platform: 'linux'}),
      'http://localhost',
    )
  })
  it('rewrites localhost url', () => {
    assert.deepStrictEqual(
      adjustUrlToDocker('http://localhost', {platform: 'darwin'}),
      'http://host.docker.internal',
    )
    assert.deepStrictEqual(
      adjustUrlToDocker('http://google.com', {platform: 'darwin'}),
      'http://google.com',
    )
  })
})
