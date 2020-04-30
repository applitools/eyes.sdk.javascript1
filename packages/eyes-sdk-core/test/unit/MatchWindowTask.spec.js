'use strict'

const chai = require('chai')
chai.use(require('chai-uuid'))
const {expect} = chai
const assert = require('assert')
const {
  MatchWindowTask,
  CheckSettings,
  Logger,
  GeneralUtils,
  AppOutput,
  AppOutputWithScreenshot,
} = require('../../index')
const {EyesBaseImpl} = require('../testUtils')
const logger = new Logger(process.env.APPLITOOLS_SHOW_LOGS)

describe('MatchWindowTask', () => {
  describe('createImageMatchSettings', () => {
    const eyes = new EyesBaseImpl()
    const task = new MatchWindowTask(true, true, true, true, eyes, true)
    const checkSettings = new CheckSettings()

    it('should return correct default values', async () => {
      const ms = await task.createImageMatchSettings(checkSettings, null)
      const expectedSerialization =
        '{"matchLevel":"Strict","accessibilityLevel":"None","ignoreCaret":true,"useDom":false,"enablePatterns":false,' +
        '"ignoreDisplacements":false,"exact":null,"ignore":[],"layout":[],"strict":[],"content":[],"accessibility":[],"floating":[]}'
      assert.strictEqual(
        JSON.stringify(ms),
        expectedSerialization,
        'ImageMatchSettings serialization does not match!',
      )
    })
  })

  describe('performMatch', () => {
    it('uploads screenshot to webhook and then sends only the metadata to Eyes server', async () => {
      /*** Given ***/

      let uploadedScreenshot
      const appOutputProvider = undefined
      const runningSession = 'runningSession'
      const serverConnector = {
        async uploadScreenshot(id, screenshot) {
          expect(id).to.be.a.uuid('v4')
          uploadedScreenshot = screenshot
          return `url:${screenshot}`
        },
        async matchWindow(runningSession, matchWindowData) {
          return {runningSession, matchWindowData: matchWindowData.toJSON()}
        },
      }
      const eyes = {
        _renderingInfoPromise: GeneralUtils.sleep(50),
      }
      const matchWindowTask = new MatchWindowTask(
        logger,
        serverConnector,
        runningSession,
        0,
        eyes,
        appOutputProvider,
      )

      const userInputs = 'userInputs'
      const appOutput = new AppOutputWithScreenshot(new AppOutput({screenshot: 'screenshot'}), null)

      const name = 'test name'
      const ignoreMismatch = 'ignoreMismatch'
      const imageMatchSettings = 'imageMatchSettings'
      const renderId = 'renderId'
      const source = 'source'

      /*** When ***/

      const matchPromise = matchWindowTask.performMatch(
        userInputs,
        appOutput,
        name,
        renderId,
        ignoreMismatch,
        imageMatchSettings,
        source,
      )

      await GeneralUtils.sleep(0)

      /*** Then ***/

      expect(uploadedScreenshot).to.be.undefined

      await eyes._renderingInfoPromise

      expect(uploadedScreenshot).to.equal('screenshot')
      expect(appOutput.getAppOutput().getScreenshotUrl('url:screenshot'))

      const result = await matchPromise

      expect(result).to.eql({
        runningSession,
        matchWindowData: {
          appOutput: {screenshotUrl: 'url:screenshot', title: undefined},
          ignoreMismatch,
          tag: name,
          userInputs,
          options: {
            forceMatch: false,
            forceMismatch: false,
            ignoreMatch: false,
            ignoreMismatch,
            renderId,
            source,
            userInputs,
            name,
            imageMatchSettings,
          },
        },
      })
    })
  })
})
