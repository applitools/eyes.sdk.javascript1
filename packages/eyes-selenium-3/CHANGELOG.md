# Changelog

## Unreleased

- added SDK agent id header for eyes server requests

## 3.8.11 - 2020/3/29

- RunningSession is no longer determined to be new according to startSession's response status, but rather by the response's payload of `isNew`. ([Trello](https://trello.com/c/60Rm4xXG/240-support-future-long-running-tasks))

## 3.8.10

- Fix for bug on mobile browsers that captures the whole screen instead of cropping to just the viewport ([Trello 274](https://trello.com/c/NfcL4xXw))
