'use strict'
const {promisify: p} = require('util')
const path = require('path')
const fs = require('fs')
const os = require('os')
const {spawn} = require('child_process')
const {makeError} = require('@applitools/functional-commons')

async function callFunctionViaProcess(
  jsFile,
  exportedfunctionName = 'default',
  args,
  {timeout = undefined, spawnOptions = {}} = {},
) {
  const jsModuleThatCallsExportedFunction = path.join(
    __dirname,
    'resources/js-module-that-calls-exported-function.js',
  )

  const tmpDir = await p(fs.mkdtemp)(os.tmpdir() + '/')
  const resultFile = path.join(tmpDir, 'result.json')
  const resultOutputFileDescriptor = await p(fs.open)(resultFile, 'w')

  try {
    await executeJsModule(
      jsModuleThatCallsExportedFunction,
      [jsFile, exportedfunctionName, JSON.stringify(args)],
      {
        timeout,
        spawnOptions: {
          ...spawnOptions,
          stdio: ['inherit', 'inherit', 'inherit', resultOutputFileDescriptor],
        },
      },
    )

    await p(fs.close)(resultOutputFileDescriptor)

    return JSON.parse(await p(fs.readFile)(resultFile))
  } catch (err) {
    await p(fs.close)(resultOutputFileDescriptor)

    const errorString = await p(fs.readFile)(resultFile, 'utf-8')

    if (errorString)
      throw makeError(new Error(errorString), {
        stdout: err.stdout,
        stderr: err.stderr,
        exitCode: err.exitCode,
      })
    else {
      throw err
    }
  } finally {
    try {
      await p(fs.unlink)(resultFile)
      await p(fs.rmdir)(tmpDir)
    } catch (err) {
      console.error(
        'Oops. Failed to delete temporary file. Not too bad, so ignoring. File:',
        resultFile,
      )
    }
  }
}

async function executeJsModule(jsModule, args = [], {spawnOptions = {}, timeout = undefined} = {}) {
  return executeProcess(process.execPath, [jsModule].concat(args || []), {spawnOptions, timeout})
}

function executeAndControlProcess(
  processPath,
  args = [],
  {spawnOptions = {}, timeout = undefined} = {},
) {
  const subProcess = spawn(processPath, args, {
    stdio: 'pipe',
    ...spawnOptions,
  })

  const exitPromise = new Promise((resolve, reject) => {
    subProcess.on('error', reject).on('close', (exitCode, signal) =>
      exitCode === 0
        ? resolve({exitCode, stdout, stderr})
        : signal
        ? reject(
            makeError(
              new Error(
                `process exited due to signal ${signal} executing process ${processPath} with args ${JSON.stringify(
                  args,
                )}`,
              ),
              {
                signal,
                stdout,
                stderr,
              },
            ),
          )
        : reject(
            makeError(
              new Error(
                `non-zero exit code (${exitCode}) executing process ${processPath} with args ${JSON.stringify(
                  args,
                )}`,
              ),
              {
                exitCode,
                stdout,
                stderr,
              },
            ),
          ),
    )

    let stdout = subProcess.stdout ? '' : undefined
    let stderr = subProcess.stderr ? '' : undefined
    subProcess.stdout && subProcess.stdout.on('data', data => (stdout += data.toString()))
    subProcess.stderr && subProcess.stderr.on('data', data => (stderr += data.toString()))

    if (timeout) {
      setTimeout(() => subProcess.kill(), timeout)
    }
    return {stdout, stderr}
  })

  return {subProcess, exitPromise}
}

async function executeProcess(
  processPath,
  args = [],
  {spawnOptions = {}, timeout = undefined} = {},
) {
  return await executeAndControlProcess(processPath, args, {spawnOptions, timeout}).exitPromise
}

async function sh(command, options) {
  return await executeProcess('/bin/bash', ['-c', command], {
    ...options,
    spawnOptions: {stdio: 'inherit', ...(options || {}).spawnOptions},
  })
}

async function shWithOutput(command, options, {withStderr = false} = {}) {
  const {stdout, stderr} = await sh(command, {
    ...options,
    spawnOptions: {stdio: 'pipe', ...(options || {}).spawnOptions},
  })

  return toArray(stdout).concat(withStderr ? toArray(stderr) : [])

  function toArray(std) {
    return std
      .trim()
      .split('\n')
      .map(s => s.trim())
  }
}

async function shWithJson(command, options) {
  const {stdout} = await sh(command, {
    ...options,
    spawnOptions: {stdio: 'pipe', ...(options || {}).spawnOptions},
  })

  return JSON.parse(stdout)
}

module.exports = {
  callFunctionViaProcess,
  executeJsModule,
  executeProcess,
  executeAndControlProcess,
  sh,
  shWithOutput,
  shWithJson,
}
