const {describe, it, _before, _after} = require('mocha');
const {expect} = require('chai');
const path = require('path');
const {delay: _psetTimeout, presult} = require('@applitools/functional-commons');
const {sh} = require('@applitools/sdk-shared/src/process-commons');

describe('eyes-storybook', () => {
  it('visual-grid-options', async () => {
    const [err, result] = await presult(
      sh(
        `node ${path.resolve(__dirname, '../../bin/eyes-storybook')} -f ${path.resolve(
          __dirname,
          'happy-config/visual-grid-options.config.js',
        )}`,
        {
          spawnOptions: {stdio: 'pipe'},
        },
      ),
    );
    const stdout = err ? err.stdout : result.stdout;

    expect(stdout.replace(/\[Chrome \d+.\d+\]/g, '[Chrome]')).to.include(
      'custom font: w/o font hinting [Chrome] [640x480] - Passed',
    );
  });
});
