'use strict'

const assert = require('assert')
const {URL} = require('url')
const {makeCheckNetwork} = require('../../lib/troubleshoot/checkNetwork')

describe('checkNetwork', () => {
  let output
  let throwFor
  const eyes = {
    testServer: async () => {
      if (throwFor.includes('eyes:Server')) {
        throw new Error('eyes:Server')
      }
    },
    testAxios: async () => {
      if (throwFor.includes('eyes:Axios')) {
        throw new Error('eyes:Axios')
      }
    },
    testFetch: async () => {
      if (throwFor.includes('eyes:Fetch')) {
        throw new Error('eyes:Fetch')
      }
    },
    testCurl: async () => {
      if (throwFor.includes('eyes:Curl')) {
        throw new Error('eyes:Curl')
      }
    },
    testHttps: async () => {
      if (throwFor.includes('eyes:Https')) {
        throw new Error('eyes:Https')
      }
    },
    url: new URL('https://eyes.com'),
    getCurlCmd: () => 'curl eyes.com',
  }
  const vg = {
    testServer: async () => {
      if (throwFor.includes('vg:Server')) {
        throw new Error('vg:Server')
      }
    },
    testAxios: async () => {
      if (throwFor.includes('vg:Axios')) {
        throw new Error('vg:Axios')
      }
    },
    testFetch: async () => {
      if (throwFor.includes('vg:Fetch')) {
        throw new Error('vg:Fetch')
      }
    },
    testCurl: async () => {
      if (throwFor.includes('vg:Curl')) {
        throw new Error('vg:Curl')
      }
    },
    testHttps: async () => {
      if (throwFor.includes('vg:Https')) {
        throw new Error('vg:Https')
      }
    },
    url: new URL('https://vg.com'),
    getCurlCmd: () => 'curl vg.com',
  }

  const stream = {
    write: (...args) => output.push(args[0]),
    cursorTo: () => {},
    clearLine: () => {},
  }
  const checkNetwork = makeCheckNetwork({
    stream,
    eyes,
    vg,
  })

  const sanitize = () => {
    output[0] = output[0].replace(/{"apiKey":".+"}/, '{"apiKey":"someKey"}')
    output = output.map(line => line.replace(/\u001b\[\d+m/g, ''))
  }

  beforeEach(() => {
    output = []
    throwFor = []
  })

  it('work', async () => {
    await checkNetwork()
    sanitize()
    assert.deepStrictEqual(output, [
      'Eyes Check Network. Running with:\n' +
        '{"apiKey":"someKey"} HTTP_PROXY="" HTTPS_PROXY="". \n' +
        '\n',
      '[1] Checking eyes API https://eyes.com \n',
      '[eyes] cURL                    [ ?  ]',
      '[eyes] cURL                    [ OK ]  +0 \n',
      '[eyes] https                   [ ?  ]',
      '[eyes] https                   [ OK ]  +0 \n',
      '[eyes] axios                   [ ?  ]',
      '[eyes] axios                   [ OK ]  +0 \n',
      '[eyes] node-fetch              [ ?  ]',
      '[eyes] node-fetch              [ OK ]  +0 \n',
      '[eyes] server connector        [ ?  ]',
      '[eyes] server connector        [ OK ]  +0 \n',
      '[2] Checking visual grid API https://vg.com \n',
      '[VG] cURL                      [ ?  ]',
      '[VG] cURL                      [ OK ]  +0 \n',
      '[VG] https                     [ ?  ]',
      '[VG] https                     [ OK ]  +0 \n',
      '[VG] axios                     [ ?  ]',
      '[VG] axios                     [ OK ]  +0 \n',
      '[VG] node-fetch                [ ?  ]',
      '[VG] node-fetch                [ OK ]  +0 \n',
      '[VG] server connector          [ ?  ]',
      '[VG] server connector          [ OK ]  +0 \n',
      '\nSuccess!\n',
    ])
  })

  it('displays errors', async () => {
    throwFor = ['eyes:Curl', 'eyes:Server', 'vg:Axios', 'vg:Fetch', 'pub:Curl']
    await checkNetwork()
    sanitize()
    assert.deepStrictEqual(output, [
      'Eyes Check Network. Running with:\n' +
        '{"apiKey":"someKey"} HTTP_PROXY="" HTTPS_PROXY="". \n' +
        '\n',
      '[1] Checking eyes API https://eyes.com \n',
      '[eyes] cURL                    [ ?  ]',
      '[eyes] cURL                    [ X  ]  +0 eyes:Curl \n',
      '[eyes] https                   [ ?  ]',
      '[eyes] https                   [ OK ]  +0 \n',
      '[eyes] axios                   [ ?  ]',
      '[eyes] axios                   [ OK ]  +0 \n',
      '[eyes] node-fetch              [ ?  ]',
      '[eyes] node-fetch              [ OK ]  +0 \n',
      '[eyes] server connector        [ ?  ]',
      '[eyes] server connector        [ X  ]  +0 eyes:Server \n',
      '[2] Checking visual grid API https://vg.com \n',
      '[VG] cURL                      [ ?  ]',
      '[VG] cURL                      [ OK ]  +0 \n',
      '[VG] https                     [ ?  ]',
      '[VG] https                     [ OK ]  +0 \n',
      '[VG] axios                     [ ?  ]',
      '[VG] axios                     [ X  ]  +0 vg:Axios \n',
      '[VG] node-fetch                [ ?  ]',
      '[VG] node-fetch                [ X  ]  +0 vg:Fetch \n',
      '[VG] server connector          [ ?  ]',
      '[VG] server connector          [ OK ]  +0 \n',
      '\n' +
        'Your proxy seems to be blocking requests to Applitools, please make sure the following command succeed: \n' +
        ' curl eyes.com \n',
    ])
  })
})
