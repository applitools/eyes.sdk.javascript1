'use strict'

const path = require('path')
const {presult} = require('@applitools/functional-commons')

async function forEachPackage(operation) {
  const folders = [
    'sdk-shared',
    'sdk-fake-eyes-server',
    'sdk-release-kit',
    'sdk-coverage-tests',
    'snippets',
    'eyes-sdk-core',
    'visual-grid-client',
    'eyes-selenium',
    'eyes-webdriverio-5',
    'eyes-webdriverio-4',
    'eyes-protractor',
    'eyes-playwright',
    'eyes-cypress',
    'eyes-storybook',
    'eyes-webdriverio-5-service',
  ]
  const errors = []
  const start = Date.now()
  for (const [index, folder] of folders.entries()) {
    console.log('[workspace]', folder, `(${index + 1} of ${folders.length})`)
    process.chdir(path.resolve(__dirname, '../..', folder))
    const [err] = await presult(operation())
    if (err) errors.push({folder, err})
  }
  const total = Date.now() - start

  if (errors.length) {
    console.log(`[workspace] done with ${errors.length} errors. Total time: ${total}ms`)
    for (const [index, {folder, err}] of errors.entries()) {
      console.log(`[workspace] Error ${index + 1} ${folder}:`, err)
    }
  } else {
    console.log(`[workspace] done without errors! Total time: ${total}ms`)
  }
}

module.exports = forEachPackage
