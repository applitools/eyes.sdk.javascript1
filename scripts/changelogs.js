'use strict'

const opn = require('open')
const path = require('path')
const util = require('util')
const {readFile, writeFile} = require('fs')
const preadFile = util.promisify(readFile)
const pwriteFile = util.promisify(writeFile)

const HISTORY_SIZE = 5
const PACKAGE_DIRS = [
  'eyes-selenium',
  'eyes-webdriverio-4',
  'eyes-webdriverio-5',
  'eyes-storybook',
  'eyes-cypress',
  'eyes-testcafe',
  'eyes-selenium-3',
  'eyes-webdriverio-4-service',
  'eyes-webdriverio-5-service',
  'eyes-images',
  'dom-snapshot',
  'dom-capture',
  'eyes-sdk-core',
  'eyes-common',
]

;(async () => {
  let [content, packagesInfo] = await Promise.all([loadTemplatePage(), loadPackagesInfo()])
  content = addInfoToPage(content, packagesInfo)
  await saveHtml(content)
  openPage()
})()

async function loadTemplatePage() {
  const pagePath = path.join(__dirname, 'changelogs-template.html')
  return preadFile(pagePath, {encoding: 'utf8'})
}

async function saveHtml(content) {
  const pagePath = path.join(__dirname, '.tmp-changelogs.html')
  await pwriteFile(pagePath, content, {encoding: 'utf8'})
}

function openPage() {
  const pagePath = path.join(__dirname, '.tmp-changelogs.html')
  opn(`file://${pagePath}`)
}

function addInfoToPage(content, packagesInfo) {
  const scriptTag = `
    <script id="info">
        window.packagesInfo = ${JSON.stringify(packagesInfo)};
    <\/script>`
  return content.replace(/<script id="info">[\s\S]*?<\/script>/, scriptTag.trim())
}

// Return {changes: [{version, entries:[]}], dirName}
async function loadPackagesInfo() {
  const parsePackages = PACKAGE_DIRS.map(async dirName => {
    const changelogPath = path.join(__dirname, '../packages/', dirName, 'CHANGELOG.md')
    let changelog = await preadFile(changelogPath, {encoding: 'utf8'})
    changelog = changelog.substr(0, 100 * 50)
    return {changes: infoFromChangelog(changelog), dirName}
  })
  return Promise.all(parsePackages)

  function infoFromChangelog(content) {
    const lines = content.split('\n')
    const info = []
    for (const line of lines) {
      let m = line.match(/##\s*(.+)/)
      if (m && info.length > HISTORY_SIZE) {
        break
      }
      if (m) {
        info.push({version: m[1]})
        continue
      }
      m = line.match(/(^[^#]\s*.+)/)
      if (m) {
        info[info.length - 1].entries = info[info.length - 1].entries || []
        info[info.length - 1].entries.push(m[1])
      }
    }
    return info
  }
}
