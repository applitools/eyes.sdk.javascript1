const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const {
  checkPackageCommits,
  checkPackagesForUniqueVersions,
  makePackagesList,
  npmLs,
  verifyDependencies,
} = require('./versions-utils')

async function verifyCommits({pkgPath}) {
  const pkgs = makePackagesList()
  const packageJson = require(path.resolve(pkgPath, 'package.json'))
  const {dependencies} = packageJson
  const workspaceDeps = pkgs.filter(pkg => pkg.name in dependencies)
  const results = (
    await Promise.all(
      workspaceDeps.map(async dep => {
        const output = await checkPackageCommits(dep.path)
        return {name: dep.name, output}
      }),
    )
  ).filter(x => x.output)

  if (results.length) {
    throw new Error(
      'There are unreleased commits in dependencies of this package:\n' +
        results.map(({name, output}) => `${chalk.yellow(name)}\n${chalk.cyan(output)}`).join('\n'),
    )
  }
}

async function verifyInstalledVersions({pkgPath, installedDirectory}, {isNpmLs} = {isNpmLs: true}) {
  const internalPackages = makePackagesList()
  const {dependencies} = JSON.parse(fs.readFileSync(path.join(pkgPath, 'package.json')))
  const filteredPackageNames = Object.keys(dependencies).filter(pkgName =>
    internalPackages.find(({name}) => name === pkgName),
  )
  if (isNpmLs) {
    process.chdir(installedDirectory)
    checkPackagesForUniqueVersions(await npmLs(), filteredPackageNames)
  } else {
    const packageLock = require(path.resolve(installedDirectory, 'package-lock.json'))
    checkPackagesForUniqueVersions(packageLock, filteredPackageNames, {
      isNpmLs,
    })
  }
}

function verifyVersions({pkgPath}) {
  const pkgs = makePackagesList()
  const results = []
  verifyDependencies({pkgs, pkgPath, results})

  const errors = results.filter(({depVersion, sourceVersion}) => depVersion !== sourceVersion)

  if (errors.length) {
    const message = errors
      .map(
        ({pkgName, dep, depVersion, sourceVersion}) =>
          `[${pkgName}] [MISMATCH] ${dep}: version specified for dependency in package.json is ${depVersion}, but source has version ${sourceVersion}`,
      )
      .join('\n')

    throw new Error(message)
  }
}

module.exports = {
  verifyCommits,
  verifyInstalledVersions,
  verifyVersions,
}
