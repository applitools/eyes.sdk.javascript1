'use strict'
const {describe, it} = require('mocha')
const {expect} = require('chai')
const extractCssResources = require('../../../src/sdk/extractCssResources')

describe('extractCssResources', () => {
  it('supports property url()', () => {
    const cssText = `
      .selector { background: url('hello.jpg'); }
      .selector2 { background-image: url("hello2.jpg"); }
      .selector3 { background: url("http://other/hello3.jpg"); }
    `
    const resourceUrls = extractCssResources(cssText)
    expect(resourceUrls).to.eql(['hello.jpg', 'hello2.jpg', 'http://other/hello3.jpg'])
  })

  it('supports @font-face rule', () => {
    const cssText = `@font-face {
      font-family: 'Zilla Slab';
      font-style: normal;
      font-weight: 400;
      src: local('Zilla Slab'), local('ZillaSlab-Regular'), url('zilla_slab.woff2') format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }`
    const resourceUrls = extractCssResources(cssText)
    expect(resourceUrls).to.eql(['zilla_slab.woff2'])
  })

  it('supports @import rule', () => {
    const cssText = `@import 'some.css';`
    const resourceUrls = extractCssResources(cssText)
    expect(resourceUrls).to.eql(['some.css'])
  })

  it('supports css encoding', () => {
    const cssText = `div { background-image: url(\\2fsomePath\\2f some.jpg) }`
    const resourceUrls = extractCssResources(cssText)
    expect(resourceUrls).to.eql(['/somePath/some.jpg'])
  })

  it('supports inline url', () => {
    const cssText = `url(data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%222%3E %3Ccircle cx=%2210%22 cy=%225.5%22 r=%224.5%22/%3E %3C/g%3E %3C/svg%3E);`
    const resourceUrls = extractCssResources(cssText)
    expect(resourceUrls).to.eql([
      'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%222%3E %3Ccircle cx=%2210%22 cy=%225.5%22 r=%224.5%22/%3E %3C/g%3E %3C/svg%3E',
    ])
  })

  it('supports @import with url() rule', () => {
    const cssText = `@import url('some.css');`
    const resourceUrls = extractCssResources(cssText)
    expect(resourceUrls).to.eql(['some.css'])
  })

  it('supports @support rule', () => {
    const cssText = `@supports (display: grid) {
      div {
        display: grid;
        background: url('hello.jpg');
      }
    }`
    const resourceUrls = extractCssResources(cssText)
    expect(resourceUrls).to.eql(['hello.jpg'])
  })

  it("doesn't crash on parse error", () => {
    const cssText = `something that doesn't get parsed`
    const resourceUrls = extractCssResources(cssText)
    expect(resourceUrls).to.eql([])
  })

  it('supports nested brackets', () => {
    const cssText = `@svg-load url(./some.svg#hihi){ .path{} }`
    const resourceUrls = extractCssResources(cssText)
    expect(resourceUrls).to.eql(['./some.svg'])
  })

  it('does not return urls for a wrong function', () => {
    const cssText = `.btn{filter:Foo(startColorstr='#4567', endColorstr='#1234', GradientType=0)`
    const resourceUrls = extractCssResources(cssText)
    expect(resourceUrls).to.eql([])
  })

  it('supports resources inside @media queries', () => {
    const cssText = `@media (max-width:991px) {
      .bla {
        background: url('hello.jpg');
      }
    }`
    const resourceUrls = extractCssResources(cssText)
    expect(resourceUrls).to.eql(['hello.jpg'])
  })

  it('supports image sets with url()', () => {
    const cssText = `.img {
      background-image: url(examples/images/image-0.jpg);
      background-image:
        -webkit-image-set(
          url(examples/images/image-1.jpg) 1x,
          url(examples/images/image-2.jpg) 2x,
        );
      background-image:
        image-set(
          url(examples/images/image-3.jpg) 1x,
          url(examples/images/image-4.jpg) 2x,
        );
    }`
    const resourceUrls = extractCssResources(cssText)
    expect(resourceUrls).to.eql([
      'examples/images/image-0.jpg',
      'examples/images/image-1.jpg',
      'examples/images/image-2.jpg',
      'examples/images/image-3.jpg',
      'examples/images/image-4.jpg',
    ])
  })

  it('supports image sets without url()', () => {
    const cssText = `.img {
      background-image: url(original.jpg);
      background-image:
        -webkit-image-set(
            "one.jpg" 1x,
          "two.jpg" 2x,
        );
      background-image:
        image-set(
          "three.jpg" 1x,
          "four.jpg" 2x,
        );
    }`
    const resourceUrls = extractCssResources(cssText)
    expect(resourceUrls).to.eql(['original.jpg', 'one.jpg', 'two.jpg', 'three.jpg', 'four.jpg'])
  })

  it('supports bad url() functions (that the browser supports)', () => {
    const cssText = `background-image: url( /path/default/file.jpg`
    const resourceUrls = extractCssResources(cssText)
    expect(resourceUrls).to.eql(['/path/default/file.jpg'])
  })

  it('supports multiple src properties in @font-face rules', () => {
    const cssText = `
   @font-face {
     font-family: 'FontAwesome';
     src: url('//use.fontawesome.com/releases/v4.7.0/fonts/fontawesome-webfont.eot');
     src: url('//use.fontawesome.com/releases/v4.7.0/fonts/fontawesome-webfont.eot?#iefix') format('embedded-opentype'),
          url('//use.fontawesome.com/releases/v4.7.0/fonts/fontawesome-webfont.woff2') format('woff2'),
          url('//use.fontawesome.com/releases/v4.7.0/fonts/fontawesome-webfont.woff') format('woff'),
          url('//use.fontawesome.com/releases/v4.7.0/fonts/fontawesome-webfont.ttf') format('truetype'),
          url('//use.fontawesome.com/releases/v4.7.0/fonts/fontawesome-webfont.svg#fontawesomeregular') format('svg');
     font-weight: normal;
     font-style: normal;
   }`

    const resourceUrls = extractCssResources(cssText)
    expect(resourceUrls).to.eql([
      '//use.fontawesome.com/releases/v4.7.0/fonts/fontawesome-webfont.eot',
      '//use.fontawesome.com/releases/v4.7.0/fonts/fontawesome-webfont.eot?',
      '//use.fontawesome.com/releases/v4.7.0/fonts/fontawesome-webfont.woff2',
      '//use.fontawesome.com/releases/v4.7.0/fonts/fontawesome-webfont.woff',
      '//use.fontawesome.com/releases/v4.7.0/fonts/fontawesome-webfont.ttf',
      '//use.fontawesome.com/releases/v4.7.0/fonts/fontawesome-webfont.svg',
    ])
  })
})
