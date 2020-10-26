# SDK Agnostic Test-framework

SAT is internal CLI tool for Applitools SDKs. With the CLI, you can:

- Generate code: create test suites and generate test files.
- Send reports: send reports to the dashboard as part of release event.

## Usage

```sh
# To save as a dependency
$ npm install -D sdk-coverage-test
# or
$ yarn add --dev sdk-coverage-test

$ npx coverage-tests --help
```

## Generate Code

```sh
$ npx coverage-tests generate [config-path]
```

### Configuration

You can specify path to the configuration file (by default: `./test/coverage/index.js`) or specify almost everything using CLI options.

Configuration file should export a config object with next structure:

```ts
type Configuration = {
  name: string, // SDK name
  testsPath: string, // path or url to the file with tests declarations
  outPath: string, // path to save generated tests files
  metaPath: string, // path to save metadata file
  ext: string, // extension for generated files (e.g. `.spec.js`)
  initializeSdk: (tracker: Tracker, test: Test) => SDKEmitter, // skd constructor which returns all possible commands
  testFrameworkTemplate: (test: Test) => string,
  overrideTests: object
}
```

### Test declarations

All test declarations should be placed in a file (you can specify path to this file using `testsPath` configuration option). The file itself is a `js` file which have two special global methods `test` and `config`. You can use `test` method to add a test declaration and `config` method to set a declaration level tests configuration object.

```ts
type TestsConfiguration = {
  pages: {
    [key: string]: string
  }
}

type TestDeclaration = {
  page: string, // page (name or raw url) to visit in a very beginning of the test
  env: {
    url: string // driver url (better use browser and/or device to target a specific driver)
    browser: string, // browser name supported by sdk implementation (e.g. 'chrome' or 'ie-11')
    device: string, // device name supported by sdk implementation (e.g 'Pixel 4' or 'iPhone XS')
    app: string, // url to the native app to be run (make sens only in combination with `device`)
    headless: boolean, // whether browser should be ran in headless mode
    orientations: 'portrait' | 'landscape', // device orientation (make sens only in combination with `device`)
    proxy: { // driver proxy configuration
      http: string,
      https: string,
      server: string,
      ftp: string,
      bypass: string[]
    }
  },
  config: EyesConfiguration & {vg: boolean, check: 'classic' | 'fluent'}
  variants: { [key: string]: TestDeclaration }
  test: ({eyes: object, driver: object, assert: object}) => void
}

type SetTestsConfiguration = (config: TestsConfiguration) => void
type AddTestDeclaration = (string: name, test: TestDeclaration) => void
```

## Report

```sh
$ npx coverage-tests report [config-path]
```

TBD