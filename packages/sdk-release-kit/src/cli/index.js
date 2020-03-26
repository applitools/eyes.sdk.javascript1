#!/usr/bin/env node

const args = require('yargs').argv
const chalk = require('chalk')
const cwd = process.cwd()
const path = require('path')

async function execute(cb) {
  try {
    await cb()
  } catch (error) {
    console.log(chalk.red(error.message))
    process.exit(1)
  }
}

if (args['verify-changelog']) {
  const verifyChangelog = require('../changelog/scripts/verify-changelog')
  execute(verifyChangelog)
} else if (args['update-changelog']) {
  const updateChangelog = require('../changelog/scripts/update-changelog')
  execute(updateChangelog)
} else if (args['send-release-notification']) {
  const sendReleaseNotification = require('../send-report/scripts/send-release-notification')
  execute(sendReleaseNotification.bind(undefined, args.recipient))
} else if (args['verify-versions']) {
  const verifyVersions = require('../versions/scripts/verify-versions')
  execute(verifyVersions.bind(undefined, {isFix: args.fix, pkgPath: cwd}))
} else if (args['verify-commits']) {
  const verifyCommits = require('../versions/scripts/verify-commits')
  execute(verifyCommits.bind(undefined, {pkgPath: cwd, isForce: args.force}))
} else if (args['verify-installed-versions']) {
  const main = async () => {
    const createDotFolder = require('../setup/scripts/create-dot-folder')
    const packInstall = require('../dry-run/scripts/pack-install')
    const verifyInstalledVersions = require('../versions/scripts/verify-installed-versions')
    execute(createDotFolder.bind(undefined, cwd))
    await execute(packInstall.bind(undefined, cwd))
    execute(
      verifyInstalledVersions.bind(undefined, {
        pkgPath: cwd,
        installedDirectory: path.join('.bongo', 'dry-run'),
      }),
    )
  }
  main()
  //} else if (args['release-pre-check']) {
  // - verify-changelog
  // - verify versions
  // - verify-commits
  // - verify-installed-versions
} else {
  execute(() => {
    throw new Error('Invalid option provided')
  })
}
