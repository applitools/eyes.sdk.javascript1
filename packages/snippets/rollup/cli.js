const yargs = require('yargs')
const {bundle, watch} = require('./commands')

yargs
  .usage('JS Snippets Builder')
  .usage('usage: $0 <command> [options]')
  .command('bundle', 'build output files')
  .command('watch', 'watch and (re)build output files')
  .option('format', {
    describe: 'output format',
    type: 'array',
    default: 'snippet',
  })
  .demandCommand(1, 'You need to specify a command before moving on')

run(yargs.argv)

async function run(argv) {
  const [command] = argv._
  const formats = argv.format
  if (command === 'bundle') {
    await bundle({formats})
  } else if (command === 'watch') {
    await watch({formats})
  }
}
