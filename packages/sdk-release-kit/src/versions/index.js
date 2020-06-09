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
const {writeUnreleasedItemToChangelog} = require('../changelog')

async function verifyCommits({pkgPath, isForce}) {
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

  if (results.length && !isForce) {
    throw new Error(
      'There are unreleased commits in dependencies of this package:\n' +
        results.map(({name, output}) => `${chalk.yellow(name)}\n${chalk.cyan(output)}`).join('\n') +
        `\nTo ignore these, re-run with BONGO_VERIFY_COMMITS_FORCE=1`,
    )
  }
}

async function verifyInstalledVersions(
  {pkgPath, installedDirectory},
  {isNpmLs} = {isNpmLs: false},
) {
  const internalPackages = makePackagesList()
  const {dependencies} = require(path.join(pkgPath, 'package.json'))
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

function verifyVersions({isFix, pkgPath}) {
  const pkgs = makePackagesList()
  const results = []
  verifyDependencies({pkgs, pkgPath, results})

  const errors = results.filter(({depVersion, sourceVersion}) => depVersion !== sourceVersion)

  if (errors.length) {
    if (isFix) {
      for (const error of errors) {
        const pkg = pkgs.find(({name}) => name === error.pkgName)
        const packageJsonPath = path.resolve(pkg.path, 'package.json')
        const packageJson = require(packageJsonPath)
        packageJson.dependencies[error.dep] = error.sourceVersion
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
        const changelogEntry = `- updated to ${error.dep}@${error.sourceVersion} (from ${error.depVersion})`
        writeUnreleasedItemToChangelog({targetFolder: pkg.path, entry: changelogEntry})
      }
    } else {
      console.log(
        errors
          .map(({pkgName, dep, depVersion, sourceVersion}) => {
            return chalk.red(
              `[${pkgName}] [MISMATCH] ${dep}: version ${depVersion} is required, but source has version ${sourceVersion}`,
            )
          })
          .join('\n') + chalk.yellow('\n\nTo fix these, run `npx bongo verify-versions --fix`'),
      )
      process.exit(1)
    }
  }
}

module.exports = {
  verifyCommits,
  verifyInstalledVersions,
  verifyVersions,
}
