import browser from 'webextension-polyfill'
import { RectangleSize, Location } from '@applitools/eyes-images'

const JS_GET_CURRENT_SCROLL_POSITION =
  'var doc = document.documentElement; ' +
  'var x = window.scrollX || ((window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)); ' +
  'var y = window.scrollY || ((window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)); ' +
  '[x, y];'

const JS_COMPUTE_CONTENT_ENTIRE_SIZE =
  'var scrollWidth = document.documentElement.scrollWidth; ' +
  'var bodyScrollWidth = document.body.scrollWidth; ' +
  'var totalWidth = Math.max(scrollWidth, bodyScrollWidth); ' +
  'var clientHeight = document.documentElement.clientHeight; ' +
  'var bodyClientHeight = document.body.clientHeight; ' +
  'var scrollHeight = document.documentElement.scrollHeight; ' +
  'var bodyScrollHeight = document.body.scrollHeight; ' +
  'var maxDocElementHeight = Math.max(clientHeight, scrollHeight); ' +
  'var maxBodyHeight = Math.max(bodyClientHeight, bodyScrollHeight); ' +
  'var totalHeight = Math.max(maxDocElementHeight, maxBodyHeight); '

const JS_RETURN_CONTENT_ENTIRE_SIZE = `${JS_COMPUTE_CONTENT_ENTIRE_SIZE}[totalWidth, totalHeight];`

export async function getEntirePageSize(tabId) {
  const result = (
    await browser.tabs.executeScript(tabId, {
      code: JS_RETURN_CONTENT_ENTIRE_SIZE,
    })
  )[0]
  return new RectangleSize(parseInt(result[0], 10) || 0, parseInt(result[1], 10) || 0)
}

export async function getCurrentScrollPosition(tabId) {
  const result = (
    await browser.tabs.executeScript(tabId, {
      code: JS_GET_CURRENT_SCROLL_POSITION,
    })
  )[0]
  return new Location(Math.ceil(result[0]) || 0, Math.ceil(result[1]) || 0)
}
