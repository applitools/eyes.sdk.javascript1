const {exec} = require('child_process')
const {promisify} = require('util')
const pexec = promisify(exec)
const path = require('path')
const {checkPackagesForUniqueVersions, makePackagesList} = require('..')

async function npmLs() {
  try {
    const {stdout} = await pexec(`npm ls`)
    return stdout
  } catch (error) {
    return error.stdout
  }
}

async function main({pkgPath, installedDirectory}) {
  const internalPackages = makePackagesList()
  const {dependencies} = require(path.join(pkgPath, 'package.json'))
  const filteredPackageNames = Object.keys(dependencies).filter(pkgName =>
    internalPackages.find(({name}) => name === pkgName),
  )
  if (installedDirectory) {
    process.chdir(installedDirectory)
  }
  checkPackagesForUniqueVersions(await npmLs(), filteredPackageNames)
}

module.exports = main
