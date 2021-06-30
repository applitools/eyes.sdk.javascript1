const {Given, Then, setDefaultTimeout} = require('cucumber')
const {client} = require('nightwatch-api')
const {Target} = require('../../../../')

setDefaultTimeout(100000)

Given(/^I open Applitools`s demo page$/, async () => {
  await client.url('https://applitools.github.io/demo/')
})

Then(/^visual test Demo$/, async () => {
  await client.eyesOpen('demo', 'eyes-nightwatch cucumber').eyesCheck(Target.window().fully()).eyesClose()
})

Then(/^the button exists$/, async () => {
  await client.assert.visible('.button-section')
})
