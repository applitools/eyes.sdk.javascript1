const path = require('path')
const {readFileSync} = require('fs')
const {convertSdkNameToReportName, sendNotification} = require('./send-report-util')
const {getLatestReleaseEntries} = require('../changelog')

async function sendReleaseNotification(
  {sdkName, sdkVersion, changeLog, testCoverageGap},
  recipient,
) {
  const payload = {
    sdk: sdkName,
    version: sdkVersion,
    changeLog,
    testCoverageGap,
    specificRecipient: recipient,
  }
  const result = await sendNotification(payload)
  if (!result.isSuccessful)
    throw new Error(
      `There was a problem sending the release notification: status ${result.status} with message ${result.message}`,
    )
}

module.exports = async (targetFolder, recipient) => {
  const changelogContents = readFileSync(path.resolve(targetFolder, 'CHANGELOG.md'), 'utf8')
  const {name, version} = require(path.resolve(targetFolder, 'package.json'))
  const send = sendReleaseNotification.bind(
    undefined,
    {
      sdkName: convertSdkNameToReportName(name),
      sdkVersion: version,
      changeLog: getLatestReleaseEntries(changelogContents).join('\n'),
      testCoverageGap: 'TODO', // track in a file in the package, get it from there
    },
    recipient,
  )
  try {
    await send()
  } catch (error) {
    await send()
  }
}
