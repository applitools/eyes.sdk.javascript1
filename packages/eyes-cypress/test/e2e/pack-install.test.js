'use strict';
const {describe, it, after} = require('mocha');
const {exec} = require('child_process');
const {resolve} = require('path');
const {promisify: p} = require('util');
const fs = require('fs');
const path = require('path');

const rootPath = resolve(__dirname, '../..');
const rootPackageJson = require(resolve(rootPath, 'package.json'));
const pexec = p(exec);

const sourceTestAppPath = path.resolve(__dirname, '../fixtures/testApp');
const targetTestAppPath = path.resolve(__dirname, '../fixtures/testAppCopies/testApp-pack-install');

describe('package and install', () => {
  let packageFilePath;
  before(async () => {
    const {name, version} = rootPackageJson;
    const packageName = name
      .split('/')
      .map(x => x.replace('@', ''))
      .join('-');
    process.chdir(rootPath);
    packageFilePath = resolve(rootPath, `${packageName}-${version}.tgz`);
    await pexec(`npm pack`);

    if (fs.existsSync(targetTestAppPath)) {
      fs.rmdirSync(targetTestAppPath, {recursive: true});
    }
    await pexec(`cp -r ${sourceTestAppPath}/. ${targetTestAppPath}`);
    process.chdir(targetTestAppPath);

    await pexec(`npm install`);
    await pexec(`npm install ${packageFilePath}`);
  });

  after(async () => {
    fs.rmdirSync(targetTestAppPath, {recursive: true});
    fs.unlinkSync(packageFilePath);
  });

  it('runs properly on installed package', async () => {
    try {
      await pexec(
        './node_modules/.bin/cypress run --headless --config integrationFolder=cypress/integration-pack,pluginsFile=cypress/plugins/index-pack.js,supportFile=cypress/support/index-pack.js',
        {maxBuffer: 10000000},
      );
    } catch (ex) {
      console.error('Error!', ex.stdout);
      throw ex;
    }
  });

  it('compiles with ts defenition file on installed package', async () => {
    const exampleFile = resolve(__dirname, './ts-defs.example.ts');
    try {
      await pexec(`tsc ${exampleFile} --noEmit`, {
        maxBuffer: 10000000,
      });
    } catch (ex) {
      console.error('Typescript compiling error:', ex.stdout);
      throw 'Typescript compiling error';
    }
  });
});
