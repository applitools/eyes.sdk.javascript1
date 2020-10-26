const vm = require('vm')
const fs = require('fs')
const fetch = require('node-fetch')
const chalk = require('chalk')
const {useFramework} = require('../framework')
const {isUrl} = require('../common-util')

async function prepareTests(config) {
  const source = isUrl(config.testsPath)
    ? await fetch(config.testsPath).then(response => response.text())
    : fs.readFileSync(config.testsPath).toString()

  const {context, api} = useFramework()
  try {
    vm.runInContext(source, vm.createContext({...api, process}))
  } catch (err) {
    if (err.constructor.name !== 'ReferenceError') throw err
    const stack = err.stack.split('\n')
    const [columnNumber, lineNumber] = stack[5].split(':').reverse()
    console.log(
      chalk.yellow(`Error during tests loading ${config.testsPath}:${columnNumber}:${lineNumber}`),
      '\n',
    )
    const [line, caret] = stack.slice(1, 3)
    console.log(chalk.cyan(line))
    console.log(chalk.yellow(caret))
    throw new ReferenceError(err.message)
  }

  return context
}

module.exports = {prepareTests}
