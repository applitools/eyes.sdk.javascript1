/* global fetch */
'use strict'
const {describe, it} = require('mocha')
const {expect} = require('chai')
const makeFetchResource = require('../../src/sdk/fetchResource')
const testLogger = require('../util/testLogger')
const testServer = require('@applitools/sdk-shared/src/run-test-server')
require('@applitools/isomorphic-fetch')

describe('fetchResource', () => {
  it('aborts fetch when media download timeout is met', async () => {
    const server = await testServer({
      showLogs: true,
      middlewareFile: require.resolve(
        '@applitools/sdk-shared/coverage-tests/util/streaming-middleware',
      ),
    })
    try {
      const fetchResource = makeFetchResource({logger: testLogger, mediaDownloadTimeout: 80, fetch})
      const url = `http://localhost:${server.port}/stream`
      const result = await fetchResource(url)
      expect(result).to.eql({url, errorStatusCode: 599})
    } finally {
      await server.close()
    }
  })
})
