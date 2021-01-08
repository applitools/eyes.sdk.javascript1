'use strict'

const path = require('path')
const cwd = process.cwd()
const spec = require(path.resolve(cwd, 'src/spec-driver'))
const {Target} = require('../../index')
const {testSetup, testServer} = require('@applitools/sdk-shared')
let server, eyes

fixture`DOMSnapshotSkipList`
  .before(async () => {
    const staticPath = path.join(cwd, 'node_modules/@applitools/sdk-shared/coverage-tests/fixtures')
    server = await testServer({
      port: 5558,
      staticPath,
      middlewareFile: path.join(
        cwd,
        'node_modules/@applitools/sdk-shared/coverage-tests/util/ephemeral-middleware.js',
      ),
    })
    eyes = testSetup.getEyes({vg: true})
  })
  .after(async () => {
    await server.close()
  })
// NOTE:
// Disabling this test since there is a problem when the middleware is enabled.
// - when on, dom-snapshot is not able to fetch any of the images
// - when off, dom-snapshot is able to fetch the first two images, but not the third
// The second point is a bug which is being tested in test/custom/TestCheckProxyResourceIssue.spec.js
test.skip('skip list for DOM snapshot works with dependencies for blobs', async driver => {
  const url = 'http://localhost:5558/skip-list/skip-list.html'
  await spec.visit(driver, url)
  await eyes.open(driver, 'Applitools Eyes SDK', 'DOMSnapshotSkipList', {width: 800, height: 600})
  await eyes.check(Target.window().fully())
  await spec.visit(driver, url)
  await eyes.check(Target.window().fully())
  await eyes.close()
})
