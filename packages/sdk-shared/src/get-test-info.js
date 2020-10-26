const fetch = require('node-fetch')

async function getTestInfo(
  testResults,
  apiKey = process.env.APPLITOOLS_API_KEY_SDK || process.env.APPLITOOLS_API_KEY,
) {
  const url = `${testResults
    .getApiUrls()
    .getSession()}?format=json&AccessToken=${testResults.getSecretToken()}&apiKey=${apiKey}`

  const response = await fetch(url)
  return response.json()
}

module.exports = getTestInfo
