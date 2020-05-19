'use strict'

const assert = require('assert')
const {getResourceAsText} = require('../../testUtils')

const {
  AppEnvironment,
  BatchInfo,
  SessionType,
  PropertyData,
  SessionStartInfo,
  ImageMatchSettings,
  MatchLevel,
  RectangleSize,
  FloatingMatchSettings,
  AccessibilityLevel,
  AccessibilityGuidelinesVersion,
  AccessibilityRegionType,
  AccessibilityRegionByRectangle,
  CheckSettingsFactory,
  MatchWindowTask,
} = require('../../../index')
const {EyesBaseImpl} = require('../../testUtils')

const CheckSettings = CheckSettingsFactory(
  function() {},
  function() {},
)

describe('SessionStartInfo', () => {
  it('TestSerialization', () => {
    const properties = []
    properties.push(new PropertyData('property 1', 'value 1'))

    const batchInfo = new BatchInfo(
      'some batch',
      new Date('2017-07-29T09:01:00.000Z'),
      'someBatchId',
    )

    const sessionStartInfo = new SessionStartInfo({
      agentId: 'agent',
      appIdOrName: 'some app',
      verId: '1.0',
      scenarioIdOrName: 'some test',
      batchInfo,
      baselineEnvName: 'baseline',
      environment: new AppEnvironment({
        os: 'windows',
        hostingApp: 'test suite',
        displaySize: new RectangleSize(234, 456),
        deviceInfo: 'Some Mobile Device',
      }),
      environmentName: 'some environment',
      defaultMatchSettings: new ImageMatchSettings({
        matchLevel: MatchLevel.Strict,
        accessibility: [
          new AccessibilityRegionByRectangle(
            {left: 10, top: 20, width: 30, height: 40},
            AccessibilityRegionType.GraphicalObject,
          ),
        ],
        floating: [
          new FloatingMatchSettings({
            left: 22,
            top: 32,
            width: 42,
            height: 52,
            maxUpOffset: 5,
            maxDownOffset: 10,
            maxLeftOffset: 15,
            maxRightOffset: 20,
          }),
        ],
        accessibilitySettings: {
          level: AccessibilityLevel.AA,
          guidelinesVersion: AccessibilityGuidelinesVersion.WCAG_2_0,
        },
      }),
      branchName: 'some branch',
      parentBranchName: 'parent branch',
      baselineBranchName: 'baseline branch',
      sessionType: SessionType.SEQUENTIAL,
      displayName: 'display name',
      compareWithParentBranch: false,
      ignoreBaseline: false,
      render: false,
      saveDiffs: false,
      properties,
    })

    const actualSerialization = JSON.stringify(sessionStartInfo, null, 2)
    const expectedSerialization = getResourceAsText('SessionStartInfo_Serialization.json')
    assert.strictEqual(
      actualSerialization,
      expectedSerialization,
      'SessionStartInfo serialization does not match!',
    )
  })
  ;[
    {useDom: true, enablePatterns: true, ignoreDisplacements: true},
    {useDom: true, enablePatterns: true, ignoreDisplacements: false},
    {useDom: true, enablePatterns: false, ignoreDisplacements: true},
    {useDom: true, enablePatterns: false, ignoreDisplacements: false},
    {useDom: false, enablePatterns: true, ignoreDisplacements: true},
    {useDom: false, enablePatterns: true, ignoreDisplacements: false},
    {useDom: false, enablePatterns: false, ignoreDisplacements: true},
    {useDom: false, enablePatterns: false, ignoreDisplacements: false},
  ].forEach(({useDom, enablePatterns, ignoreDisplacements}) => {
    it(`TestFluentApiSerialization (${useDom}, ${enablePatterns}, ${ignoreDisplacements})`, async () => {
      const settings = CheckSettings.window()
        .fully()
        .useDom(useDom)
        .enablePatterns(enablePatterns)
        .ignoreDisplacements(ignoreDisplacements)

      const eyes = new EyesBaseImpl()
      const task = new MatchWindowTask(true, true, true, true, eyes, true)
      const imageMatchSettings = await task.createImageMatchSettings(settings, null)

      const actualSerialization = JSON.stringify(imageMatchSettings)
      const expectedSerialization = getResourceAsText(
        `SessionStartInfo_FluentApiSerialization_${useDom}_${enablePatterns}_${ignoreDisplacements}.json`,
      )
      assert.strictEqual(
        actualSerialization,
        expectedSerialization,
        'ImageMatchSettings serialization does not match!',
      )
    })

    it(`TestImageMatchSettingsSerialization_Global (${useDom}, ${enablePatterns}, ${ignoreDisplacements})`, async () => {
      const settings = CheckSettings.window()
        .fully()
        .useDom(useDom)
        .enablePatterns(enablePatterns)

      const eyes = new EyesBaseImpl()
      const configuration = eyes.getConfiguration()
      configuration.setIgnoreDisplacements(ignoreDisplacements)
      eyes.setConfiguration(configuration)

      const task = new MatchWindowTask(true, true, true, true, eyes, true)
      const imageMatchSettings = await task.createImageMatchSettings(settings, null)

      const actualSerialization = JSON.stringify(imageMatchSettings)
      const expectedSerialization = getResourceAsText(
        `SessionStartInfo_FluentApiSerialization_${useDom}_${enablePatterns}_${ignoreDisplacements}.json`,
      )
      assert.strictEqual(
        actualSerialization,
        expectedSerialization,
        'ImageMatchSettings serialization does not match!',
      )
    })

    it(`TestConfigurationSerialization (${useDom}, ${enablePatterns}, ${ignoreDisplacements})`, async () => {
      const settings = CheckSettings.window().fully()

      const eyes = new EyesBaseImpl()
      const configuration = eyes.getConfiguration()
      configuration.setUseDom(useDom)
      configuration.setEnablePatterns(enablePatterns)
      configuration.setIgnoreDisplacements(ignoreDisplacements)
      eyes.setConfiguration(configuration)

      const task = new MatchWindowTask(true, true, true, true, eyes, true)
      const imageMatchSettings = await task.createImageMatchSettings(settings, null)

      const actualSerialization = JSON.stringify(imageMatchSettings)
      const expectedSerialization = getResourceAsText(
        `SessionStartInfo_FluentApiSerialization_${useDom}_${enablePatterns}_${ignoreDisplacements}.json`,
      )
      assert.strictEqual(
        actualSerialization,
        expectedSerialization,
        'ImageMatchSettings serialization does not match!',
      )
    })
  })
})
