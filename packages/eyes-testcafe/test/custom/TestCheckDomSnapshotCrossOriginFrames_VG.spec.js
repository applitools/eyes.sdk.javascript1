const cwd = process.cwd()
const path = require('path')
const {testSetup, testServer} = require('@applitools/sdk-shared')
let eyes, serverA, serverB

fixture`CORS iframe support in vg`
  .before(async () => {
    const staticPath = path.join(cwd, 'node_modules/@applitools/sdk-shared/coverage-tests/fixtures')
    serverA = await testServer({
      port: 7373,
      staticPath,
      allowCors: false,
      middlewareFile: path.join(
        cwd,
        'node_modules/@applitools/sdk-shared/coverage-tests/util/handlebars-middleware.js',
      ),
      hbData: {
        src: 'http://localhost:7374/cors_frames/frame.html',
      },
    })
    serverB = await testServer({port: 7374, staticPath})
    eyes = testSetup.getEyes({vg: true})
  })
  .after(async () => {
    await serverA.close()
    await serverB.close()
  })
test('TestCheckDomSnapshotCrossOriginFrames_VG', async t => {
  await t.navigateTo('http://localhost:7373/cors_frames/cors.hbs')
  await eyes.open(t, 'CORS iframes', 'TestCheckDomSnapshotCrossOriginFrames_VG', {
    width: 1200,
    height: 800,
  })
  await eyes.check()
  await eyes.close(true)
})
