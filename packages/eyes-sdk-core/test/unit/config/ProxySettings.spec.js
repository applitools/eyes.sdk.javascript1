'use strict'

const assert = require('assert')

const {ProxySettings} = require('../../../index')

describe('ProxySettings', () => {
  it('should parse url with host and port', () => {
    const proxy = new ProxySettings('http://localhost:1234/')
    const proxyObject = proxy.toProxyObject()
    assert.strictEqual(proxyObject.host, 'localhost')
    assert.strictEqual(proxyObject.port, '1234')
  })

  it('should parse url with host, port, isHttpOnly and use auth from constructor', () => {
    const proxy = new ProxySettings('http://localhost:1234/', 'admin', '1111', true)
    const proxyObject = proxy.toProxyObject()
    assert.strictEqual(proxyObject.host, 'localhost')
    assert.strictEqual(proxyObject.port, '1234')
    assert.strictEqual(proxyObject.auth.username, 'admin')
    assert.strictEqual(proxyObject.auth.password, '1111')
    assert.strictEqual(proxyObject.isHttpOnly, true)
  })

  it('should parse url with host, port and auth', () => {
    const proxy = new ProxySettings('http://username:password@localhost:1234/')
    const proxyObject = proxy.toProxyObject()
    assert.strictEqual(proxyObject.host, 'localhost')
    assert.strictEqual(proxyObject.port, '1234')
    assert.strictEqual(proxyObject.auth.username, 'username')
    assert.strictEqual(proxyObject.auth.password, 'password')
    assert.strictEqual(proxyObject.isHttpOnly, false)
  })

  it('should use isHttpOnly with default value of false', () => {
    const proxy = new ProxySettings('http://username:password@localhost:1234/')
    const proxyObject = proxy.toProxyObject()
    assert.strictEqual(proxyObject.isHttpOnly, false)
  })
})
