'use strict';

const path = require('path');
const fs = require('fs');

const TMP_PATH = path.resolve(__dirname, '../../.applitools');

function makeFakeT({ screenshotPath }) {
  return {
    takeScreenshot: async () => {
      if (!fs.existsSync(TMP_PATH)) {
        fs.mkdirSync(TMP_PATH);
      }
      const dest = path.resolve(TMP_PATH, path.basename(screenshotPath));
      fs.copyFileSync(screenshotPath, dest);
      return dest;
    },
  };
}

function makeFakeTestCafe() {
  return {
    ClientFunction,
  };

  function ClientFunction(func) {
    function run(...args) {
      return func.apply(this, args);
    }

    run.with = ({ boundTestRun }) => function runWith(...args) {
      return run.apply(boundTestRun || this, args);
    };

    return run;
  }
}

exports.makeFakeT = makeFakeT;
exports.makeFakeTestCafe = makeFakeTestCafe;
