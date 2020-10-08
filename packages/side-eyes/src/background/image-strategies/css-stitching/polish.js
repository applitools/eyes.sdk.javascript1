import browser from 'webextension-polyfill'

export async function hideCaret(tabId) {
  await browser.tabs.executeScript(tabId, {
    code:
      'window.__eyes_active_element = document.activeElement; __eyes_active_element && __eyes_active_element.blur();',
  })

  return async () =>
    await browser.tabs.executeScript(tabId, {
      code: '__eyes_active_element && __eyes_active_element.focus(); delete window.__eyes_active_element;',
    })
}

export async function hideScrollbars(tabId) {
  const initialOverflow =
    (
      await browser.tabs.executeScript(tabId, {
        code:
          'var originalOverflow = document.documentElement.style["overflow"]; document.documentElement.style["overflow"] = "hidden"; originalOverflow;',
      })
    )[0] || ''

  return async () =>
    await browser.tabs.executeScript(tabId, {
      code: `document.documentElement.style["overflow"] = "${initialOverflow}"`,
    })
}
