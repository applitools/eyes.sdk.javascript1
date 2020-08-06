'use strict'
const BrowserNames = require('./BrowserNames')
const OSNames = require('./OSNames')
const ArgumentGuard = require('../utils/ArgumentGuard')

const MAJOR_MINOR = '(\\d+)(?:[_.](\\d+))?'
const PRODUCT = `(?:(%s)/${MAJOR_MINOR})`

// Browser Regexes
const VALUES_FOR_BROWSER_REGEX_EXCEPT_IE = ['Opera', 'Edg', 'Chrome', 'Safari', 'Firefox', 'Edge']
const IE_BROWSER_REGEX = new RegExp(`(?:MS(IE) ${MAJOR_MINOR})`)

const getBrowserRegExes = () => {
  const browserRegExes = []

  for (let i = 0; i < VALUES_FOR_BROWSER_REGEX_EXCEPT_IE.length; i += 1) {
    const browser = VALUES_FOR_BROWSER_REGEX_EXCEPT_IE[i]
    browserRegExes.push(new RegExp(PRODUCT.replace('%s', browser)))
  }

  // Last pattern is IE
  browserRegExes.push(IE_BROWSER_REGEX)
  return browserRegExes
}

const VERSION_REGEX = new RegExp(PRODUCT.replace('%s', 'Version'))

const OS_REGEXES = [
  new RegExp(`(?:(Windows NT) ${MAJOR_MINOR})`),
  new RegExp('(?:(Windows XP))'),
  new RegExp('(?:(Windows 2000))'),
  new RegExp('(?:(Windows NT))'),
  new RegExp('(?:(Windows))'),
  new RegExp(`(?:(Mac OS X) ${MAJOR_MINOR})`),
  new RegExp(`(?:(Android) ${MAJOR_MINOR})`),
  new RegExp(`(?:(CPU(?: i[a-zA-Z]+)? OS) ${MAJOR_MINOR})`),
  new RegExp('(?:(Mac OS X))'),
  new RegExp('(?:(Mac_PowerPC))'),
  new RegExp('(?:(Linux))'),
  new RegExp('(?:(CrOS))'),
  new RegExp('(?:(SymbOS))'),
]

const HIDDEN_IE_REGEX = new RegExp(`(?:rv:${MAJOR_MINOR}\\) like Gecko)`)

const EDGE_REGEX = new RegExp(PRODUCT.replace('%s', 'Edge'))

/**
 * Handles parsing of a user agent string
 */
class UserAgent {
  constructor() {
    /** @type {string} */
    this._OS = undefined
    /** @type {string} */
    this._OSMajorVersion = undefined
    /** @type {string} */
    this._OSMinorVersion = undefined

    /** @type {string} */
    this._browser = undefined
    /** @type {string} */
    this._browserMajorVersion = undefined
    /** @type {string} */
    this._browserMinorVersion = undefined
  }

  /**
   * @param {string} userAgent - User agent string to parse
   * @param {boolean} unknowns - Whether to treat unknown products as {@code UNKNOWN} or throw an exception.
   * @return {UserAgent} - A representation of the user agent string.
   */
  static parseUserAgentString(userAgent, unknowns) {
    ArgumentGuard.notNull(userAgent, 'userAgent')

    userAgent = userAgent.trim()
    const result = new UserAgent()

    // OS
    const oss = new Map()
    const matchers = []

    for (let i = 0; i < OS_REGEXES.length; i += 1) {
      if (OS_REGEXES[i].test(userAgent)) {
        matchers.push(OS_REGEXES[i].exec(userAgent))
        break
      }
    }

    for (let i = 0; i < matchers.length; i += 1) {
      const os = matchers[i][1]
      if (os) {
        oss.set(os.toLowerCase(), matchers[i])
      }
    }

    let osmatch
    if (matchers.length === 0) {
      if (unknowns) {
        result._OS = OSNames.Unknown
      } else {
        throw new TypeError(`Unknown OS: ${userAgent}`)
      }
    } else {
      if (oss.size > 1 && oss.has('android')) {
        osmatch = oss.get('android')
      } else {
        osmatch = oss.get(oss.keys().next().value)
      }

      result._OS = osmatch[1]
      if (osmatch.length > 1) {
        result._OSMajorVersion = osmatch[2]
        result._OSMinorVersion = osmatch[3]
      }

      if (result._OSMajorVersion && !result._OSMinorVersion) {
        result._OSMinorVersion = '0'
      }
    }

    // OS Normalization

    if (result._OS.startsWith('CPU')) {
      result._OS = OSNames.IOS
    } else if (result._OS === 'Windows XP') {
      result._OS = OSNames.Windows
      result._OSMajorVersion = '5'
      result._OSMinorVersion = '1'
    } else if (result._OS === 'Windows 2000') {
      result._OS = OSNames.Windows
      result._OSMajorVersion = '5'
      result._OSMinorVersion = '0'
    } else if (result._OS === 'Windows NT') {
      result._OS = OSNames.Windows
      if (result._OSMajorVersion === '6' && result._OSMinorVersion === '1') {
        result._OSMajorVersion = '7'
        result._OSMinorVersion = '0'
      } else if (result._OSMajorVersion === '6' && result._OSMinorVersion === '2') {
        result._OSMajorVersion = '8'
        result._OSMinorVersion = '0'
      } else if (result._OSMajorVersion === '6' && result._OSMinorVersion === '3') {
        result._OSMajorVersion = '8'
        result._OSMinorVersion = '1'
      } else if (!result._OSMajorVersion) {
        result._OSMajorVersion = '4'
        result._OSMinorVersion = '0'
      }
    } else if (result._OS === 'Mac_PowerPC') {
      result._OS = OSNames.Macintosh
    } else if (result._OS === 'CrOS') {
      result._OS = OSNames.ChromeOS
    }

    // Browser
    let browserOK = false
    const browserRegexes = getBrowserRegExes()
    for (let i = 0; i < browserRegexes.length; i += 1) {
      if (browserRegexes[i].test(userAgent)) {
        const matcher = browserRegexes[i].exec(userAgent)
        result._browser = matcher[1]
        result._browserMajorVersion = matcher[2]
        result._browserMinorVersion = matcher[3]
        browserOK = true
        break
      }
    }

    if (result._OS === OSNames.Windows) {
      if (EDGE_REGEX.test(userAgent)) {
        const edgeMatch = EDGE_REGEX.exec(userAgent)
        result._browser = BrowserNames.Edge
        result._browserMajorVersion = edgeMatch[2]
        result._browserMinorVersion = edgeMatch[3]
      }

      // IE11 and later is "hidden" on purpose.
      // http://blogs.msdn.com/b/ieinternals/archive/2013/09/21/internet-explorer-11-user-agent-string-ua-string-sniffing-compatibility-with-gecko-webkit.aspx
      if (HIDDEN_IE_REGEX.test(userAgent)) {
        const ieMatch = HIDDEN_IE_REGEX.exec(userAgent)
        result._browser = BrowserNames.IE
        result._browserMajorVersion = ieMatch[1]
        result._browserMinorVersion = ieMatch[2]
        browserOK = true
      }
    }

    if (result._browser === 'Edg') {
      result._browser = 'Edge'
    }

    if (!browserOK) {
      if (unknowns) {
        result._browser = 'Unknown'
      } else {
        throw new TypeError(`Unknown browser: ${userAgent}`)
      }
    }

    // Explicit browser version (if available)
    if (VERSION_REGEX.test(userAgent)) {
      const versionMatch = VERSION_REGEX.exec(userAgent)
      result._browserMajorVersion = versionMatch[2]
      result._browserMinorVersion = versionMatch[3]
    }

    return result
  }

  /**
   * @return {string}
   */
  getBrowser() {
    return this._browser
  }

  /**
   * @return {string}
   */
  getBrowserMajorVersion() {
    return this._browserMajorVersion
  }

  /**
   * @return {string}
   */
  getBrowserMinorVersion() {
    return this._browserMinorVersion
  }

  /**
   * @return {string}
   */
  getOS() {
    return this._OS
  }

  /**
   * @return {string}
   */
  getOSMajorVersion() {
    return this._OSMajorVersion
  }

  /**
   * @return {string}
   */
  getOSMinorVersion() {
    return this._OSMinorVersion
  }
}

module.exports = UserAgent
