# Contributing

## Building

_NOTE: [yarn](https://yarnpkg.com/en/docs/install) is required._

### Getting Started

Run the following from the root of the repo.

```sh
yarn install
```

or just

```sh
yarn
```


This will install the dependencies for the mono root, all packages, and link internal dependencies together.

### To disable linking (per package)

You can perform a focused installation of a package.

```sh
cd packages/package-name
yarn install --focused
```

_NOTE: this will only work for packages that are publicly available on `npm`. For details, read more [here](https://yarnpkg.com/blog/2018/05/18/focused-workspaces/)._

### Linting

Just like with `npm` you can run scripts.

Case-in-point, linting can be run this way. Either for all packages from the project root, or from an individual package.

```sh
yarn lint
```

or

```sh
cd packages/package-name
yarn lint
```

### Changelog

When contributing code to a package, add an entry to the changelog for that package (e.g., `packages/eyes-selenium/CHANGELOG.md`).

At the top of each changelog file is a section with the heading `## Unreleased`. Simply add a bullet to this section with a note about what you changed. This section will be used to automtically create a changelog entry when cutting a release.

_NOTE: If your change involves updating the version of an internal package, add the changelog entry from that internal package to the changelog of the package you are updating._

#### Verify workspace versions

Running `yarn vv` in a package folder will verify that its applitools dependencies (the ones considered workspaces in this repo) have the same versions as the local source code. This is important in order to have the latest verions while also keeping exact versioning.
To verify the entire workspace, run in the root folder `yarn workspaces run vv`.

To automatically fix mismatches, run `yarn vv --fix`, or in the root folder: `yarn workspaces run vv --fix`.

### Versioning & Publishing

You can version a package as part of publishing it.

```sh
cd packages/package-name
yarn publish --patch # or --minor or --major
```

This will automatically update the `package.json` and changelog for the package, commit them, and add a tag for the version. It will also publish the package to `npm` and push the version and its tag to GitHub.

_NOTE: If you don't provide a version argument, you will be prompted for a version._

_NOTE: Client facing SDKs have additional things that will run as part of versioning/publishing. They will run end-to-end coverage tests and send out a release notification.__

### Coverage tests

#### Custom

Test code is located at `sdk-shared/coverage-tests/custom`.
Tests use several utilities:

1. Eyes instantiation: `getEyes` from `sdk-shared/src/test-setup.js`. This helps in getting the right batch, api key, configuration (failure for new tests to avoid wrong baselines, match timeout 0 for better perf), and logging with env var.

2. Driver instantiation: use `cwd` to require `SpecDriver`, and build the driver with `spec.build`.

3. Browser presets: defined in `sdk-shared/src/test-setup.js` for use when building the driver. For example: `spec.build({browser: 'safari-11'})`.

#### Generic

TBD
