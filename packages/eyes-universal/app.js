const yargs = require('yargs')
const makeSDK = require('./src/sdk')

const {argv} = yargs
  .example([
    ['$ eyes-universal', 'Run Eyes Universal server on default port (2107)'],
    ['$ eyes-universal --port 8080', 'Run Eyes Universal server on port 8080'],
    ['$ eyes-universal --no-singleton', 'Run Eyes Universal server in non-singleton mode'],
  ])
  .option('port', {
    description: 'run server on a specific port.',
    alias: 'p',
    type: 'number',
    default: 2107,
  })
  .option('singleton', {
    description:
      'run server on a singleton mode. It will prevent server to start in case the same server is already started.',
    alias: 's',
    type: 'boolean',
    default: true,
  })
  .option('idle-timeout', {
    description: 'time in minutes for server to stay responsible in case of idle.',
    type: 'boolean',
    default: 15,
    coerce(value) {
      return value * 60 * 1000
    },
  })

makeSDK(argv)
