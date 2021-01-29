// re: https://trello.com/c/xNCZNfPi
const _path = require('path')
const {testSetup, _testServer} = require('@applitools/sdk-shared')
const eyes = testSetup.getEyes({vg: true})
let _server
fixture`check open when js error in aut`
  .before(async () => {
    //const staticPath = path.join(__dirname, 'fixtures')
    //server = await testServer({port: 7999, staticPath})
  })
  .after(async () => {
    //await server.close()
    eyes.abortIfNotClosed()
  })
test.skip('repro', async t => {
  //await t.navigateTo('https://demo.applitools.com/') // works
  await t.navigateTo('https://www.walmart.com.mx/tu-cuenta/iniciar-sesion') // NOTE: errors with this
  //await t.navigateTo('http://localhost:7999/errors.html') // errors, but not in the right way...?
  await eyes.open({
    t,
    appName: 'eyes-testcafe custom',
    testName: 'viewport size error on open for certain pages',
    browser: [{width: 800, height: 600, name: 'chrome'}], // NOTE: and with this (take this away and it doesn't)
  })
  await eyes.checkWindow({
    target: 'window',
    fully: true,
  })
  await eyes.close(false)
})
