# Changelog

## Unreleased


## 3.3.2

- avoid unnecessary requests to get batchInfo (due to wrong `isGeneratedId` value on batchInfo)

## 3.3.1

- update @applitools/dom-snapshot@3.4.0 to get correct css in DOM snapshots ([Trello](https://trello.com/c/3BFtM4hx/188-hidden-spinners-in-text-field-are-visible-in-firefox), [Trello](https://trello.com/c/S4XT7ONp/192-vg-dom-snapshot-deletes-duplicate-keys-from-css-rules), [Trello](https://trello.com/c/mz8CKKB7/173-selector-not-seen-as-it-should-be-issue-with-css-variable), [Trello](https://trello.com/c/KZ25vktg/245-edge-screenshot-different-from-chrome-and-ff))

## 3.3.0

- Add `viewportSize` parameter to control the puppeteer browser size ([Trello](https://trello.com/c/lGEGpIZI/237-bad-rendering-of-element-storybook))

## 3.2.14

- Support both new and old server versions for identifying new running sessions. ([Trello](https://trello.com/c/mtSiheZ9/267-support-startsession-as-long-running-task))

## 3.2.13

- dom snapshot log for fetched resources now shows the byte length that was fetched [Trello](https://trello.com/c/CjSvn1OQ/262-storybook-409-conflict-wrong-sha)

## 3.2.12

- dom snapshot error while fetching is now always in clear text [Trello](https://trello.com/c/Jx1VJgpA/258-gap-storybook-assets-not-loading)

## 3.2.11

- fix trying to fetch branch info from server on non github integration runs
- support future long running tasks [Trello](https://trello.com/c/60Rm4xXG/240-support-future-long-running-tasks)
