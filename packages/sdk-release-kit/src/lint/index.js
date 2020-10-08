const {exec} = require('child_process')
const {promisify} = require('util')
const pexec = promisify(exec)
const path = require('path')

async function lint(targetDirectory) {
  const {scripts} = require(path.resolve(targetDirectory, 'package.json'))
  const hasYarnScript = !!scripts.lint
  try {
    hasYarnScript
      ? await pexec(`yarn lint`)
      : await pexec(`eslint . --ext .js --no-eslintrc --config ../../.eslintrc`)
  } catch (error) {
    throw new Error(error.stdout)
  }
}

module.exports = {
  lint,
}
