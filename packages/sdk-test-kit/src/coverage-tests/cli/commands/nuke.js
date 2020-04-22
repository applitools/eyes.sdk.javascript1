const {exec} = require('child_process')
const os = require('os')

function doKaboom() {
  if (/win[32|64]/.test(os.platform())) return
  process.stdout.write('\nCleaning up rogue processes... ')
  exec(`ps ax | grep Chrome | grep headless | awk '{print $1}' | xargs kill -9`)
  exec(`ps ax | grep chromedriver | awk '{print $1}' | xargs kill -9`)
  console.log('Done!')
}

module.exports = {
  nuke: doKaboom,
}
