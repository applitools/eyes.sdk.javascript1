const {URL} = require('url')

function getResourceCookies(url, cookies) {
  return cookies
    .reduce((acc, cookie) => {
      const {hostname, pathname, protocol} = new URL(url)
      const {domain, path, expires} = cookie

      const resourceUrl = hostname + pathname
      const cookieUrl = domain + path


      // ? should we send cookies blindly according to hostname and path alone ?
      // ? python impl checks subdomain, protocol, and expiry
      // ? https://github.com/applitools/eyes.sdk.python/blob/482b9f7756d4503865471da4dea464ccde634539/eyes_selenium/applitools/selenium/visual_grid/resource_collection_task.py#L227
      // const cookieExpiry = new Date(expires * 1000).getTime()
      // const currentTime = new Date().getTime()
      // const expired = currentTime > cookieExpiry

      if (resourceUrl.includes(cookieUrl)) {
        acc.push(`${cookie.name}=${cookie.value};`)
      }

      return acc
    }, [])
    .join(' ')
}

module.exports = getResourceCookies
