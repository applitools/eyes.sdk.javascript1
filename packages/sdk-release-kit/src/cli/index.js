#!/usr/bin/env node

const args = require('yargs')
  .command(
    ['preversion', 'release-pre-check', 'pre-version'],
    'Run all verification checks pre-release',
  )
  .command(['version'], 'Supportive steps to version a package')
  .command(['postversion, post-version'], 'Supportive steps to after a package has been versioned')
  .command(['lint', 'l'], 'Static code analysis ftw')
  .command(['verify-changelog', 'vch'], 'Verify changelog has unreleased entries')
  .command(
    ['verify-commits', 'vco'],
    'Verify no unreleased changes for internal dependencies exist',
  )
  .command(['verify-versions', 'vv'], 'Verify consistent versions in relevant packages')
  .command(['verify-installed-versions', 'viv'], 'Verify correct dependencies are installable')
  .command(['ls-dry-run', 'ls'], 'Display dependencies from a verify-installed-versions run')
  .command(['update-changelog', 'uc'], 'Create release entry in the changelog')
  .command(
    ['send-release-notification', 'hello-world'],
    'Send a notification that a has been released',
  )
  .demandCommand()
  .help().argv
const chalk = require('chalk')
const cwd = process.cwd()
const path = require('path')
const {verifyChangelog, writeReleaseEntryToChangelog} = require('../changelog')
const {packInstall, lsDryRun} = require('../dry-run')
const {lint} = require('../lint')
const sendReleaseNotification = require('../send-report')
const {createDotFolder} = require('../setup')
const {verifyCommits, verifyInstalledVersions, verifyVersions} = require('../versions')
const {gitAdd, gitCommit, gitPullWithRebase, gitPushWithTags, isStagedForCommit} = require('../git')

;(async () => {
  try {
    const command = args._[0]
    switch (command) {
      case 'lint':
      case 'l':
        return await lint(cwd)
      case 'ls-dry-run':
      case 'ls':
        return lsDryRun()
      case 'postversion':
      case 'post-version':
        await gitPushWithTags()
        if (!args['skip-release-notification']) {
          await sendReleaseNotification(cwd, args.recipient)
        }
        return
      case 'preversion':
      case 'pre-version':
      case 'release-pre-check':
        await gitPullWithRebase()
        await lint(cwd)
        await verifyChangelog(cwd)
        await verifyVersions({isFix: args.fix, pkgPath: cwd})
        await verifyCommits({pkgPath: cwd, isForce: process.env.BONGO_VERIFY_COMMITS_FORCE})
        createDotFolder(cwd)
        await packInstall(cwd)
        return await verifyInstalledVersions({
          pkgPath: cwd,
          installedDirectory: path.join('.bongo', 'dry-run'),
        })
      case 'send-release-notification':
      case 'hello-world':
        return await sendReleaseNotification(cwd, args.recipient)
      case 'update-changelog':
      case 'uc':
        return writeReleaseEntryToChangelog(cwd)
      case 'verify-changelog':
      case 'vch':
        return await verifyChangelog(cwd)
      case 'verify-commits':
      case 'vco':
        return await verifyCommits({pkgPath: cwd, isForce: process.env.BONGO_VERIFY_COMMITS_FORCE})
      case 'verify-installed-versions':
      case 'viv':
        createDotFolder(cwd)
        await packInstall(cwd)
        return await verifyInstalledVersions({
          pkgPath: cwd,
          installedDirectory: path.join('.bongo', 'dry-run'),
        })
      case 'verify-versions':
      case 'vv':
        const isFix = args.fix
        await verifyVersions({isFix, pkgPath: cwd})
        if (isFix && !args.skipCommit) {
          await gitAdd('package.json')
          await gitAdd('CHANGELOG.md')
          if (await isStagedForCommit('package.json', 'CHANGELOG.md')) {
            await gitCommit()
          }
        }
        break
      case 'version':
        writeReleaseEntryToChangelog(cwd)
        return await gitAdd('CHANGELOG.md')
      default:
        throw new Error('Invalid option provided')
    }
  } catch (error) {
    console.log(chalk.red(error.message))
    process.exit(1)
  }
})()
