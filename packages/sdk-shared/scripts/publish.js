'use strict'

const forEachPackage = require('../src/for-each-package')
const {checkPackageCommits} = require('@applitools/sdk-release-kit/src/versions/versions-utils')
const {sh} = require('../src/process-commons')

;(async function main() {
  await forEachPackage(publish)
})().catch(err => {
  console.log(err)
  process.exit(1)
})

async function publish() {
  const pkgPath = process.cwd()
  const output = await checkPackageCommits(pkgPath)
  if (output) {
    await sh('yarn publish --patch')
  }
}
