# dom-capture

Script for getting a representation of the DOM in JSON format with information on position and computed style for each element.

## Installing

```sh
npm install @applitools/dom-capture
```

## Usage

### From Node.js

This package exports `getCaptureDomScript` and `getCaptureDomAndPollScript` that can be used when working with puppeteer, CDP or Selenium in Node.js.

This async function returns a string with a function that can be sent to the browser for evaluation. It doesn't immediately invoke the function, so the sender should wrap it as an IIFE. For example:

```js
  const {getCaptureDomScript} = require('@applitools/dom-capture');
  const captureDomScript = await getCaptureDomScript();
  const returnValue = await page.evaluate(`(${captureDomScript})()`); // puppeteer
```

### From the browser

By using the **non bundled** version of the script: `src/browser/captureFrame`.

This function can then be bundled together with other client-side code so they are consumed regardless of a browser driver.

### From non-JavaScript code

This package's `dist` folder contains a script that can be sent to the browser regardless of driver and language. An agent that wishes to extract information from a webpage can read the contents of `dist/captureDom` and send that to the browser as an async script. **There's still the need to wrap it in a way that invokes it**.

For example in `Java`:

```java
  Object response = driver.executeAsyncScript("const callback = arguments[arguments.length - 1];(" + captureDom + ")().then(callback, err => callback(err.message))";
```

## The `captureDom` script

This script receives information about what should be captured, and a document from which to capture the information. The first argument is an object with the following properties: `{styleProps, rectProps, ignoredTagNames}`:

- `styleProps` - an array containing the css properties that should be captured for computed style. E.g. `['background']`.
- `rectProps` - an array containing the bounding client rect properties that should be captured. E.g. `['top', 'left']`.
- `ignoredTagNames` - an array containing tag names that should not be captured. E.g. `['head']`.

The script returns an object representing the DOM in hierarchical structure (as opposed to the flat structure of CDT), with computed style and bounding client rect information for each element.

Each element has the following properties:

- `tagName`
- `style`
- `rect`
- `attributes`
- `childNodes`
- `shadowRoot`

Text nodes have the following properties:

- `tagName` - always `#text`.
- `text` - the text of the text node.

In addition, in the object representing the `HTML` element there are 2 other special properties:

- `css` - the bundled css string for all the css in this frame (including style tags, link elements and css imports).
- `images` - image size information for all the images included as background image. The structure is as follows:

```js
{
  "http://some/image.jpg": {width, height}
}
```

ShadowRoot nodes have `childNodes`, `css` and `images` attributes:
* notice that the `css` applies only to the dom tree starting from this `shadowRoot` (i.e. starting from it's childNodes), also note that `css` from outside this dom tree (i.e. `css` from a containing HTML or `shadowRoot`) does not apply to this tree.
* `images` is also relevant only in the current `shadowRoot` dom tree context.


The return value is a **string** that consists of a prefix specifying un fetched css resources and iframes, followed by the actual DOM structure.
For example:

```js
{"separator":"-----","cssStartToken":"#####","cssEndToken":"#####","iframeStartToken":"\"@@@@@","iframeEndToken":"@@@@@\""}
http://url/to/css/1
http://url/to/css/2
http://url/to/css/3
-----
html[1]/body[1]/iframe[2],html[1]/body[1]/iframe[1]
html[1]/body[1]/div[10]/div[3]/iframe[2],html[1]/body[1]/div[4]/iframe[6]
-----
{"tagName":"HTML","style":{...},"rect":{...},"childNodes":[
  {"tagName":"BODY","style":{...},"rect":{...},"childNodes":[
    {"tagName":"DIV","style":{...},"rect":{...},"childNodes":[
      {"tagName":"#text","text":"hello"}],"shadowRoot": { "childNodes": [{"tagName": "DIV","style": {...},"rect":{...},"childNodes":[]}],"css": `/** http://some/url.css **/
      div.inShadow{border: 5px solid salmon;}`,
      "images": {}}
    },
    {"tagName":"IFRAME","style":{...},"rect":{...},"attributes":{"src":"some/url.html"},"childNodes":[
      {"tagName":"HTML","style":{...},"rect":{...},"childNodes":[
        {"tagName":"BODY","style":{...},"rect":{...},"childNodes":[
          {"tagName":"IFRAME","style":{...},"rect":{...},"attributes":{"src":"http://localhost:7272/iframe.html","width":"200","height":"100"},"childNodes":["@@@@@html[1]/body[1]/iframe[2],html[1]/body[1]/iframe[1]@@@@@"}]}],
      "css":"","images":{}}]}]}],
  "css":`/** http://some/url.css **/
         div{border: 5px solid salmon;}
         /** http://url/to/css/1 **/
         #####http://url/to/css/1#####
         /** http://url/to/css/2 **/
         #####http://url/to/css/2#####
         /** http://url/to/css/3 **/
         #####http://url/to/css/3#####`,
  "images":{}}
-----
{
  "total": {
    "startTime": 1573131315953,
    "endTime": 1573131315964,
    "elapsedTime": 11
  },
  "prefetchCss": {
    "startTime": 1573131315953,
    "endTime": 1573131315961,
    "elapsedTime": 8
  },
  "doCaptureDoc": {
    "startTime": 1573131315961,
    "endTime": 1573131315964,
    "elapsedTime": 3
  },
  "waitForImages": {
    "startTime": 1573131315964,
    "endTime": 1573131315964,
    "elapsedTime": 0
  }
}
```

The first line should be parsed as a JSON and its properties serve to parse the rest of the string.
The following lines up to the next separator are urls to cross-origin css resources.
The following lines up to the next separator are comma-separated lists of xpath expressions that uniquely identify iframes (iframe per line).
after the following separator is the JSON structure that was captured from the DOM.
The last part is the performance metrics of the operation. This part is optional depends on the value of 3rd parameter in captureFrame function.

Notice how every css resource in the prefix has a corresponding token of the structure `#####url#####`, and every cross-origin iframe in the prefix has a corresponding token of the structure `"@@@@@path@@@@@"`.

In order to complete the process of capturing the DOM, the SDK (or other code using this script) should fetch all the css resources, run `JSON.stringify` on the result of each css (this is important for escaping), then replace the token with the escaped css string.
In addition, for each cross-origin iframe the `captureDom` script should be run again in the context of the frame, and the same process should
be done recursively. When finalizing the result of a frame, it should then be injected to its parent's result in the corresponding token.