const fs = require('fs')
const path = require('path')
const {exec} = require('child_process')
const {promisify} = require('util')
const pexec = promisify(exec)

module.exports = async packageDir => {
  const workingDir = path.join(packageDir, '.bongo', 'dry-run')
  if (fs.statSync(workingDir).isDirectory()) {
    // needs Node 12
    fs.rmDirSync(workingDir, {recursive: true})
  }
  fs.mkdirSync(workingDir)
  await pexec(`yarn pack --filename dry-run.tgz`)
  await pexec(`npm install dry-run.tgz --prefix ${workingDir}`)
  fs.unlinkSync('dry-run.tgz')
}
