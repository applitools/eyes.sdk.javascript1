const fs = require('fs')
const path = require('path')

module.exports = packageDir => {
  const workingDir = path.join(packageDir, '.bongo')
  if (fs.statSync(workingDir).isDirectory()) {
    process.exit(0)
  }
  fs.mkdirSync(workingDir)
}
