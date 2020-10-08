# `@applitools/sdk-fake-eyes-server`

Fake Eyes server for testing purposes

## Usage

1. From `Node.js` code:

```js
const {startFakeEyesServer} = require('@applitools/sdk-fake-eyes-server')

const {port, close} = await startFakeEyesServer();
```

2. Standalone:

use the `PORT` environment variable to control the port

```sh
npm i @applitools/sdk-fake-eyes-server
PORT=3000 npx fake-eyes-server
```

## Configuration

- `expectedFolder`: A folder that has files of images with the proper naming to act as baselines for image comparison.
- `updateFixtures`: set this to `true` in order to save the uploaded images to files.
- `port`: The port to run the server. Passing `0` or not passing will run the server on a random free port.
- `logger`: An object of the shape `{log, verbose}`, e.g. `console`.
- `hangUp`: When true, the server will always hang up the underlying socket and will result with a "socket hang up" network error on the client side.
