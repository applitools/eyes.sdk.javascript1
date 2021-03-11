const assert = require('assert')
const {
  translateArgsToConfig,
  makeTranslateArgsToCheckSettings,
  writeTapFile,
} = require('../../src/util')
const {CheckSettings} = require('../../src/sdk')
const translateArgsToCheckSettings = makeTranslateArgsToCheckSettings(CheckSettings)
const path = require('path')
const fs = require('fs')

describe('util', () => {
  describe('write tap file', () => {
    it('works', () => {
      const formatter = {asHierarchicTAPString: () => 'the results'}
      let pathToFile
      try {
        pathToFile = writeTapFile({tapDirPath: __dirname, formatter})
        assert.deepStrictEqual(pathToFile, path.resolve(__dirname, 'eyes.tap'))
        const content = fs.readFileSync(path.resolve(__dirname, 'eyes.tap'), 'utf8')
        assert.deepStrictEqual(content, formatter.asHierarchicTAPString())
      } finally {
        pathToFile && fs.unlinkSync(pathToFile)
      }
    })
  })
  describe('config', () => {
    describe('translate check args to check settings', () => {
      it('tag', () => {
        const args = {
          tag: 'blah',
        }
        const checkSettings = translateArgsToCheckSettings(args)
        assert.deepStrictEqual(checkSettings.getName(), args.tag)
      })
      it('window fully', () => {
        const args = {
          target: 'window',
          fully: true,
        }
        const checkSettings = translateArgsToCheckSettings(args)
        assert.deepStrictEqual(checkSettings.getStitchContent(), args.fully)
      })
      it('region selector', () => {
        const args = {
          target: 'region',
          selector: '#overflowing-div',
        }
        const checkSettings = translateArgsToCheckSettings(args)
        assert.deepStrictEqual(checkSettings.getTargetElement(), args.selector)
      })
      it('region', () => {
        const args = {target: 'region', region: {top: 100, left: 0, width: 1000, height: 200}}
        const checkSettings = translateArgsToCheckSettings(args)
        const actualRegion = checkSettings.getTargetRegion()
        assert.deepStrictEqual(actualRegion.getTop(), args.region.top)
        assert.deepStrictEqual(actualRegion.getLeft(), args.region.left)
        assert.deepStrictEqual(actualRegion.getWidth(), args.region.width)
        assert.deepStrictEqual(actualRegion.getHeight(), args.region.height)
      })
      it('ignore', async () => {
        const args = {
          ignore: [{selector: '#overflowing-div'}, {top: 100, left: 0, width: 1000, height: 200}],
        }
        const checkSettings = translateArgsToCheckSettings(args)
        const ignoreRegions = checkSettings.getIgnoreRegions()
        assert.deepStrictEqual(ignoreRegions.length, args.ignore.length)
        assert.deepStrictEqual(ignoreRegions[0]._selector, args.ignore[0].selector)
        const r = await ignoreRegions[1].getRegion()
        assert.deepStrictEqual(r[0], args.ignore[1])
      })
      it('floating', async () => {
        const args = {
          floating: [
            {
              top: 100,
              left: 0,
              width: 1000,
              height: 100,
              maxUpOffset: 20,
              maxDownOffset: 20,
              maxLeftOffset: 20,
              maxRightOffset: 20,
            },
            {
              selector: '#overflowing-div',
              maxUpOffset: 20,
              maxDownOffset: 20,
              maxLeftOffset: 20,
              maxRightOffset: 20,
            },
          ],
        }
        const checkSettings = translateArgsToCheckSettings(args)
        const actualFloatingRegions = checkSettings.getFloatingRegions()
        assert.deepStrictEqual(actualFloatingRegions.length, args.floating.length)
        assert.deepStrictEqual(actualFloatingRegions[0]._region._top, args.floating[0].top)
        assert.deepStrictEqual(actualFloatingRegions[0]._region._left, args.floating[0].left)
        assert.deepStrictEqual(actualFloatingRegions[0]._region._width, args.floating[0].width)
        assert.deepStrictEqual(actualFloatingRegions[0]._region._height, args.floating[0].height)
        assert.deepStrictEqual(
          actualFloatingRegions[0]._options.maxUpOffset,
          args.floating[0].maxUpOffset,
        )
        assert.deepStrictEqual(
          actualFloatingRegions[0]._options.maxDownOffset,
          args.floating[0].maxDownOffset,
        )
        assert.deepStrictEqual(
          actualFloatingRegions[0]._options.maxLeftOffset,
          args.floating[0].maxLeftOffset,
        )
        assert.deepStrictEqual(
          actualFloatingRegions[0]._options.maxRightOffset,
          args.floating[0].maxRightOffset,
        )
        assert.deepStrictEqual(actualFloatingRegions[1]._selector, args.floating[1].selector)
        assert.deepStrictEqual(
          actualFloatingRegions[1]._options.maxUpOffset,
          args.floating[1].maxUpOffset,
        )
        assert.deepStrictEqual(
          actualFloatingRegions[1]._options.maxDownOffset,
          args.floating[1].maxDownOffset,
        )
        assert.deepStrictEqual(
          actualFloatingRegions[1]._options.maxLeftOffset,
          args.floating[1].maxLeftOffset,
        )
        assert.deepStrictEqual(
          actualFloatingRegions[1]._options.maxRightOffset,
          args.floating[1].maxRightOffset,
        )
      })
      it('layout', () => {
        const args = {
          layout: [{top: 100, left: 0, width: 1000, height: 100}, {selector: '#overflowing-div'}],
        }
        const checkSettings = translateArgsToCheckSettings(args)
        const actualLayoutRegions = checkSettings.getLayoutRegions()
        assert.deepStrictEqual(actualLayoutRegions.length, args.layout.length)
      })
      it('strict', () => {
        const args = {
          strict: [{top: 100, left: 0, width: 1000, height: 100}, {selector: '#overflowing-div'}],
        }
        const checkSettings = translateArgsToCheckSettings(args)
        const actualStrictRegions = checkSettings.getStrictRegions()
        assert.deepStrictEqual(actualStrictRegions.length, args.strict.length)
      })
      it('content', () => {
        const args = {
          content: [{top: 100, left: 0, width: 1000, height: 100}, {selector: '#overflowing-div'}],
        }
        const checkSettings = translateArgsToCheckSettings(args)
        const actualContentRegions = checkSettings.getContentRegions()
        assert.deepStrictEqual(actualContentRegions.length, args.content.length)
      })
      it('accessibility', () => {
        const args = {
          accessibility: [
            {accessibilityType: 'RegularText', selector: '#overflowing-div'},
            {accessibilityType: 'BoldText', top: 100, left: 0, width: 1000, height: 100},
          ],
        }
        const checkSettings = translateArgsToCheckSettings(args)
        const actualAccessibilityRegions = checkSettings.getAccessibilityRegions()
        assert.deepStrictEqual(actualAccessibilityRegions.length, args.accessibility.length)
      })
      it('scriptsHooks', () => {
        const args = {
          scriptHooks: {
            beforeCaptureScreenshot: "document.body.style.backgroundColor = 'gold'",
          },
        }
        const checkSettings = translateArgsToCheckSettings(args)
        assert.deepStrictEqual(checkSettings.getScriptHooks(), args.scriptHooks)
      })
      it('sendDom', () => {
        const args = {sendDom: false}
        const checkSettings = translateArgsToCheckSettings(args)
        assert.deepStrictEqual(checkSettings.getSendDom(), args.sendDom)
      })
      it('enablePatterns', () => {
        const args = {enablePatterns: true}
        const checkSettings = translateArgsToCheckSettings(args)
        assert.deepStrictEqual(checkSettings.getEnablePatterns(), args.enablePatterns)
      })
    })
    describe('translate open args to config', () => {
      it('works', () => {
        const args = {
          testName: 'test-name',
          browser: [{width: 1024, height: 768, name: 'ie11'}],
          batchId: 'batch-id',
          batchName: 'batch-name',
          baselineEnvName: 'baseline-env-name',
          envName: 'env-name',
          ignoreCaret: true,
          matchLevel: 'None',
          baselineBranchName: 'baseline-branch-name',
          saveFailedTests: true,
          saveNewTests: true,
          properties: [{name: 'My prop', value: 'My value'}],
          ignoreDisplacements: true,
          compareWithParentBranch: true,
          ignoreBaseline: true,
          notifyOnCompletion: true,
          accessibilityValidation: {level: 'AA', guidelinesVersion: 'WCAG_2_0'},
          showLogs: true,
        }
        const config = translateArgsToConfig(args)
        assert.deepStrictEqual(config.getTestName(), args.testName)
        assert.deepStrictEqual(config.getBrowsersInfo(), args.browser)
        const batch = config.getBatch()
        assert.deepStrictEqual(batch.getName(), args.batchName)
        assert.deepStrictEqual(batch.getId(), args.batchId)
        assert.deepStrictEqual(batch.getNotifyOnCompletion(), args.notifyOnCompletion)
        assert.deepStrictEqual(config.getBaselineEnvName(), args.baselineEnvName)
        assert.deepStrictEqual(config.getEnvironmentName(), args.envName)
        assert.deepStrictEqual(config.getIgnoreCaret(), args.ignoreCaret)
        assert.deepStrictEqual(config.getMatchLevel(), args.matchLevel)
        assert.deepStrictEqual(config.getBaselineBranchName(), args.baselineBranchName)
        assert.deepStrictEqual(config.getParentBranchName(), args.parentBranchName)
        assert.deepStrictEqual(config.getSaveFailedTests(), args.saveFailedTests)
        assert.deepStrictEqual(config.getSaveNewTests(), args.saveNewTests)
        assert.deepStrictEqual(
          Object.values(config.getProperties()[0]),
          Object.values(args.properties[0]),
        )
        assert.deepStrictEqual(config.getIgnoreDisplacements(), args.ignoreDisplacements)
        assert.deepStrictEqual(config.getCompareWithParentBranch(), args.compareWithParentBranch)
        assert.deepStrictEqual(config.getIgnoreBaseline(), args.ignoreBaseline)
        assert.deepStrictEqual(config.getAccessibilityValidation(), args.accessibilityValidation)
        assert.deepStrictEqual(config.getShowLogs(), args.showLogs)
      })
      it('skips undefined entries', () => {
        const config = translateArgsToConfig({})
        assert.deepStrictEqual(config.getMatchLevel(), 'Strict')
        assert.deepStrictEqual(config.getIgnoreDisplacements(), false)
        assert.deepStrictEqual(config.getAccessibilityValidation(), undefined)
      })
    })
    describe('translate applitools.config.js file contents to config', () => {
      it('works', () => {
        const args = {
          apiKey: 'asdf',
          showLogs: true,
          serverUrl: 'https://blah',
          proxy: 'https://username:password@myproxy.com:443',
          isDisabled: true,
          failTestcafeOnDiff: false,
          tapDirPath: process.cwd(),
          dontCloseBatches: true,
          disableBrowserFetching: true,
        }
        const config = translateArgsToConfig(args)
        assert.deepStrictEqual(config.getApiKey(), args.apiKey)
        assert.deepStrictEqual(config.getShowLogs(), args.showLogs)
        assert.deepStrictEqual(config.getServerUrl(), args.serverUrl)
        assert.deepStrictEqual(config.getProxy()._uri, args.proxy)
        assert.deepStrictEqual(config.getIsDisabled(), args.isDisabled)
        assert.deepStrictEqual(config.getDontCloseBatches(), args.dontCloseBatches)
        assert.deepStrictEqual(config.getDisableBrowserFetching(), args.disableBrowserFetching)
        assert.deepStrictEqual(config.failTestcafeOnDiff, args.failTestcafeOnDiff)
        assert.deepStrictEqual(config.tapDirPath, args.tapDirPath)
      })
      it('merges args in the correct order', () => {
        const args1 = {isDisabled: true}
        const args2 = {isDisabled: false}
        const config = translateArgsToConfig({...args2, ...args1})
        assert.deepStrictEqual(config.getIsDisabled(), true)
      })
    })
  })
})
