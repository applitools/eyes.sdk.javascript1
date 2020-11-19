'use strict';
const chalk = require('chalk');
const MSG = `
Important notice: Your Applitools visual tests are currently running with a testConcurrency value of 5.
This means that only up to 5 visual tests can run in parallel, and therefore the execution might be slower.
If your Applitools license supports a higher concurrency level, learn how to configure it here: https://www.npmjs.com/package/@applitools/eyes-cypress#concurrency.
Need a higher concurrency in your account? Email us @ sdr@applitools.com with your required concurrency level.`;
module.exports = {concurrencyMsg: chalk.yellow(MSG), msgText: MSG};
