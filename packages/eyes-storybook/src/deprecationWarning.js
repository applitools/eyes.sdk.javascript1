const chalk = require('chalk');

function deprecationWarning({deprecatedThing, newThing, isDead}) {
  return chalk.yellow(
    `Notice: ${deprecatedThing} has been renamed. Please use ${newThing} instead.\n`,
  );
}

module.exports = deprecationWarning;
