const chalk = require('chalk');

function deprecationWarning(deprecatedThing, newThing) {
  return chalk.yellow(
    `Notice: ${deprecatedThing} has been renamed. Please use ${newThing} instead.\n`,
  );
}

module.exports = deprecationWarning;
