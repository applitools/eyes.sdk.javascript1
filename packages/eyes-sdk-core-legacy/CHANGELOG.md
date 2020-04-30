# Changelog

## Unreleased

## 1.0.0 - 20/4/2020

- new package name: @applitools/eyes-sdk-core-legacy
- added SDK agent id header for eyes server requests

## 5.0.0 - 29/3/2020

- RunningSession is no longer determined to be new according to startSession's response status, but rather by the response's payload of `isNew`. ([Trello](https://trello.com/c/60Rm4xXG/240-support-future-long-running-tasks))
- make supported node versions consistent at >=8.9.0

## 4.0.5

- fix syntax error that appears in older versions of Node (e.g., Node 8) [Trello 186](https://trello.com/c/XpDyr8n8)

## 4.0.4

- bug fix for logging valid requests with unexpected formats [Trello 186](https://trello.com/c/XpDyr8n8)

## 4.0.3

- more bug fixes for error logging on failed requests [Trello 186](https://trello.com/c/XpDyr8n8)

## 4.0.2

- bug fix for logging errors on failed requests [Trello 186](https://trello.com/c/XpDyr8n8)
