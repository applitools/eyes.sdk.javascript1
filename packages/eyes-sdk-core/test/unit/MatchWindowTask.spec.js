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
  Location,
} = require('../../index')
const {EyesBaseImpl} = require('../testUtils')
const MutableImage = require('../../lib/images/MutableImage')
const EyesScreenshot = require('../../lib/capture/EyesScreenshot')
const logger = new Logger(process.env.APPLITOOLS_SHOW_LOGS)

describe('MatchWindowTask', () => {
  describe('createImageMatchSettings', () => {
    const eyes = new EyesBaseImpl()
    const task = new MatchWindowTask(true, true, true, true, eyes, true)
    const checkSettings = new CheckSettings()

    it('should return correct default values', async () => {
      const ms = await task.createImageMatchSettings(checkSettings, null)
      const expectedSerialization =
        '{"matchLevel":"Strict","ignoreCaret":true,"useDom":false,"enablePatterns":false,' +
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
      const appOutput = new AppOutputWithScreenshot(
        new AppOutput({screenshot: 'screenshot', imageLocation: Location.ZERO}),
        null,
      )

      const name = 'test name'
      const ignoreMismatch = 'ignoreMismatch'
      const imageMatchSettings = 'imageMatchSettings'
      const renderId = 'renderId'
      const source = 'source'
      const variationGroupId = 'variationGroupId'

      /*** When ***/

      const matchPromise = matchWindowTask.performMatch(
        userInputs,
        appOutput,
        name,
        renderId,
        ignoreMismatch,
        imageMatchSettings,
        source,
        variationGroupId,
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
          appOutput: {screenshotUrl: 'url:screenshot', title: undefined, location: {x: 0, y: 0}},
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
            variantId: variationGroupId,
          },
        },
      })
    })
  })

  describe('_tryTakeScreenshot', () => {
    it('should return the same screenshot if it matches the previous one', async () => {
      // sha256 of the word 'screenshot' === 4441146b0fe1d5c6845af126ba5ce6003ea77d6b4cb04d14114f86a925c5dbca
      const eyes = new EyesBaseImpl()
      const screenshotBuffer = Buffer.from('screenshot')
      const screenshot = new EyesScreenshot(new MutableImage(screenshotBuffer))
      const appOutputMock = {getScreenshot: () => screenshot}
      const appOutput = new AppOutputWithScreenshot(appOutputMock, screenshot)
      const matchWindowTask = new MatchWindowTask(true, true, true, true, eyes, appOutput)

      const screenshotSha = await screenshot.getImage().getImageSha256()
      matchWindowTask._lastScreenshotSha = screenshotSha

      const secondScreenshot = await matchWindowTask._tryTakeScreenshot(
        null,
        null,
        null,
        false,
        {getRenderId: () => ''},
        null,
      )

      const secondScreenshotSha = await secondScreenshot.getImage().getImageSha256()
      expect(screenshotSha).to.equal(secondScreenshotSha)
    })
  })
})
