# Eyes-Storybook

Applitools Eyes SDK for [Storybook](http://storybook.js.org).

### Table of contents

- [Installation](#installation)
  * [Install npm package](#install-npm-package)
  * [Applitools API key](#applitools-api-key)
- [Usage](#usage)
  * [Configuring local storybook server](#configuring-local-storybook-server)
  * [Standalone server](#standalone-server)
  * [Command line arguments](#command-line-arguments)
- [Concurrency](#concurrency)
- [Advanced configuration](#advanced-configuration)
  * [Method 1: Environment variables](#method-1--environment-variables)
  * [Method 2: The `applitools.config.js` file](#method-2--the--applitoolsconfigjs--file)
- [Configuring the browser](#configuring-the-browser)
  * [Previous browser versions](#previous-browser-versions)
  * [Getting a screenshot of multiple browsers in parallel](#getting-a-screenshot-of-multiple-browsers-in-parallel)
  * [Device emulation](#device-emulation)
- [Per component configuration](#per-component-configuration)
    + [The following properties are supported:](#the-following-properties-are-supported-)
  * [`include`](#-include-)
  * [`variations`](#-variations-)
  * [`waitBeforeScreenshot`](#-waitbeforescreenshot-)
  * [`properties`](#-properties-)
  * [`ignoreRegions`](#-ignoreregions-)
  * [`floatingRegions`](#-floatingregions-)
  * [`layoutRegions`](#-layoutregions-)
  * [`contentRegions`](#-contentregions-)
  * [`strictRegions`](#-strictregions-)
  * [`accessibilityRegions`](#-accessibilityregions-)
  * [`accessibilityValidation`](#-accessibilityvalidation-)
  * [Parameters that cannot be set as an Advanced configuration](#parameters-that-cannot-be-set-as-an--advanced-configuration---advanced-configuration-)
  * [`runBefore`](#-runbefore-)
  * [`scriptHooks`](#-scripthooks-)
    + [beforeCaptureScreenshot](#beforecapturescreenshot)
- [Running Eyes-Storybook in Docker](#running-eyes-storybook-in-docker)
- [Dealing with dynamic data](#dealing-with-dynamic-data)
- [Troubleshooting](#troubleshooting)

## Installation

### Install npm package

Install Eyes-Storybook as a local dev dependency in your tested project:

```bash
npm install --save-dev @applitools/eyes-storybook
```

### Applitools API key

In order to authenticate via the Applitools server, you need to supply the Eyes-Storybook SDK with the API key you got from Applitools. Read more about how to obtain the API key [here](https://applitools.com/docs/topics/overview/obtain-api-key.html).

To do this, set the environment variable `APPLITOOLS_API_KEY` to the API key before running your tests.
For example, on Linux/Mac:

```bash
export APPLITOOLS_API_KEY=<your_key>
```

And on Windows:

```bash
set APPLITOOLS_API_KEY=<your_key>
```

## Usage

After completing the installation and defining the API key, you will be able to run Eyes-Storybook from the command line and let it take screenshots of all your stories.

If your project is using the default storybook config folder (i.e. `<project_folder>/.storybook`), then run the following command:

```bash
npx eyes-storybook
```

### Configuring local storybook server

Normally, Eyes-Storybook starts a storybook dev server in an available port between 9000-9010 for the duration of the tests. It's possible to pass arguments to Eyes-Storybook to configure the local storybook server:

- `--storybook-port OR -p`: Port to run storybook (passed as `-p` to `start-storybook`).
- `--storybook-host OR -h`: Host to run storybook (passed as `-h` to `start-storybook`).
- `--storybook-config-dir OR -c`: Directory where to load Storybook configurations from (passed as `-c` to `start-storybook`)
- `--storybook-static-dir OR -s`: Directory where to load static files from, comma-separated list (passed as `-s` to `start-storybook`)

### Standalone server

As noted in the previous section, Eyes-Storybook starts a storybook dev server. If you wish to start the server outside of Eyes-Storybook, or test a production build that's available at a certain URL, then just specify the URL for the storybook in the command line (or in the configuration file, see [Advanced configuration](#advanced-configuration) below).

For example:

```bash
npx eyes-storybook -u http://localhost:6006
```

Or for a production storybook:

```bash
npx eyes-storybook -u http://react.carbondesignsystem.com/
```

### Command line arguments

The full list of command line arguments can be viewed by running `npx eyes-storybook --help`:

```txt
Usage: eyes-storybook.js [options]

Options:
  --help                                            Show help                                                                       [boolean]
  --version, -v                                     Show the version number                                                         [boolean]
  --conf, -f                                        Path to applitools.config.js config file                                         [string]
  --storybook-url, -u                               URL to storybook                                                                 [string]
  --storybookPort, -p, --storybook-port             Port to run Storybook                                                            [number]
  --storybookHost, -h, --storybook-host             Host to run Storybook                                                            [string]
  --storybookConfigDir, -c, --storybook-config-dir  Path to Storybook's config folder (defaults to .storybook)                       [string]
  --storybookStaticDir, --storybook-static-dir      Path to Storybook's static files folder                                          [string]
  --showStorybookOutput, --show-storybook-output    Whether or not you want to see Storybook output                                 [boolean]
  --readStoriesTimeout, --read-stories-timeout      The time to wait until all stories are read, before starting the visual tests    [number]
  --exitcode, -e                                    If tests failed close with non-zero exit code                                   [boolean]
```

## Concurrency

The default level of concurrency for free accounts is `10`. This means that only up to 10 visual tests can run in parallel, and therefore the execution might be slow.
If your account does support a higher level of concurrency, it's possible to pass a different value by specifying it in the property `concurrency` in the applitools.config.js file (see [Advanced configuration](#advanced-configuration) section below).

If you are interested in speeding up your visual tests, contact sdr@applitools.com to get a trial account and faster tests with more concurrency.

## Advanced configuration

In addition to command-line arguments, it's possible to define the following configuration parameteres for tests by using environment variables or the applitools.config.js file:

| Property name             | Default value               | Description   |
| -------------             |:-------------               |:-----------   |
| `storybookUrl`            | undefined                   | URL to storybook (also available as command-line argument). |
| `storybookPort`           | 9000                        | Port to run Storybook (also available as command-line argument). |
| `storybookHost`           | localhost                   | Host to run Storybook (also available as command-line argument). |
| `storybookConfigDir`      | .storybook                  | Path to Storybook's config folder (also available as command-line argument). |
| `storybookStaticDir`      | undefined                   | Path to Storybook's static files folder (also available as command-line argument). |
| `showStorybookOutput`     | undefined                   | Whether or not you want to see Storybook output (also available as command-line argument). |
| `viewportSize`            | { width: 1024, height: 600} | The size of the puppeteer browser's window. This is the browser window which renders the stories originally (and opens at the size provided in the `viewportSize` parameter), and then a DOM snapshot is uploaded to the server, which renders this snapshot on all the browsers and sizes provided in the `browser` parameter.|
| `exitcode`                | false                       | If tests failed close with non-zero exit code (also available as command-line argument). |
| `browser`                 | { width: 800, height: 600, name: 'chrome' } | The size and browser of the generated screenshots. For more info and possible values, see the [browser section below](#configuring-the-browser).|
| `showLogs`                | false                       | Whether or not you want to see logs of the Eyes-Storybook plugin. |
| `saveDebugData`           | false                       | Whether to save troubleshooting data. See the troubleshooting section of this doc for more info. |
| `batchId`                 | random                      | Provides ability to group tests into batches. Read more about batches [here](https://applitools.com/docs/topics/working-with-test-batches/how-to-group-tests-into-batches.html). |
| `batchName`               | undefined                   | Provides a name to the batch. |
| `batchSequenceName`       | undefined                   | Name for managing batch statistics. |
| `baselineEnvName`         | undefined                   | The name of the environment of the baseline. |
| `envName`                 | undefined                   | A name for the environment in which the application under test is running. |
| `ignoreCaret`             | false                       | Whether to ignore or the blinking caret or not when comparing images. |
| `matchLevel`              | undefined                   | The test-wide match level to use when checking application screenshot with the expected output. Possible values are `Strict`, `Exact`, `Layout` and `Content`. Read more about match levels [here](http://support.applitools.com/customer/portal/articles/2088359). |
| `branchName`              | undefined                   | The name of the branch. |
| `baselineBranchName`      | undefined                   | The name of the baseline branch. |
| `parentBranchName`        | undefined                   | Sets the branch under which new branches are created. |
| `proxy`                   | undefined                   | Sets the proxy settings to be used in network requests to Eyes server. This can be either a string to the proxy URI, or an object containing the URI, username and password.<br/><br/>For example: <br/>`{url: 'https://myproxy.com:443', username: 'my_user', password: 'my_password', isHttpOnly: false}`<br/>or:<br/>`"https://username:password@myproxy.com:443"`|
| `saveFailedTests`         | false                       | Set whether or not failed tests are saved by default (saved as baseline). |
| `saveNewTests`            | false                       | Set whether or not new tests are saved by default (saved as baseline). |
| `serverUrl`               | Default Eyes server URL     | The URL of Eyes server |
| `compareWithParentBranch` | false                       |  |
| `ignoreBaseline`          | false                       |  |
| `runInDocker`             | false                       | If you are having issues running the SDK in docker, set this flag to `true`. See more info [below](#running-eyes-storybook-in-docker) |
| `puppeteerOptions`        | undefined                | Options to send to `puppeteer.launch`. This is a low-level configuration and should be used with great care. Example use `{ args: ['--no-sandbox'], headless: false, devtools: true}` |
| `tapFilePath`             | undefined                   | Directory path of a results file. If set, then a [TAP](https://en.wikipedia.org/wiki/Test_Anything_Protocol#Specification) file is created in this directory, the file is created with the name eyes.tap and contains the Eyes test results. |
| `xmlFilePath`             | undefined                   | Directory path of a results file. If set, then a [XUnit XML](https://google.github.io/rich-test-results/xunitxml) file is created in this directory, the file is created with the name eyes.xml and contains the Eyes test results. |
| `waitBeforeScreenshot`    | undefined                   | Selector, function or timeout.<br/>If ```number``` then the argument is treated as time in milliseconds to wait before all screenshots.<br/>If ```string``` then the argument is treated as a selector for elements to wait for before all screenshots.<br/>If ```function```, then the argument is treated as a predicate to wait for before all screenshots.<br/><hr/>For per component configuration see [waitBeforeScreenshot.](#waitBeforeScreenshot)<br/>Note that we use Puppeteer's [page.waitFor()](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagewaitforselectororfunctionortimeout-options-args), checkout it's API for more details. |
| `include`                 | true                        | A predicate function specifying which stories should be visually tested.<br/>Visual baselines will be created only for the components specified.<br/>The function receives an object with ```name```, ```kind``` and ```parameters``` properties.<br/>For example (exclude all stories with a name that start with [SKIP]):<br/>```({name,  kind, parameters}) => !/^\[SKIP\]/.test(name)```<br/>For more information, see [per component configuration - include](#include). |
| `variations`              | undefined                   | Specifies additional variations for all or some of the stories. For example, RTL. For more information, see [per component  configuration - variations](#variations).|
| `notifyOnCompletion`      | false                       | If `true` batch completion notifications are sent. |
| `dontCloseBatches`        | false                       | If true, batches are not closed for notifyOnCompletion.|
| `concurrency`             | 10                          | The maximum number of tests that can run concurrently. The default value is the allowed amount for free accounts. For paid accounts, set this number to the quota set for your account. |
| `readStoriesTimeout`      | 60000                       | The amount of time (in milliseconds) Eyes-Storybook waits for storybook to load. For old storybook versions 2 and 3, this is also the time it takes for Eyes-Storybook to acknowledge it is working on those versions. So it is recommended to make this value small (e.g. 3000) when working with Storybook version 2 or 3. |
| `ignoreDisplacements`     | false                       | Sets whether Test Manager should intially display mismatches for image features that have only been displaced, as opposed to real mismatches. |
| `properties`              | undefined                   | Adds custom properties for each test. These show up in Test Manager, and tests can be grouped by custom properties. By default, Eyes-Storybook adds 2 custom properties for each test: the **Component name** and **State** of each component. Adding more properties via this config param will **not** override these two properties.|
| `ignoreRegions`           | undefined                   | An array of regions to ignore when comparing the checkpoint screenshot with the baseline screenshot. For more information, see [per component  configuration - ignoreRegions](#ignoreRegions)|
| `floatingRegions`         | undefined                   | An array of regions to consider as floating when comparing the checkpoint screenshot with the baseline screenshot. For more information, see [per component  configuration - floatingRegions](#floatingRegions)|
| `layoutRegions`           | undefined                   | An array of regions to consider as match level **Layout** when comparing the checkpoint screenshot with the baseline screenshot. For more information, see [per component  configuration - layoutRegions](#layoutRegions)|
| `strictRegions`           | undefined                   | An array of regions to consider as match level **Strict** when comparing the checkpoint screenshot with the baseline screenshot. For more information, see [per component  configuration - strictRegions](#strictRegions)|
| `contentRegions`          | undefined                   | An array of regions to consider as match level **Content** when comparing the checkpoint screenshot with the baseline screenshot. For more information, see [per component  configuration - contentRegions](#contentRegions)|
| `accessibilityRegions`    | undefined                   | An array of regions to validate accessibility when comparing the checkpoint screenshot with the baseline screenshot. Validation is according to the configured `accessibilityValidation`. For more information, see [per component  configuration - contentRegions](#contentRegions)|
| `accessibilityValidation` | undefined | An object that specifies the accessibility level and guidelines version to use for the screenshots. Possible values for **level** are `None`, `AA` and `AAA`, and possible values for **guidelinesVersion** are `WCAG_2_0` and `WCAG_2_1`. For example: `{level: 'AA', guidelinesVersion: 'WCAG_2_0'}`. For more information, see [per component  configuration - accessibilityValidation](#accessibilityValidation)|

There are 2 ways to specify test configuration:

1) Environment variables
2) The `applitools.config.js` file

The list above is also the order of precedence, which means that if you specify a property as an environment variable, it will override the value defined for the same property in the `applitools.config.js` file.

### Method 1: Environment variables

The name of the corresponding environment variable is in uppercase, with the `APPLITOOLS_` prefix, and separating underscores instead of camel case:

```js
APPLITOOLS_APP_NAME
APPLITOOLS_SHOW_LOGS
APPLITOOLS_BATCH_ID
APPLITOOLS_BATCH_NAME
APPLITOOLS_BATCH_SEQUENCE_NAME
APPLITOOLS_PROXY
APPLITOOLS_NOTIFY_ON_COMPLETION
...
// all other configuration variables apply as well..
```

### Method 2: The `applitools.config.js` file

It's possible to have a file called `applitools.config.js` at the current working directory (the directory you are at when running the `eyes-storybook` script). In this file specify the desired configuration, as an exported CommonJS module. For example:

```js
module.exports = {
  appName: 'My app',
  showLogs: true,
  batchName: 'My batch'
  ...
  // all other configuration variables apply
}
```

## Configuring the browser

Eyes-Storybook will take a screenshot of the page as specified in the `browser` configuration parameter.

Possible values are:

- `chrome`
- `firefox`
- `edgechromium`
- `edgelegacy`
- `ie10`
- `ie11`
- `safari`
- `chrome-one-version-back`
- `chrome-two-versions-back`
- `firefox-one-version-back`
- `firefox-two-versions-back`
- `safari-one-version-back`
- `safari-two-versions-back`
- `edgechromium-one-version-back`
- `edgechromium-two-versions-back`

### Previous browser versions

`*-one-version-back` and `*-two-versions-back` are relative to the version of the same browser. For example, if `chrome` refers to version 79, then `chrome-one-version-back` will be Chrome 78 and `chrome-two-versions-back` will be Chrome 77.

### Getting a screenshot of multiple browsers in parallel

It's also possible to send an array of browsers, for example in the `applitools.config.js` file:

```js
module.exports = {
  browser: [
    {width: 800, height: 600, name: 'firefox'},
    {width: 1024, height: 768, name: 'chrome'},
    {width: 1024, height: 768, name: 'ie11'}
  ]
}
```

### Device emulation

To enable chrome's device emulation, it's possible to send a device name and screen orientation, for example:

```js
module.exports = {
  browser: {
    deviceName: 'iPhone X',
    screenOrientation: 'landscape',
    name: 'chrome' // optional, just to make it explicit this is browser emulation and not a real device. Only chrome is supported for device emulation.
  }
}
```

Possible values for screen orientation are `landscape` and `portrait`, and if no value is specified, the default is `portrait`.

The list of device names is taken from [chrome devtools predefined devices](https://raw.githubusercontent.com/chromium/chromium/0aee4434a4dba42a42abaea9bfbc0cd196a63bc1/third_party/blink/renderer/devtools/front_end/emulated_devices/module.json), and can be obtained by running the following command in a unix-based shell (installing [`jq`](https://stedolan.github.io/jq/) might be needed):

```sh
curl -s https://raw.githubusercontent.com/chromium/chromium/0aee4434a4dba42a42abaea9bfbc0cd196a63bc1/third_party/blink/renderer/devtools/front_end/emulated_devices/module.json | jq '.extensions[].device.title'
```

In addition, it's possible to use chrome's device emulation with custom viewport sizes, pixel density and mobile mode, by passing `deviceScaleFactor` and `mobile` in addition to `width` and `height`. For example:

```js
module.exports = {
  browser: {
    width: 800,
    height: 600,
    deviceScaleFactor: 3,
    mobile: true,
    name: 'chrome' // optional, just to make it explicit this is browser emulation and not a real device. Only chrome is supported for device emulation.
  }
}
```

## Per component configuration

**_Only supported in Storybook version >= 4_**

There are two ways to provide configuration for a specific story, or a group of stories.

1. **As an argument to the story** - It's possible to pass a third argument to storybook's `.add` function to customize each story. An `eyes` property on the parameters object can be specified with configuration properties.

2. **In the global configuration file, `applitools.config.js`** - If a function is specified for one of the properties below, it will be called for each story, and will be passed the story's metadata, of the structure `{name, kind, parameters}`, where `name` is the name of the component, `kind` is the string built by storybook for the category, e.g. `Forms|Input/Text`, and `parameters` are the third argument to storybook's `.add` function. The function should return the configuration value for the specific property+story.

_Specifying a value locally in the story takes precedence over the global config value._

#### The following properties are supported:

### `include`

When `false`, the component will not be visually tested. For example:

```js
// This story will not be tested visually
storiesOf('Some kind', module)
  .add(
    'Some story',
    () => <div>I am visually perfect!</div>,
    {eyes: {include: false}}
  )
```

### `variations`

An array of string values, which specifies which variations to add for this story. For each value, an additional visual test will be executed for the component. It will have the same name only with a `[<variation name>]` suffix, and when the component is loaded, the URL will have an additional param: `eyes-variation=<variation name>`.

This can accommodate many use cases, for example RTL (right to left).
It's now possible for the component to render its variation version when the relevant URL param is present. For Example, here's a storybook that handles an RTL variation:

```js
const isRTL = new URL(window.location).searchParams.get('eyes-variation') === 'RTL';

if (isRTL) {
  document.documentElement.setAttribute('dir', 'rtl')
}

// 2 visual tests will be created - one for LTR and one for RTL
storiesOf('Components that support RTL', module)
  .add(
    'Some story',
    () => <div>
        <span>I am visually perfect!</span>
        <span>{isRTL ? ' and rendered right to left as well :)' : ''}</span>
      </div>,
    {eyes: {variations: ['RTL']}}
  )
```

### `waitBeforeScreenshot`

Selector or timeout, see [advanced configuration](#advanced-configuration) for more details.

```js
storiesOf('Components with a waitBeforeScreenshot', module)
  .add(
    'Some story',
    () => <span id="container" class="loading"></span>,
    {eyes: { waitBeforeScreenshot: '#container.ready' }}
  );
```

_Note that the predicate option for `waitBeforeScreenshot` is currently not available in the per component configuration._

### `properties`

Adds custom properties for each test. These show up in Test Manager, and tests can be grouped by custom properties. By default, Eyes-Storybook adds 2 custom properties for each test: the **Component name** and **State** of each component. Adding more properties via this config param will **not** override these two properties.

### `ignoreRegions`

A single or an array of regions to ignore when checking for visual differences. For example:

```js
storiesOf('Components with ignored region', module)
  .add(
    'Some story',
    () =>
      <div>
        <span>I am visually perfect!</span>
        <span className="ignore-this">this should be ignored</span>
      </div>,
    {eyes: {
      ignoreRegions: [
        {selector: '.ignore-this'}, // by css selector
        {left: 10, top: 20, width: 200, height: 80} // by absolute coordinates
      ]}
    }
  )
```

### `floatingRegions`

An array of regions to consider as floating when comparing the checkpoint screenshot with the baseline screenshot. For example:

```js
storiesOf('Components with floating region', module)
  .add(
    'Some story',
    () =>
      <div>
        <span>I am visually perfect!</span>
        <span className="floating-region">this should be floating</span>
      </div>,
    {eyes: {
      floatingRegions: [
        { // by selector
          selector: '.floating-region',
          maxUpOffset: 10,
          maxDownOffset: 20,
          maxLeftOffset: 30,
          maxRightOffset: 40,
        },
        { // by absolute coordinates
          left: 10,
          top: 20,
          width: 200,
          height: 80,
          maxUpOffset: 10,
          maxDownOffset: 20,
          maxLeftOffset: 30,
          maxRightOffset: 40,
        }
      ]}
    }
  )
```

### `layoutRegions`

An array of regions to consider as match level **Layout** when comparing the checkpoint screenshot with the baseline screenshot. For example:

```js
storiesOf('Components with layout region', module)
  .add(
    'Some story',
    () =>
      <div>
        <span>I am visually perfect!</span>
        <span className="layout-region">this should be compared with layout match level</span>
      </div>,
    {eyes: {
      layoutRegions: [
        {selector: '.layout-region'}, // by css selector
        {left: 10, top: 20, width: 200, height: 80} // by absolute coordinates
      ]}
    }
  )
```

### `contentRegions`

An array of regions to consider as match level **Content** when comparing the checkpoint screenshot with the baseline screenshot. For example:

```js
storiesOf('Components with content region', module)
  .add(
    'Some story',
    () =>
      <div>
        <span>I am visually perfect!</span>
        <span className="content-region">this should be compared with content match level</span>
      </div>,
    {eyes: {
      contentRegions: [
        {selector: '.content-region'}, // by css selector
        {left: 10, top: 20, width: 200, height: 80} // by absolute coordinates
      ]}
    }
  )
```

### `strictRegions`

An array of regions to consider as match level **Strict** when comparing the checkpoint screenshot with the baseline screenshot. For example:

```js
storiesOf('Components with strict region', module)
  .add(
    'Some story',
    () =>
      <div>
        <span>I am visually perfect!</span>
        <span className="strict-region">this should be compared with strict match level</span>
      </div>,
    {eyes: {
      strictRegions: [
        {selector: '.strict-region'}, // by css selector
        {left: 10, top: 20, width: 200, height: 80} // by absolute coordinates
      ]}
    }
  )
```

### `accessibilityRegions`

A single or an array of regions for accessibility checking. For example:

```js
storiesOf('Components with accessibility regions', module)
  .add(
    'Some story',
    () =>
      <div>
        <span>I am visually perfect!</span>
        <span className="check-me">this should be tested for accessibility</span>
      </div>,
    {eyes: {
      accessibilityRegions: [
        {accessibilityType: 'RegularText', selector: '.check-me'}, // by css selector
        {accessibilityType: 'RegularText', left: 10, top: 20, width: 200, height: 80} // by absolute coordinates
      ]
    }}
  )
});
```

Possible accessibilityType values are: `IgnoreContrast`,`RegularText`,`LargeText`,`BoldText` and `GraphicalObject`.

### `accessibilityValidation`

The level and guidelines version that should be used when validation accesibility regions. For example:

```js
storiesOf('Components with accessibility regions', module)
  .add(
    'Some story',
    () => <div>
      <span>I am visually perfect!<span>
      <span className="check-me">this should be tested for accessibility</span>
    {eyes: {
      accessibilityValidation: {
        level: 'AA',
        guidelinesVersion: 'WCAG_2_0'
      }
    }}
  )
});
```

Possible values for `level` are: `AA` and `AAA`.
Possible values for `guidelinesVersion` are: `WCAG_2_0` and `WCAG_2_1`.

### Parameters that cannot be set as an [Advanced configuration](#advanced-configuration)

### `runBefore`

An asynchronous function that will be evaluated before the story's screenshot is taken. This is the place to perform any interaction with the story using DOM API's.

For performing various DOM interactions, we recommend checking out [dom-testing-library](https://github.com/testing-library/dom-testing-library). It provides utilities to interact, query and wait for conditions on the DOM.

For example, a component that renders a popover could trigger the opening of the popover and wait for content to appear:

```js
// these are utilities from dom-testing-library
import {wait, within, fireEvent} from '@testing-library/dom';

// <Popover /> is a component in your UI library.
// The assumption in this example is that it is opened by an element with the text 'Open',
// and then that element's text changes to 'Close':
storiesOf('UI components', module)
  .add('Popover', () => <Popover />, {
    eyes: {
      runBefore({rootEl, story}) {
        fireEvent.click(within(rootEl).getByText('Open'))
        return wait(() => within(rootEl).getByText('Close'))
      }
    },
  })
```

### `scriptHooks`

A set of scripts to be run by the browser during the rendering. It is intended to be used as a means to alter the page's state and structure at the time of rendering. 
An object with the following properties:

  #### beforeCaptureScreenshot 
  A script that runs after the page is loaded but before taking the screenshot. For example:


  ```js
  storiesOf('Components', module)
    .add(
      'Some story',
      () =>
        <div>Some Story</div>, { 
          eyes: { 
            scriptHooks: {
              beforeCaptureScreenshot: "document.body.style.backgroundColor = 'gold'"
            }
          }
        })
  ```

## Running Eyes-Storybook in Docker

When running the SDK in docker, there might be issues related to properly launching the internal chrome browser via puppeteer. If you seem to have such issues, set `runInDocker: true` in your config file. This will pass the internal chrome browser special arguments, as described [here](https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#tips).

If you still have issues, you might need to follow the instructions to use your own chromium browser in the docker container, and point that to the SDK's puppeteer. Follow the instructions [here](https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#running-puppeteer-in-docker) and set the `executablePath` via the `puppeteerOptions`. For example, `applitools.config.js`:

```js
module.exports = {
  puppeteerOptions: {
    executablePath: '/usr/bin/chromium-browser'
  }
}
```

## Dealing with dynamic data

Sometimes components render dynamic data, such as dates, or random data. This creates a challenge when testing these components. The way we recommend to address this issue is to insert code into your storybook which normalizes the data (uses fixed dates, or a specific seed), when it is being run in an automated environment.

Eyes storybook makes it possible for components to be aware that they are being tested. There will be a specific query parameter on the URL of the story's iframe: `?eyes-storybook=true`.

This way it's possible to write a story like this:

```js
const isBeingTested =
    new URL(window.location).searchParams.get('eyes-storybook')

const SOME_FIXED_DATE = 354060000000

const date = new Date(isBeingTested ? SOME_FIXED_DATE : undefined)

storiesOf('Some kind', module).add('Date', () => <div>{date}</div>)
```

## Troubleshooting

If issues occur, the `saveDebugData` config property can be set to true in order to save helpful information. The information will be saved under a folder named `.applitools` in the current working directory. This could be then used for getting support on your issue.
<br/>You can also use [DEBUG=eyes*](https://github.com/visionmedia/debug) for debugging.
