# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [5.1.1](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.1.0...@applitools/eyes-sdk-core@5.1.1) (2019-03-24)

**Note:** Version bump only for package @applitools/eyes-sdk-core





# [5.1.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.0.1...@applitools/eyes-sdk-core@5.1.0) (2019-03-17)


### Features

* **eyes-sdk-core:** add ability to pass object into `setConfiguration` ([c402a0f](https://github.com/applitools/eyes.sdk.javascript1/commit/c402a0f))





## [5.0.1](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@5.0.0...@applitools/eyes-sdk-core@5.0.1) (2019-03-14)

**Note:** Version bump only for package @applitools/eyes-sdk-core





# [5.0.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.9.0...@applitools/eyes-sdk-core@5.0.0) (2019-03-13)


### Bug Fixes

* **eyes-sdk-core:** add new method `deleteSession` to TestResults, it should be used instead of `delete`. ([34744cb](https://github.com/applitools/eyes.sdk.javascript1/commit/34744cb))
* **eyes-sdk-core:** allow set batch to `undefined` ([3abaf46](https://github.com/applitools/eyes.sdk.javascript1/commit/3abaf46))
* **eyes-sdk-core:** fix order of arguments when creating `BatchInfo` ([713a0f0](https://github.com/applitools/eyes.sdk.javascript1/commit/713a0f0))
* **eyes-sdk-core:** fix use of wrong setting of AgentId ([e917170](https://github.com/applitools/eyes.sdk.javascript1/commit/e917170))
* **eyes-selenium:** move `sendDom` from ImageMatchSettings to Configuration ([5c2c527](https://github.com/applitools/eyes.sdk.javascript1/commit/5c2c527))


### Code Refactoring

* **eyes-sdk-core:** remove `delete()` from `TestResults` ([4e24585](https://github.com/applitools/eyes.sdk.javascript1/commit/4e24585))


### Features

* **eyes-sdk-core:** add `getScrolledElement` to PositionProvider ([2afebbb](https://github.com/applitools/eyes.sdk.javascript1/commit/2afebbb))
* **eyes-sdk-core:** add `setConfiguration` method to Eyes ([64813e4](https://github.com/applitools/eyes.sdk.javascript1/commit/64813e4))
* **eyes-sdk-core:** add `setIsVisualGrid` method ([94662fb](https://github.com/applitools/eyes.sdk.javascript1/commit/94662fb))
* **eyes-sdk-core:** added setters in eyes-abstarct for useDom & enablePattrens ([15439d8](https://github.com/applitools/eyes.sdk.javascript1/commit/15439d8))
* **eyes-sdk-core:** remove deprecated methods ([7decce1](https://github.com/applitools/eyes.sdk.javascript1/commit/7decce1))
* **eyes-selenium:** add `data-applitools-original-overflow` only if we hide element ([5247feb](https://github.com/applitools/eyes.sdk.javascript1/commit/5247feb))
* **eyes-selenium:** add `data-applitools-original-overflow` tag to elements where we change overflow ([26016a9](https://github.com/applitools/eyes.sdk.javascript1/commit/26016a9))
* **eyes-selenium:** update `setOverflow` of EyesJsBrowserUtils ([032d475](https://github.com/applitools/eyes.sdk.javascript1/commit/032d475))
* remove setProxy, setBatch from Configuration, use objects instead ([c91d4ae](https://github.com/applitools/eyes.sdk.javascript1/commit/c91d4ae))
* use JS getters/setters for Configuration classes ([c68771e](https://github.com/applitools/eyes.sdk.javascript1/commit/c68771e))


### BREAKING CHANGES

* **eyes-sdk-core:** `delete` is no more available from `TestResults`, use `deleteSession` instead.





# [4.9.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.8.0...@applitools/eyes-sdk-core@4.9.0) (2019-02-27)


### Features

* **eyes-sdk-core:** 🎸 added useDom and enablePatterns to match request ([5e16823](https://github.com/applitools/eyes.sdk.javascript1/commit/5e16823))
* **eyes-sdk-core:** add `configuration` to constructor of EyesBase ([7b69423](https://github.com/applitools/eyes.sdk.javascript1/commit/7b69423))
* **eyes-sdk-core, visua-grid-client:** 🎸 supporting useDom and enablePatterns for match request ([03ae908](https://github.com/applitools/eyes.sdk.javascript1/commit/03ae908))





# [4.8.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.7.2...@applitools/eyes-sdk-core@4.8.0) (2019-02-19)


### Features

* **eyes-sdk-core:** add `EyesAbstract` class, move getters/setters to it and use Configuration for store properties ([e1a2b39](https://github.com/applitools/eyes.sdk.javascript1/commit/e1a2b39))





## [4.7.2](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.7.1...@applitools/eyes-sdk-core@4.7.2) (2019-02-11)

**Note:** Version bump only for package @applitools/eyes-sdk-core






## [4.7.1](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.7.0...@applitools/eyes-sdk-core@4.7.1) (2019-02-07)

**Note:** Version bump only for package @applitools/eyes-sdk-core





# [4.7.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.6.4...@applitools/eyes-sdk-core@4.7.0) (2019-01-29)


### Features

* **eyes-sdk-core:** add blankCorsIframeSrcOfCdt method to CorsIframeHandler ([2801841](https://github.com/applitools/eyes.sdk.javascript1/commit/2801841))
* **eyes-sdk-core:** add export of CorsIframeHandle, CorsIframeHandler ([4bd139e](https://github.com/applitools/eyes.sdk.javascript1/commit/4bd139e))





## [4.6.4](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.6.3...@applitools/eyes-sdk-core@4.6.4) (2019-01-28)

**Note:** Version bump only for package @applitools/eyes-sdk-core





## [4.6.3](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.6.2...@applitools/eyes-sdk-core@4.6.3) (2019-01-22)

**Note:** Version bump only for package @applitools/eyes-sdk-core





## [4.6.2](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.6.1...@applitools/eyes-sdk-core@4.6.2) (2019-01-21)


### Bug Fixes

* **eyes-sdk-core:** restore accidentally removed method in TestResultsFormatter ([0bd8abf](https://github.com/applitools/eyes.sdk.javascript1/commit/0bd8abf))





## [4.6.1](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.6.0...@applitools/eyes-sdk-core@4.6.1) (2019-01-16)


### Bug Fixes

* **eyes-sdk-core:** restore methods that were removed in previous update ([fff611d](https://github.com/applitools/eyes.sdk.javascript1/commit/fff611d))





# [4.6.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.5.4...@applitools/eyes-sdk-core@4.6.0) (2019-01-16)


### Bug Fixes

* **eyes-images:** fix issue when any string means url in Target ctor ([c9a02d6](https://github.com/applitools/eyes.sdk.javascript1/commit/c9a02d6))
* **eyes-sdk-core:** use correct URL props for user/pass in ProxySettings ([a40a1c6](https://github.com/applitools/eyes.sdk.javascript1/commit/a40a1c6))
* **eyes-selenium:** rename ImageMatchSettings's `useDom` property to `sendDom`, set it from EyesBase's setSendDom() and use it in MatchSettingsTask ([abd9e2e](https://github.com/applitools/eyes.sdk.javascript1/commit/abd9e2e))


### Features

* add `withName(String)` method to CheckSettings ([1774167](https://github.com/applitools/eyes.sdk.javascript1/commit/1774167))
* finalize eyes-rendering pkg, continue introduction of eyes-common ([c3367b7](https://github.com/applitools/eyes.sdk.javascript1/commit/c3367b7))
* **eyes-common:** move methods which uses `fs` into separate FileUtils class ([cdc499d](https://github.com/applitools/eyes.sdk.javascript1/commit/cdc499d))
* **eyes-sdk-core:** Add `downloadResource` method to ServerConnector ([0ae5f39](https://github.com/applitools/eyes.sdk.javascript1/commit/0ae5f39))
* **eyes-sdk-core:** allow to create Logger with ConsoleLogHandler from ctor ([3144b9a](https://github.com/applitools/eyes.sdk.javascript1/commit/3144b9a))


### BREAKING CHANGES

* **eyes-common:** `save` method was removed from MutableImage, `readImage`, `writeImage` methods were removed from ImageUtils.





## [4.5.4](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.5.3...@applitools/eyes-sdk-core@4.5.4) (2018-12-12)


### Bug Fixes

* **eyes-sdk-core:** update deepmerge dependency, fix issue with esmodule ([5cd5419](https://github.com/applitools/eyes.sdk.javascript1/commit/5cd5419))





## [4.5.3](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.5.2...@applitools/eyes-sdk-core@4.5.3) (2018-12-11)


### Bug Fixes

* **eyes-sdk-core:** fix error when response of renderStatusById is null ([8f1e3f5](https://github.com/applitools/eyes.sdk.javascript1/commit/8f1e3f5))





## [4.5.2](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.5.1...@applitools/eyes-sdk-core@4.5.2) (2018-12-07)


### Bug Fixes

* **eyes-sdk-core:** Remove check for fs in ImageUtils before parse/pack ([febea66](https://github.com/applitools/eyes.sdk.javascript1/commit/febea66))





## [4.5.1](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.5.0...@applitools/eyes-sdk-core@4.5.1) (2018-12-06)


### Features

* **eyes-sdk-core:** Add EyesSimpleScreenshotFactory class ([d2eb741](https://github.com/applitools/eyes.sdk.javascript1/commit/d2eb741))





# [4.5.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.4.0...@applitools/eyes-sdk-core@4.5.0) (2018-12-04)

**Note:** Version bump only for package @applitools/eyes-sdk-core





# [4.4.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.3.0...@applitools/eyes-sdk-core@4.4.0) (2018-11-29)


### Bug Fixes

* **eyes-sdk-core:** fix not working `setHostOSInfo` method ([24a301e](https://github.com/applitools/eyes.sdk.javascript1/commit/24a301e))
* **eyes-sdk-core:** update docs for return type of `abortIfNotClosed` ([7cd1f44](https://github.com/applitools/eyes.sdk.javascript1/commit/7cd1f44))


### Features

* **eyes-sdk-core:** add `isNotNull(value)` method to `TypeUtils` ([0d402bd](https://github.com/applitools/eyes.sdk.javascript1/commit/0d402bd))





# [4.3.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.2.0...@applitools/eyes-sdk-core@4.3.0) (2018-11-26)


### Features

* **eyes-sdk-core:** add `isNull` method to `TypeUtils` ([3be1d46](https://github.com/applitools/eyes.sdk.javascript1/commit/3be1d46))
* **eyes-sdk-core:** add an ability to completely disable proxy settings ([03a0a7d](https://github.com/applitools/eyes.sdk.javascript1/commit/03a0a7d))





# [4.2.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.1.0...@applitools/eyes-sdk-core@4.2.0) (2018-11-20)


### Features

* **eyes-sdk-core:** add `deviceInfo`, `osInfo`, `hostingAppInfo` properties to `AppEnvironment` ([e7437bc0](https://github.com/applitools/eyes.sdk.javascript1/commit/e7437bc))
* **eyes-sdk-core:** add `hostOSInfo`, `hostAppInfo`, `deviceInfo` properties to `EyesBase` ([e7437bc0](https://github.com/applitools/eyes.sdk.javascript1/commit/e7437bc))
* **eyes-sdk-core:** send `sendDom` property in `RenderRequest` also when it eq `false` ([ef929ab](https://github.com/applitools/eyes.sdk.javascript1/commit/ef929ab))





## [4.1.0](https://github.com/applitools/eyes.sdk.javascript1/compare/v4.0.3...v4.1.0) (2018-11-08)

**Note:** Version bump only for package @applitools/eyes-sdk-core





## [4.0.3](https://github.com/applitools/eyes.sdk.javascript1/compare/v4.0.2...v4.0.3) (2018-11-07)


### Features

* Add new methods to `TypeUtils`: `isInteger`, `has`. Update other methods, add tests for all methods  ([f12ce4f](https://github.com/lerna/lerna/commit/f12ce4f))





## [4.0.2](https://github.com/applitools/eyes.sdk.javascript1/compare/v4.0.1...v4.0.2) (2018-11-06)


### Features

* Remove @deprecated tag from setMatchLevel/getMatchLevel ([22f8c09](https://github.com/lerna/lerna/commit/22f8c09))




## [4.0.1](https://github.com/applitools/eyes.sdk.javascript1/compare/eyes.selenium-v1.9.0-alpha...v4.0.1) (2018-11-03)


### BREAKING CHANGES

* Changes in `GeneralUtils` ([cc01222](https://github.com/lerna/lerna/commit/cc01222))
  - Removed methods: `assignTo`, `mixin`, `clone`, `getStackTrace` 
  - Methods moved to new class `TypeUtils`: `isString`, `isNumber`, `isBoolean`, `isObject`, `isPlainObject`, `isArray`, `isBuffer`, `isBase64`
  - Changed `cartesianProduct` method, now it returns array instead of generator

* Changes in `CheckSettings` ([ed1f342](https://github.com/lerna/lerna/commit/ed1f342))
  - Removed methods: `ignore`, `ignores` (use `ignoreRegions` instead)
  - Renamed methods: `floating` to `floatingRegion`, `floatings` to `floatingRegions`


### Features

* Fix error when viewportSize in setViewportSize given as an object ([db6472a](https://github.com/lerna/lerna/commit/db6472a))
