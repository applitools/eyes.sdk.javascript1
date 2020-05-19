'use strict'
const axios = require('axios')

async function getApiData(testResults, apiKey = process.env.APPLITOOLS_API_KEY) {
  let response = await axios.get(
    `${testResults
      .getApiUrls()
      .getSession()}?format=json&AccessToken=${testResults.getSecretToken()}&apiKey=${apiKey}`,
  )
  return response.data
}

module.exports.getApiData = getApiData
