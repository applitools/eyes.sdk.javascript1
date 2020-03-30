const {exec} = require('child_process')
const {promisify} = require('util')
const pexec = promisify(exec)
const path = require('path')
const {checkPackagesForUniqueVersions} = require('..')

async function npmLs() {
  try {
    const {stdout} = await pexec(`npm ls`)
    return stdout
  } catch (error) {
    return error.stdout
  }
}

async function main({pkgPath, installedDirectory}) {
  const {dependencies} = require(path.join(pkgPath, 'package.json'))
  const packageNames = Object.keys(dependencies)
  if (installedDirectory) {
    process.chdir(installedDirectory)
  }
  try {
    checkPackagesForUniqueVersions(await npmLs(), packageNames)
  } catch (error) {
    process.chdir(pkgPath)
    throw error
  }
}

module.exports = main
