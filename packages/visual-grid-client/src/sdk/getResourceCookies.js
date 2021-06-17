const {URL} = require('url')

function getResourceCookies(url, cookies = []) {
  return cookies.reduce((acc, cookie) => {
    const resourceUrl = new URL(url)

    const domainMatch = cookie.domain.startsWith('.')
      ? resourceUrl.hostname.includes(cookie.domain.slice(1))
      : resourceUrl.hostname === cookie.domain
    if (!domainMatch) return acc

    const pathMatch = resourceUrl.pathname.startsWith(cookie.path)
    if (!pathMatch) return acc

    if (cookie.secure && resourceUrl.protocol !== 'https:') return acc

    const expired = cookie.expiry >= 0 && Date.now() > cookie.expiry * 1000
    if (expired) return acc

    return acc + `${cookie.name}=${cookie.value};`
  }, '')
}

module.exports = getResourceCookies
