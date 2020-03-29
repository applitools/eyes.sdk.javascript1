const {exec} = require('child_process')
const {promisify} = require('util')
const pexec = promisify(exec)

module.exports = async () => {
  const {stdout} = await pexec(`cd .bongo/dry-run; npm ls; cd -`)
  console.log(stdout)
}
