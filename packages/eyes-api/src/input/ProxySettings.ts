import * as utils from '@applitools/utils'

export type ProxySettings = {
  url: string
  username?: string
  password?: string
  isHttpOnly?: boolean
}

export default class ProxySettingsData implements Required<ProxySettings> {
  private _url: string
  private _username: string
  private _password: string
  private _isHttpOnly: boolean
  private _isDisabled: boolean

  constructor(proxy: ProxySettings)
  constructor(url: string, username?: string, password?: string, isHttpOnly?: boolean)
  constructor(isDisabled: true)
  constructor(
    proxyOrUrlOrIsDisabled: ProxySettings | string | true,
    username?: string,
    password?: string,
    isHttpOnly?: boolean,
  ) {
    utils.guard.notNull(proxyOrUrlOrIsDisabled, {name: 'proxyOrUrlOrIsDisabled'})

    if (proxyOrUrlOrIsDisabled === true) {
      this._isDisabled = true
    } else {
      if (utils.type.isString(proxyOrUrlOrIsDisabled)) {
        return new ProxySettingsData({url: proxyOrUrlOrIsDisabled, username, password, isHttpOnly})
      }
      this._url = proxyOrUrlOrIsDisabled.url
      this._username = proxyOrUrlOrIsDisabled.username
      this._password = proxyOrUrlOrIsDisabled.password
      this._isHttpOnly = proxyOrUrlOrIsDisabled.isHttpOnly
      this._isDisabled = false
    }
  }

  get url() {
    return this._url
  }
  getUri() {
    return this.url
  }

  get username() {
    return this._username
  }
  getUsername() {
    return this._username
  }

  get password() {
    return this._password
  }
  getPassword() {
    return this._password
  }

  get isHttpOnly() {
    return this._isHttpOnly
  }
  getIsHttpOnly() {
    return this._isHttpOnly
  }

  get isDisabled() {
    return this._isDisabled
  }
  getIsDisabled() {
    return this._isDisabled
  }
}
