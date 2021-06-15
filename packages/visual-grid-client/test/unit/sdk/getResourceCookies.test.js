const {expect} = require('chai')
const getResourceCookies = require('../../../src/sdk/getResourceCookies')

describe('getResourceCookies', () => {
  it('should return cookies per url', () => {
    const url = 'https://somedomain.com'
    const cookies = [
      {domain: 'somedomain.com', path: '/', name: 'hello', value: 'world'},
      {domain: 'someotherdomain.com', path: '/', name: 'goodbye', value: 'moon'},
    ]

    expect(getResourceCookies(url, cookies)).to.equal('hello=world;')
  })

  it('should return cookies per path', () => {
    const url = 'https://somedomain.com/images/image.png'
    const cookies = [
      {domain: 'somedomain.com', path: '/images', name: 'hello', value: 'world'},
      {domain: 'someotherdomain.com', path: '/images', name: 'hello', value: 'world'},
      {domain: 'somedomain.com', path: '/images', name: 'goodbye', value: 'moon'},
    ]

    expect(getResourceCookies(url, cookies)).to.equal('hello=world; goodbye=moon;')
  })

  it('should work with subdomains', () => {
    const url = 'https://mydomain.somedomain.com/images/image.png'
    const cookies = [
      {domain: 'someotherdomain.com', path: '/images', name: 'hello', value: 'world'},
      {domain: '.somedomain.com', path: '/images', name: 'goodbye', value: 'moon'},
    ]

    expect(getResourceCookies(url, cookies)).to.equal('goodbye=moon;')
  });
})
