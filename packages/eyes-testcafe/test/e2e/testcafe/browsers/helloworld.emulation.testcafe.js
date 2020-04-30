/* global fixture */

'use strict'

const {ConsoleLogHandler} = require('@applitools/eyes-sdk-core')
const {Eyes, Target} = require('../../../../index')

fixture`Hello world`.page`https://applitools.com/helloworld`

test('helloworld viewport', async t => {
  const eyes = new Eyes()
  if (process.env.APPLITOOLS_SHOW_LOGS || process.env.APPLITOOLS_DEBUG_TEST) {
    eyes.setLogHandler(new ConsoleLogHandler(true))
  }
  await eyes.open(t, 'Applitools helloworld', 'eyes-testcafe e2e - viewport')
  await eyes.check('some tag', Target.window())
  await eyes.close()
})
