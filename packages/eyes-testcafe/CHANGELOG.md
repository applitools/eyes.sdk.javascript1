# Change Log

## Unreleased

- fix bug that prevented window resizing from working reliably ([Trello](https://trello.com/c/xNCZNfPi))

## 1.12.5 - 2021/2/2

- fix default checkWindow behavior- take full page when no target is specified
- set minimum supported Node version to be consistent with other SDKs (8.9)
- updated to @applitools/eyes-sdk-core@12.14.7 (from 12.14.2)
- updated to @applitools/visual-grid-client@15.5.20 (from 15.5.13)

## 1.12.4 - 2021/1/27

- chore: add husky
- update peer dependency version of testcafe to include earlier versions (e.g., 1.7.x)
- fix issue where the browser is in an invalid state but eyes.open tries to proceed ([Trello](https://trello.com/c/xNCZNfPi))
- updated to @applitools/eyes-sdk-core@12.14.2 (from 12.13.0)
- updated to @applitools/visual-grid-client@15.5.13 (from 15.5.6)

## 1.12.3 - 2021/1/13

- fix for fetching font-face resources from stylesheets [Trello](https://trello.com/c/DwmxtRoR)
- updated to @applitools/eyes-sdk-core@12.13.0 (from 12.12.2)
- updated to @applitools/visual-grid-client@15.5.6 (from 15.5.5)

## 1.12.2 - 2021/1/11

- fixed default checkWindow behavior (when no options are provided) to respect backwards compatibility -- so it captures a full page screenshot instead of just the viewport
- fixed bug in specifying a tag name in checkWindow
- updated to @applitools/eyes-sdk-core@12.12.2 (from 12.12.1)
- updated to @applitools/visual-grid-client@15.5.5 (from 15.5.4)

## 1.12.1 - 2021/1/9

- fix performance issue with checkWindow command when used on pages of a non-trivial size
- updated to @applitools/eyes-sdk-core@12.12.1 (from 12.12.0)
- updated to @applitools/visual-grid-client@15.5.4 (from 15.5.3)

## 1.12.0 - 2021/1/9

- Updated SDK to use new core with backwards compatibility for existing API [Trello](https://trello.com/c/MZimmaSV)
- Added support for new Eyes concurrency model [Trello](https://trello.com/c/a7xq2hlL)
- Added JS layout support [Trello](https://trello.com/c/9dzS8FhB)
- Added CORS iframe support [Trello](https://trello.com/c/wPl3ef7y)
- Fix bugs in fetching resources due to TestCafe reverse proxy URLs [Trello](https://trello.com/c/nlMUhJTp)
- updated to @applitools/visual-grid-client@15.5.3 (from 15.5.0)

## earlier versions

- omitted
