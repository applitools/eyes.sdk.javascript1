'use strict';

const fetch = require('node-fetch');
const { ConsoleLogHandler, RectangleSize } = require('@applitools/eyes.sdk.core');
const { Eyes, Target } = require('../index'); // should be replaced to '@applitools/eyes.images'

(async () => {
  // Initialize the eyes SDK and set your private API key.
  const eyes = new Eyes();
  // eyes.setApiKey('Your API Key');
  eyes.setLogHandler(new ConsoleLogHandler(false));
  // Define the OS.
  eyes.setHostOS('Windows 10');

  try {
    // Start the test and set the browser's viewport size to 800x600.
    await eyes.open('Image test', 'Javascript screenshot test!', new RectangleSize(800, 600));

    // Load page image and validate.
    const img = await (await fetch('https://applitools.com/images/tutorials/applitools_hero.png')).buffer();

    // Visual validation.
    await eyes.check('Contact-us page', Target.image(img));

    // End the test.
    await eyes.close();
  } finally {
    // If the test was aborted before eyes.close was called ends the test as aborted.
    await eyes.abortIfNotClosed();
  }
})();
