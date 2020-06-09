# Change Log

## Unreleased

- cache actual viewport size in case of error during setting viewport size

 ## 5.13.0 - 2020/6/9

- added mobile web API support for VG 
- updated to @applitools/eyes-sdk-core@11.0.5 (from 11.0.2)
- updated to @applitools/visual-grid-client@14.4.4 (from 14.4.1)

## 5.12.0 - 2020/6/2

- Unified core
- updated to @applitools/eyes-sdk-core@11.0.2 (from v10.3.1)
- updated to @applitools/visual-grid-client@14.4.1 (from v14.2.1)

## 5.11.2 - 2020/5/26

- updated to @applitools/eyes-sdk-core@10.3.1 (from v10.3.0)
- updated to @applitools/visual-grid-client@14.2.1 (from v14.2.0)

## 5.11.1 - 2020/5/25

- updated to @applitools/eyes-sdk-core@10.3.0
- updated to @applitools/visual-grid-client@14.2.0

## 5.11.0 - 2020/5/19

- Support accessibility validation
- removed "source" attribute from VG checkWindow
- fetching resources with "referer" header.
- added retry for requests failing with a 503 response status
- added more devices for device emulation
- updated to @applitools/dom-utils@4.7.17
- updated to @applitools/eyes-sdk-core@10.2.0
- updated to @applitools/visual-grid-client@14.1.0

## 5.10.1 - 2020/4/27

- support edgelegacy, edgechromium, and edgechromium-one-version-back
- added emulation devices
- fix returned value from `close` method ([Trello](https://trello.com/c/m6K2Ftd5/277-wdio5-difficulty-getting-test-results-object))
- updated to @applitools/dom-utils@4.7.14
- updated to @applitools/eyes-sdk-core@9.2.1
- updated to @applitools/visual-grid-client@13.7.2

## 5.9.23 - 2020/4/1

- removed eyes-common dependency
- update @applitools/visual-grid-client@13.6.11
- handle switchToFrame on MS Edge <= 18 ([Trello](https://trello.com/c/SLUduLu8/68-can-take-baseline-screenshot-but-checkpoint-screenshots-not-showing-up.))

## 5.9.22

- fixed bug when target region wasn't cleared after check ([Trello](https://trello.com/c/gMwZw0C0/268-wdio5-cannot-read-property-offset-of-null-when-taking-window-screenshot-after-region))
- fix exception when restoring scrollbars

## 5.9.21

- Fix bug when calculating if a captured image fits within the viewport on Chrome on Android [Trello 275](https://trello.com/c/PrGEKzhJ)

## 5.9.20

- Updated internal packages

## 5.9.19

- Fix Target regions for Visual Grid
- Fix WebElement regions for Visual Grid

## 5.9.18

- update @applitools/visual-grid-client@13.6.7 to support xpath selectors for regions ([Trello](https://trello.com/c/QGpZcMKS/249-strict-region-shows-up-on-classic-runner-test-but-not-on-ug-runner-test))

## 5.9.17

- update @applitools/dom-snapshot@3.4.0 to get correct css in DOM snapshots ([Trello](https://trello.com/c/3BFtM4hx/188-hidden-spinners-in-text-field-are-visible-in-firefox), [Trello](https://trello.com/c/S4XT7ONp/192-vg-dom-snapshot-deletes-duplicate-keys-from-css-rules), [Trello](https://trello.com/c/mz8CKKB7/173-selector-not-seen-as-it-should-be-issue-with-css-variable), [Trello](https://trello.com/c/KZ25vktg/245-edge-screenshot-different-from-chrome-and-ff))

## 5.9.16

- Support both new and old server versions for identifying new running sessions. ([Trello](https://trello.com/c/mtSiheZ9/267-support-startsession-as-long-running-task))
- Fix exception in older Node.js versions ([Trello](https://trello.com/c/QGpZcMKS/249-strict-region-shows-up-on-classic-runner-test-but-not-on-ug-runner-test))

## 5.9.15

- fix trying to fetch branch info from server on non github integration runs

## 5.20.0

- same as 5.9.14

## 5.10.0

- same as 5.9.14

## 5.9.14

- regions fixes for VG
- upload domsnapshot directly to Azure [Trello](https://trello.com/c/ZCLJo8Fy/241-upload-dom-directly-to-azure)
- support future long running tasks [Trello](https://trello.com/c/60Rm4xXG/240-support-future-long-running-tasks)
- fix regression in css stitching [Trello](https://trello.com/c/dp5IIoFw/235-css-stitching-regression-in-41533)

## 5.9.13
- branching base commit support
- make functions in runners 

## 5.9.12
- Send stitching service URL to visual grid [Trello 212](https://trello.com/c/Sqh6k2VV)

## 5.9.9 - 2020-02-09
- removed unnecessary dev dependencies

## [5.9.6]
- fixed image cropping on mobile Safari so it doesn't capture the browser nav [Trello 178](https://trello.com/c/yiPcT5Ks)

## [5.9.1] - 2019-12-16
### Fixed
- Checkpoint screenshots not captured when frame errors exist. [Trello 1197](https://trello.com/c/SLUduLu8)

## [5.9.0] - 2019-12-12
### Fixed
- Crop safari url bar and status bar on mobile devices (IOS). [Trello 939](https://trello.com/c/SM80YzdM)
- Fix appium support. [Trello 1199](https://trello.com/c/Ls2aOycy)
- Don't scroll to the top of the page when eyes.check() is running. [Trello 1337](https://trello.com/c/6puZ79sd)

## [5.8.4] - 2019-11-28 
### Fixed
- Updated VGC to 13.3.6: supporting http only proxy. [Trello 976](https://trello.com/c/cOquuvWo/976-axios-adding-support-to-proxy-of-http-over-https)

## [5.8.3] - 2019-11-09 
### Fixed
- Fix css stitching for new chrome 78 (bug in chrome). [Trello 1206](https://trello.com/c/euVqe1Sv)

## [5.8.2] - 2019-11-01
### Fixed
- Default viewportSize `null` value was overriding configuration. [Trello 1168](https://trello.com/c/yPqI3erm)

## [5.8.1] - 2019-10-21
### Added
- This changelog file.
### Fixed
- Imports from SDK-core.
- Automatic dependency update for patch versions only. 


