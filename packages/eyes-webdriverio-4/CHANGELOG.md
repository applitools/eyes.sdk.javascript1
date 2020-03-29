# Change Log

## Unreleased


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
