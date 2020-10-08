'use strict'

const chalk = require('chalk')
const _eyes = require('./eyes')
const _vg = require('./vg')
const {userConfig, presult, ptimeoutWithError} = require('./utils')
const TIMEOUT = 15000

function makeCheckNetwork({stream = process.stdout, eyes = _eyes, vg = _vg}) {
  const hasClearLine = stream.clearLine && stream.cursorTo

  async function doTest(func, name) {
    const delimiterLength = 30 - name.length
    const delimiter = new Array(delimiterLength).join(' ')
    hasClearLine && printSuccess(name, delimiter, '[ ?  ]')

    const start = new Date()
    const funcWithTimeout = ptimeoutWithError(func(), TIMEOUT, new Error('request timeout!'))
    const [err] = await presult(funcWithTimeout)
    const end = parseInt((Date.now() - start) / 1000)

    clearLine()
    if (err) {
      printErr(
        name,
        delimiter,
        `[ X  ]  +${end}`,
        err.message,
        err.message[err.message.length - 1] !== '\n' ? '\n' : '',
      )
    } else {
      printSuccess(name, delimiter, `[ OK ]  +${end}`, '\n')
    }
    return !!err
  }

  function print(...msg) {
    stream.write(chalk.cyan(...msg))
  }

  function printErr(...msg) {
    stream.write(chalk.red(...msg))
  }

  function printSuccess(...msg) {
    stream.write(chalk.green(...msg))
  }

  function clearLine() {
    if (hasClearLine) {
      stream.clearLine()
      stream.cursorTo(0)
    }
  }

  return async function checkNetwork() {
    if (!userConfig.apiKey) {
      printErr(
        'Missing "apiKey". Add APPLITOOLS_API_KEY as an env variable or add "apiKey" in applitools.config.js\n',
      )
      return
    }
    const proxyEnvMsg = `HTTP_PROXY="${process.env.HTTP_PROXY || ''}" HTTPS_PROXY="${process.env
      .HTTPS_PROXY || ''}".`
    print(`Eyes Check Network. Running with:\n${JSON.stringify(userConfig)} ${proxyEnvMsg} \n\n`)

    let hasErr = false
    let curlRenderErr = true
    let curlVgErr = true

    // TODO - http and fetch need to account for proxy.

    print('[1] Checking eyes API', eyes.url.origin, '\n')
    curlRenderErr = await doTest(eyes.testCurl, '[eyes] cURL')
    hasErr = curlRenderErr
    hasErr = (await doTest(eyes.testHttps, '[eyes] https')) || hasErr
    hasErr = (await doTest(eyes.testAxios, '[eyes] axios')) || hasErr
    hasErr = (await doTest(eyes.testFetch, '[eyes] node-fetch')) || hasErr
    hasErr = await doTest(eyes.testServer, '[eyes] server connector')

    print('[2] Checking visual grid API', vg.url.origin, '\n')
    curlVgErr = await doTest(vg.testCurl, '[VG] cURL')
    hasErr = curlVgErr || hasErr
    hasErr = (await doTest(vg.testHttps, '[VG] https')) || hasErr
    hasErr = (await doTest(vg.testAxios, '[VG] axios')) || hasErr
    hasErr = (await doTest(vg.testFetch, '[VG] node-fetch')) || hasErr
    hasErr = (await doTest(vg.testServer, '[VG] server connector')) || hasErr

    if (!hasErr) {
      printSuccess('\nSuccess!\n')
    }

    const proxyMsg =
      '\nYour proxy seems to be blocking requests to Applitools, please make sure the following command succeed:'
    if (curlRenderErr) {
      printErr(proxyMsg, '\n', eyes.getCurlCmd(), '\n')
    }
    if (curlVgErr) {
      printErr(proxyMsg, '\n', await vg.getCurlCmd())
    }
  }
}

exports.makeCheckNetwork = makeCheckNetwork
