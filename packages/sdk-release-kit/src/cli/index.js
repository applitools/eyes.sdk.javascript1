#!/usr/bin/env node

const yargs = require('yargs')
const chalk = require('chalk')
const path = require('path')
const fs = require('fs')
const {verifyChangelog, writeReleaseEntryToChangelog} = require('../changelog')
const {packInstall, lsDryRun} = require('../dry-run')
const {lint} = require('../lint')
const sendReleaseNotification = require('../send-report')
const {createDotFolder} = require('../setup')
const {verifyCommits, verifyInstalledVersions, verifyVersions} = require('../versions')
const {gitAdd, gitCommit, gitPushWithTags, isChanged, gitStatus} = require('../git')
const {yarnInstall, yarnUpgrade, verifyUnfixedDeps} = require('../yarn')

yargs
  .config({cwd: process.cwd()})
  .command(
    ['preversion', 'release-pre-check', 'pre-version'],
    'Run all verification checks pre-release',
    {
      skipVerifyInstalledVersions: {alias: 'sviv', type: 'boolean'},
      skipVerifyVersions: {alias: 'svv', type: 'boolean'},
      skipDeps: {alias: 'sd', type: 'boolean'},
      skipCommit: {alias: 'sc', type: 'boolean', default: false},
    },
    async args => {
      const {cwd} = args
      if (!args.skipDeps) {
        console.log('[bongo preversion] yarn install')
        await yarnInstall()
      }
      console.log('[bongo preversion] lint')
      await lint(cwd)
      console.log('[bongo preversion] verify changelog')
      verifyChangelog(cwd)
      console.log('[bongo preversion] verify unfixed dependencies')
      verifyUnfixedDeps(cwd)
      if (!args.skipVerifyVersions) {
        console.log('[bongo preversion] verify commits')
        await verifyCommits({pkgPath: cwd}).catch(err => console.log(err.message))
      }
      try {
        console.log('[bongo preversion] verify versions')
        verifyVersions({pkgPath: cwd})
      } catch (err) {
        console.log(chalk.yellow(err.message))
      }
      if (!args.skipVerifyInstalledVersions) {
        console.log('[bongo preversion] verify installed versions')
        createDotFolder(cwd)
        await packInstall(cwd)
        await verifyInstalledVersions({
          pkgPath: cwd,
          installedDirectory: path.join('.bongo', 'dry-run'),
        })
      }
      await commitFiles(args)
      console.log('[bongo preversion] done!')
    },
  )
  .command(['version'], 'Supportive steps to version a package', {}, async ({cwd}) => {
    writeReleaseEntryToChangelog(cwd)
    await gitAdd('CHANGELOG.md')
  })
  .command(
    ['postversion, post-version'],
    'Supportive steps to after a package has been versioned',
    {
      recipient: {alias: 'r', type: 'string'},
      skipReleaseNotification: {alias: 'sr', type: 'boolean'},
    },
    async args => {
      await gitPushWithTags()
      if (!args.skipReleaseNotification) {
        await sendReleaseNotification(args.cwd, args.recipient)
      }
    },
  )
  .command(['lint', 'l'], 'Static code analysis ftw', {}, async ({cwd}) => await lint(cwd))
  .command(['verify-changelog', 'vch'], 'Verify changelog has unreleased entries', {}, ({cwd}) =>
    verifyChangelog(cwd),
  )
  .command(
    ['verify-commits', 'vco'],
    'Verify no unreleased changes for internal dependencies exist',
    {},
    async ({cwd}) => await verifyCommits({pkgPath: cwd}),
  )
  .command(
    ['verify-versions', 'vv'],
    'Verify consistent versions in relevant packages',
    {},
    async ({cwd}) => {
      try {
        verifyVersions({pkgPath: cwd})
      } catch (err) {
        console.log(chalk.yellow(err.message))
      }
    },
  )
  .command(
    ['verify-installed-versions', 'viv'],
    'Verify correct dependencies are installable',
    {},
    async ({cwd}) => {
      createDotFolder(cwd)
      await packInstall(cwd)
      await verifyInstalledVersions({
        pkgPath: cwd,
        installedDirectory: path.join('.bongo', 'dry-run'),
      })
    },
  )
  .command(
    ['ls-dry-run', 'ls'],
    'Display dependencies from a verify-installed-versions run',
    {},
    () => lsDryRun(),
  )
  .command(['update-changelog', 'uc'], 'Create release entry in the changelog', {}, ({cwd}) =>
    writeReleaseEntryToChangelog(cwd),
  )
  .command(
    ['send-release-notification', 'hello-world'],
    'Send a notification that an sdk has been released',
    {recipient: {alias: 'r', type: 'string'}},
    async args => await sendReleaseNotification(args.cwd, args.recipient),
  )
  .command(
    ['deps', 'd'],
    'update internal deps',
    {
      skipCommit: {type: 'boolean', default: false},
      upgradeAll: {type: 'boolean', default: false},
    },
    async args => {
      console.log('[bongo deps] running...')
      await deps(args)
      console.log('[bongo deps] updated deps. now committing...')
      await commitFiles(args)
      console.log('[bongo deps] done')
    },
  )
  .demandCommand(1, 'exit')
  .fail((msg, error, args) => {
    if (msg === 'exit') {
      return args.showHelp()
    }
    const command = process.argv[2]
    if (process.argv.includes('--verbose')) {
      console.log(error)
    } else {
      console.log(chalk.red(error.message))
      console.log(`run "npx bongo ${command} --verbose" to see stack trace`)
    }
    process.exit(1)
  })
  .wrap(yargs.terminalWidth())
  .help().argv

async function deps({cwd, upgradeAll}) {
  verifyUnfixedDeps(cwd)
  await yarnUpgrade({
    folder: cwd,
    upgradeAll,
  })
}

async function commitFiles({cwd, skipCommit}) {
  if (!skipCommit) {
    console.log('[bongo] commit files running...\n', (await gitStatus()).stdout)
    const files = ['package.json', 'CHANGELOG.md', 'yarn.lock']
    for (const file of files) {
      // git add fails when trying to add files that weren't changed
      if (await isChanged(file)) {
        console.log(`[bongo] git add changed file: ${file}`)
        await gitAdd(file)
      }
    }

    // git commit fails when trying to commit files that weren't changed
    console.log(`[bongo] committing changed files:\n${(await gitStatus()).stdout}`)
    if (await isChanged(...files)) {
      const pkgName = JSON.parse(fs.readFileSync(path.resolve(cwd, 'package.json'))).name
      await gitCommit(`[auto commit] ${pkgName}: upgrade deps`)
      console.log(`[bongo] actually committed files`)
    }
  }
}
