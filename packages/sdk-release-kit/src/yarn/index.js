'use strict'
const fs = require('fs')
const path = require('path')
const pickby = require('lodash.pickby')
const {sh} = require('@applitools/sdk-shared/src/process-commons')
const chalk = require('chalk')
const {writeUnreleasedItemToChangelog} = require('../changelog')

async function yarnInstall() {
  await sh(`yarn install`)
}

async function yarnUpgrade({folder, upgradeAll, skipDev}) {
  const pkgJson = JSON.parse(fs.readFileSync(path.resolve(folder, 'package.json')))
  const {dependencies, devDependencies} = pkgJson
  const applitoolsDeps = pickby(dependencies, (_, pkg) => pkg.startsWith('@applitools/'))
  const depsToUpgrade = upgradeAll ? dependencies : applitoolsDeps
  if (Object.keys(depsToUpgrade).length) {
    const depsStr = Object.keys(depsToUpgrade).join(' ')
    const cmd = `yarn upgrade --exact --latest ${depsStr}`
    console.log(chalk.cyan(cmd))
    await sh(cmd)

    const newPkgJson = JSON.parse(fs.readFileSync(path.resolve(folder, 'package.json')))
    const upgradedDeps = findUpgradedDeps(dependencies, newPkgJson.dependencies)
    for (const [dep, oldVersion, newVersion] of upgradedDeps) {
      const changelogEntry = `- updated to ${dep}@${newVersion} (from ${oldVersion})`
      writeUnreleasedItemToChangelog({targetFolder: folder, entry: changelogEntry})
    }
  }

  if (!skipDev) {
    const cmdDev = `yarn upgrade ${Object.keys(devDependencies).join(' ')}`
    console.log('\n' + chalk.cyan(cmdDev))
    await sh(cmdDev)
  }
}

function findUpgradedDeps(oldDeps, newDeps) {
  return Object.keys(oldDeps).reduce((upgradedDeps, dep) => {
    return !oldDeps[dep] || !newDeps[dep] || oldDeps[dep] === newDeps[dep]
      ? upgradedDeps
      : [...upgradedDeps, [dep, oldDeps[dep], newDeps[dep]]]
  }, [])
}

function findUnfixedDeps(dependencies) {
  return Object.keys(dependencies).reduce((warnings, pkg) => {
    return isNaN(Number(dependencies[pkg][0])) ? {...warnings, [pkg]: dependencies[pkg]} : warnings
  }, {})
}

function verifyUnfixedDeps(folder) {
  const pkgJson = require(path.resolve(folder, 'package.json'))
  const {dependencies} = pkgJson
  const unfixedDeps = findUnfixedDeps(dependencies)
  const messages = []
  Object.entries(unfixedDeps).forEach(([key, value]) => {
    messages.push(chalk.red(`depenency is not fixed: ${key}@${value}`))
  })
  if (messages.length) {
    throw new Error(messages.join('\n'))
  }
}

module.exports = {
  yarnInstall,
  yarnUpgrade,
  findUnfixedDeps,
  findUpgradedDeps,
  verifyUnfixedDeps,
}
