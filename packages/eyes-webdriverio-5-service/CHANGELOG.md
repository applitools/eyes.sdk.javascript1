# Changelog

## Unreleased


## 1.11.2 - 2021/1/29

- chore: add husky
- updated to @applitools/eyes-webdriverio@5.29.4 (from 5.29.1)

## 1.11.1 - 2021/1/12

- updated to @applitools/eyes-webdriverio@5.29.1 (from 5.29.0)

## 1.11.0 - 2020/12/18

- updated to @applitools/eyes-webdriverio@5.29.0 (from 5.28.2)

## 1.10.1 - 2020/12/14

- updated to @applitools/eyes-webdriverio@5.28.2 (from 5.28.1)

## 1.10.0 - 2020/12/11

- expose grid configuration primitives

## 1.9.1 - 2020/12/11

- updated to @applitools/eyes-webdriverio@5.28.1 (from 5.28.0)

## 1.9.0 - 2020/12/11

- updated to @applitools/eyes-webdriverio@5.28.0 (from 5.27.2)

## 1.8.2 - 2020/12/1

- updated to @applitools/eyes-webdriverio@5.27.2 (from 5.27.1)

## 1.8.1 - 2020/11/29

- updated to @applitools/eyes-webdriverio@5.27.1 (from 5.27.0)

## 1.8.0 - 2020/11/26

- updated to @applitools/eyes-webdriverio@5.27.0 (from 5.26.0)

## 1.7.0 - 2020/11/10

- updated to @applitools/eyes-webdriverio@5.25.1 (from 5.24.0)
- updated to @applitools/eyes-webdriverio@5.26.0 (from 5.25.1)

## 1.6.11 - 2020/10/7

- updated to @applitools/eyes-webdriverio@5.24.0 (from 5.23.1)

## 1.6.10 - 2020/10/1

- remove yarn workspaces
- updated to @applitools/eyes-webdriverio@5.22.2 (from 5.21.0)
- updated to @applitools/eyes-webdriverio@5.23.1 (from 5.22.2)

## 1.6.9 - 2020/8/11

- updated to @applitools/eyes-webdriverio@5.21.0 (from 5.19.2)

## 1.6.8 - 2020/7/26

- updated to @applitools/eyes-webdriverio@5.19.2 (from 5.19.1)

## 1.6.7 - 2020/7/24

- updated to @applitools/eyes-webdriverio@5.18.0 (from 5.17.0)
- updated to @applitools/eyes-webdriverio@5.19.1 (from 5.18.0)

## 1.6.6 - 2020/7/5

- updated to @applitools/eyes-webdriverio@5.17.0 (from 5.16.0)

## 1.6.5 - 2020/7/1

- updated to @applitools/eyes-webdriverio@5.16.0 (from 5.15.1)

## 1.6.4 - 2020/6/29

- updated to @applitools/eyes-webdriverio@5.15.1 (from 5.14.0)

## 1.6.3 - 2020/6/16

- updated to @applitools/eyes-webdriverio@5.14.0 (from 5.13.2)

## 1.6.2 - 2020/6/14

- updated to @applitools/eyes-webdriverio@5.13.2 (from 5.13.1)

## 1.6.1 - 2020/6/11

- updated to @applitools/eyes-webdriverio@5.13.1 (from 5.13.0)

## 1.6.0 - 2020/6/9

- updated to @applitools/eyes-webdriverio@5.13.0 (from 5.12.0)

## 1.5.0 - 2020/6/2

- Unified core
- updated to @applitools/eyes-webdriverio@5.12.0 (from v5.11.0)

## 1.4.0 - 2020/5/19

- updated to @applitools/eyes-webdriverio@5.11.0

## 1.3.10 - 2020/4/27

- updated to @applitools/eyes-webdriverio@5.10.1

## 1.3.9 - 2020/4/16

- updated to @applitools/eyes-webdriverio@5.9.23

## 1.3.8 - 29/3/2020

- update SDK version to 5.9.22

## 1.3.7

- missed commit (no changes)

## 1.3.6

- upload domsnapshot directly to Azure [Trello](https://trello.com/c/ZCLJo8Fy/241-upload-dom-directly-to-azure)
- update @applitools/dom-snapshot@3.4.0 to get correct css in DOM snapshots ([Trello](https://trello.com/c/3BFtM4hx/188-hidden-spinners-in-text-field-are-visible-in-firefox), [Trello](https://trello.com/c/S4XT7ONp/192-vg-dom-snapshot-deletes-duplicate-keys-from-css-rules), [Trello](https://trello.com/c/mz8CKKB7/173-selector-not-seen-as-it-should-be-issue-with-css-variable), [Trello](https://trello.com/c/KZ25vktg/245-edge-screenshot-different-from-chrome-and-ff))

## 1.3.5 - 2020-02-10

- update SDK version to 5.9.12

## 1.3.4 - 2020-02-09
- added missing require for ConsoleLogHandler
- exported By and Target from eyes-webdriverio so they can be required directly from this package instead
- updated the version of eyes-webdriverio to latest

## [1.2.3] - 2019-11-09 
### Fixed
- Setting viewportSize through configuration. [Ticket 1168](https://trello.com/c/yPqI3erm)
- Set appName from describe tag. [Ticket 1174](https://trello.com/c/gIlKtwZU)
- Fix css stitching for new chrome 78 (bug in chrome). [Trello 1206](https://trello.com/c/euVqe1Sv)

## [1.2.2] - 2019-10-24
### Fixed
- Updated dependencies for underlying ignore regions fix. [Ticket](https://trello.com/c/E97HesbG)

## [1.2.1] - 2019-09-26
### Added
- This changelog file.
### Fixed
- Setting scroll root element only after `open` is called. [Ticket](https://trello.com/c/0NRouZgA)
- Test name taken from each test, not just the first one.  [Ticket](https://trello.com/c/eOhBTH5r), [Ticket](https://trello.com/c/0NRouZgA)

## [1.2.0] - 2019-09-14
### Added
- Added access to the configuration using the `eyesGetConfiguration()`/`eyesSetConfiguration()` commands.
- Added access to the test results per test and per suite (`eyesGetTestResults` and `eyesGetAllTestsResults` commands).

## [1.1.0] - 2019-08-06
### Added
- Added `eyesSetScrollRootElement` command.

## [1.0.1] - 2019-05-19
### Added
- First release.
 
 
