'use strict'

const path = require('path')
const {exec} = require('child_process')
const {promisify} = require('util')
const pexec = promisify(exec)
const chalk = require('chalk')
const {makePackagesList} = require('..')

async function verifyDependencies({pkgPath, isForce}) {
  const pkgs = makePackagesList()
  const packageJson = require(path.resolve(pkgPath, 'package.json'))
  const {dependencies} = packageJson
  const workspaceDeps = pkgs.filter(pkg => pkg.name in dependencies)
  const results = (
    await Promise.all(
      workspaceDeps.map(async dep => {
        const output = await verifyCommits(dep.path)
        return {name: dep.name, output}
      }),
    )
  ).filter(x => x.output)

  if (results.length && !isForce) {
    throw new Error(
      'There are unreleased commits in dependencies of this package:\n' +
        results.map(({name, output}) => `${chalk.yellow(name)}\n${chalk.cyan(output)}`).join('\n'),
    )
  }
}

async function verifyCommits(pkgPath) {
  const packageJson = require(path.resolve(pkgPath, 'package.json'))
  const {name, version} = packageJson
  const tagName = `${name}@${version}`
  const exclusions = `":(exclude,icase)../*/changelog.md" ":!../*/test/*"`
  try {
    return (await pexec(`git log --oneline ${tagName}..HEAD -- ${pkgPath} ${exclusions}`)).stdout
  } catch (ex) {
    if (/bad revision/.test(ex.message)) {
      const tagNameCyan = chalk.cyan(tagName)
      const versionCyan = chalk.cyan(version)
      console.log(
        chalk.yellow(
          `Warning [${name}]: unable to detect unreleased commits because tag ${tagNameCyan} is missing from git.
Please make sure there are no additional commits to this package since the release of version ${versionCyan}!`,
        ),
      )
    } else {
      throw ex
    }
  }
}

module.exports = verifyDependencies
