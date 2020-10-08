const {describe, it, before, after} = require('mocha');
const {expect} = require('chai');
const path = require('path');
const testServer = require('@applitools/sdk-shared/src/run-test-server');
const {sh} = require('@applitools/sdk-shared/src/process-commons');
const {delay: psetTimeout, presult} = require('@applitools/functional-commons');
const {version} = require('../../package.json');

describe('eyes-storybook', () => {
  let closeTestServer, showLogsOrig;
  before(async () => {
    closeTestServer = (await testServer({port: 7272})).close;
    showLogsOrig = process.env.APPLITOOLS_SHOW_LOGS;
    if (showLogsOrig) {
      console.warn(
        '\nThis test disables APPLITOOLS_SHOW_LOGS so dont be surprised son !!! See: test/e2e/eyes-storybook.e2e.test.js:15\n',
      );
    }
    delete process.env.APPLITOOLS_SHOW_LOGS;
  });

  after(async () => {
    await closeTestServer();
    process.env.APPLITOOLS_SHOW_LOGS = showLogsOrig;
  });

  it('renders test storybook', async () => {
    const [err, result] = await presult(
      sh(
        `node ${path.resolve(__dirname, '../../bin/eyes-storybook')} -f ${path.resolve(
          __dirname,
          'happy-config/applitools.config.js',
        )}`,
        {
          spawnOptions: {stdio: 'pipe'},
        },
      ),
    );

    const stdout = err ? err.stdout : result.stdout;
    const stderr = err ? err.stderr : result.stderr;

    const normalizedStdout = stdout
      .replace(
        /See details at https\:\/\/.+.applitools.com\/app\/test-results\/.+/g,
        'See details at <some_url>',
      )
      .replace(/Total time\: \d+ seconds/, 'Total time: <some_time> seconds')
      .replace(/\[(Chrome|Firefox) \d+\.\d+\]/g, '[$1 VER]');
    expect(normalizedStdout).to.equal(
      `Using @applitools/eyes-storybook version ${version}.


Ignoring parameters for story: "with some emoji Button" since they are not serilizable. Error: "Converting circular structure to JSON
    --> starting at object with constructor 'Object'
    --- property 'inner' closes the circle"

See details at <some_url>

[EYES: TEST RESULTS]:

Button with-space yes-indeed: a yes-a b [Chrome VER] [1024x768] - Passed
Button with-space yes-indeed/nested with-space yes: b yes-a b [Chrome VER] [1024x768] - Passed
Button with-space yes-indeed/nested with-space yes/nested again-yes a: c yes-a b [Chrome VER] [1024x768] - Passed
Button: with some emoji [Chrome VER] [1024x768] - Passed
Button: with text [Chrome VER] [1024x768] - Passed
Image: image [Chrome VER] [1024x768] - Passed
Interaction: Popover [Chrome VER] [1024x768] - Passed
Nested: story 1 [Chrome VER] [1024x768] - Passed
Nested/Component: story 1.1 [Chrome VER] [1024x768] - Passed
Nested/Component: story 1.2 [Chrome VER] [1024x768] - Passed
Responsive UI: Red/green [Chrome VER] [1024x768] - Passed
RTL: local RTL config [Chrome VER] [1024x768] - Passed
RTL: local RTL config [rtl] [Chrome VER] [1024x768] - Passed
RTL: should also do RTL [Chrome VER] [1024x768] - Passed
RTL: should also do RTL [rtl] [Chrome VER] [1024x768] - Passed
SOME section|Nested/Component: story 1.1 [Chrome VER] [1024x768] - Passed
SOME section|Nested/Component: story 1.2 [Chrome VER] [1024x768] - Passed
Text: appears after a delay [Chrome VER] [1024x768] - Passed
Wow|one with-space yes-indeed/nested with-space yes/nested again-yes a: c yes-a b [Chrome VER] [1024x768] - Passed


No differences were found!
See details at <some_url>
Total time: <some_time> seconds


Important notice: Your Applitools visual tests are currently running with a concurrency value of 10.
This means that only up to 10 visual tests can run in parallel, and therefore the execution might be slower.
If your Applitools license supports a higher concurrency level, learn how to configure it here: https://www.npmjs.com/package/@applitools/eyes-storybook#concurrency.
Need a higher concurrency in your account? Email us @ sdr@applitools.com with your required concurrency level.


`,
    );

    expect(stderr).to.equal(`- Starting storybook server
✔ Storybook was started
- Reading stories
✔ Reading stories
- Done 0 stories out of 19
✔ Done 19 stories out of 19
`);
  });

  it('fails with proper message when failing to get stories because of undetermined version', async () => {
    const promise = presult(
      sh(`node ./bin/eyes-storybook -u http://localhost:7272 --read-stories-timeout=500`, {
        spawnOptions: {stdio: 'pipe'},
      }),
    );
    const results = await Promise.race([promise, psetTimeout(5000).then(() => 'not ok')]);

    expect(results).not.to.equal('not ok');

    expect(results[0].stdout).to.equal(`Using @applitools/eyes-storybook version ${version}.


`);

    expect(results[0].stderr).to.equal(`- Reading stories
✖ Error when reading stories: could not determine storybook version in order to extract stories
`);
  });

  it('fails with proper message when failing to get stories because of navigation timeout', async () => {
    const promise = presult(
      sh(`node ./bin/eyes-storybook --read-stories-timeout=10 -u http://localhost:9001`, {
        spawnOptions: {stdio: 'pipe'},
      }),
    );
    const results = await Promise.race([promise, psetTimeout(3000).then(() => 'not ok')]);

    expect(results).not.to.equal('not ok');

    expect(results[0].stdout).to.equal(`Using @applitools/eyes-storybook version ${version}.


`);

    expect(results[0].stderr).to.equal(`- Reading stories
✖ Error when loading storybook. Navigation Timeout Exceeded: 10ms exceeded
`);
  });

  it('fails with proper message when failing to get stories because storybook is loading too slowly', async () => {
    const promise = presult(
      sh(
        `node ./bin/eyes-storybook --read-stories-timeout=1000 -u http://localhost:7272/storybook-loading.html`,
        {
          spawnOptions: {stdio: 'pipe'},
        },
      ),
    );
    const results = await Promise.race([promise, psetTimeout(5000).then(() => 'not ok')]);

    expect(results).not.to.equal('not ok');

    expect(results[0].stdout).to.equal(`Using @applitools/eyes-storybook version ${version}.


`);

    expect(results[0].stderr).to.equal(`- Reading stories
✖ Error when reading stories: storybook is loading for too long
`);
  });

  it('renders multi browser versions', async () => {
    const [err, result] = await presult(
      sh(
        `node ${path.resolve(__dirname, '../../bin/eyes-storybook')} -f ${path.resolve(
          __dirname,
          'happy-config/single.config.js',
        )}`,
        {
          spawnOptions: {stdio: 'pipe'},
        },
      ),
    );

    const stdout = err ? err.stdout : result.stdout;
    const stderr = err ? err.stderr : result.stderr;

    const normalizedStdout = stdout
      .replace(
        /See details at https\:\/\/.+.applitools.com\/app\/test-results\/.+/g,
        'See details at <some_url>',
      )
      .replace(/Total time\: \d+ seconds/, 'Total time: <some_time> seconds')
      .replace(/\[(Chrome|Firefox) \d+\.\d+\]/g, '[$1 VER]');

    expect(normalizedStdout).to.equal(`Using @applitools/eyes-storybook version ${version}.


See details at <some_url>

[EYES: TEST RESULTS]:

Single category: Single story [Chrome VER] [640x480] - Passed
Single category: Single story [Chrome VER] [640x480] - Passed
Single category: Single story [Firefox VER] [640x480] - Passed


No differences were found!
See details at <some_url>
Total time: <some_time> seconds


Important notice: Your Applitools visual tests are currently running with a concurrency value of 10.
This means that only up to 10 visual tests can run in parallel, and therefore the execution might be slower.
If your Applitools license supports a higher concurrency level, learn how to configure it here: https://www.npmjs.com/package/@applitools/eyes-storybook#concurrency.
Need a higher concurrency in your account? Email us @ sdr@applitools.com with your required concurrency level.


`);

    expect(stderr).to.equal(`- Starting storybook server
✔ Storybook was started
- Reading stories
✔ Reading stories
- Done 0 stories out of 1
✔ Done 1 stories out of 1
`);
  });
});
