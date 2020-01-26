# eyes-sdk-javascript 
## Building

_NOTE: [yarn](https://yarnpkg.com/en/docs/install) is required.

### Getting Started

Run the following from the root of the repo.

```sh
> yarn install
```

This will install the dependencies for the mono root, all packages, and link internal dependencies together.

### To disable linking (per package)

You can perform a focused installation of a package.

```sh
> cd packages/package-name
> yarn install --focused
```

_NOTE: this will only work for packages that are publicly available on `npm`. For details, read more [here](https://yarnpkg.com/blog/2018/05/18/focused-workspaces/)._

### Linting

Just like with `npm` you can run scripts.

Case-in-point, linting can be run this way. Either for all packages from the project root, or from an individual package.

```sh
> yarn lint
```

or

```sh
> cd packages/package-name
> yarn lint
```

### Versioning

You can version a package before publishing it with the `version` command.

```sh
> cd packages/package-name
> yarn version --patch
> yarn version --minor
> yarn version --major
```

This will automatically update the `package.json` for the package, commit it, and add a tag for the version.

### Publishing

You can then release the package with the `publish` command.

```sh
> yarn publish
```

This will publish the package to `npm` and push the version and its tag to GitHub

_NOTE: if you haven't run `version` before publishing then it will prompt you for the version information._
