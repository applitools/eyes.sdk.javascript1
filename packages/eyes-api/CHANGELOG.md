# Changelog

## Unreleased


## 1.0.7 - 2021/6/30

- create plain enums types

## 1.0.6 - 2021/6/27

- support thenable webdrivers

## 1.0.5 - 2021/6/15

- updated to @applitools/types@1.0.3 (from 1.0.2)

## 1.0.4 - 2021/6/15

- add auto id generation for batch info
- read default values for some configuration properties from environment variables
- change default `throwErr` argument value in `EyesRunner::getAllTestResults` from `false` to `true`
- fix `Eyes` constructor to support the first argument as `null` and second as a `Configuration` object
- updated to @applitools/types@1.0.2 (from 1.0.1)

## 1.0.3 - 2021/5/24

- fix `EyesRunner#getAllTestResults` behavior when no eyes attached
- fix missing `properties` array in `Configuration`
- fix `logs` format in `Configuration`
- improve string formatting for `Location`, `RectangleSize` and `Region` data classes
- fix return value of `Eyes#extractTextRegions`
- fix usage of enums and string literals
- updated to @applitools/types@1.0.1 (from 1.0.0)

## 1.0.2 - 2021/5/23

- remove unused `RenderingInfo` and RunningSession types
- rename `BrowserName` to `BrowserType`
- allow sting values instead of enums in Plain types
- use `@applitools/types` package to describe internal types
- add spec to the `EyesRunner`
- updated to @applitools/logger@1.0.1 (from 1.0.0)
- updated to @applitools/utils@1.2.0 (from 1.1.3)

## 1.0.1 - 2021/5/12

- allow VisualGridRunner to be constructed without argument

## 1.0.0 - 2021/5/11

- rename variantId to variationGroupId
- added strict type definition of CheckSettings.hooks

## 0.1.0 - 2021/4/13

- renamed TestResultsContainer to TestResultContainer

## 0.0.3 - 2021/4/12

- make output classes readonly
- move TestAccessibilityStatus to its own file
- add variantId to CheckSettings
- updated to @applitools/utils@1.1.3 (from 1.1.1)
- updated to @applitools/logger@1.0.0 (from 0.0.2)

## 0.0.2 - 2021/3/24

- initial implementation of API layer for js eyes SDKs