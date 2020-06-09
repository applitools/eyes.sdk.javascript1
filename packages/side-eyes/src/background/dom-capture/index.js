import browser from 'webextension-polyfill'

export async function getDomCapture(tabId) {
  const enableDomCapture = await isDomCaptureEnabled()
  if (!enableDomCapture) return false

  return parseOutExternalFrames(await runDomScript(tabId, { name: 'domCapture' }))
}

export async function getDomSnapshot(tabId) {
  const enableLegacyDomSnapshot = await isLegacyDomSnapshotEnabled()
  const script = enableLegacyDomSnapshot
    ? {
        script: require('raw-loader!@applitools/dom-snapshot/dist/processPage.js'),
      }
    : { name: 'domSnapshot' }
  return (await runDomScript(tabId, script))[0]
}

export async function isDomCaptureEnabled() {
  const { enableDomCapture } = await browser.storage.local.get(['enableDomCapture'])

  return enableDomCapture
}

export async function isLegacyDomSnapshotEnabled() {
  const { enableLegacyDomSnapshot, experimentalEnabled } = await browser.storage.local.get([
    'enableLegacyDomSnapshot',
    'experimentalEnabled',
  ])

  return !!(enableLegacyDomSnapshot && experimentalEnabled)
}

let scriptCount = 0

async function runDomScript(tabId, script) {
  scriptCount++
  const id = scriptCount
  if (script.name) {
    browser.tabs.executeScript(tabId, {
      code: `window.execDomScript(${id}, '${script.name}').then(result => { window.__eyes__${id} = result; }).catch()`,
    })
  } else if (script.script) {
    browser.tabs.executeScript(tabId, {
      code: `(${script.script})().then(result => { window.__eyes__${id} = result; }).catch()`,
    })
  }

  return new Promise((res, rej) => {
    let startTime = new Date()
    const domCapRetry = setInterval(() => {
      let elapsed = new Date() - startTime
      if (elapsed >= 300000) {
        clearInterval(domCapRetry)
        rej('Unable to capture DOM within the timeout specified')
      }
      browser.tabs
        .executeScript(tabId, {
          code: `window.__eyes__${id};`,
        })
        .then(result => {
          // eslint-disable-next-line
          console.log(
            `[${elapsed}ms]: ${
              result && result[0] ? result : 'No DOM Capture result yet'
            }`
          )
          if (result && result[0]) {
            browser.tabs.executeScript(tabId, {
              code: `delete window.__eyes__${id};`,
            })
            clearInterval(domCapRetry)
            res(result)
          }
        })
    }, 100)
  })
}

export function parseOutExternalFrames(input = []) {
  if (input && input[0]) {
    const cap = input[0]
    const firstLineEnd = cap.indexOf('\n')
    const meta = JSON.parse(cap.substr(0, firstLineEnd))
    const sepLength = (meta.separator + '\n').length
    const rest = cap.substr(cap.indexOf(meta.separator + '\n') + sepLength)
    const sepLocation = rest.indexOf(meta.separator + '\n')
    const frames = rest
      .substr(0, sepLocation)
      .split('\n')
      .filter(f => !!f)
    const snapshot = rest.substr(sepLocation + sepLength)
    let result = snapshot

    frames.forEach(frame => {
      result = result.replace(`${meta.iframeStartToken}${frame}${meta.iframeEndToken}`, '')
    })

    return result
  }
}
