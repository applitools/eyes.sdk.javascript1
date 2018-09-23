'use strict';
const chalk = require('chalk');
const fs = require('fs');
const detect = require('detect-port');
const startStorybookServer = require('./startStorybookServer');

async function validateAndPopulateConfig(config) {
  if (!config.apiKey) {
    const msg = `
${chalk.red('Environment variable APPLITOOLS_API_KEY is not set.')}
${chalk.green(`To fix:
1. Register for Applitools developer account at www.applitools.com/devreg
2. Get API key from menu
3. Set APPLITOOLS_API_KEY environment variable
  Mac/Linux: export APPLITOOLS_API_KEY=Your_API_Key_Here
  Windows: set APPLITOOLS_API_KEY=Your_API_Key_Here`)}`;
    throw new Error(msg);
  }

  if (!config.appName) {
    const packageJsonPath = `${process.cwd()}/package.json`;
    if (!fs.existsSync(packageJsonPath)) {
      const msg = `
${chalk.red(
        `App name is not defined. Normally we would take it by default from the package.json file located at the root of your project (${process.cwd()}), but the package.json file wasn't found.`,
      )}

${chalk.green(`To set an "appName", do one of the following:
Option 1: specify "appName" in the eyes.json file that should be placed in the current working directory.
Option 2: set an environment variable APPLITOOLS_APP_NAME.
Option 3: have a package.json file in the current working directory that has a "name" property. We'll take it from there.`)}

`;
      throw new Error(msg);
    }

    const packageJson = require(packageJsonPath);
    if (!packageJson.name) {
      const msg = `
${chalk.red(
        `App name is not defined. Normally we would take it by default from the package.json file located at the root of your project (${process.cwd()}), but the package.json file doesn't have a "name" property.`,
      )}

${chalk.green(
        `To fix, add a "name" property to your package.json file located at ${process.cwd()}\n`,
      )}

`;
      throw new Error(msg);
    }

    config.appName = packageJson.name;
  }

  if (!config.batchName) {
    config.batchName = config.appName;
  }

  if (config.storybookUrl) {
    config.startServer = false;
  }

  if (config.startServer) {
    try {
      config.storybookPort = await detect(config.storybookPort);
    } catch (ex) {
      console.log(chalk.red(`couldn't find available port around`, config.storybookPort));
    }

    config.storybookUrl = await startStorybookServer(
      Object.assign({packagePath: process.cwd()}, config),
    );
  } else {
    config.storybookUrl = config.storybookUrl.replace(/\/$/, '');
  }

  if (!config.storybookUrl) {
    console.info(
      chalk.red('The parameter "URL" was not passed. Pass a URL with the "-u" parameter.\n'),
    );
    console.log(chalk.green('For example:\nnpx eyes-storybook -u http://localhost:9009'));
    process.exit(1);
  }
}

module.exports = validateAndPopulateConfig;
