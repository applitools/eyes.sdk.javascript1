'use strict';

const axios = require('axios'); // eslint-disable-line node/no-unpublished-require
const { Eyes, Target, ConsoleLogHandler, RectangleSize } = require('../index'); // should be replaced to '@applitools/eyes-images'

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
    const response = await axios('https://www.google.com/logos/doodles/2018/tyrus-wongs-108th-birthday-6464919774953472.2-s.png', { responseType: 'arraybuffer' });
    const img = Buffer.from(response.data, 'binary');

    // Visual validation.
    await eyes.check('Google logo', Target.image(img));

    // End the test.
    await eyes.close();
  } finally {
    // If the test was aborted before eyes.close was called ends the test as aborted.
    await eyes.abort();
  }
})();
