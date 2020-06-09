# Change Log

## Unreleased


## 2.17.0 - 2020/6/9

- added mobile web API support for VG
- updated to @applitools/eyes-sdk-core@11.0.5 (from 11.0.4)
- updated to @applitools/visual-grid-client@14.4.4 (from 14.4.3)

## 2.16.0 - 2020/6/2

- Unified core
- updated to @applitools/eyes-sdk-core@11.0.2 (from v10.3.1)
- updated to @applitools/visual-grid-client@14.4.1 (from v14.2.1)

## 2.15.0 - 2020/5/19

- Support accessibility validation
- removed "source" attribute from VG checkWindow
- updated to @applitools/eyes-sdk-core@10.1.2
- updated to @applitools/visual-grid-client@14.0.1
- updated to @applitools/dom-utils@4.7.17
- updated to @applitools/eyes-sdk-core@10.2.0
- updated to @applitools/visual-grid-client@14.1.0

## 2.14.1 - 2020/5/12

- added devices to device emulation
- return support for legacy `element` and `locator` fields in WDIOWrappedElement
- updated to @applitools/dom-utils@4.7.16
- updated to @applitools/eyes-sdk-core@10.1.1
- updated to @applitools/visual-grid-client@13.8.0
- handle mobile devices during working with frames

## 2.14.0 - 2020/4/30

- support webdriver API in the driver returning from `eyes.open`
- support both EyesWrappedElement and webdriver.io objects (elements or responses) in all API's ([Trello](https://trello.com/c/JJ5vm3wS/269-frames-shadow-dom-break-region-checking))
- preserve frame state after check operation ([Trello](https://trello.com/c/R1H28Z9z/218-wdio-45-constant-need-to-switch-to-new-iframe))
- many bug fixes
- updated to @applitools/visual-grid-client@13.7.3
- updated to @applitools/eyes-sdk-core@10.0.0
- updated to @applitools/visual-grid-client@13.7.5

## 2.13.1 - 2020/4/27

- updated to @applitools/dom-utils@4.7.14
- updated to @applitools/eyes-sdk-core@9.2.1
- updated to @applitools/visual-grid-client@13.7.2

## 2.13.0 - 2020/4/26

- support edgelegacy, edgechromium, and edgechromium-one-version-back
- added emulation devices
- updated to @applitools/eyes-sdk-core@9.2.0
- updated to @applitools/visual-grid-client@13.7.0
- updated to @applitools/dom-utils@4.7.13

## 2.12.9 - 2020/4/22

- fix capture region failures on IE
- fix returned value from `close` method ([Trello](https://trello.com/c/m6K2Ftd5/277-wdio5-difficulty-getting-test-results-object))
- updated to @applitools/eyes-sdk-core@9.1.1
- updated to @applitools/visual-grid-client@13.6.14
- updated to @applitools/dom-utils@4.7.11

## 2.12.8 - 2020/4/1

- fixed regions support for VG

## 2.12.7 - 2020/3/31

- removed eyes-common dependency

## 2.12.6

- update @applitools/dom-utils@4.7.10, @applitools/eyes-common@3.20.2, @applitools/eyes-sdk-core@9.0.3, @applitools/visual-grid-client@13.6.11

## 2.12.5

- handle stale elements during check operation ([Trello](https://trello.com/c/JJ5vm3wS/269-frames-shadow-dom-break-region-checking))

## 2.12.4

- Support both new and old server versions for identifying new running sessions. ([Trello](https://trello.com/c/mtSiheZ9/267-support-startsession-as-long-running-task))
- update @applitools/dom-snapshot@3.4.0 to get correct css in DOM snapshots ([Trello](https://trello.com/c/3BFtM4hx/188-hidden-spinners-in-text-field-are-visible-in-firefox), [Trello](https://trello.com/c/S4XT7ONp/192-vg-dom-snapshot-deletes-duplicate-keys-from-css-rules), [Trello](https://trello.com/c/mz8CKKB7/173-selector-not-seen-as-it-should-be-issue-with-css-variable), [Trello](https://trello.com/c/KZ25vktg/245-edge-screenshot-different-from-chrome-and-ff))

## 2.12.3

- fix trying to fetch branch info from server on non github integration runs
- upload domsnapshot directly to Azure [Trello](https://trello.com/c/ZCLJo8Fy/241-upload-dom-directly-to-azure)
- fix regression in css stitching [Trello](https://trello.com/c/dp5IIoFw/235-css-stitching-regression-in-41533)
- support future long running tasks [Trello](https://trello.com/c/60Rm4xXG/240-support-future-long-running-tasks)

## 2.12.2
- branching base commit support
- make functions in runners 

## 2.12.1
- Fixed regression which broke xpath selectors when looking up the location of an element

## 2.12.0
- Added nested frame support (without CORS) for checkRegion by locator [Trello 213](https://trello.com/c/Xyyhdb5t)

## 2.11.9
- Send stitching service URL to visual grid [Trello 212](https://trello.com/c/Sqh6k2VV)

## 2.11.8
- Fixed error when performing a URL lookup on native mobile. [Trello 208](https://trello.com/c/ZPkZsyaI)

## 2.11.7
- Fixed error when getting images on Safari. Related to [Trello 99](https://trello.com/c/C0oZf2oc)

## [un versioned] - 
### Fixed
- Crop safari url bar and status bar on mobile devices (IOS). [Trello 939](https://trello.com/c/SM80YzdM)

## [2.11.2] - 2019-11-08
### Fixed
- fix css stitching for new chrome 78 (bug in chrome). [Trello 1206](https://trello.com/c/euVqe1Sv)
- Default viewportSize `null` value was overriding configuration. [Trello 1168](https://trello.com/c/yPqI3erm)

## [2.11.1] - 2019-11-05
### Added
- This CHANGELOG.
### Fixed
- Correct imports for coded regions. [Trello 1217](https://trello.com/c/GwNqDTYg) 
