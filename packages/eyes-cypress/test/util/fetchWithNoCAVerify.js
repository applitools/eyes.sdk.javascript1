const https = require('https');
const fetch = require('node-fetch');
const agent = new https.Agent({
  rejectUnauthorized: false,
});

module.exports = (url, options = {}) => fetch(url, Object.assign(options, {agent}));
