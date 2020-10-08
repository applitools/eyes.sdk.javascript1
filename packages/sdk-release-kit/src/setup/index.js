const fs = require('fs')
const path = require('path')

function createDotFolder(packageDir) {
  const workingDir = path.join(packageDir, '.bongo')
  if (!fs.existsSync(workingDir)) fs.mkdirSync(workingDir)
}

module.exports = {
  createDotFolder,
}
