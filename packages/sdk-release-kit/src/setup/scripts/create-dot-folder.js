const fs = require('fs')
const path = require('path')

module.exports = packageDir => {
  const workingDir = path.join(packageDir, '.bongo')
  if (!fs.existsSync(workingDir)) fs.mkdirSync(workingDir)
}
