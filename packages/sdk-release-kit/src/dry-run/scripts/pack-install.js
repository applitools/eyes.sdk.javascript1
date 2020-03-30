const fs = require('fs')
const path = require('path')
const {exec} = require('child_process')
const {promisify} = require('util')
const pexec = promisify(exec)

module.exports = async packageDir => {
  const workingDir = path.join(packageDir, '.bongo')
  const installDir = path.join(workingDir, 'dry-run')
  const packFile = path.join(workingDir, `dry-run.tgz`)
  await pexec(`rm -rf ${installDir}`)
  await pexec(`rm -rf ${packFile}`)
  fs.mkdirSync(installDir)
  await pexec(`yarn pack --filename ${packFile}`)
  await pexec(`npm install ${packFile} --prefix ${installDir}`)
}
