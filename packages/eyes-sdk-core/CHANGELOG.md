# Change Log

## Unreleased


## 12.6.1 - 2020/11/24

- fix check frame logic by passing closeAfterMatch flag

## 12.6.0 - 2020/11/19

- new concurrency model
- updated to @applitools/dom-snapshot@4.2.7 (from 4.2.5)

## 12.5.7 - 2020/11/9

- fix region compensation issue in firefox

## 12.5.6 - 2020/11/8

- add 2020 ios devices
- fix coded region calculation when running in target region ([Trello 538](https://trello.com/c/FQ8iJZdi))

## 12.5.5 - 2020/11/1

- updated to @applitools/dom-snapshot@4.2.5 (from 4.2.3)

## 12.5.4 - 2020/10/26

- restore inner offset of the element in case one stitch full page screenshot ([Trello 528](https://trello.com/c/iu2Png9p))
- updated to @applitools/dom-snapshot@4.2.3 (from 4.2.2)

## 12.5.3 - 2020/10/24

- fix `setViewportSize` utility

## 12.5.2 - 2020/10/23

- remove unused devDependencies
- fix sending multiple region types by the same element in vg mode
- fix sending `ignoreDisplacements` in vg mode
- fix check settings when set `false` in `sendDom` using object notation
- remove force hiding scrollbars during taking full page screenshot with css stitching
- updated to @applitools/dom-capture@8.0.1 (from 8.0.0)
- updated to @applitools/snippets@2.1.0 (from 2.0.3)

## 12.5.1 - 2020/10/22

- rename `_getSetBatchId` to `getBatchIdWithoutGenerating`

## 12.5.0 - 2020/10/22

- added ability to close batches using batch IDs

## 12.4.4 - 2020/10/19

- deprecate `saveDebugData`

## 12.4.3 - 2020/10/18

- use `enableMultipleResultsPerSelector` in render request
- updated to @applitools/dom-snapshot@4.2.2 (from 4.2.1)

## 12.4.2 - 2020/10/14

- re-enable native app viewport screenshotting along with added support for checkRegion

## 12.4.1 - 2020/10/13

- disable native mobile app viewport screenshotting (until check region functionality is also supported)

## 12.4.0 - 2020/10/13

- improve screenshots on native mobile apps (with Appium) so just the application viewport is captured ([PR 135](https://github.com/applitools/eyes.sdk.javascript1/pull/135))
=======

## 12.3.2 - 2020/10/13

- override cors frame's src after dom snapshot is taken
- prevent taking a screenshot of the invisible part of the region ([Trello 544](https://trello.com/c/wJsUyBPE), [Trello 528](https://trello.com/c/iu2Png9p), [commit](https://github.com/applitools/eyes.sdk.javascript1/commit/c4adcdd74d479284075835e7a99489d8ba37825f))
- updated to @applitools/dom-snapshot@4.2.1 (from 4.2.0)

## 12.3.1 - 2020/10/7

- add support for proxy configurations that use a default port (e.g., port 80) with isHttpOnly ([Trello 539](https://trello.com/c/0RPLxkOo), [commit](https://github.com/applitools/eyes.sdk.javascript1/commit/f0225dd9d5d761f5941eea1fa145bfaea9170877))

## 12.3.0 - 2020/10/6

- added support of chunked dom snapshot results
- used common polling logic for dom snapshot and dom capture
- add warnings when `setViewportSize` fails during taking dom snapshot with layout breakpoints
- support multiple versions of ios for visual grid
- updated to @applitools/dom-snapshot@4.1.2 (from 4.1.0)
- updated to @applitools/snippets@2.0.3 (from 2.0.1)
- updated to @applitools/dom-capture@8.0.0 (from 7.3.0)
- updated to @applitools/dom-snapshot@4.2.0 (from 4.1.2)

## 12.2.9 - 2020/9/28

- increase the default number of retries for request
- add delay before retry
- updated to @applitools/snippets@2.0.1 (from 2.0.0)

## 12.2.8 - 2020/9/24

- new release process

## 12.2.7 - 2020/9/23

- remove yarn workspaces

## 12.2.6 - 2020/9/23

- support cross origin iframes

## 12.2.5 - 2020/9/17

- fix viewport position calculations ([Trello](https://trello.com/c/TuXUZUNO))
- fix `takeDomCapture`

## 12.2.4 - 2020/9/15

- add new `takeDomSnapshot` implementation
- remove `selenium-webdriver` dependency

## 12.2.3 - 2020/9/2

- add `disableBrowserFetching` configuration parameter ([Trello](https://trello.com/c/ixJJZdiA))

## 12.2.2 - 2020/9/1

- fix layout breakpoints configuration

## 12.2.1 - 2020/9/1

- fix layout breakpoints configuration

## 12.2.0 - 2020/8/30

- add support for `layoutBreakpoints`
- avoid javascript execution on native devices during viewport size extraction
- mark coded regions and target elements with unique selectors for the visual grid
- improve handling of fractional metrics ([Trello](https://trello.com/c/TuXUZUNO/441-sonatype-wdio-5-targetregion-appears-off-by-one-pixel))
- updated to @applitools/snippets@1.1.0 (from 1.0.3)
- updated to @applitools/snippets@1.1.1 (from 1.1.0)

## 12.1.4 - 2020/8/13

- avoid starting session with missing displaySize ([Trello 1](https://trello.com/c/jppq7ILy) [Trello 2](https://trello.com/c/5zDFhiMG))

## 12.1.3 - 2020/8/12

- fix priority of the default match level value ([Trello](https://trello.com/c/XxBQFIWQ/438-wdio-5-fluent-api-inconsistent-behavior-between-classicrunner-and-visualgrid-runner-with-matchlevel-specified-on-per-step-basis))
- populate device name from capabilities ([Trello](https://trello.com/c/qyf1baqT/464-wdio5-mobile-web-device-name-not-reported-on-dashboard))
- populate isMobile from ua in case of chrome emulation

## 12.1.2 - 2020/8/10

- handle case when SpecDrive.childContext doesn't return a new context
- remove workaround in EyesScreenshot
- add typedef for SpecDriver
- updated to @applitools/snippets@1.0.3 (from 1.0.2)

## 12.1.1 - 2020/8/6

- add utility function to verify that the object is an instance of a class by class name
- add JSON output to TestResultsFormatter [PR 224](https://github.com/applitools/eyes.sdk.javascript1/pull/224)

## 12.1.0 - 2020/8/6

- add support for RenderRequst `visualGridOptions` in Configuration and CheckSettings

## 12.0.1 - 2020/8/5

- Fix bug in runner.getAllTestResults(false)

## 12.0.0 - 2020/8/4

- support devtools protocol ([Trello](https://trello.com/c/fNxDJDId))

## 11.5.1 - 2020/7/28

- fix parsing of translate values in Firefox ([Trello](https://trello.com/c/encLpr4g))

## 11.5.0 - 2020/7/26

- support non-200 resources ([Trello](https://trello.com/c/J5lBWutP))

## 11.4.1 - 2020/7/24

- fix issue with duplicate copies of the SDK ([Trello](https://trello.com/c/4Gd7uWtS))

## 11.4.0 - 2020/7/24

- updated enum types to be more explicit about values
- remove type definitions
- support Appium mobile selectors
- updated to @applitools/dom-capture@7.2.6 (from 7.2.4)

## 11.3.9 - 2020/7/22

- avoid `error.getTestResults is not a function` error ([Trello 1](https://trello.com/c/XAmA255U) [Trello 2](https://trello.com/c/1Bl2EaDE))

## 11.3.8 - 2020/7/19

- fix `Date` typo in BatchInfo JSDoc
- support duplicate copies of the SDK in CheckSettings constructor ([Trello](https://trello.com/c/4Gd7uWtS))

## 11.3.7 - 2020/7/15

- use EyesClassic type as a return type for EyesFactoryCtor

## 11.3.6 - 2020/7/14

- return extended driver from EyesVisualGrid#open

## 11.3.5 - 2020/7/13

- improve typings

## 11.3.4 - 2020/7/7

- REVERT: avoid creating a test if no check command was called ([Trello](https://trello.com/c/ZhKO8sqA/404-wdiojs-sdkempty-test-results-with-new-eyes-core))

## 11.3.3 - 2020/7/7

- fix types

## 11.3.2 - 2020/7/7

- [REVERTED] avoid creating a test if no check command was called ([Trello](https://trello.com/c/ZhKO8sqA/404-wdiojs-sdkempty-test-results-with-new-eyes-core))
- fix setting blank src on same-origin iframes in visual grid

## 11.3.1 - 2020/7/7

- fix issue with redirected frames in dom-snapshot ([Trello](https://trello.com/c/egprwtNp))

## 11.3.0 - 2020/7/7

- support visual locators

## 11.2.2 - 2020/7/5

- cache correct viewport size value after fail set viewport size
- improve for element client rect js snippet
- fix js snippet to be compatible with IE ([Trello](https://trello.com/c/Y0Q6QAHK/406-wdio5-error-executing-javascript-fully-fullpagescreenshot))
- replace concurrent requests to the browser with sequential requests ([Trello](https://trello.com/c/Idx6gS3e/419-gartner-ie-errors))
- prevent call unnecessary methods in native context ([Trello](https://trello.com/c/SSWShJPg/345-wdio-5-sdk-support-for-wdio6))
- static Eyes.setViewportSize method ([Trello](https://trello.com/c/1KTjqPjI))

## 11.2.1 - 2020/6/30

- bring back input validation of accessibility type for AccessibilityRegionByRectangle
- handle stale element reference error wrapped with eyes error

## 11.2.0 - 2020/6/30

- Add type definitions

## 11.1.0 - 2020/6/28

- remove IosScreenOrientation ([Trello](https://trello.com/c/abSJ68Rl/409-ufg-safari-on-ios-orientations-changes))

## 11.0.10 - 2020/6/17

- fix stale scroll root element issue

## 11.0.9 - 2020/6/15

- change default concurrent sessions in visual grid from 3 to 1

## 11.0.8 - 2020/6/14

- raise minimum payload size in requests ([Trello](https://trello.com/c/4JMV3NKN))

## 11.0.7 - 2020/6/12

- improved support of the regions with fixed position ([Trello](https://trello.com/c/9G1aau4d/357-wdio5-unable-to-capture-scrollable-region)
- support scroll root elements with a position different from (0, 0) ([Trello](https://trello.com/c/04pdU1Up/328-js4-incorrect-stitching-using-targetregion-with-scrollrootelement))

## 11.0.6 - 2020/6/11

- added support of  check settings as a plain object
- handle bug when Safari 11(!) take a full page screenshot by default ([Trello](https://trello.com/c/A9AUxYlP))
- fix OOM issue with big images ([Trello](https://trello.com/c/4JMV3NKN))

## 11.0.5 - 2020/6/9

- addBrowser can now accept browserInfo object as first argument
- fixed iosDeviceInfo in renderRequest and added JSdoc for iosDeviceInfo

## 11.0.4 - 2020/6/4

- fix marking the scroll root element
- support correct driver API in DomCapture

## 11.0.3 - 2020/6/3

- added EDGE_CHROMIUM_TWO_VERSIONS_BACK to BrowserType
- updated to @applitools/dom-capture@7.2.4 (from v7.2.0)

## 11.0.2 - 2020/6/2

- avoid 404 error in internet explorer due to parallel script executions

## 11.0.1 - 2020/6/2

- change document.scrollingElement to document.documentElement as the default scroll root element

## 11.0.0 - 2020/5/31

- Unified core to power all SDK's

## 10.3.1 - 2020/5/26

- fix MatchLevel.Layout value ([Trello 1](https://trello.com/c/IBESoj8Q/371-cypress-unable-to-set-match-level-to-layout), [Trello 2](https://trello.com/c/EQD3JUOf/296-wdio-5-long-image-sometimes-fails-sometimes-succeeds))

## 10.3.0 - 2020/5/24

- add ability to output XUnit XML from the TestResultFormatter (per [Trello 261](https://trello.com/c/ozmI1rav))
- fix to implicitly use the correct dom-capture script when running on Internet Explorer or Edge Classic (per [Trello 296](https://trello.com/c/EQD3JUOf/296-wdio-5-long-image-sometimes-fails-sometimes-succeeds))
- merge dom-utils into the core
- merge eyes-common into the core

## 10.2.0 - 2020/5/19

- add AccessibilityGuidelinesVersion enum
- remove accessibilityLevel from checkSettings
- updated to @applitools/eyes-common@3.24.0

   ## 10.1.2 - 2020/5/13

- added retry for requests returning with a status code of 503   

## 10.1.1 - 2020/5/11

- updated to @applitools/eyes-common@3.23.1

## 10.1.0 - 2020/5/11

- add iosDeviceInfo support
- updated to @applitools/eyes-common@3.23.0

## 10.0.2 - 2020/5/11

- updated to @applitools/eyes-common@3.22.2

## 10.0.1 - 2020/5/4

- added resource info on putRender Error

## 10.0.0 - 2020/4/30

- consolidate classes into core (no changes from 9.3.0)

## 9.3.0 - 2020/4/30

- consolidate classes into core

## 9.2.1 - 2020/4/26

- updated to @applitools/eyes-common@3.22.1

## 9.2.0 - 2020/4/26

- updated to @applitools/eyes-common@3.22.0

## 9.1.2 - 2020/4/23

- updated to @applitools/eyes-common@3.21.1

## 9.1.1 - 2020/4/19

- added SDK agent id header for eyes server requests

## 9.1.0 - 2020/4/5

- updated to @applitools/eyes-common@3.21.0

## 9.0.3

- Fix getElementXpath in EyesJsBrowserUtils
- Added toCheckWindowConfiguration() to CheckSettings
- EyesRunner: `getAllTestResults` method now awaits existing close operations

## 9.0.2

- Support both new and old server versions for identifying new running sessions. ([Trello](https://trello.com/c/mtSiheZ9/267-support-startsession-as-long-running-task))

## 9.0.1

- identical to 9.0.0 (commit was added)

## 9.0.0

- **Breaking change**: RunningSession is no longer determined to be new according to startSession's response status, but rather by the response's payload of `isNew`. ([Trello](https://trello.com/c/60Rm4xXG/240-support-future-long-running-tasks))

## 8.1.2

- update @applitools/eyes-common@3.20.1

## 8.1.1

- updated eyes common to latest

## 8.1.0

- regions support for toPersistedRegions() for VGC

## 8.0.2

- fix exception on aborts - using _getSetBatchId in closeBatch so we dont generate batch id but still get the generated batch id.
guarding addBrowsers arguments for sending an array
- upload domsnapshot directly to Azure [Trello](https://trello.com/c/ZCLJo8Fy/241-upload-dom-directly-to-azure)
- support future long running tasks [Trello](https://trello.com/c/60Rm4xXG/240-support-future-long-running-tasks)
- fix regression in css stitching [Trello](https://trello.com/c/dp5IIoFw/235-css-stitching-regression-in-41533)

## 8.0.1

- getUserSetBatchId() can now run after generating batch id

## 8.0.0

- Moved server connector makers to runners

## 7.0.0

- move all runners to eyes-sdk-core
- fix setConfiguration cloned configuration [Trello 220](https://trello.com/c/d3rahmUd/220-setconfiguration-does-not-clone-the-configuration)
- remove EyesAbstract
- new branching model for Eyes [Trello 145](https://trello.com/c/VhEHv3YI/145-modify-branching-model-to-be-more-git-like-adjust-github-bitbucket-integrations-109-108-hotfix)

## 6.0.15

- identical to 6.0.9

## 6.0.14

- identical to 6.0.11

## 6.0.13

- unpublished

## 6.0.12

- unpublished

## 6.0.11

- fix Configuration and ImageMatchSettings copy constructor [Trello 204](https://trello.com/c/oH7Ne5EZ/204-js4ignoredisplacements-is-not-working)

## 6.0.6

- Fix `isMobile` check in EyesBase to support non-Selenium SDKs
- Bug fix in SessionResults to prevent a false positive when processing an expectedAppOutput collection that is in a dirty state (e.g., an array with an entry of `null`)


## [5.20.7](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.20.6...@applitools/eyes-sdk-core@5.20.7) (2019-11-28)


### Bug Fixes

* **eyes-common, eyes-sdk-core:** setProxyOptions is now out of server connector ([e1d15c4](https://github.com/applitools/eyes.sdk.javascript1/commit/e1d15c4))
* **eyes-common, eyes-sdk-core, visual-grid-client:** supporting http only proxy ([9221512](https://github.com/applitools/eyes.sdk.javascript1/commit/9221512))





## [5.20.6](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.20.5...@applitools/eyes-sdk-core@5.20.6) (2019-11-17)

**Note:** Version bump only for package @applitools/eyes-sdk-core





## [5.20.5](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.20.4...@applitools/eyes-sdk-core@5.20.5) (2019-11-13)

**Note:** Version bump only for package @applitools/eyes-sdk-core





## [5.20.4](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.20.3...@applitools/eyes-sdk-core@5.20.4) (2019-11-04)


### Bug Fixes

* **eyes-sdk-core, visual-grid-client:** added skipStartingSession to openBase - fixed testWindow startSession calls. ([cd424cb](https://github.com/applitools/eyes.sdk.javascript1/commit/cd424cb))





## [5.20.3](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.20.2...@applitools/eyes-sdk-core@5.20.3) (2019-11-03)

**Note:** Version bump only for package @applitools/eyes-sdk-core





## [5.20.2](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.20.1...@applitools/eyes-sdk-core@5.20.2) (2019-10-07)


### Bug Fixes

* **eyes-sdk-core:** don't close batch if APPLITOOLS_DONT_CLOSE_BATCHES=true ([e07344f](https://github.com/applitools/eyes.sdk.javascript1/commit/e07344f))





## [5.20.1](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.20.0...@applitools/eyes-sdk-core@5.20.1) (2019-10-07)


### Bug Fixes

* skip error inside `EyesBase.closeBatch()` (to work for all SDKs) ([b25d298](https://github.com/applitools/eyes.sdk.javascript1/commit/b25d298))





# [5.20.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.19.0...@applitools/eyes-sdk-core@5.20.0) (2019-10-06)


### Bug Fixes

* **visual-grid-client, eyes-common, eyes-sdk-core, eyes-selenium:** renamed setAccessibilityLevel to setAccessibilityValidation ([77d60e8](https://github.com/applitools/eyes.sdk.javascript1/commit/77d60e8))


### Features

* **eyes-common:** move BrowserType, DeviceName, ScreenOrientation, StitchMode to common module ([7dbdb41](https://github.com/applitools/eyes.sdk.javascript1/commit/7dbdb41))





# [5.19.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.18.1...@applitools/eyes-sdk-core@5.19.0) (2019-10-02)


### Features

* **eyes-sdk-common:** added accessibility status to TestResults ([c8d6273](https://github.com/applitools/eyes.sdk.javascript1/commit/c8d6273))





## [5.18.1](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.18.0...@applitools/eyes-sdk-core@5.18.1) (2019-09-27)


### Bug Fixes

* **eyes-sdk-core:** do not closeBatch in disabled mode ([454e306](https://github.com/applitools/eyes.sdk.javascript1/commit/454e306))





# [5.18.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.17.3...@applitools/eyes-sdk-core@5.18.0) (2019-09-23)


### Bug Fixes

* add exports of accessibility constants ([a4c0bed](https://github.com/applitools/eyes.sdk.javascript1/commit/a4c0bed))
* refactoring and fixing AccessibilityRegionByElement/Selector ([73dc022](https://github.com/applitools/eyes.sdk.javascript1/commit/73dc022))


### Features

* **eyes-sdk-core:** add `closeBatch` method to `EyesBase` and update close batch endpoint ([ae2d72d](https://github.com/applitools/eyes.sdk.javascript1/commit/ae2d72d))





## [5.17.3](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.17.2...@applitools/eyes-sdk-core@5.17.3) (2019-09-23)


### Bug Fixes

* **eyes-sdk-core, visual-grid-client:** removed getter and setter for accessibilityLevel from EyesAbstract ([9bb7e39](https://github.com/applitools/eyes.sdk.javascript1/commit/9bb7e39))





## [5.17.2](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.17.1...@applitools/eyes-sdk-core@5.17.2) (2019-09-22)


### Bug Fixes

* **eyes-common:** changed accessibilityRegionType API - removed None. ([b510014](https://github.com/applitools/eyes.sdk.javascript1/commit/b510014))





## [5.17.1](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.17.0...@applitools/eyes-sdk-core@5.17.1) (2019-09-22)

**Note:** Version bump only for package @applitools/eyes-sdk-core





# [5.17.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.16.1...@applitools/eyes-sdk-core@5.17.0) (2019-09-18)


### Features

* **eyes-common, eyes-sdk-core, visual-grid-client:** Added accessibilityLevel to match request. ([df2a383](https://github.com/applitools/eyes.sdk.javascript1/commit/df2a383))
* **eyes-common, eyes-sdk-core, visual-grid-client:** supporting accessibility regions to match request ([cc9ec8c](https://github.com/applitools/eyes.sdk.javascript1/commit/cc9ec8c))
* **eyes-sdk-core:** add `deleteBatchSessions` request to ServerConnector ([0728e08](https://github.com/applitools/eyes.sdk.javascript1/commit/0728e08))





## [5.16.1](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.16.0...@applitools/eyes-sdk-core@5.16.1) (2019-09-04)


### Bug Fixes

* change list of exports, add more classes from eyes-sdk-core ([8da543c](https://github.com/applitools/eyes.sdk.javascript1/commit/8da543c))





# [5.16.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.15.1...@applitools/eyes-sdk-core@5.16.0) (2019-09-02)


### Features

* **eyes-sdk-core:** added response body for error requests ([8fd246f](https://github.com/applitools/eyes.sdk.javascript1/commit/8fd246f))





## [5.15.1](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.15.0...@applitools/eyes-sdk-core@5.15.1) (2019-08-27)


### Bug Fixes

* serialize arrays in log output ([a255f95](https://github.com/applitools/eyes.sdk.javascript1/commit/a255f95))





# [5.15.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.14.0...@applitools/eyes-sdk-core@5.15.0) (2019-08-27)


### Features

* **eyes-sdk-core:** added renderIds to TestResults ([f440baf](https://github.com/applitools/eyes.sdk.javascript1/commit/f440baf))
* **eyes-sdk-core:** moved renderIds to StepInfo ([bfe09df](https://github.com/applitools/eyes.sdk.javascript1/commit/bfe09df))





# [5.14.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.13.0...@applitools/eyes-sdk-core@5.14.0) (2019-08-14)


### Features

* add `displayName` property to SessionStartInfo ([68ebb4e](https://github.com/applitools/eyes.sdk.javascript1/commit/68ebb4e))





# [5.13.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.12.3...@applitools/eyes-sdk-core@5.13.0) (2019-08-13)


### Bug Fixes

* **eyes-sdk-core:** add `ENOTFOUND` to list of failed codes (will retry) ([8deb302](https://github.com/applitools/eyes.sdk.javascript1/commit/8deb302))


### Features

* **eyes-sdk-core:** added response body to PUT logging ([9f7a868](https://github.com/applitools/eyes.sdk.javascript1/commit/9f7a868))





## [5.12.3](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.12.2...@applitools/eyes-sdk-core@5.12.3) (2019-08-08)

**Note:** Version bump only for package @applitools/eyes-sdk-core





## [5.12.2](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.12.1...@applitools/eyes-sdk-core@5.12.2) (2019-07-29)


### Bug Fixes

* **eyes-sdk-core:** limit size of resources send to VisualGrid ([f26876c](https://github.com/applitools/eyes.sdk.javascript1/commit/f26876c))





## [5.12.1](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.12.0...@applitools/eyes-sdk-core@5.12.1) (2019-07-16)


### Bug Fixes

* ignore regions using visual grid by selector (possibly invalid) ([f5adaa1](https://github.com/applitools/eyes.sdk.javascript1/commit/f5adaa1))
* save errors of regions and log warnings instead of throwing errors ([1f362d9](https://github.com/applitools/eyes.sdk.javascript1/commit/1f362d9))





# [5.12.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.11.1...@applitools/eyes-sdk-core@5.12.0) (2019-07-10)


### Bug Fixes

* **eyes-sdk-core:** throw error if visual-grid can't find region selector ([eac6334](https://github.com/applitools/eyes.sdk.javascript1/commit/eac6334))


### Features

* rename abortIfNotClosed to abort (old name saved as an alias) ([b09eba1](https://github.com/applitools/eyes.sdk.javascript1/commit/b09eba1))





## [5.11.1](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.11.0...@applitools/eyes-sdk-core@5.11.1) (2019-07-02)

**Note:** Version bump only for package @applitools/eyes-sdk-core





# [5.11.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.10.0...@applitools/eyes-sdk-core@5.11.0) (2019-06-30)


### Features

* add source (current url) to MatchWindowData.Options ([1989824](https://github.com/applitools/eyes.sdk.javascript1/commit/1989824))





# [5.10.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.9.3...@applitools/eyes-sdk-core@5.10.0) (2019-06-24)


### Features

* **eyes-sdk-core:** added renderId to MatchWindowData ([db05cbf](https://github.com/applitools/eyes.sdk.javascript1/commit/db05cbf))
* **eyes-sdk-core:** remove `isSaved` property of TestResults ([fd9cf90](https://github.com/applitools/eyes.sdk.javascript1/commit/fd9cf90))





## [5.9.3](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.9.2...@applitools/eyes-sdk-core@5.9.3) (2019-06-19)


### Bug Fixes

* **eyes-sdk-core:** remove serverConnector from output of TestResults ([a6fd38b](https://github.com/applitools/eyes.sdk.javascript1/commit/a6fd38b))





## [5.9.2](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.9.1...@applitools/eyes-sdk-core@5.9.2) (2019-06-19)

**Note:** Version bump only for package @applitools/eyes-sdk-core





## [5.9.1](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.9.0...@applitools/eyes-sdk-core@5.9.1) (2019-06-17)

**Note:** Version bump only for package @applitools/eyes-sdk-core





# [5.9.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.8.1...@applitools/eyes-sdk-core@5.9.0) (2019-06-03)


### Bug Fixes

* update axios to new version. ([d8d0ae9](https://github.com/applitools/eyes.sdk.javascript1/commit/d8d0ae9))


### Features

* add `sequenceName` property to `BatchInfo` object ([aca2b90](https://github.com/applitools/eyes.sdk.javascript1/commit/aca2b90))





## [5.8.1](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.8.0...@applitools/eyes-sdk-core@5.8.1) (2019-05-27)


### Bug Fixes

* rename ignoreDisplacement to ignoreDisplacements ([1dfb277](https://github.com/applitools/eyes.sdk.javascript1/commit/1dfb277))
* rename ignoreDisplacement to ignoreDisplacements (2) ([8b18a77](https://github.com/applitools/eyes.sdk.javascript1/commit/8b18a77))





# [5.8.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.7.5...@applitools/eyes-sdk-core@5.8.0) (2019-05-24)


### Features

* add `ignoreDisplacements` to fluent and match settings ([e329709](https://github.com/applitools/eyes.sdk.javascript1/commit/e329709))





## [5.7.5](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.7.4...@applitools/eyes-sdk-core@5.7.5) (2019-05-23)

**Note:** Version bump only for package @applitools/eyes-sdk-core





## [5.7.4](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.7.3...@applitools/eyes-sdk-core@5.7.4) (2019-05-21)


### Bug Fixes

* **eyes-selenium:** fix conflict between sendDom check and global values ([a4da78c](https://github.com/applitools/eyes.sdk.javascript1/commit/a4da78c))





## [5.7.3](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.7.2...@applitools/eyes-sdk-core@5.7.3) (2019-05-21)

**Note:** Version bump only for package @applitools/eyes-sdk-core





## [5.7.2](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.7.1...@applitools/eyes-sdk-core@5.7.2) (2019-05-07)

**Note:** Version bump only for package @applitools/eyes-sdk-core





## [5.7.1](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.7.0...@applitools/eyes-sdk-core@5.7.1) (2019-05-06)

**Note:** Version bump only for package @applitools/eyes-sdk-core





# [5.7.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.5.2...@applitools/eyes-sdk-core@5.7.0) (2019-05-03)


### Features

* **visual-grid-client, eyes-sdk-core:** added agentId to render request ([fb65891](https://github.com/applitools/eyes.sdk.javascript1/commit/fb65891))





## [5.5.2](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.5.1...@applitools/eyes-sdk-core@5.5.2) (2019-04-24)

**Note:** Version bump only for package @applitools/eyes-sdk-core





## [5.5.1](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.5.0...@applitools/eyes-sdk-core@5.5.1) (2019-04-23)

**Note:** Version bump only for package @applitools/eyes-sdk-core






# [5.5.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.4.2...@applitools/eyes-sdk-core@5.5.0) (2019-04-12)


### Bug Fixes

* **eyes-sdk-core:** make retry requests when timeout error of requests ([aa14cb8](https://github.com/applitools/eyes.sdk.javascript1/commit/aa14cb8))
* **eyes-sdk-core:** not existing `proxy` getter was used ([db941a5](https://github.com/applitools/eyes.sdk.javascript1/commit/db941a5))
* **eyes-sdk-core:** use smaller timeout for /render-status requests ([091522d](https://github.com/applitools/eyes.sdk.javascript1/commit/091522d))


### Features

* move defaultMatchSettings from EyesAbstract to Configuration ([43d305c](https://github.com/applitools/eyes.sdk.javascript1/commit/43d305c))





## [5.4.2](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.4.0...@applitools/eyes-sdk-core@5.4.2) (2019-04-08)


### Bug Fixes

* **eyes-sdk-core:** increased upload byte size in PUT resource to 15.5MB (VG is 16MB). ([d7e0f13](https://github.com/applitools/eyes.sdk.javascript1/commit/d7e0f13))





# [5.4.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.3.0...@applitools/eyes-sdk-core@5.4.0) (2019-04-03)


### Features

* **eyes-sdk-core:** use environment params from Configuration ([20097d2](https://github.com/applitools/eyes.sdk.javascript1/commit/20097d2))





# [5.3.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.2.0...@applitools/eyes-sdk-core@5.3.0) (2019-04-02)


### Bug Fixes

* **eyes-sdk-core:** allow to set `Batch` by object ([72ac062](https://github.com/applitools/eyes.sdk.javascript1/commit/72ac062))


### Features

* **eyes-sdk-core:** use methods instead of getters/setters ([f8d5b3b](https://github.com/applitools/eyes.sdk.javascript1/commit/f8d5b3b))





# [5.2.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.1.1...@applitools/eyes-sdk-core@5.2.0) (2019-03-29)


### Bug Fixes

* **eyes-sdk-core:** fix work of `checkSingleWindowBase` ([bd96d73](https://github.com/applitools/eyes.sdk.javascript1/commit/bd96d73))


### Features

* **eyes-sdk-core:** added browser and viewport to TAP string in formatter ([3f4495b](https://github.com/applitools/eyes.sdk.javascript1/commit/3f4495b))





## [5.1.1](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.1.0...@applitools/eyes-sdk-core@5.1.1) (2019-03-24)

**Note:** Version bump only for package @applitools/eyes-sdk-core





# [5.1.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.0.1...@applitools/eyes-sdk-core@5.1.0) (2019-03-17)


### Features

* **eyes-sdk-core:** add ability to pass object into `setConfiguration` ([c402a0f](https://github.com/applitools/eyes.sdk.javascript1/commit/c402a0f))





## [5.0.1](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.0.0...@applitools/eyes-sdk-core@5.0.1) (2019-03-14)

**Note:** Version bump only for package @applitools/eyes-sdk-core





# [5.0.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.9.0...@applitools/eyes-sdk-core@5.0.0) (2019-03-13)


### Bug Fixes

* **eyes-sdk-core:** add new method `deleteSession` to TestResults, it should be used instead of `delete`. ([34744cb](https://github.com/applitools/eyes.sdk.javascript1/commit/34744cb))
* **eyes-sdk-core:** allow set batch to `undefined` ([3abaf46](https://github.com/applitools/eyes.sdk.javascript1/commit/3abaf46))
* **eyes-sdk-core:** fix order of arguments when creating `BatchInfo` ([713a0f0](https://github.com/applitools/eyes.sdk.javascript1/commit/713a0f0))
* **eyes-sdk-core:** fix use of wrong setting of AgentId ([e917170](https://github.com/applitools/eyes.sdk.javascript1/commit/e917170))
* **eyes-selenium:** move `sendDom` from ImageMatchSettings to Configuration ([5c2c527](https://github.com/applitools/eyes.sdk.javascript1/commit/5c2c527))


### Code Refactoring

* **eyes-sdk-core:** remove `delete()` from `TestResults` ([4e24585](https://github.com/applitools/eyes.sdk.javascript1/commit/4e24585))


### Features

* **eyes-sdk-core:** add `getScrolledElement` to PositionProvider ([2afebbb](https://github.com/applitools/eyes.sdk.javascript1/commit/2afebbb))
* **eyes-sdk-core:** add `setConfiguration` method to Eyes ([64813e4](https://github.com/applitools/eyes.sdk.javascript1/commit/64813e4))
* **eyes-sdk-core:** add `setIsVisualGrid` method ([94662fb](https://github.com/applitools/eyes.sdk.javascript1/commit/94662fb))
* **eyes-sdk-core:** added setters in eyes-abstract for useDom & enablePatterns ([15439d8](https://github.com/applitools/eyes.sdk.javascript1/commit/15439d8))
* **eyes-sdk-core:** remove deprecated methods ([7decce1](https://github.com/applitools/eyes.sdk.javascript1/commit/7decce1))
* **eyes-selenium:** add `data-applitools-original-overflow` only if we hide element ([5247feb](https://github.com/applitools/eyes.sdk.javascript1/commit/5247feb))
* **eyes-selenium:** add `data-applitools-original-overflow` tag to elements where we change overflow ([26016a9](https://github.com/applitools/eyes.sdk.javascript1/commit/26016a9))
* **eyes-selenium:** update `setOverflow` of EyesJsBrowserUtils ([032d475](https://github.com/applitools/eyes.sdk.javascript1/commit/032d475))
* remove setProxy, setBatch from Configuration, use objects instead ([c91d4ae](https://github.com/applitools/eyes.sdk.javascript1/commit/c91d4ae))
* use JS getters/setters for Configuration classes ([c68771e](https://github.com/applitools/eyes.sdk.javascript1/commit/c68771e))


### BREAKING CHANGES

* **eyes-sdk-core:** `delete` is no more available from `TestResults`, use `deleteSession` instead.





# [4.9.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.8.0...@applitools/eyes-sdk-core@4.9.0) (2019-02-27)


### Features

* **eyes-sdk-core:** 🎸 added useDom and enablePatterns to match request ([5e16823](https://github.com/applitools/eyes.sdk.javascript1/commit/5e16823))
* **eyes-sdk-core:** add `configuration` to constructor of EyesBase ([7b69423](https://github.com/applitools/eyes.sdk.javascript1/commit/7b69423))
* **eyes-sdk-core, visual-grid-client:** 🎸 supporting useDom and enablePatterns for match request ([03ae908](https://github.com/applitools/eyes.sdk.javascript1/commit/03ae908))





# [4.8.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.7.2...@applitools/eyes-sdk-core@4.8.0) (2019-02-19)


### Features

* **eyes-sdk-core:** add `EyesAbstract` class, move getters/setters to it and use Configuration for store properties ([e1a2b39](https://github.com/applitools/eyes.sdk.javascript1/commit/e1a2b39))





## [4.7.2](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.7.1...@applitools/eyes-sdk-core@4.7.2) (2019-02-11)

**Note:** Version bump only for package @applitools/eyes-sdk-core






## [4.7.1](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.7.0...@applitools/eyes-sdk-core@4.7.1) (2019-02-07)

**Note:** Version bump only for package @applitools/eyes-sdk-core





# [4.7.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.6.4...@applitools/eyes-sdk-core@4.7.0) (2019-01-29)


### Features

* **eyes-sdk-core:** add blankCorsIframeSrcOfCdt method to CorsIframeHandler ([2801841](https://github.com/applitools/eyes.sdk.javascript1/commit/2801841))
* **eyes-sdk-core:** add export of CorsIframeHandle, CorsIframeHandler ([4bd139e](https://github.com/applitools/eyes.sdk.javascript1/commit/4bd139e))





## [4.6.4](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.6.3...@applitools/eyes-sdk-core@4.6.4) (2019-01-28)

**Note:** Version bump only for package @applitools/eyes-sdk-core





## [4.6.3](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.6.2...@applitools/eyes-sdk-core@4.6.3) (2019-01-22)

**Note:** Version bump only for package @applitools/eyes-sdk-core





## [4.6.2](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.6.1...@applitools/eyes-sdk-core@4.6.2) (2019-01-21)


### Bug Fixes

* **eyes-sdk-core:** restore accidentally removed method in TestResultsFormatter ([0bd8abf](https://github.com/applitools/eyes.sdk.javascript1/commit/0bd8abf))





## [4.6.1](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.6.0...@applitools/eyes-sdk-core@4.6.1) (2019-01-16)


### Bug Fixes

* **eyes-sdk-core:** restore methods that were removed in previous update ([fff611d](https://github.com/applitools/eyes.sdk.javascript1/commit/fff611d))





# [4.6.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.5.4...@applitools/eyes-sdk-core@4.6.0) (2019-01-16)


### Bug Fixes

* **eyes-images:** fix issue when any string means url in Target ctor ([c9a02d6](https://github.com/applitools/eyes.sdk.javascript1/commit/c9a02d6))
* **eyes-sdk-core:** use correct URL props for user/pass in ProxySettings ([a40a1c6](https://github.com/applitools/eyes.sdk.javascript1/commit/a40a1c6))
* **eyes-selenium:** rename ImageMatchSetting's `useDom` property to `sendDom`, set it from EyesBase's setSendDom() and use it in MatchSettingsTask ([abd9e2e](https://github.com/applitools/eyes.sdk.javascript1/commit/abd9e2e))


### Features

* add `withName(String)` method to CheckSettings ([1774167](https://github.com/applitools/eyes.sdk.javascript1/commit/1774167))
* finalize eyes-rendering pkg, continue introduction of eyes-common ([c3367b7](https://github.com/applitools/eyes.sdk.javascript1/commit/c3367b7))
* **eyes-common:** move methods which uses `fs` into separate FileUtils class ([cdc499d](https://github.com/applitools/eyes.sdk.javascript1/commit/cdc499d))
* **eyes-sdk-core:** Add `downloadResource` method to ServerConnector ([0ae5f39](https://github.com/applitools/eyes.sdk.javascript1/commit/0ae5f39))
* **eyes-sdk-core:** allow to create Logger with ConsoleLogHandler from ctor ([3144b9a](https://github.com/applitools/eyes.sdk.javascript1/commit/3144b9a))


### BREAKING CHANGES

* **eyes-common:** `save` method was removed from MutableImage, `readImage`, `writeImage` methods were removed from ImageUtils.





## [4.5.4](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.5.3...@applitools/eyes-sdk-core@4.5.4) (2018-12-12)


### Bug Fixes

* **eyes-sdk-core:** update deepmerge dependency, fix issue with esmodule ([5cd5419](https://github.com/applitools/eyes.sdk.javascript1/commit/5cd5419))





## [4.5.3](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.5.2...@applitools/eyes-sdk-core@4.5.3) (2018-12-11)


### Bug Fixes

* **eyes-sdk-core:** fix error when response of renderStatusById is null ([8f1e3f5](https://github.com/applitools/eyes.sdk.javascript1/commit/8f1e3f5))





## [4.5.2](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.5.1...@applitools/eyes-sdk-core@4.5.2) (2018-12-07)


### Bug Fixes

* **eyes-sdk-core:** Remove check for fs in ImageUtils before parse/pack ([febea66](https://github.com/applitools/eyes.sdk.javascript1/commit/febea66))





## [4.5.1](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.5.0...@applitools/eyes-sdk-core@4.5.1) (2018-12-06)


### Features

* **eyes-sdk-core:** Add EyesSimpleScreenshotFactory class ([d2eb741](https://github.com/applitools/eyes.sdk.javascript1/commit/d2eb741))





# [4.5.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.4.0...@applitools/eyes-sdk-core@4.5.0) (2018-12-04)

**Note:** Version bump only for package @applitools/eyes-sdk-core





# [4.4.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.3.0...@applitools/eyes-sdk-core@4.4.0) (2018-11-29)


### Bug Fixes

* **eyes-sdk-core:** fix not working `setHostOSInfo` method ([24a301e](https://github.com/applitools/eyes.sdk.javascript1/commit/24a301e))
* **eyes-sdk-core:** update docs for return type of `abortIfNotClosed` ([7cd1f44](https://github.com/applitools/eyes.sdk.javascript1/commit/7cd1f44))


### Features

* **eyes-sdk-core:** add `isNotNull(value)` method to `TypeUtils` ([0d402bd](https://github.com/applitools/eyes.sdk.javascript1/commit/0d402bd))





# [4.3.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.2.0...@applitools/eyes-sdk-core@4.3.0) (2018-11-26)


### Features

* **eyes-sdk-core:** add `isNull` method to `TypeUtils` ([3be1d46](https://github.com/applitools/eyes.sdk.javascript1/commit/3be1d46))
* **eyes-sdk-core:** add an ability to completely disable proxy settings ([03a0a7d](https://github.com/applitools/eyes.sdk.javascript1/commit/03a0a7d))





# [4.2.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.1.0...@applitools/eyes-sdk-core@4.2.0) (2018-11-20)


### Features

* **eyes-sdk-core:** add `deviceInfo`, `osInfo`, `hostingAppInfo` properties to `AppEnvironment` ([e7437bc0](https://github.com/applitools/eyes.sdk.javascript1/commit/e7437bc))
* **eyes-sdk-core:** add `hostOSInfo`, `hostAppInfo`, `deviceInfo` properties to `EyesBase` ([e7437bc0](https://github.com/applitools/eyes.sdk.javascript1/commit/e7437bc))
* **eyes-sdk-core:** send `sendDom` property in `RenderRequest` also when it eq `false` ([ef929ab](https://github.com/applitools/eyes.sdk.javascript1/commit/ef929ab))





## [4.1.0](https://github.com/applitools/eyes.sdk.javascript1/compare/v4.0.3...v4.1.0) (2018-11-08)

**Note:** Version bump only for package @applitools/eyes-sdk-core





## [4.0.3](https://github.com/applitools/eyes.sdk.javascript1/compare/v4.0.2...v4.0.3) (2018-11-07)


### Features

* Add new methods to `TypeUtils`: `isInteger`, `has`. Update other methods, add tests for all methods  ([f12ce4f](https://github.com/lerna/lerna/commit/f12ce4f))





## [4.0.2](https://github.com/applitools/eyes.sdk.javascript1/compare/v4.0.1...v4.0.2) (2018-11-06)


### Features

* Remove @deprecated tag from setMatchLevel/getMatchLevel ([22f8c09](https://github.com/lerna/lerna/commit/22f8c09))




## [4.0.1](https://github.com/applitools/eyes.sdk.javascript1/compare/eyes.selenium-v1.9.0-alpha...v4.0.1) (2018-11-03)


### BREAKING CHANGES

* Changes in `GeneralUtils` ([cc01222](https://github.com/lerna/lerna/commit/cc01222))
  - Removed methods: `assignTo`, `mixin`, `clone`, `getStackTrace` 
  - Methods moved to new class `TypeUtils`: `isString`, `isNumber`, `isBoolean`, `isObject`, `isPlainObject`, `isArray`, `isBuffer`, `isBase64`
  - Changed `cartesianProduct` method, now it returns array instead of generator

* Changes in `CheckSettings` ([ed1f342](https://github.com/lerna/lerna/commit/ed1f342))
  - Removed methods: `ignore`, `ignores` (use `ignoreRegions` instead)
  - Renamed methods: `floating` to `floatingRegion`, `floatings` to `floatingRegions`


### Features

* Fix error when viewportSize in setViewportSize given as an object ([db6472a](https://github.com/lerna/lerna/commit/db6472a))
