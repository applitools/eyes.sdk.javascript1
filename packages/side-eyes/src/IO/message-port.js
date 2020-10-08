import browser from 'webextension-polyfill'
import { isChrome, isFirefox } from '../background/utils/userAgent'

export function sendMessage(payload) {
  return getId().then(id => browser.runtime.sendMessage(id, payload))
}

export const DEFAULT_ID = isChrome
  ? 'mooikfkahbdckldjjndioackbalphokd'
  : isFirefox
  ? '{a6fd85ed-e919-4a43-a5af-8da18bda539f}'
  : '' // eslint-disable-line indent

function bundledId() {
  let id = process.env.SIDE_ID
  if (!id) {
    id = DEFAULT_ID
  }

  return id
}

function getId() {
  return browser.storage.local.get(['seideId']).then(results => (results.seideId ? results.seideId : bundledId()))
}

let interval

export function startPolling(payload, cb) {
  interval = setInterval(() => {
    sendMessage({
      uri: '/health',
      verb: 'get',
    })
      .catch(res => ({ error: res.message }))
      .then(res => {
        if (!res) {
          sendMessage({
            uri: '/register',
            verb: 'post',
            payload,
          }).then(() => {
            cb()
          })
        } else if (res === true) {
          cb()
        } else if (res.error) {
          cb(new Error(res.error))
        }
      })
  }, 1000)
}

export function stopPolling() {
  clearInterval(interval)
}
