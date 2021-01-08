'use strict'

const path = require('path')
const cwd = process.cwd()
const {testSetup, testServer} = require('@applitools/sdk-shared')
const spec = require(path.resolve(cwd, 'src/spec-driver'))
const {Target} = require('../../index')
let server, eyes

fixture`TestDisableBrowserFetching`
  .before(async () => {
    const staticPath = path.join(cwd, 'node_modules/@applitools/sdk-shared/coverage-tests/fixtures')
    server = await testServer({
      port: 5557,
      staticPath,
      middlewareFile: path.join(
        cwd,
        'node_modules/@applitools/sdk-shared/coverage-tests/util/ua-middleware.js',
      ),
    })
    eyes = testSetup.getEyes({vg: true})
  })
  .after(async () => {
    await server.close()
  })
test('sends dontFetchResources to dom snapshot', async driver => {
  await spec.visit(driver, 'http://localhost:5557/ua.html')
  await eyes.open({
    t: driver,
    appName: 'VgFetch',
    testName: 'TestDisableBrowserFetching',
    browser: [{width: 800, height: 600, name: 'chrome'}],
    disableBrowserFetching: true,
  })
  await eyes.check(Target.window())
  await eyes.close()
})
