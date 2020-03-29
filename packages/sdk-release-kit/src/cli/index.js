#!/usr/bin/env node

const args = require('yargs').argv
const chalk = require('chalk')
const cwd = process.cwd()
const path = require('path')
const verifyChangelog = require('../changelog/scripts/verify-changelog')
const updateChangelog = require('../changelog/scripts/update-changelog')
const sendReleaseNotification = require('../send-report/scripts/send-release-notification')
const verifyVersions = require('../versions/scripts/verify-versions')
const verifyCommits = require('../versions/scripts/verify-commits')
const createDotFolder = require('../setup/scripts/create-dot-folder')
const packInstall = require('../dry-run/scripts/pack-install')
const verifyInstalledVersions = require('../versions/scripts/verify-installed-versions')
const lsDryRun = require('../dry-run/scripts/ls-dry-run.js')

;(async () => {
  async function execute(cb) {
    try {
      await cb()
    } catch (error) {
      console.log(chalk.red(error.message))
      process.exit(1)
    }
  }

  if (args['verify-changelog']) {
    execute(verifyChangelog.bind(undefined, cwd))
  } else if (args['update-changelog']) {
    execute(updateChangelog.bind(undefined, cwd))
  } else if (args['send-release-notification']) {
    execute(sendReleaseNotification.bind(undefined, args.recipient))
  } else if (args['verify-versions']) {
    execute(verifyVersions.bind(undefined, {isFix: args.fix, pkgPath: cwd}))
  } else if (args['verify-commits']) {
    const isForce = args.force || process.env.BONGO_VERIFY_COMMITS_FORCE
    execute(verifyCommits.bind(undefined, {pkgPath: cwd, isForce}))
  } else if (args['verify-installed-versions']) {
    execute(createDotFolder.bind(undefined, cwd))
    await execute(packInstall.bind(undefined, cwd))
    await execute(
      verifyInstalledVersions.bind(undefined, {
        pkgPath: cwd,
        installedDirectory: path.join('.bongo', 'dry-run'),
      }),
    )
  } else if (args['release-pre-check']) {
    execute(verifyChangelog.bind(undefined, cwd))
    execute(verifyVersions.bind(undefined, {isFix: args.fix, pkgPath: cwd}))
    const isForce = args.force || process.env.BONGO_VERIFY_COMMITS_FORCE
    execute(verifyCommits.bind(undefined, {pkgPath: cwd, isForce}))
    execute(createDotFolder.bind(undefined, cwd))
    await execute(packInstall.bind(undefined, cwd))
    await execute(
      verifyInstalledVersions.bind(undefined, {
        pkgPath: cwd,
        installedDirectory: path.join('.bongo', 'dry-run'),
      }),
    )
  } else if (args['ls-dry-run']) {
    execute(lsDryRun)
  } else {
    execute(() => {
      throw new Error('Invalid option provided')
    })
  }
})()
