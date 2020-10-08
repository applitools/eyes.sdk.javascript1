'use strict'
const {BlobServiceClient} = require('@azure/storage-blob')

async function uploadToStorage({
  sdkName,
  reportId,
  isSandbox,
  payload,
  connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING,
}) {
  if (!connectionString) {
    throw new Error(
      'In order to upload test results to Azure, connection string needs to be provided. Usually this is done by defining the env var AZURE_STORAGE_CONNECTION_STRING. For more details: https://docs.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-nodejs?toc=/azure/developer/javascript/toc.json&bc=/azure/developer/breadcrumb/toc.json#copy-your-credentials-from-the-azure-portal',
    )
  }
  const folderName = `${sdkName}/${isSandbox ? 'sandbox' : 'prod'}`
  const dateStr = formatDate(new Date())
  const sandboxStr = isSandbox ? '-sandbox' : ''
  const reportIdStr = reportId ? `-${reportId}` : ''
  const blobName = `${dateStr}${sandboxStr}${reportIdStr}.json`
  const blobPath = `${folderName}/${blobName}`
  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
  const containerClient = blobServiceClient.getContainerClient('coverage-test-results')
  const blockBlobClient = containerClient.getBlockBlobClient(blobPath)
  return await blockBlobClient.upload(payload, payload.length)
}

function formatDate(d) {
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const date = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  const millis = String(d.getMilliseconds()).padStart(3, '0')
  return `${d.getFullYear()}-${month}-${date}-${hours}-${minutes}-${seconds}-${millis}`
}

module.exports = uploadToStorage
