'use strict'
const fs = require('fs')
const path = require('path')
const semver = require('semver')
const chalk = require('chalk')

const pkgsFolder = path.resolve(__dirname, '../../../packages')
const packages = fs.readdirSync(pkgsFolder)

const duplicates = findDuplicates()
const devDuplicates = findDuplicates({isDevDependency: true})

console.log(
  chalk.magenta(`
dependencies duplicates
=======================`),
)
console.log(duplicatesToStr(duplicates))
console.log(
  chalk.magenta(`
devDependencies duplicates
==========================`),
)
console.log(duplicatesToStr(devDuplicates))

function duplicatesToStr(duplicates) {
  return duplicates
    .map(
      ([dep, versions], i) => `${i + 1}) ${chalk.cyan(dep)}
${Object.entries(versions)
  .map(([version, pkgs]) => `    ${version}: ${pkgs.join(', ')}`)
  .join('\n')}`,
    )
    .join('\n')
}

function findDuplicates({isDevDependency} = {}) {
  const deps = {}
  for (const pkg of packages) {
    const pkgJson = require(path.resolve(pkgsFolder, pkg, 'package.json'))
    const pkgJsonDeps = isDevDependency ? pkgJson.devDependencies : pkgJson.dependencies
    for (const dep in pkgJsonDeps) {
      const pkgDepVersion = pkgJsonDeps[dep].replace('^', '')
      if (deps[dep]) {
        if (deps[dep][pkgDepVersion]) {
          deps[dep][pkgDepVersion].push(pkg)
        } else {
          deps[dep][pkgDepVersion] = [pkg]
        }
      } else {
        deps[dep] = {[pkgDepVersion]: [pkg]}
      }
    }
  }

  return Object.entries(deps)
    .filter(([_dep, versions]) => Object.keys(versions).length > 1)
    .map(([dep, versions]) => {
      return [
        dep,
        sortObj(versions, (a, b) => {
          if (!semver.valid(a)) return -1
          if (!semver.valid(b)) return 1
          return semver.gt(a, b) ? 1 : -1
        }),
      ]
    })
}

function sortObj(obj, comparator) {
  return Object.keys(obj)
    .sort(comparator)
    .reduce((acc, key) => ({[key]: obj[key], ...acc}), {})
}
