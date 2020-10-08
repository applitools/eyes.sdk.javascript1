# `sdk-coverage-tests`

## Implementations

- [eyes-selenium](../eyes-selenium/test/coverage/index.js)
- [eyes-testcafe](../eyes-testcafe/test/coverage/index.js)
- [eyes-webdriverio-4](../eyes-webdriverio-4/test/coverage/index.js)
- [eyes-webdriverio-5](../eyes-webdriverio-5/test/coverage/index.js)

## Workflow

1. Generate tests
2. Run tests (handled by the SDK)
3. Process results

For an example of how this has been done in other SDKs, see the `coverage` scripts in a `package.json` for one of the implementations listed above.

### Generate tests

After an SDK has specified an implementation, the command-line utility can be used to generate tests files either with the built-in generator (e.g., for Mocha) or with one the SDK implementation has provided.

Each test will be generated into its own file and saved to `test/coverage/generic`.

### Running tests

Once the tests have been created you can run them from the SDK.

The only hard requirement is that the results be outputted to an aggregate file using XUnit XML. The expected filename is `coverage-test-report.xml`.

### Process results

After a test run completes and an XML result file has been rendered, the coverage-test CLI can be invoked to process it and send the results to the QA dashboard.

## Running with containers

In order to pick up the correct baselines, you need the following things:

- the correct API key
- the correct app environment

The coverage-tests CLI looks to see that the SDK team API has been set to the `APPLITOOLS_API_KEY_SDK` environment variable. It will warn if it hasn't been set. If it has been set, it will use it in the generated test files.

For most baselines, the correct environment is Chrome running on Linux. If you're running this on your local development machine then there's nothing to do. But if you're running on a Mac, you'll end up comparing against the wrong baseline images. The simplest thing to do in this case is to use a Docker image.

The Selenium project maintains an image for standalone-chrome which you can spin up with the following command.

```
docker run -p 4444:4444 --shm-size=2g selenium/standalone-chrome:3.141.59-zinc
```

To use this when running coverage-tests you'll want to become familiar with a couple of environment variables.

- `SKIP_CHROMEDRIVER`
- `CVG_TESTS_REMOTE`

### SKIP_CHROMEDRIVER

When running coverage-tests for the WDIO SDKs, they implicitly look for a driver running on `http://localhost:4444/wd/hub`. To support this, the coverage-tests script in the SDK spins up an instance of ChromeDriver on this port as a preliminary step.

But, instead, if you want to use the Docker container specified above, run the tests with `SKIP_CHROMEDRIVER=true`.

### CVG_TESTS_REMOTE

When running coverage-tests on eyes-selenium, no preliminary steps are taken by the SDK's coverage-tests script since Selenium handles this behind the scenes.

If you want to use the Docker container, specify `CVG_TESTS_REMOTE=http://localhost:4444/wd/hub`.
