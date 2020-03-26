const fs = require('fs')
const path = require('path')

module.exports = packageDir => {
  const workingDir = path.join(packageDir, '.bongo')
  try {
    fs.statSync(workingDir)
  } catch (error) {
    fs.mkdirSync(workingDir)
  }
}
