'use strict';

// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  suites: {
    selenium: 'e2e/*.spec.js',
    default: '*.spec.js',
  },
  capabilities: {
    browserName: 'chrome',
  },
  framework: 'jasmine2',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 300000,
  },
  onPrepare: () => {
    // we need this to get appName and testName and pass them to eyes.open in beforeEach
    jasmine.getEnv()
      .addReporter({
        specStarted: (result) => {
          global.testName = result.description;
          global.appName = result.fullName.replace(` ${result.description}`, '');
        },
      });
  },
};
