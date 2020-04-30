'use strict'
const fs = require('fs')
const path = require('path')
const nock = require('nock')

function fakeDriverServer({
  sessionId = 'fake session id',
  _capabilities = {},
  url = 'fake url',
  userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36',
  screenshotFileName = 'software_development.png',
} = {}) {
  nock('http://localhost:4444')
    .post('/session')
    .reply(200, {value: createSession()})
    .persist()
    .post(/session\/.+\/url/)
    .reply(200, {value: url})
    .persist()
    .get(/session\/.+\/url/)
    .reply(200, {value: url})
    .persist()
    .get(/session\/.+\/title/)
    .reply(200, {value: 'fake title'})
    .persist()
    .post(/session\/.+\/frame/)
    .reply(200, {value: null})
    .persist()
    .post(/session\/.+\/window\/rect/)
    .reply(200, {value: {height: 800, width: 600, x: 0, y: 0}})
    .persist()
    .get(/session\/.+\/window\/rect/)
    .reply(200, {value: {height: 800, width: 600, x: 0, y: 0}})
    .persist()
    .post(/session\/.+\/element/)
    .reply(200, {value: {'element-6066-11e4-a52e-4f735466cecf': 'bla'}})
    .persist()
    .get(/session\/.+\/screenshot/)
    .reply(200, {value: takeScreenshot()})
    .persist()
    .post(/session\/.+\/execute\/sync/)
    .reply(200, (_uri, reqBody) => {
      return {value: executeScript(reqBody.script, ...reqBody.args)}
    })
    .persist()

  function createSession() {
    return {
      capabilities: {
        acceptInsecureCerts: false,
        browserName: 'chrome',
        browserVersion: '80.0.3987.132',
        chrome: {
          chromedriverVersion:
            '80.0.3987.106 (f68069574609230cf9b635cd784cfb1bf81bb53a-refs/branch-heads/3987@{#882})',
          userDataDir: '/tmp/.com.google.Chrome.gWd3Sb',
        },
        'goog:chromeOptions': {
          debuggerAddress: 'localhost:45061',
        },
        networkConnectionEnabled: false,
        pageLoadStrategy: 'normal',
        platformName: 'linux',
        proxy: {},
        setWindowRect: true,
        strictFileInteractability: false,
        timeouts: {
          implicit: 0,
          pageLoad: 300000,
          script: 30000,
        },
        unhandledPromptBehavior: 'dismiss and notify',
      },
      sessionId,
    }
  }

  function executeScript(script, ..._args) {
    // TODO use vm.runInContext with mocked window
    if (script === 'return window.devicePixelRatio') {
      return 1
    } else if (
      script ===
      'var width = Math.max(arguments[0].clientWidth, arguments[0].scrollWidth);' +
        'var height = Math.max(arguments[0].clientHeight, arguments[0].scrollHeight);' +
        'return [width, height];'
    ) {
      // entire size
      return [1200, 800]
    } else if (script.indexOf('__captureDomAndPoll()') > -1) {
      return `{"separator":"-----","cssStartToken":"#####","cssEndToken":"#####","iframeStartToken":"\\\\"@@@@@","iframeEndToken":"@@@@@\\\\""}\n-----\n-----\n{}`
    } else if (script === 'return navigator.userAgent;') {
      return userAgent
    }
    return ''
  }

  function takeScreenshot() {
    return fs
      .readFileSync(path.resolve(__dirname, '../fixtures', screenshotFileName))
      .toString('base64')
  }
}

module.exports = {fakeDriverServer}
