// https://trello.com/c/QCK2xDlS
const {testSetup, getTestInfo} = require('@applitools/sdk-shared')
const eyes = testSetup.getEyes({vg: true})
const assert = require('assert')

fixture`Hello world`.page('https://applitools.com/helloworld/')

test('EnablePatterns', async t => {
  await eyes.open({
    appName: 'eyes-testcafe',
    testName: 'enablePatterns',
    t,
  })
  await eyes.checkWindow({
    enablePatterns: true,
  })
  const result = await eyes.close(false)
  const testInfo = await getTestInfo(result)
  assert.ok(testInfo['actualAppOutput']['0']['imageMatchSettings']['enablePatterns'])
})
