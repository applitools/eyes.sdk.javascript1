# visual-grid-client

A library that drives the visual grid with dom snapshot rendering.

## Installing

```sh
npm install @applitools/visual-grid-client
```

## Using the package

```js
const {makeVisualGridClient} = require('@applitools/visual-grid-client')
```

See below for the full API.

## API

### makeVisualGridClient

* To create a visualGridClient, call `makeVisualGridClient`:

```js
const {makeVisualGridClient} = require('@applitools/visual-grid-client')
const visualGridClient = makeVisualGridClient()
```

The visualGridClient, returned by `makeVisualGridClient`, is an object with the following functions:

* `openEyes(configOverride)`: to start a set of tests, where each step is a set of renderings according to the browser
  stuff in the configuration.
  This function will return an object with functions (see below) allowing you to create renderings (or "steps" in
  Applitools parlance) for the test.

* `testWindow({openParams, checkParams, throwEx})`

* `closeBatch()`


### openEyes

Async function `openEyes` will create a test. Actually, it will create a series of tests, one for each browser configuration
defined in the `browser` property of the configuration.

* `openEyes` accepts a configuration object that will override the default configuration found by
  `makeVisualGridClient`, per this test.

* Accepts:
  * proxy - string or object, examples: 

    ```https://username:password@myproxy```

    ```{url: 'https://myproxy', username: 'my_user', password: 'my_password', isHttpOnly: false```
  * more params TBD..

* Returns a promise to an object with the following functions:


  * `checkWindow(...)`: creates a "step" that checks the window according to the  baseline. Note that this
    function will not fail, and you need to `await` the promises returned from `close()`  to wait for the failure or success
    of a batch of steps in the test.
  * `close()`: async closes the test (or series of tests) created by `openEyes`.
  * `abort()`: if you want to abort this test (or series of tests). Async.

### `checkWindow(...)`

`checkWindow` receives an object with the following parameters:

* `tag`: the name of the step, as seen in Applitools Eyes.
* `url`: the URL appearing in the address bar of the browser. All relative URLs in the CDT will be relative to it.
* `snapshots`: either single dom snapshot or an array corresponding to the `browser` array sent in `openEyes`. The DOM snapshot can have these properties:
  * `cdt`: the HTML and set and resources, in the `x-applitools-html/cdt` format (see below). you can use `domNodesToCdt` to create a CDT from a `document`.
  * `resourceUrls`: By default, an empty array. Additional resource URLs not found in the CDT.
  * `resourceContents`: a map of all resource values (buffers). The keys are URLs (relative to the `url` property).
  * `frames`: same structure of `snapshot`, recursively.
* `target`: the target of the rendering. Can be one of `window`, `region`
* `fully`: set when `target` is `window`, if `fully` is `true` then snapshot is full page, if `fully` is `false` then snapshot is viewport.
* `selector`: if the `target` is `region`, this is the selector we are targeting.
* `region`: if the `target` is `region`, this is the region we are targeting.
  This is an object with `x`, `y`, `width`, `height` properties.
* `ignore`: TBD
* `floating`: TBD
* `accessibility`: TBD
* `strict`: TBD
* `layout`: TBD
* `content`: TBD
* `sendDom`: TBD
* `scriptHooks`: a set of scripts to be run by the browser during the rendering.
   An object with the following properties:
  * `beforeCaptureScreenshot`: a script that runs after the page is loaded but before taking the screenshot.
  The value  is an object with the following properties:
  * `url`: yes, again.
  * `type`: the content type of the resource.
  * `value`: a `Buffer` of the resource content.
* `matchLevel`: The method to use when comparing two screenshots, which expresses the extent to which the two images are expected to match.
* `accessibilitySettings`: The accessibility to use for the screenshots. Possible values are 'AA' and 'AAA'. // TODO
* `batchNotify`.

### close()

`close` receives `throwEx` parameters, and returns a promise.

* If throwEx = true (default) :
    * If all tests defined in the `openEyes` pass then the promise is **resolved** with Array\<TestResults\>.
    * If there are differences found in some tests defined in `openEyes` then the promise is **rejected** with Array\<TestResults\>.
    * If there are any unexpected errors like a network error then the promise is **rejected** with Array\<Error|TestResults\>.
* If throwEx = false :
    * The promise is always **resolved** with Array\<TestResults|Error\>.

### The CDT format

```js
{
  domNodes: [
    {
      nodeType: number, // like in the DOM Standard
      nodeName: ‘...’ , // for elements and DocumentType
      nodeValue: ‘...’, // for text nodes
      attributes: [{name, value}, ...],
      childNodeIndexes: [index, index, ...]
    },
    //...
  ],
  resources: [
    {
      hashFormat: 'sha256', // currently the only hash format allowed
      hash: '....', // the hash of the resource.
      contentType: '...', // the mime type of the resource.
    },
    //...
  ]
}

```

### domNodesToCdt

Accepts a document object conforming to the DOM specification (browser document is fine, as is the JSDOM document).
Returns a cdt, ready to be passed to `checkWindow`

## Configuration

* See [Eyes Cypress configuration](https://github.com/applitools/eyes.cypress#advanced-configuration)
  for a list of properties in the configuration and to understand how the visual grid client
  reads the configuration.

## Logging

???

## Example

Example [Mocha](https://www.npmjs.com/package/mocha) test that uses the visual grid client:

```js
const path = require('path')
const fs = require('fs')
const {makeVisualGridClient} = require('@applitools/visual-grid-client')
const {getProcessPageAndSerialize} = require('@applitools/dom-snapshot')
const puppeteer = require('puppeteer')

describe('visual-grid-client test', function() {
  let visualGridClient
  let closePromises = []
  let processPageAndSerialize
  let browser
  let page

  before(async () => {
    browser = await puppeteer.launch()
    page = await browser.newPage()

    visualGridClient = makeVisualGridClient({
      showLogs: true,
    })

    processPageAndSerialize = `(${await getProcessPageAndSerializeScript()})()`
  })

  after(async () => {
    await browser.close()
    const results = await Promise.all(closePromises)
    await visualGridClient.closeBatch() // after all sessions ended (session = open checkWindow close)
    return results;
  })

  let checkWindow, close
  beforeEach(async () => {
    ;({checkWindow, close} = await visualGridClient.openEyes({
      appName: 'visual grid client with a cat',
      testName: 'visual-grid-client test',
    }))
  })
  afterEach(() => closePromises.push(close()))

  it('should work', async () => {
    await page.goto('index.html')
    const {cdt, url, resourceUrls, blobs, frames} = await page.evaluate(processPageAndSerialize)
    const resourceContents = blobs.map(({url, type, value}) => ({
      url,
      type,
      value: Buffer.from(value, 'base64'),
    }));
    checkWindow({
      tag: 'first test',
      target: 'region',
      fully: false,
      url,
      snapshots: {
        cdt,
        resourceUrls,
        resourceContents,
        frames,
      }
    })
  })
})
```

## Example testWindow()
```js
const {makeVisualGridClient} = require('@applitools/visual-grid-client')
const {getProcessPageAndSerialize} = require('@applitools/dom-snapshot')
const puppeteer = require('puppeteer')

describe('visual-grid-client test', function() {
  let visualGridClient
  let closePromises = []
  let processPageAndSerialize
  let browser
  let page

  before(async () => {
    browser = await puppeteer.launch()
    page = await browser.newPage()

    visualGridClient = makeVisualGridClient({
      showLogs: true,
    })

    processPageAndSerialize = `(${await getProcessPageAndSerializeScript()})()`
  })

  after(async () => {
    await browser.close()
    const results = await Promise.all(closePromises)
  })

  it('should work', async () => {
    await page.goto('index.html')
    const {cdt, url, resourceUrls, blobs, frames} = await page.evaluate(processPageAndSerialize)
    const resourceContents = blobs.map(({url, type, value}) => ({
      url,
      type,
      value: Buffer.from(value, 'base64'),
    }));

    const checkParams = {
      tag: 'first test',
      target: 'region',
      fully: false,
      url,
      snapshots: {
        cdt,
        resourceUrls,
        resourceContents,
        frames,
      }
    };

    const openParams = {
      appName: 'visual grid client with a cat',
      testName: 'visual-grid-client test',
    }

    const results = await testWindow({checkParams, openParams, throwEx: false})
  })
})
```

## Contributing

### Generating a changelog

The best way is to run `npm run changelog`. The prerequisite for that is to have [jq](https://stedolan.github.io/jq/) installed, and also define the following in git configuration:

```sh
git config changelog.format "* %s - %an [[%h](https://github.com/applitools/visual-grid-client/commit/%H)]"
```
