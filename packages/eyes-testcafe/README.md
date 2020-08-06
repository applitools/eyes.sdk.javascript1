<p align="center">
  <br/>
  <img src="https://eyes.applitools.com/app/v/396/Deploy/Main/build/3b185003dd49bb7679d8de4b3696dacf.png" width="250" alt="Applitools Eyes">

  <h3 align="center">Eyes-TestCafe SDK for <a href="https://devexpress.github.io/testcafe/">TestCafe</a></h1>

  <br/>
  <div align="center">
    <img src="https://img.shields.io/badge/classic-beta-yellow" style="margin-right: 10px">
    <img src="https://img.shields.io/badge/node-%3E%3D%2010-green">
  </div>
  <br/><br/>
</p>
<br/>

## Table of contents

- [Installation](#installation)
- [Applitools API key](#applitools-api-key)
- [Usage](#usage)
- [Getting started with the API](#getting-started-with-the-api)
  * [open](#open)
    + [Visual tests and baselines](#visual-tests-and-baselines)
    + [Batches](#batches)
  * [check](#check)
    + [Arguments to `eyes.check`](#arguments-to--eyescheck-)
      - [`tag`](#-tag-)
      - [`checkSettings`](#-checksettings-)
  * [close](#close)
- [Receipes for common tasks](#receipes-for-common-tasks)
  * [Configure Server URL](#configure-server-url)
  * [Configure Proxy](#configure-proxy)
  * [Make every visual test correspond to a TestCafe test](#make-every-visual-test-correspond-to-a-testcafe-test)
  * [Organize tests in batches](#organize-tests-in-batches)
    + [Method 1: environment variable](#method-1--environment-variable)
    + [Method 2: `eyes.setBatch`](#method-2---eyessetbatch-)
  * [Stitch mode](#stitch-mode)
    + [Background information](#background-information)
      - [1. Stitch mode: Scroll](#1-stitch-mode--scroll)
      - [2. Stitch mode: CSS](#2-stitch-mode--css)
  * [Stitch overlap](#stitch-overlap)
  * [Match level](#match-level)
  * [Ignore displacements](#ignore-displacements)
  * [Test properties](#test-properties)
  * [Test results](#test-results)
  * [Logging](#logging)

## Installation

Install Eyes-TestCafe as a local dev dependency in your tested project:

```bash
npm i -D @applitools/eyes-testcafe@beta
```

## Applitools API key

In order to authenticate via the Applitools server, you need to supply the Eyes-TestCafe SDK with the API key you got from Applitools. Read more about how to obtain the API key [here](https://applitools.com/docs/topics/overview/obtain-api-key.html).

To do this, set the environment variable `APPLITOOLS_API_KEY` to the API key before running your tests.
For example, on Linux/Mac:

```bash
export APPLITOOLS_API_KEY=<your_key>
npx testcafe chrome:headless some-test-dir
```

And on Windows:

```bash
set APPLITOOLS_API_KEY=<your_key>
npx testcafe chrome:headless some-test-dir
```

It's also possible to set the API key programmatically like so:

```js
eyes.setApiKey('<your API key>')
```

## Usage

After defining the API key, you will be able to use commands from Eyes-TestCafe in your testcafe tests to take screenshots and use Applitools Eyes to manage them.

For example:

```js
import {Eyes, Target} from '@applitools/eyes-testcafe'

const eyes = new Eyes()

fixture`Hello world`
  .page('https://applitools.com/helloworld')
  .afterEach(() => eyes.close())
  
test('Hello world page', async t => {
  await eyes.open(t, 'Hello World!', 'My first JavaScript test!', {width: 1200, height: 800})
  await eyes.check('Main Page', Target.window())
  await t.click('button')
  await eyes.check('Click!', Target.window())
})
```

## Getting started with the API

### open

Create an Applitools test.
This will start a session with the Applitools server.

```js
eyes.open(t, appName, testName, viewportSize)
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

Generate a screenshot of the current page and add it to the Applitools Test.

```js
eyes.check(tag, checkSettings)
```

#### Arguments to `eyes.check`

##### `tag`

Defines a name for the checkpoint in the Eyes Test Manager. The name may be any string and serves to identify the step to the user in the Test manager. You may change the tag value without impacting testing in any way since Eyes does not use the tag to identify the baseline step that corresponds to the checkpoint - Eyes matches steps based on their content and position in the sequences of images of the test. See [How Eyes compares checkpoints and baseline images](https://applitools.com/docs/topics/general-concepts/how-eyes-compares-checkpoints.html) for details.

##### `checkSettings`

Holds the checkpoint's configuration. This is defined using the fluent API, starting with `Target`.

- For taking a viewport screenshot, call `Target.window()`.
- For a full page screenshot, call `Target.window().fully()`.

### close

Close the applitools test and check that all screenshots are valid.

It is important to call this at the end of each test, symmetrically to `open`(or in `afterEach()`, see [Best practice for using the SDK](#best-practice-for-using-the-sdk)).

```js
const testResults = await eyes.close(throwEx)
```

## Recipes for common tasks

### Configure Server URL

By default, Eyes-TestCafe communicates with Applitools' public Eyes cloud server, located at `https://eyesapi.applitools.com`.

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

### Make every visual test correspond to a TestCafe test

Every call to `eyes.open` and `eyes.close` defines a test in Applitools Eyes, and all the calls to `eyes.check` between them are called "steps". In order to get a test structure in Applitools that corresponds to the test structure in TestCafe, it's best to open/close tests in every `test` call. **You can use `afterEach` for calling `eyes.close()`**

```js
fixture`Hello world`
  .page('https://applitools.com/helloworld')
  .afterEach(async () => eyes.close())
```

### Organize tests in batches

It's possible to manage how visual tests are aggregated into batches. Here are two methods for clustering tests into a single batch:

#### Method 1: environment variable

Run all the processes that execute testcafe with the same value for `APPLITOOLS_BATCH_ID`. For example, execute all testcafe files with the same randomly generated UUID:

```sh
#! Unix based machines:
APPLITOOLS_BATCH_ID=`uuidgen` npx testcafe chrome:headless tests/*.testcafe.js
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
import {Eyes, StitchMode} from '@applitools/eyes-testcafe'

const eyes = new Eyes()
eyes.setStitchMode(StitchMode.CSS)

// to go back to scroll:
eyes.setStitchMode(StitchMode.SCROLL)
```

#### Background information

Eyes-TestCafe allows you to control if the checkpoint image should include only the viewport - i.e. what you see in the browser window when you first load a page, or if it should also include the full page - i.e. what you would see if you manually scrolled down, or across, a page that is larger than the viewport.

When Eyes-TestCafe takes a full page screenshot, it does so by taking multiple screenshots of the viewport at different locations of the page (via the TestCafe test controller), and then "stitching" them together. The output is one clear, potentially very large, screenshot of what can be revealed on the page when it is scrolled.

There are two methods for creating the stitched screenshot, and they are both related to the way the page is moved relative to the viewport. Here they are:

##### 1. Stitch mode: Scroll

Using this method, the page is scrolled, just as a user would scroll. Eyes-TestCafe takes the viewport screenshot, then scrolls the page to calculated locations.
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
// For the rest of the execution
import {MatchLevel} from '@applitools/eyes-testcafe'
eyes.setMatchLevel(MatchLevel.Layout)

// For a single checkpoint
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

This is done by calling `setProperties` on the configuration, and providing it with an array of properties with the structure `{name, value}`. For exmaple:

```js
import {Eyes, Target} from '@applitools/eyes-testcafe'

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

_For the full list of methods, visit our documentation page: https://applitools.com/docs/api/eyes-sdk/index-gen/class-testresults-selenium4-javascript.html_ (This is for our Selenium SDK, but all methods are relevant for Eyes-TestCafe as well)

### Logging

To enable logging to the console, use the `ConsoleLogHandler` class:

```js
import {Eyes, ConsoleLogHandler} from '@applitools/eyes-testcafe'

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
import {Eyes, FileLogHandler} from '@applitools/eyes-testcafe'
import path from 'path'

const eyes = new Eyes()

// append non-verbose logs to logs/eyes.log (relative to current working directory)
eyes.setLogHandler(new FileLogHandler(false, path.resolve('logs', 'eyes.log')))

// write verbose logs to a new file at logs/eyes-{timestamp}.log (relative to current working directory)
eyes.setLogHandler(new FileLogHandler(true, path.resolve('logs', `eyes-${Date.now()}.log`), false))
```
