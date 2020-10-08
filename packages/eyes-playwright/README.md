<div align="center">

![Applitools Eyes](https://i.ibb.co/3hWJK68/applitools-eyes-logo.png)
### Applitools Eyes SDK for [Playwright](https://playwright.dev/)
[![npm](https://img.shields.io/npm/v/@applitools/eyes-playwright.svg?style=for-the-badge)](https://www.npmjs.com/package/@applitools/eyes-playwright)

</div>
<br/>

## Table of contents

- [Installation](#installation)
- [Applitools API key](#applitools-api-key)
- [Usage](#usage)
- [Getting started with the API](#getting-started-with-the-api)
  * [Eyes constructor](#eyes-constructor)
  * [open](#open)
    + [Visual tests and baselines](#visual-tests-and-baselines)
    + [Batches](#batches)
  * [check](#check)
    + [Arguments to `eyes.check`](#arguments-to-eyescheck)
      - [`tag`](#tag)
      - [`checkSettings`](#checksettings)
        * [Page screenshot](#page-screenshot)
        * [Region screenshot](#region-screenshot)
        * [Switching into frames](#switching-into-frames)
        * [Ignore Regions](#ignore-regions)
        * [Floating Regions](#floating-regions)
        * [Content/Strict/Layout Regions](#content-strict-layout-regions)
        * [Accessiblity Regions](#accessiblity-regions)
        * [Scroll root element](#scroll-root-element)
        * [Other checkSettings configuration](#other-checksettings-configuration)
  * [close](#close)
- [Runners](#runners)
  * [Purpose of runners](#purpose-of-runners)
    + [1. Use the Ultrafast grid](#1-use-the-ultra-fast-grid)
    + [2. Manage tests across multiple `Eyes` instances](#2-manage-tests-across-multiple-eyes-instances)
- [Recipes for common tasks](#recipes-for-common-tasks)
  * [Configure Server URL](#configure-server-url)
  * [Configure Proxy](#configure-proxy)
  * [Make every visual test correspond to a functional test](#make-every-visual-test-correspond-to-a-functional-test)
  * [Organize tests in batches](#organize-tests-in-batches)
    + [Method 1: environment variable](#method-1--environment-variable)
    + [Method 2: `eyes.setBatch`](#method-2--eyessetbatch)
  * [Stitch mode](#stitch-mode)
    + [Background information](#background-information)
      - [1. Stitch mode: Scroll](#1-stitch-mode-scroll)
      - [2. Stitch mode: CSS](#2-stitch-mode-css)
  * [Stitch overlap](#stitch-overlap)
  * [Match level](#match-level)
  * [Ignore displacements](#ignore-displacements)
  * [Test properties](#test-properties)
  * [Test results](#test-results)
  * [Logging](#logging)
  * [Configuring browsers for the Ultrafast grid](#configuring-browsers-for-the-ultra-fast-grid)


## Installation

Install Eyes-Playwright as a local dev dependency in your tested project:

```bash
npm i -D @applitools/eyes-playwright
```

## Applitools API key

In order to authenticate via the Applitools server, you need to supply the Eyes-Playwright SDK with the API key you got from Applitools. Read more about how to obtain the API key [here](https://applitools.com/docs/topics/overview/obtain-api-key.html).

To do this, set the environment variable `APPLITOOLS_API_KEY` to the API key before running your tests.
For example, on Linux/Mac:

```bash
export APPLITOOLS_API_KEY=<your_key>
npm test
```

And on Windows:

```bash
set APPLITOOLS_API_KEY=<your_key>
npx test
```

It's also possible to set the API key programmatically like so:

```js
eyes.setApiKey('<your API key>')
```

## Usage

After defining the API key, you will be able to use commands from Eyes-Playwright in your tests to take screenshots and use Applitools Eyes to manage them.

For example:

```js
const {Eyes, Target} = require('@applitools/eyes-playwright')

(async () => {
  const browser = await playwright.firefox.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://applitools.com');

  const eyes = new Eyes();
  await eyes.open(page, "applitools.com website", "My first Playwright test!")
  await eyes.check('home page', Target.window().fully())
  await eyes.close()
})();
```

## Getting started with the API

### Eyes constructor

Creates an instance of `Eyes`, which then exposes methods to run and configure visual tests.

```js
const eyes = new Eyes(runner)
```

- `runner` - A runner instance which manages tests across multiple `Eyes` instances. The runner can be an instance of either a `ClassicRunenr` or a `VisualGridRunner`. For more information, see the [Runners](#runners) section below.

### open

Creates an Applitools test.
This will start a session with the Applitools server.

```js
eyes.open(page, appName, testName, viewportSize)
```

#### Visual tests and baselines

By using the `open`/`check`/`close` methods on `Eyes`, you are creating visual tests in Applitools Eyes. A visual test is a sequence of screenshots, compared with a baseline. The baseline is also a sequence of screenshots. The specific baseline to compare against is found by using the values for:

1. Browser
2. Operating system
3. App name
4. Test name
5. Viewport size

The baseline is created automatically when running a test with specific values for these 5 parameters for the first time. For example, you run a test with **Chrome** on **OS X** and specify the **app name**, **test name** and **viewport size** via `eyes.open(t, 'some app', 'some test', {width: 1200, height: 800})`. The first time the test runs with these parameters, a baseline will be created. Any subsequent execution with the same values will compare screenshots against this baseline. The test will actually be created after running `eyes.close`, and the results of the test are returned as a `TestResults` object.

_For more information, visit our documentation page:
https://applitools.com/docs/topics/general-concepts/how-eyes-compares-checkpoints.html_

#### Batches

It's possible to aggregate tests that are run in different processes, or in different Eyes instances, under the same batch. This is done by providing the same batch ID to these tests.

For instructions, see the [Organize tests in batches](#organize-tests-in-batches) section below.

_For more information, visit our documentation page:
https://applitools.com/docs/topics/working-with-test-batches/working-with-test-batches-in-overview.html_

### check

Generates a screenshot of the current page and add it to the Applitools Test.

```js
eyes.check(checkSettings)
```

#### `checkSettings`

Holds the checkpoint's configuration. This is defined using a fluent API, starting with `Target`.

##### Page screenshot

- For taking a viewport screenshot, call `Target.window()`.
- For a full page screenshot, call `Target.window().fully()`.

##### Region screenshot

To take an element screenshot, it's possible to specify either a selector or the element representation itself. For example:

```js
// region by selector
eyes.check(Target.region('.banner'))

// region by element
const el = await page.$('.banner')
eyes.check(Target.region(el))
```

It's also possible to specify the absolute coordinates for the desired region:

```js
// region by coordinates
eyes.check(
  Target.region({left: 10, top: 20, width: 200, height: 80})
)
```

For all the above options, it's possible to specify `.fully()` in order to take the entire content of an element that can be scrolled.

##### Working with frames

For taking screenshots of elements inside iframes, it's possible to specify the frame using the `Target.frame` fluent API. For example:

```js
// element inside frame
eyes.check(
  Target.frame('frame-1').region('.element-inside frame')
)
```

It's possible to take a screenshot of the entire frame:

```js
// entire frame
eyes.check(
  Target.frame('frame-1').fully()
)
```

Multiple frame calls can be made, thus creating a "frame chain". For example:

```js
// element inside nested frames
eyes.check(
  Target.frame('frame-1').frame('frame-1-1').region('.nested-element')
)
```

##### Ignore Regions

<!-- TODO add explanation -->

```js
// single region
eyes.check(
  'viewport screenshot with ignore region',
  Target
    .window()
    .ignoreRegion('.dynamic-content-here')
)

// multiple regions
eyes.check(
  'viewport screenshot with ignore region',
  Target
    .window()
    .ignoreRegions('.dynamic-content-here', someElement, someCoordinates)
)
```

Possible input types are:

- string (interpreted as css selector)
- element
- coordinates (`{left, top, width, height}`)

##### Floating Regions

<!-- TODO add explanation -->

```js
// viewport screenshot with floating region
eyes.check(
  Target
    .window()
    .floatingRegion('.floating-area', 10, 10, 10, 10) // up, down, left, right
)

// multiple regions
eyes.check(
  Target
    .window()
    .floatingRegions(10, '.floating-area', someElement, someCoordinates) // up, down, left, right all equal to 10
)
```

Possible input types are:

- string (interpreted as css selector)
- element
- coordinates (`{left, top, width, height}`)

##### Content/Strict/Layout Regions

<!-- TODO add explanation -->

```js
// viewport screenshot with content region
eyes.check(Target.window().contentRegion('.some-element'))

// viewport screenshot with strict region
eyes.check(Target.window().strictRegion('.some-element'))

// viewport screenshot with layout region
eyes.check(Target.window().layoutRegion('.some-element'))

// multiple regions
Target.window().contentRegions(region1, region2, region3)
Target.window().strictRegions(region1, region2, region3)
Target.window().layoutRegions(region1, region2, region3)
```

Possible input types are:

- string (interpreted as css selector)
- element
- coordinates (`{left, top, width, height}`)

##### Accessiblity Regions

<!-- TODO add explanation -->

```js
const {AccessibilityRegionType} = require('@applitools/eyes-playwright')

// viewport screenshot with accessibility region
eyes.check(
  Target.window().accessibilityRegion('.some-element', AccessibilityRegionType.LargeText)
)

// multiple regions is done by chaining the same method
eyes.check(
  Target.window()
    .accessibilityRegion('.element-1', AccessibilityRegionType.LargeText)
    .accessibilityRegion('.element-2', AccessibilityRegionType.IgnoreContrast)
    .accessibilityRegion('.element-3', AccessibilityRegionType.BoldText)
)
```

Possible input types are:

- string (interpreted as css selector)
- element
- coordinates (`{left, top, width, height}`)

##### Scroll root element

<!-- TODO add explanation -->

```js
// full page with custom scroll root element
eyes.check(
  Target.window().fully().scrollRootElement('.main-content')
)
```

Possible input types are:

- string (interpreted as css selector)
- element

##### Tag (`withName`)

Defines a name for the checkpoint in the Eyes Test Manager. The name may be any string and serves to identify the step to the user in the Test manager. You may change the tag value without impacting testing in any way since Eyes does not use the tag to identify the baseline step that corresponds to the checkpoint - Eyes matches steps based on their content and position in the sequences of images of the test. See [How Eyes compares checkpoints and baseline images](https://applitools.com/docs/topics/general-concepts/how-eyes-compares-checkpoints.html) for details.

```js
eyes.check(Target.window().withName('Main page'))
```

###### Other checkSettings configuration

<!-- TODO add explanation -->

- `hideScrollbars`
- `hideCaret`
- `ignoreDisplacements`
- `useDom`
- `enablePatterns`

### close

Closes the applitools test and check that all screenshots are valid.

It is important to call this at the end of each test, symmetrically to `open`(or in `afterEach()`, see [Best practice for using the SDK](#best-practice-for-using-the-sdk)).

```js
const testResults = await eyes.close(throwEx)
```

- `throwEx` - (Boolean) throw an error if visual differences were found, or if the test failed for any other reason. The deault is `true`.

Return value: [`TestResults`](#test-results).

## Runners

There are two types of runners: `ClassicRunner` and `VisualGridRunner`:

1. `ClassicRunner` - used when the screenshot is taken by the SDK itself.

```js
const {ClassicRunner} = require('@applitools/eyes-playwright')
const runner = new ClassicRunner()
```

2. `VisualGridRunner` - used when the screenshot is taken by the **Ultrafast grid**.

```js
const {VisualGridRunner} = require('@applitools/eyes-playwright')
const runner = new VisualGridRunner(concurrentSessions)
```

- `concurrentSessions` - (Number) the number of visual tests that are allowed to run at the same time. Default: `1`.

### Purpose of runners

There are two purposes for using runners:

#### 1. Use the Ultrafast grid

This is done simply by specifying the `VisualGridRunner`. Browsers are specified by using the [`Configuration`](#configuration) API. For example:

```js
const {Eyes, VisualGridRunner, BrowserType, DeviceName} = require('@applitools/eyes-playwright')
const eyes = new Eyes(new VisualGridRunner)
const configuration = eyes.getConfiguration()

configuration.addBrowser({width: 1200, height: 800, name: BrowserType.CHROME})
configuration.addBrowser({width: 1200, height: 800, name: BrowserType.FIREFOX})
configuration.addBrowser({width: 1200, height: 800, name: BrowserType.SAFARI})
configuration.addBrowser({width: 1200, height: 800, name: BrowserType.EDGE})
configuration.addBrowser({width: 1200, height: 800, name: BrowserType.IE_11})
configuration.addBrowser({deviceName: DeviceName.Galaxy_S9_Plus})

eyes.setConfiguration(configuration)
```

#### 2. Manage tests across multiple `Eyes` instances

If you decide to create more than one instance of `Eyes` in your tests (for example, if you run `new Eyes()` in `beforeEach` test hooks), the runner provides a method called **`getAllTestResults`** for collecting test results across all eyes instances.

Consider the following:

```js
const {Eyes, ClassicRunner, StitchMode} = require('applitools/eyes-playwright')
const runner = new VisualGridRunner(10)

async function runTest(url, ...browsers) {
  await page.goto(url)
  const eyes = new Eyes(runner)
  const configuration = eyes.getConfiguration()
  configuration.addBrowsers(...browsers)
  eyes.setConfiguration(configuration)
  await eyes.open(page, appName, testName, viewportSize)
  await eyes.check(undefined, Target.window().fully())
  eyes.close()
}

async function collectResults() {
  const testResultsSummary = await runner.getAllTestResults()
  for (const testResultContainer of testResultsSummary) {
    const testResults = testResultContainer.getTestResults()
    console.log(formatTestResults(testResults)) // see the Recipes section below for the implementation of this function
  }
}

Promise.all([
  runTest('https://example.org',
    {width: 1200, height: 800, name: BrowserType.CHROME},
    {width: 1200, height: 800, name: BrowserType.FIREFOX}
  ),
  runTest('https://applitools.com',
    {deviceName: DeviceName.Galaxy_S9_Plus},
    {deviceName: DeviceName.iPhone_X}
  )
]).then(collectResults)
```

This snippet of code runs two visual tests in parallel on two websites, using a specific configuration for each url. To achieve this, multiple `Eyes` instances are used, but in order to wait for all test results, we call `runner.getAllTestResults`. We then iterate through the results and print out a formatted summary.

<!-- TODO
## Configuration

show logs
save debug data ???
api key
server url
proxy
connection timeout ???
remove session ???
ignore baseline
save new tests
save failed tests
match timeout
match level
isDisabled
batch
properties
branch name
parent branch name
baseline branch name
environment name
save diffs
send dom
host app
host os
host app info
host os info
device info
app name
test name
display name
viewport size
accessibility validation
use dom
enable patterns
ignore displacements
ignore caret
force full page screenshot
wait before screenshots
stitch mode
hide scrollbars
hide caret
stitch overlap
dont close batches
concurrent sessions ???
add browsers
-->

## Recipes for common tasks

### Configure Server URL

By default, Eyes-Playwright communicates with Applitools' public Eyes cloud server, located at `https://eyesapi.applitools.com`.

If you have a dedicated cloud or an on-premise server, configure a different Eyes server URL as follows:

```js
eyes.setServerUrl('https://mycompanyeyesapi.applitools.com')
```

### Configure Proxy

If your company's network requires requests to go through the corporate proxy, you may configure it as follows:

```js
eyes.setProxy('http://yourproxy.com')

// provide username and password:
eyes.setProxy('http://user:pass@yourproxy.com')
// OR
eyes.setProxy({
  url: 'https://yourproxy.com',
  username: 'user',
  password: 'pass'
})

// use tunneling in case of HTTP over HTTPS proxy:
eyes.setProxy({
  url: 'http://yourproxy.com',
  isHttpOnly: true
})
```

### Make every visual test correspond to a functional test

Every call to `eyes.open` and `eyes.close` defines a test in Applitools Eyes, and all the calls to `eyes.check` between them are called "steps". In order to get a test structure in Applitools that corresponds to the test structure in your functional test, it's best to open/close tests in every `test` call.

For example, when running with Mocha as a test runner:

```js
describe('My first visual test', function() {
  beforeEach(async () => {
    await eyes.open(page, "applitools.com website", "My first Playwright test!")
  })
  afterEach(async () => {
    await eyes.close()
  })
  it('...', async function() {
    // ...
  });
});
```

### Organize tests in batches

It's possible to manage how visual tests are aggregated into batches. Here are two methods for clustering tests into a single batch:

#### Method 1: environment variable

Run all the processes that execute Playwright with the same value for `APPLITOOLS_BATCH_ID`. For example, run tests with the same randomly generated UUID:

```sh
#! Unix based machines:
APPLITOOLS_BATCH_ID=`uuidgen` npm test
```

It's also possible to control the batch name that shows up in Test Manager. For example:

```sh
export APPLITOOLS_BATCH_ID=`uuidgen`
export APPLITOOLS_BATCH_NAME="Login tests"
npm test
```

#### Method 2: `eyes.setBatch`

Provide all Eyes instances with the same value for batch ID. For example:

```js
eyes.setBatch({
  id: SOME_SHARED_VALUE_THAT_WILL_BE_THE_SAME_FOR_ALL_TEST_FILES,
  name: 'My batch'
})
```

### Stitch mode

The default stitch mode is `Scroll`. In order to change it:

```js
const {Eyes, StitchMode} = require('@applitools/eyes-playwright')

const eyes = new Eyes()
eyes.setStitchMode(StitchMode.CSS)

// to go back to scroll:
eyes.setStitchMode(StitchMode.SCROLL)
```

#### Background information

Eyes-Playwright allows you to control if the checkpoint image should include only the viewport - i.e. what you see in the browser window when you first load a page, or if it should also include the full page - i.e. what you would see if you manually scrolled down, or across, a page that is larger than the viewport.

When Eyes-Playwright takes a full page screenshot, it does so by taking multiple screenshots of the viewport at different locations of the page (via Playwright's API), and then "stitching" them together. The output is one clear, potentially very large, screenshot of what can be revealed on the page when it is scrolled.

There are two methods for creating the stitched screenshot, and they are both related to the way the page is moved relative to the viewport. Here they are:

##### 1. Stitch mode: Scroll

Using this method, the page is scrolled, just as a user would scroll. Eyes-Playwright takes the viewport screenshot, then scrolls the page to calculated locations.
The issue with this method is that the page might respond to scroll events, and change the way it appears visually between the screenshots.

##### 2. Stitch mode: CSS

Using this method, the page is moved around by changing the CSS property `transform` on the HTML element with different values for `translate(x,y)`.
This method is not sensitive to scroll events, and is usually the recommended method for stitching.

### Stitch overlap

The stitch overlap is the length of the intersecting area between two screenshots that are stitched together. It's like placing two printed pictures one on top of the other with some overlapping area between them.

This is useful in cases of fixed elements, like a footer, that show up in each of the sub-screenshots. Using a stitch overlap bigger than the size of the footer would make it disappear from every image, and only show up at the bottom of the full page screenshot.

The default stitch overlap is 50 pixels. To change it:

```js
eyes.setStitchOverlap(60)
```

### Match level

The **match level** determines the way by which Eyes compares the checkpoint image with the baseline image.

The default match level is `Strict`. To change it:

```js
// Option 1: For the rest of the execution
const {MatchLevel} = require('@applitools/eyes-playwright')
eyes.setMatchLevel(MatchLevel.Layout)

// Option 2: For a single checkpoint
eyes.check(Target.window().layout())
eyes.check(Target.window().strict())
eyes.check(Target.window().content())
eyes.check(Target.window().exact())
```

_For more information, visit our documentation page: https://applitools.com/docs/common/cmn-eyes-match-levels.html_

### Ignore displacements

By using **ignore displacements** you can hide diffs that arise from content whose position on the page has changed, and focus on mismatches caused by actual changes in the content.

The default is `false`. To change it:

```js
// For the rest of the execution
eyes.setIgnoreDisplacements(true)

// For a single checkpoint
eyes.check(Target.window().ignoreDisplacements())
```

_For more information, visit our documentation page: https://applitools.com/docs/topics/test-manager/viewers/tm-diff-displacement.html_

### Test properties

It's possible to provide additional information about each test in custom fields, which can then show up in Test Manager in their own column.

This is done by calling `setProperties` on the configuration, and providing it with an array of properties with the structure `{name, value}`. For example:

```js
const {Eyes, Target} = require('@applitools/eyes-playwright')

const eyes = new Eyes()

const configuration = eyes.getConfiguration()
configuration.setProperties([{name: 'my custom property', value: 'some value'}])
eyes.setConfiguration(configuration)
```

### Test results

The results of the test can be consumed as the return value from `eyes.close`. Here's an example for creating a formatted output string out of the `TestResults` object:

```js
function formatTestResults(testResults) {
  return `
Test name                 : ${testResults.getName()}
Test status               : ${testResults.getStatus()}
URL to results            : ${testResults.getUrl()}
Total number of steps     : ${testResults.getSteps()}
Number of matching steps  : ${testResults.getMatches()}
Number of visual diffs    : ${testResults.getMismatches()}
Number of missing steps   : ${testResults.getMissing()}
Display size              : ${testResults.getHostDisplaySize().toString()}
Steps                     :
${testResults
  .getStepsInfo()
  .map(step => {
    return `  ${step.getName()} - ${getStepStatus(step)}`
  })
  .join('\n')}`
}

function getStepStatus(step) {
  if (step.getIsDifferent()) {
    return 'Diff'
  } else if (!step.getHasBaselineImage()) {
    return 'New'
  } else if (!step.getHasCurrentImage()) {
    return 'Missing'
  } else {
    return 'Passed'
  }
}
```

_For the full list of methods, visit our documentation page: https://applitools.com/docs/api/eyes-sdk/index-gen/class-testresults-selenium4-javascript.html_ (This is for our Selenium SDK, but all methods are relevant for Eyes-Playwright as well)

### Logging

To enable logging to the console, use the `ConsoleLogHandler` class:

```js
import {Eyes, ConsoleLogHandler} from '@applitools/eyes-playwright'

const eyes = new Eyes()
eyes.setLogHandler(new ConsoleLogHandler())

// To enable verbose logging:
eyes.setLogHandler(new ConsoleLogHandler(true))
```

To write logs to file, use the `FileLogHandler` class. It's possible to configure the file path, verbosity, and whether to append to file.

The API is as follows:

```js
new FileLogHandler(isVerbose, filepath, append)
```

Default values are:

- `isVerbose`: `false`
- `filepath`: `'eyes.log'`, meaning a file with this name will be created in the current working directory.
- `append`: `true`, meaning that every test will append to the file instead of recreating it.

For example:

```js
const {Eyes, FileLogHandler} = require('@applitools/eyes-playwright')
const path = require('path')

const eyes = new Eyes()

// append non-verbose logs to logs/eyes.log (relative to current working directory)
eyes.setLogHandler(new FileLogHandler(false, path.resolve('logs', 'eyes.log')))

// write verbose logs to a new file at logs/eyes-{timestamp}.log (relative to current working directory)
eyes.setLogHandler(new FileLogHandler(true, path.resolve('logs', `eyes-${Date.now()}.log`), false))
```

### Configuring browsers for the Ultrafast grid

When it comes to multiple browsers and mobile devices, the Ultrafast grid shines.
It's now possible to run one functional test, and in the background have multiple screenshots rendered for different browsers, viewport sizes, and mobile devices.

The API methods are:

- `configuration.addBrowser(browser)` for adding a single browser configuration.
- `configuration.addBrowsers(browser1, browser2, ...)` for adding single or multiple browser configurations.

Here are examples for how to execute visual tests on different browsers and platforms:

#### Desktop browsers

```js
const {BrowserType} = require('@applitools/eyes-playwright')
// ...
const configuration = eyes.getConfiguration()
configuration.addBrowsers(
  {name: BrowserType.EDGE_CHROMIUM, width: 768, height: 1024},
  {name: BrowserType.EDGE_LEGACY, width: 768, height: 1024},
  {name: BrowserType.FIREFOX, width: 768, height: 1024},
  {name: BrowserType.CHROME, width: 768, height: 1024},
  {name: BrowserType.IE_11, width: 768, height: 1024},
  {name: BrowserType.IE_10, width: 768, height: 1024},
  {name: BrowserType.SAFARI, width: 768, height: 1024},
  {name: BrowserType.CHROME_ONE_VERSION_BACK, width: 768, height: 1024},
  {name: BrowserType.CHROME_TWO_VERSIONS_BACK, width: 768, height: 1024},
  // ...
)
eyes.setConfiguration(configuration)
```

#### Chrome device emulation

Predefined device:

```js
const {ScreenOrientation, DeviceName} = require('@applitools/eyes-playwright')
// ...
const configuration = eyes.getConfiguration()
configuration.addBrowsers(
  {
    chromeEmulationInfo: {
      deviceName: DeviceName.iPhone_6_7_8,
    },
  },
  {
    chromeEmulationInfo: {
      deviceName: DeviceName.Galaxy_S9_Plus,
      screenOrientation: ScreenOrientation.LANDSCAPE,
    },
  },
)
eyes.setConfiguration(configuration)
```

Custom device:

```js
const configuration = eyes.getConfiguration()
configuration.addBrowser({
  chromeEmulationInfo: {
    width: 800,
    height: 600,
    deviceScaleFactor: 3,
  },
})
eyes.setConfiguration(configuration)
```

#### iOS device

```js
const {IosDeviceName, ScreenOrientation, IosVersion} = require('@applitools/eyes-playwright')
// ...
const configuration = eyes.getConfiguration()
configuration.addBrowser({
  iosDeviceInfo: {
    deviceName: IosDeviceName.iPhone_11,
    screenOrientation: ScreenOrientation.LANDSCAPE, // optional, default: ScreenOrientation.PORTRAIT
    iosVersion: IosVersion.LATEST // optional, default: undefined (i.e. the default is determined by the Ultrafast grid)
  },
})
eyes.setConfiguration(configuration)
```
