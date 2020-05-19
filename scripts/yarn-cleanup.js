const {exec} = require('child_process')
const {promisify} = require('util')
const pexec = promisify(exec)
const path = require('path')

;(async () => {
  await pexec(`rm -rf ${path.join(__dirname, 'node_modules', 'canvas')}`)
})()
