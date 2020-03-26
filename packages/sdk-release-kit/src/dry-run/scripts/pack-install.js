const fs = require('fs')
const path = require('path')
const {exec} = require('child_process')
const {promisify} = require('util')
const pexec = promisify(exec)

module.exports = async packageDir => {
  const workingDir = path.join(packageDir, '.bongo', 'dry-run')
  await pexec(`rm -rf ${workingDir}`)
  await pexec(`rm -rf dry-run.tgz`)
  fs.mkdirSync(workingDir)
  await pexec(`yarn pack --filename dry-run.tgz`)
  await pexec(`npm install dry-run.tgz --prefix ${workingDir}`)
}
