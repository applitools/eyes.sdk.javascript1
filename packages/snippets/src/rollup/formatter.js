const path = require('path')

const formats = {
  snippet(outputOptions, bundles) {
    const filename = path.basename(outputOptions.file)
    const file = bundles[filename]
    file.code = `module.exports=function(){\n${file.code}return ${outputOptions.name}.apply(this,arguments)\n}`
  },
  json(outputOptions, bundles) {
    const filename = path.basename(outputOptions.file)
    const file = bundles[filename]
    file.fileName = `${path.basename(outputOptions.file, path.extname(outputOptions.file))}.json`
    file.code = JSON.stringify({
      code: `function(){${file.code}return ${outputOptions.name}.apply(this,arguments)}`,
    })
  },
}

module.exports = function() {
  const state = {}
  return {
    outputOptions(outputOptions) {
      if (outputOptions.format === 'snippet' || outputOptions.format === 'json') {
        state.format = outputOptions.format
        outputOptions.format = 'iife'
      }
    },
    generateBundle(outputOptions, bundles) {
      console.log(bundles)
      if (state.format === 'snippet' || state.format === 'json') {
        formats[state.format](outputOptions, bundles)
      }
    },
  }
}
