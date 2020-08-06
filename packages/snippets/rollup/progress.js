const chalk = require('chalk')

module.exports = function progress({total} = {}) {
  const loaded = new Set()

  return {
    name: 'progress',
    load(id) {
      loaded.add(id)
    },
    transform(_code, id) {
      if (!process.stdout.isTTY) {
        console.log(`(${chalk.red(loaded.size)}): ${id}`)
        return
      }
      process.stdout.clearLine()
      process.stdout.cursorTo(0)
      let output = ''
      if (total > 0) {
        const percent = Math.round((100 * loaded.size) / total)
        output += `${Math.min(100, percent)}% `
      }
      output += `(${chalk.green(`${loaded.size}/${total}`)}): ${id}`
      if (output.length < process.stdout.columns) {
        process.stdout.write(output)
      } else {
        process.stdout.write(output.substring(0, process.stdout.columns - 1))
      }
    },
    buildEnd() {
      if (loaded.size >= total) {
        loaded.clear()
      }
    },
  }
}
