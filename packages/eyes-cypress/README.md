# Eyes-Cypress

Applitools Eyes SDK for [Cypress](https://www.cypress.io/).

## Installation

### Install npm package

Install Eyes-Cypress as a local dev dependency in your tested project:

```bash
npm i -D @applitools/eyes-cypress
```

### Configure plugin and commands

#### Automatic configuration

Run the following command in your terminal:

```bash
npx eyes-setup
```

The above command will add the necessary imports to your cypress `pluginsFile` and `supportFile` (and create the TypeScript definitions file), as described in the manual configuration below.

#### Manual configuration

##### 1. Configure Eyes-Cypress plugin

Eyes-Cypress acts as a [Cypress plugin](https://docs.cypress.io/guides/tooling/plugins-guide.html), so it should be configured as such.
Unfortunately there's no easy way to do this automatically, so you need to manually add the following code to your `pluginsFile`:

**Important**: add this code **after** the definition of `module.exports`:

```js
require('@applitools/eyes-cypress')(module)
```

Normally, this is `cypress/plugins/index.js`. You can read more about it in Cypress' docs [here](https://docs.cypress.io/guides/references/configuration.html#Folders-Files).

##### 2. Configure custom commands

Eyes-Cypress exposes new commands to your tests. This means that more methods will be available on the `cy` object. To enable this, it's required to configure these custom commands.
As with the plugin, there's no automatic way to configure this in cypress, so you need to manually add the following code to your `supportFile`:

```js
import '@applitools/eyes-cypress/commands'
```

Normally, this is `cypress/support/index.js`. You can read more about it in Cypress' docs [here](https://docs.cypress.io/guides/references/configuration.html#Folders-Files).

##### 3. (Optional) TypeScript configuration

Eyes-Cypress ships with official type declarations for TypeScript. This allows you to add eyes commands to your TypeScript tests.

Add this file to your project with either: 
1. Adding the path to your [tsconfig](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) file:
    ```
    {
      "files": ["./node_modules/@applitools/eyes-cypress/eyes-index.d.ts"],
      ...
    }
    ```
  2. Copying the file to to your [cypress/support/](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests.html#Folder-Structure) dir:
      ```
      cp node_modules/@applitools/eyes-cypress/eyes-index.d.ts ./cypress/support/    
      ```


### Applitools API key

In order to authenticate via the Applitools server, you need to supply the Eyes-Cypress SDK with the API key you got from Applitools. Read more about how to obtain the API key [here](https://applitools.com/docs/topics/overview/obtain-api-key.html).

To do this, set the environment variable `APPLITOOLS_API_KEY` to the API key before running your tests.
For example, on Linux/Mac:

```bash
export APPLITOOLS_API_KEY=<your_key>
npx cypress open
```

And on Windows:

```bash
set APPLITOOLS_API_KEY=<your_key>
npx cypress open
```

It's also possible to specify the API key in the `applitools.config.js` file. The property name is `apiKey`. For example:

```js
module.exports = {
  apiKey: 'YOUR_API_KEY',
  ...
}
```

See the [Advanced configuration](#method-3-the-applitoolsconfigjs-file) section below for more information on using the config file.

## Usage

After completing the configuration (either automatic or manual) and defining the API key, you will be able to use commands from Eyes-Cypress in your cypress tests to take screenshots and use Applitools Eyes to manage them:

### Example

```js
describe('Hello world', () => {
  it('works', () => {
    cy.visit('https://applitools.com/helloworld');
    cy.eyesOpen({
      appName: 'Hello World!',
      testName: 'My first JavaScript test!',
      browser: { width: 800, height: 600 },
    });
    cy.eyesCheckWindow('Main Page');
    cy.get('button').click();
    cy.eyesCheckWindow('Click!');
    cy.eyesClose();
  });
});
```

### Best practice for using the SDK

Every call to `cy.eyesOpen` and `cy.eyesClose` defines a test in Applitools Eyes, and all the calls to `cy.eyesCheckWindow` between them are called "steps". In order to get a test structure in Applitools that corresponds to the test structure in Cypress, it's best to open/close tests in every `it` call. This can be done via the `beforeEach` and `afterEach` functions that Cypress provides (via the mocha test runner).

After adjusting the example above, this becomes:

```js
describe('Hello world', () => {
  beforeEach(() => {
    cy.eyesOpen({
      appName: 'Hello World!',
      browser: { width: 800, height: 600 },
    });
  });

  afterEach(() => {
    cy.eyesClose();
  });

  it('My first JavaScript test!', () => {
    cy.visit('https://applitools.com/helloworld');
    cy.eyesCheckWindow('Main Page');
    cy.get('button').click();
    cy.eyesCheckWindow('Click!');
  });
});
```

Applitools will take screenshots and perform the visual comparisons in the background. Performance of the tests will not be affected during the test run, but there will be a small phase at the end of the test run that waits for visual tests to end.

**Note**: In Cypress interactive mode (`cypress open`) there is a bug that exceptions in root level `after` statements don't appear in the UI. They still appear in the browser's console, and considered failures in `cypress run`. See [this issue](https://github.com/cypress-io/cypress/issues/2296) for more information and tracking.

<br/>

### Index
- [Commands](#Commands)
  - [Open](#Open)
  - [CheckWindow](#Check-window)
    - [tag](#tag)
    - [target](#target)
    - [fully](#fully)
    - [selector](#selector)
    - [region](#region)
    - [ignore](#ignore)
    - [floating](#floating)
    - [layout](#layout)
    - [strict](#strict)
    - [content](#content)
    - [accessibility](#accessibility)
    - [scriptHooks](#scriptHooks)
    - [sendDom](#sendDom)
  - [Close](#Close)
- [Concurrency](#Concurrency)
- [Advanced configuration](#Advanced-configuration)
  - [Scoped configuration](#Here-are-the-available-configuration-properties)
  - [Global configuration](#global-configuration-properties)
  - [Examples](#Method-1-Arguments-for-cyeyesOpen)
    - [Arguments for `cy.eyesOpen`](#Method-1-Arguments-for-cyeyesOpen)
    - [Environment variables](#Method-2-Environment-variables)
    - [The `applitools.config.js` file](#Method-3-The-applitoolsconfigjs-file)
- [Configuring the browser](#Configuring-the-browser)
  - [Device emulation](#Device-emulation)
- [Tests timeout](#Setting-a-timeout)
- [IDE Code Completion](#Intelligent-Code-Completion)
  - [Triple slash directives](#1-Triple-slash-directives)
  - [Reference type declarations via `tsconfig`](#2-Reference-type-declarations-via-tsconfig)
- [Troubleshooting](#Troubleshooting)

<br/><hr/><br/>

### Commands

In addition to the built-in commands provided by Cypress, like `cy.visit` and `cy.get`, Eyes-Cypress defines new custom commands, which enable the visual testing with Applitools Eyes. These commands are:

#### Open

Create an Applitools test.
This will start a session with the Applitools server.

```js
cy.eyesOpen({
  appName: '',
  testName: ''
});
```

It's possible to pass a config object to `eyesOpen` with all the possible configuration properties. Read the [Advanced configuration](#advanced-configuration) section for a detailed description.

#### Check window

Generate a screenshot of the current page and add it to the Applitools Test.

```js
cy.eyesCheckWindow('Login screen')

OR

cy.eyesCheckWindow({ tag: 'Login screen', target: 'your target' })
```

##### Arguments to `cy.eyesCheckWindow`

##### `tag`

(optional): A logical name for this check.

##### `target`

(optional): Possible values are:
<br/> 1. `window` 
  This is the default value. If set then the captured image is of the entire page or the viewport, use [`fully`](#fully) for specifying what `window` mode to use.
<br/>2. `region` 
  If set then the captured image is of the parts of the page, use this parameter with [`region`](#region) or [`selector`](#selector) for specifying the areas to captured.

##### `fully`

(optional) In case [`target`](#target) is `window`, if `fully` is `true` (default) then the snapshot is of the entire page, if `fully` is `false` then snapshot is of the viewport.

```js
  // Capture viewport only
  cy.eyesCheckWindow({
    target: 'window',
    fully: false,
  });
  ```

##### `selector`

(optional): In case [`target`](#target) is `region`, this should be the actual css or xpath selector to an element, and the screenshot would be the content of that element. For example:

  ```js
  // Using a css selector
  cy.eyesCheckWindow({
    target: 'region',
    selector: {
      type: 'css',
      selector: '.my-element' // or '//button'
    }
  });
  
  // Using an xpath selector
  cy.eyesCheckWindow({
    target: 'region',
    selector: {
      type: 'xpath',
      selector: '//button[1]'
    }
  });
  
  // The shorthand string version defaults to css selectors
  cy.eyesCheckWindow({
    target: 'region',
    selector: '.my-element'
  });
  ```

##### `region`

(optional): In case [`target`](#target) is `region`, this should be an object describing the region's coordinates for capturing the image. For example:

  ```js
  cy.eyesCheckWindow({
    target: 'region',
    region: {top: 100, left: 0, width: 1000, height: 200}
  });
  ```

##### `ignore`

(optional): A single or an array of regions to ignore when checking for visual differences. For example:

  ```js
  cy.eyesCheckWindow({
    ignore: [
      {top: 100, left: 0, width: 1000, height: 100},
      {selector: '.some-div-to-ignore'}
    ]
  });
  ```

##### `floating`

(optional): A single or an array of floating regions to ignore when checking for visual differences. More information about floating regions can be found in Applitools docs [here](https://help.applitools.com/hc/en-us/articles/360006915292-Testing-of-floating-UI-elements). For example:

```js
cy.eyesCheckWindow({
  floating: [
    {top: 100, left: 0, width: 1000, height: 100, maxUpOffset: 20, maxDownOffset: 20, maxLeftOffset: 20, maxRightOffset: 20},
    {selector: '.some-div-to-float', maxUpOffset: 20, maxDownOffset: 20, maxLeftOffset: 20, maxRightOffset: 20}
  ]
});
```

##### `layout`

(optional): A single or an array of regions to match as [layout level.](https://help.applitools.com/hc/en-us/articles/360007188591-Match-Levels) For example:

  ```js
  cy.eyesCheckWindow({
    layout: [
      {top: 100, left: 0, width: 1000, height: 100},
      {selector: '.some-div-to-test-as-layout'}
    ]
  });
  ```

##### `strict`

(optional): A single or an array of regions to match as [strict level.](https://help.applitools.com/hc/en-us/articles/360007188591-Match-Levels) For example:

  ```js
  cy.eyesCheckWindow({
    strict: [
      {top: 100, left: 0, width: 1000, height: 100},
      {selector: '.some-div-to-test-as-strict'}
    ]
  });
  ```

##### `content`

(optional): A single or an array of regions to match as [content level.](https://help.applitools.com/hc/en-us/articles/360007188591-Match-Levels) For example:

  ```js
  cy.eyesCheckWindow({
    content: [
      {top: 100, left: 0, width: 1000, height: 100},
      {selector: '.some-div-to-test-as-content'}
    ]
  });
  ```

##### `accessibility`

(optional): A single or an array of regions to perform accessibility checks, For example:

  ```js
  cy.eyesCheckWindow({
    accessibility: [
      {accessibilityType: 'RegularText', selector: '.some-div'},
      {accessibilityType: 'LargeText', selector: '//*[@id="main"]/h1', type: 'xpath'},
      {accessibilityType: 'BoldText', top: 100, left: 0, width: 1000, height: 100},
    ]
  });
  ```

  Possible accessibilityType values are: `IgnoreContrast`,`RegularText`,`LargeText`,`BoldText` and `GraphicalObject`.

##### `scriptHooks`

(optional): A set of scripts to be run by the browser during the rendering. It is intended to be used as a means to alter the page's state and structure at the time of rendering.
An object with the following properties:
  * ##### `beforeCaptureScreenshot`: a script that runs after the page is loaded but before taking the screenshot. For example:
      
      ```js
      cy.eyesCheckWindow({
        scriptHooks: {
          beforeCaptureScreenshot: "document.body.style.backgroundColor = 'gold'"
        }
      })
      ```

##### `sendDom`

(optional): A flag to specify whether a capture of DOM and CSS should be taken when rendering the screenshot. The default value is true. This should only be modified to troubleshoot unexpected behavior, and not for normal production use.

```js
cy.eyesCheckWindow({sendDom: false})
```

##### `useDom`

<!-- TODO add explanation -->

```js
cy.eyesCheckWindow({useDom: true})
```

##### `enablePatterns`

<!-- TODO add explanation -->

```js
cy.eyesCheckWindow({enablePatterns: true})
```

##### `matchLevel`

<!-- TODO add explanation -->

```js
cy.eyesCheckWindow({matchLevel: 'Layout'})
```

The different matchLevels are specified here:  https://github.com/applitools/eyes.sdk.javascript1/blob/master/packages/eyes-sdk-core/lib/config/MatchLevel.js

<!-- TODO uncomment when polyfillAdoptedStyleSheets feature is released

##### `visualGridOptions`

An object that specifies options to configure renderings on the Ultrafast grid.
Available options:

* `polyfillAdoptedStyleSheets`: Creates a polyfill when the DOM contains `adoptedStyleSheets` ([reference](https://developers.google.com/web/updates/2019/02/constructable-stylesheets)) for browsers that don't support it (It is currently supported only in Chrome). When `true`, those browsers will successfully include the css as inline style tags. When `false`, the css will not be included. When `undefined`, an error will be thrown with a message stating that this feature is not supported in the desired browser. 

```js
cy.eyesCheckWindow({
  visualGridOptions: {
    polyfillAdoptedStyleSheets: true
  }
})
```
-->

#### Close

Close the applitools test and check that all screenshots are valid.

It is important to call this at the end of each test, symmetrically to `eyesOpen`(or in `afterEach()`, see [Best practice for using the SDK](#best-practice-for-using-the-sdk)).

Close receives no arguments.

```js
cy.eyesClose();
```

## Concurrency

The default level of concurrency for free accounts is `5`. This means that only up to 5 visual tests can run in parallel, and therefore the execution might be slow.
If your account does support a higher level of concurrency, it's possible to pass a different value by specifying it in the property `testConcurrency` in the applitools.config.js file (see [Advanced configuration](#advanced-configuration) section below).

If you are interested in speeding up your visual tests, contact sdr@applitools.com to get a trial account and faster tests with more concurrency.

## Advanced configuration

There are 3 ways to specify test configuration:
1) Arguments to `cy.eyesOpen()`
2) Environment variables
3) The `applitools.config.js` file

The list above is also the order of precedence, which means that if you pass a property to `cy.eyesOpen` it will override the environment variable, and the environment variable will override the value defined in the `applitools.config.js` file.

### Here are the available configuration properties:

| Property name             | Default value               | Description   |
| -------------             |:-------------               |:-----------   |
| `testName`                | The value of Cypress's test title | Test name. If this is not specified, the test name will be the title of the `it` block where the test is running.    |
| `browser`                 | { width: 800, height: 600, name: 'chrome' } | The size and browser of the generated screenshots. This doesn't need to be the same as the browser that Cypress is running. It could be a different size and also a different browser. For more info and possible values, see the [browser section below](#configuring-the-browser).|
| `batchId`                 | random                      | Provides ability to group tests into batches. Read more about batches [here](https://applitools.com/docs/topics/working-with-test-batches/how-to-group-tests-into-batches.html). |
| `batchName`               | The name of the first test in the batch                   | Provides a name to the batch (for display purpose only). |
| `batchSequenceName`               | undefined | Name for managing batch statistics. |
| `baselineEnvName`         | undefined                   | The name of the environment of the baseline. |
| `envName`                 | undefined                   | A name for the environment in which the application under test is running. |
| `ignoreCaret`             | false                       | Whether to ignore or the blinking caret or not when comparing images. |
| `matchLevel`              | Strict                      | The method to use when comparing two screenshots, which expresses the extent to which the two images are expected to match. Possible values are `Strict`, `Exact`, `Layout` and `Content`. Read more about match levels [here](http://support.applitools.com/customer/portal/articles/2088359). |
| `baselineBranchName`      | undefined                   | The name of the baseline branch. |
| `parentBranchName`        | undefined                   | Sets the branch under which new branches are created. |
| `saveFailedTests`         | false                       | Set whether or not failed tests are saved by default. |
| `saveNewTests`            | false                       | Set whether or not new tests are saved by default. |
| `properties`              | undefined                   | Custom properties for the eyes test. The format is an array of objects with name/value properties. For example: `[{name: 'My prop', value:'My value'}]`. |
| `ignoreDisplacements`     | false                       | Sets whether Test Manager should intially display mismatches for image features that have only been displaced, as opposed to real mismatches. |
| `compareWithParentBranch` | false                       |  |
| `ignoreBaseline`          | false                       |  |
| `notifyOnCompletion`  | false | If `true` batch completion notifications are sent. |
| `accessibilityValidation` | undefined | An object that specifies the accessibility level and guidelines version to use for the screenshots. Possible values for **level** are `None`, `AA` and `AAA`, and possible values for **guidelinesVersion** are `WCAG_2_0` and `WCAG_2_1`. For example: `{level: 'AA', guidelinesVersion: 'WCAG_2_0'}`|
| `visualGridOptions` | undefined | An object that specifies options to configure renderings on the Ultrafast grid. See more information [here](#visualgridoptions) |

### Global configuration properties:

The following configuration properties cannot be defined using the first method of passing them to `cy.eyesOpen`. They should be defined either in the `applitools.config.js` file or as environment variables.

| Property name             | Default value               | Description   |
| -------------             |:-------------               |:-----------   |
| `apiKey`                  | undefined                   | The API key used for working with the Applitools Eyes server. See more info in the [Applitools API key](#applitools-api-key) section above |
| `showLogs`                | false                       | Whether or not you want to see logs of the Eyes-Cypress plugin. Logs are written to the same output of the Cypress process. |
| `serverUrl`               | Default Eyes server URL     | The URL of Eyes server |
| `proxy`                   | undefined                   | Sets the proxy settings to be used in network requests to Eyes server. This can be either a string to the proxy URI, or an object containing the URI, username and password.<br/><br/>For example:<br/>`{url: 'https://myproxy.com:443', username: 'my_user', password: 'my_password', isHttpOnly: false}`<br/>or:<br/>`"https://username:password@myproxy.com:443"`|
| `isDisabled`              | false                       | If true, all calls to Eyes-Cypress commands will be silently ignored. |
| `failCypressOnDiff`       | true                        | If true, then the Cypress test fails if an eyes visual test fails. If false and an eyes test fails, then the Cypress test does not fail. 
| `tapDirPath`              | undefined                   | Directory path of a results file. If set, then a [TAP](https://en.wikipedia.org/wiki/Test_Anything_Protocol#Specification) file is created in this directory, the tap file name is created with the name [ISO-DATE](https://en.wikipedia.org/wiki/ISO_8601)\-eyes.tap and contains the Eyes test results (Note that because of a current Cypress [limitation](https://github.com/cypress-io/cypress-documentation/issues/818) the results are scoped per spec file, this means that the results file is created once for each spec file).|
| `testConcurrency`             | 5                          | The maximum number of tests that can run concurrently. The default value is the allowed amount for free accounts. For paid accounts, set this number to the quota set for your account. |
|`dontCloseBatches`| false | If true, batches are not closed for  [notifyOnCompletion](#advanced-configuration).|
|`disableBrowserFetching`| false | If true, page resources for rendering on the UFG will be fetched from outside of the browser.|
|`enablePatterns`| false | |
|`useDom`| false | |


### Method 1: Arguments for `cy.eyesOpen`

Pass a config object as the only argument. For example:

```js
cy.eyesOpen({
  appName: 'My app',
  batchName: 'My batch',
  ...
  // all other configuration variables apply
})
```

### Method 2: Environment variables

The name of the corresponding environment variable is in uppercase, with the `APPLITOOLS_` prefix, and separating underscores instead of camel case:

```js
APPLITOOLS_APP_NAME
APPLITOOLS_SHOW_LOGS
APPLITOOLS_CONCURRENCY
APPLITOOLS_SAVE_DEBUG_DATA
APPLITOOLS_BATCH_ID
APPLITOOLS_BATCH_NAME
APPLITOOLS_BATCH_SEQUENCE_NAME
APPLITOOLS_BASELINE_ENV_NAME
APPLITOOLS_ENV_NAME
APPLITOOLS_IGNORE_CARET
APPLITOOLS_IS_DISABLED
APPLITOOLS_MATCH_LEVEL
APPLITOOLS_BRANCH_NAME
APPLITOOLS_BASELINE_BRANCH_NAME
APPLITOOLS_PARENT_BRANCH_NAME
APPLITOOLS_SAVE_FAILED_TESTS
APPLITOOLS_SAVE_NEW_TESTS
APPLITOOLS_COMPARE_WITH_PARENT_BRANCH
APPLITOOLS_IGNORE_BASELINE
APPLITOOLS_SERVER_URL
APPLITOOLS_PROXY
APPLITOOLS_NOTIFY_ON_COMPLETION
```

### Method 3: The `applitools.config.js` file

It's possible to have a file called `applitools.config.js` at the same folder location as `cypress.json`. In this file specify the desired configuration, in a valid JSON format. For example:

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

Eyes-Cypress will take a screenshot of the page in the requested browser, the browser can be set in the `applitools.config.js` or by passing it to `cy.eyesOpen`.

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

It's also possible to send an array of browsers, for example:

```js
cy.eyesOpen({
  ...
  browser: [
    {width: 800, height: 600, name: 'firefox'},
    {width: 1024, height: 768, name: 'chrome'},
    {width: 1024, height: 768, name: 'ie11'}
  ]
}
```

**Note**: If only a single browser is set, then Eyes-Cypress changes the Cypress application viewport to that viewport size.

### Device emulation

To enable chrome's device emulation, it's possible to send a device name and screen orientation, for example:

```js
cy.eyesOpen({
  ...
  browser: {
    deviceName: 'iPhone X',
    screenOrientation: 'landscape',
    name: 'chrome' // optional, just to make it explicit this is browser emulation and not a real device. Only chrome is supported for device emulation.
  }
}
```

Possible values for screen orientation are `landscape` and `portrait`, and if no value is specified, the default is `portrait`.

The list of device names is available at https://github.com/applitools/eyes.sdk.javascript1/blob/master/packages/eyes-sdk-core/lib/config/DeviceName.js

In addition, it's possible to use chrome's device emulation with custom viewport sizes, pixel density and mobile mode, by passing `deviceScaleFactor` and `mobile` in addition to `width` and `height`. For example:

```js
cy.eyesOpen({
  ...
  browser: {
    width: 800,
    height: 600,
    deviceScaleFactor: 3,
    mobile: true,
    name: 'chrome' // optional, just to make it explicit this is browser emulation and not a real device. Only chrome is supported for device emulation.
  }
}
```

### iOS device

```js
cy.eyesOpen({
  // ...
  browser: {
    iosDeviceInfo: {
      deviceName: 'iPhone XR',
      screenOrientation: 'landscape', // optional, default: 'portrait'
      iosVersion: 'latest' // optional, default: undefined (i.e. the default is determined by the Ultrafast grid)
    },
  }
})
```

The list of devices is available at https://github.com/applitools/eyes.sdk.javascript1/blob/master/packages/eyes-sdk-core/lib/config/IosDeviceName.js

Possible values for `iosVersion` are:

- `'latest'` - the latest iOS version that's supported by the UFG
- `'latest-1'` - one version prior to the latest version
- `undefined` - the UFG's default

## Setting a timeout

At the end of the test run, Eyes-Cypress will wait for the results of all visual tests. There's a default timeout of 2 minutes between the end of the test run and the end of the visual tests (although it should not take so long normally!).

It's possible to change that default by setting the configuration variable `eyesTimeout`, in one of the various ways to configure Cypress, as described in the [Cypress plugins documentation](https://docs.cypress.io/guides/references/configuration.html).

## Intelligent Code Completion

#### There are two ways you can add Eyes-Cypress intelliSense to your tests: 

### 1. Triple slash directives

The simplest way to see IntelliSense when typing an Eyes-Cypress command is to add a [triple-slash](http://www.typescriptlang.org/docs/handbook/triple-slash-directives.html) directive to the head of your JavaScript or TypeScript testing file. This will turn the IntelliSense on a per file basis:
```
  /// <reference types="@applitools/eyes-cypress" />
```

### 2. Reference type declarations via `tsconfig`

Adding a [tsconfig.json](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html) inside your cypress folder containing the following configuration should get intelligent code completion working on all your test files:
```
{
  "compilerOptions": {
    "allowJs": true,
    "baseUrl": "../node_modules",
    "types": [
      "@applitools/eyes-cypress"
    ]
  },
  "include": [
    "**/*.*"
  ]
}
```
