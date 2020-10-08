'use strict'

const assert = require('assert')

const {
  MatchLevel,
  AccessibilityLevel,
  AccessibilityGuidelinesVersion,
  Region,
  ImageMatchSettings,
  ExactMatchSettings,
} = require('../../../index')

describe('ImageMatchSettings', () => {
  describe('toJSON()', () => {
    it('empty instance', () => {
      const ims = new ImageMatchSettings()
      const expectedSerialization =
        '{"matchLevel":"Strict","ignoreCaret":true,"useDom":false,"enablePatterns":false,' +
        '"ignoreDisplacements":false,"ignore":[],"layout":[],"strict":[],"content":[],"accessibility":[],"floating":[]}'
      assert.strictEqual(
        JSON.stringify(ims),
        expectedSerialization,
        'ImageMatchSettings serialization does not match!',
      )
    })

    it('with modified exact and ignore caret', () => {
      const ims = new ImageMatchSettings({
        matchLevel: MatchLevel.Content,
        accessibilitySettings: {
          level: AccessibilityLevel.AA,
          guidelinesVersion: AccessibilityGuidelinesVersion.WCAG_2_0,
        },
        exact: new ExactMatchSettings(),
        ignoreCaret: true,
      })
      const expectedSerialization =
        '{"matchLevel":"Content","ignoreCaret":true,"useDom":false,"enablePatterns":false,' +
        '"ignoreDisplacements":false,"exact":{"minDiffIntensity":0,"minDiffWidth":0,"minDiffHeight":0,"matchThreshold":0},' +
        '"ignore":[],"layout":[],"strict":[],"content":[],"accessibility":[],"accessibilitySettings":{"level":"AA","version":"WCAG_2_0"},"floating":[]}'
      assert.strictEqual(
        JSON.stringify(ims),
        expectedSerialization,
        'ImageMatchSettings serialization does not match!',
      )
    })

    it('with ignore regions', () => {
      const ims = new ImageMatchSettings()
      ims.setIgnoreRegions([new Region(10, 20, 30, 40)])
      const expectedSerialization =
        '{"matchLevel":"Strict","ignoreCaret":true,"useDom":false,"enablePatterns":false,' +
        '"ignoreDisplacements":false,"ignore":[{"left":10,"top":20,"width":30,"height":40,"coordinatesType":' +
        '"SCREENSHOT_AS_IS"}],"layout":[],"strict":[],"content":[],"accessibility":[],"floating":[]}'
      assert.strictEqual(
        JSON.stringify(ims),
        expectedSerialization,
        'ImageMatchSettings serialization does not match!',
      )
    })

    it('with accessibility regions', () => {
      const ims = new ImageMatchSettings()
      ims.setAccessibilityRegions([new Region(10, 20, 30, 40)])
      const expectedSerialization =
        '{"matchLevel":"Strict","ignoreCaret":true,"useDom":false,"enablePatterns":false,' +
        '"ignoreDisplacements":false,"ignore":[],"layout":[],"strict":[],"content":[],' +
        '"accessibility":[{"left":10,"top":20,"width":30,"height":40,"coordinatesType":' +
        '"SCREENSHOT_AS_IS"}],"floating":[]}'
      assert.strictEqual(
        JSON.stringify(ims),
        expectedSerialization,
        'ImageMatchSettings serialization does not match!',
      )
    })

    it('with modified useDom and enablePatterns', () => {
      const ims = new ImageMatchSettings({useDom: true, enablePatterns: false})
      const expectedSerialization =
        '{"matchLevel":"Strict","ignoreCaret":true,"useDom":true,"enablePatterns":false,' +
        '"ignoreDisplacements":false,"ignore":[],"layout":[],"strict":[],"content":[],"accessibility":[],"floating":[]}'
      assert.strictEqual(
        JSON.stringify(ims),
        expectedSerialization,
        'ImageMatchSettings serialization does not match!',
      )
    })

    it('copy ctor', () => {
      const accessibilitySettings = {
        level: AccessibilityLevel.AAA,
        guidelinesVersion: AccessibilityGuidelinesVersion.WCAG_2_0,
      }
      const ims = new ImageMatchSettings({
        ignoreDisplacements: true,
        ignore: [new Region(10, 20, 30, 40)],
        accessibilitySettings,
      })
      const imsCopy = new ImageMatchSettings(ims)

      assert.strictEqual(imsCopy.getIgnoreDisplacements(), true)
      assert.deepStrictEqual(imsCopy.getIgnoreRegions(), [new Region(10, 20, 30, 40)])
      assert.deepStrictEqual(imsCopy.getAccessibilitySettings(), accessibilitySettings)
    })
  })
})
