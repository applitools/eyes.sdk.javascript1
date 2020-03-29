# Changelog

## Unreleased


## 3.9.20

- avoid unnecessary requests to get batchInfo (due to wrong `isGeneratedId` value on batchInfo)

## 3.9.19

- update @applitools/dom-snapshot@3.4.1 to fix missing css-tree dependency issue

## 3.9.18

- update @applitools/dom-snapshot@3.4.0 to get correct css in DOM snapshots ([Trello](https://trello.com/c/3BFtM4hx/188-hidden-spinners-in-text-field-are-visible-in-firefox), [Trello](https://trello.com/c/S4XT7ONp/192-vg-dom-snapshot-deletes-duplicate-keys-from-css-rules), [Trello](https://trello.com/c/mz8CKKB7/173-selector-not-seen-as-it-should-be-issue-with-css-variable), [Trello](https://trello.com/c/KZ25vktg/245-edge-screenshot-different-from-chrome-and-ff))

## 3.9.17

- Typescript type defs: mark `cy.eyesCheckWindow` arguments as optional

## 3.9.16

- Support both new and old server versions for identifying new running sessions. ([Trello](https://trello.com/c/mtSiheZ9/267-support-startsession-as-long-running-task))

## 3.9.15

- add missing browsers to TypeScript definitions [Trello](https://trello.com/c/2QEofssH/264-cypress-js-vs-ts-not-the-same-goodrx-poc)

## 3.9.14

- fix trying to fetch branch info from server on non github integration runs
- support future long running tasks [Trello](https://trello.com/c/60Rm4xXG/240-support-future-long-running-tasks)
