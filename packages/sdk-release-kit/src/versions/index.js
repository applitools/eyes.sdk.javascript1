const path = require('path')
const {isMatch} = require('micromatch')

function _isAlreadyChecked({pkgName, dep, results}) {
  return results.find(result => result.pkgName === pkgName && result.dep === dep)
}

function _isWorkspacePackage({pkgs, pkgName}) {
  return pkgs.find(({name}) => name === pkgName)
}

function makePackagesList() {
  const {packages} = require(path.join(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    'package.json',
  )).workspaces
  return packages.map(pkgPath => {
    const pkgDir = path.join(__dirname, '..', '..', '..', '..', pkgPath)
    const packageJson = require(path.join(pkgDir, 'package.json'))
    return {
      name: packageJson.name,
      path: pkgDir,
    }
  })
}

function verifyDependencies({pkgs, pkgPath, results}) {
  const packageJsonPath = path.resolve(pkgPath, 'package.json')
  const packageJson = require(packageJsonPath)
  const pkgName = packageJson.name
  const {dependencies} = packageJson

  for (const dep in dependencies) {
    if (!_isAlreadyChecked({pkgName, dep, results}) && _isWorkspacePackage({pkgs, pkgName: dep})) {
      const depVersion = dependencies[dep]
      const pkg = pkgs.find(({name}) => name === dep)
      const depPackageJsonPath = path.join(pkg.path, 'package.json')
      const depPackageJson = require(depPackageJsonPath)
      const sourceVersion = depPackageJson.version
      results.push({pkgName, dep, depVersion, sourceVersion, error: true})
      verifyDependencies({pkgs, pkgPath: pkg.path, results})
    }
  }
}

function checkPackagesForUniqueVersions(input, packageNames) {
  let errors = []
  packageNames.forEach(packageName => {
    const versions = _findVersionNumbersForPackage(input, packageName)
    if (versions.size > 1) errors.push({name: packageName, versions})
  })
  if (errors.length) {
    const affectedPackages = errors.map(error => error.name).join(', ')
    throw new Error(
      `Non-unique package versions found of ${affectedPackages} \n\nTo learn more, run \`npx bongo --ls-dry-run\`.`,
    )
  }
}

function _findVersionNumbersForPackage(input, pkgName) {
  let versionNumbers = []
  const packageEntries = findEntryByPackageName(input, pkgName)
  packageEntries.forEach(entry => {
    const versionNumber = entry.match(/(\d+\.)?(\d+\.)?(\*|\d+)/)[0]
    versionNumbers.push(versionNumber)
  })
  return new Set(versionNumbers)
}

function findEntryByPackageName(input, target) {
  if (typeof input === 'string') input = input.split('\n')
  return input.filter(entry => {
    const result = entry.match(/(@?\w+\/?\w+\-?\w+)@/)
    const _entry = result ? result[1] : ''
    return isMatch(_entry, target)
  })
}

module.exports = {
  makePackagesList,
  verifyDependencies,
  checkPackagesForUniqueVersions,
  findEntryByPackageName,
}
