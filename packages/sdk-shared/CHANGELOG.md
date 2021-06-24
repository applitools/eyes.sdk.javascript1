# Changelog

## Unreleased

- add custom coverage test for cookies
- add script for linking

## 0.9.3 - 2021/5/25

- updated to @applitools/test-server@1.0.3 (from 1.0.1)
- updated to @applitools/test-utils@1.0.3 (from 1.0.0)

## 0.9.2 - 2021/5/23

- fix handlebars middleware

## 0.9.1 - 2021/5/23

- move test-server and test-utils from dev deps to deps

## 0.9.0 - 2021/5/23

- decompose all of the logic to the separate packages
- dedicate this package only to shared custom tests

## 0.8.10 - 2021/5/11

- fix path to the sdk

## 0.8.9 - 2021/5/11

- add script for linking

## 0.8.8 - 2021/3/15

- skip baseline test
- skip baseline test
## 0.8.7 - 2021/3/14

- use latest selenium chrome
- add husky hooks
- updated to @applitools/sdk-coverage-tests@2.3.8 (from 2.3.3)

## 0.8.5 - 2021/1/11

- removing skipped tests

## 0.8.4 - 2021/1/11

- removing skipped tests

## 0.8.3 - 2021/1/11

- updated to @applitools/sdk-coverage-tests@2.3.3 (from 2.3.0)

## 0.8.2 - 2021/1/9

- fix bug in test-setup cwd require

## 0.8.1 - 2021/1/9

- fix test-setup require to work with packages that don't have an index.js in the package root

## 0.8.0 - 2021/1/8

- added debugScreenshots boolean option to getEyes that will automatically create a screenshots dir in the cwd
- update the Eyes deps require statement in test-setup to use 'index' explicitly in the path (to support eyes-testcafe's need for dual index files)
- updated to @applitools/sdk-coverage-tests@2.3.0 (from 2.2.2)

## 0.7.1 - 2021/1/5

- change safari-11 to run on Mac 10.13 instead of 10.12
- change safari-11 to run on Mac 10.13 instead of 10.12
## 0.7.0 - 2021/1/4

- expose coverateTestsConfig
- updated to @applitools/sdk-coverage-tests@2.2.2 (from 2.1.3)

## 0.6.1 - 2020/12/22

- add dom traversing functionality

## 0.6.0 - 2020/12/18

- Re-established defaults for a few of the native mobile tests (which defaults to skipEmit: true) since they are failing. Need to revisit them later.

## 0.5.19 - 2020/12/16

- add `getDom` function to the coverage tests

## 0.5.18 - 2020/12/1

- remove hard-coded testsPath to generic tests (fixes broken generic coverage test generation)

## 0.5.17 - 2020/12/1

- add extractText to the spec-emitted
- updated to @applitools/sdk-coverage-tests@2.1.3 (from 2.1.0)

## 0.5.16 - 2020/11/25

- skipping tests

## 0.5.15 - 2020/11/25

- remove browser version from tags in generic tests

## 0.5.14 - 2020/11/25

- skipping headfull tests in CI

## 0.5.13 - 2020/11/23

- fixed check frame logic

## 0.5.12 - 2020/11/22

- github actions release

## 0.5.6 - 2020/11/19

- updated to @applitools/sdk-coverage-tests@2.1.0 (from 2.0.4)

## 0.5.5 - 2020/11/16

- update Mocha test names for TestEyesDifferentRunners for better traceability in test output

## 0.5.4 - 2020/11/16

- add eyes.abort to the afterEach for all generic coverage tests for better session cleanup

## 0.5.3 - 2020/11/16

- update duplicate sdk test to work out of node_modules
- updated to @applitools/sdk-coverage-tests@2.0.4 (from 2.0.3)

## 0.5.2 - 2020/11/14

- missed publishing index.js

## 0.5.1 - 2020/11/14

- move prettier to depdendencies

## 0.5.0 - 2020/11/13

- update cors test server page to use a web font

## 0.4.2 - 2020/11/12

- updated to @applitools/sdk-coverage-tests@2.0.3 (from 2.0.1)

## 0.4.1 - 2020/11/10

- ability to show logs in cvg tests
- updated to @applitools/sdk-coverage-tests@2.0.1 (from 2.0.0)

## 0.4.0 - 2020/10/23

- update `getEyes` api
- remove unused dependencies
- updated to @applitools/sdk-coverage-tests@2.0.0 (from 1.0.16)

## 0.3.0 - 2020/10/14

- add native mobile app device configurations for iOS and Android
- add custom coverage tests to check native app viewport screenshots
- updated to @applitools/sdk-coverage-tests@1.0.16 (from 1.0.14)

## 0.2.0 - 2020/10/7

- update TestMobileWeb_VG to take full page

## 0.1.5 - 2020/10/6

- replace `SpecDriver` with `spec-driver`

## 0.1.4 - 2020/10/1

- update render script

## 0.1.3 - 2020/9/23

- remove yarn workspaces
- updated to @applitools/functional-commons@1.6.0 (from 1.5.4)
- updated to @applitools/sdk-coverage-tests@1.0.14 (from 1.0.13)
