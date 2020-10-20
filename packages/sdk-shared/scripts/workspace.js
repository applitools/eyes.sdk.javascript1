'use strict'

const forEachPackage = require('../src/for-each-package')
const {sh} = require('../src/process-commons')

;(async function main() {
  const commands = process.argv.slice(2)
  await forEachPackage(runCommands)

  function runCommands() {
    return commands.reduce((p, cmd) => p.then(() => sh(cmd)), Promise.resolve())
  }
})().catch(err => {
  console.log(err)
  process.exit(1)
})
