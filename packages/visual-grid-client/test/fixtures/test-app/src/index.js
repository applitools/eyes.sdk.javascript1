/* eslint-disable */
const url = require('url');
// These are polyfilled in Selenium IDE
url.URL = URL;
process.hrtime = require('browser-process-hrtime');
window.Buffer = require('buffer').Buffer;
window.makeRenderingGridClient = require('../../../../src/sdk/renderingGridClient');
