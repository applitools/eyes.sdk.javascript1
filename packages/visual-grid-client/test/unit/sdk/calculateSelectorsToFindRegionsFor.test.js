'use strict'

const {describe, it} = require('mocha')
const {expect} = require('chai')
const calculateSelectorsToFindRegionsFor = require('../../../src/sdk/calculateSelectorsToFindRegionsFor')
const {Region} = require('@applitools/eyes-sdk-core')

describe('calculateSelectorsToFindRegionsFor Tests', () => {
  describe('calculateSelectorsToFindRegionsFor', () => {
    it('handles no arguments', () => {
      const {selectorsToFindRegionsFor} = calculateSelectorsToFindRegionsFor({})
      expect(selectorsToFindRegionsFor).to.be.undefined
    })

    it('handles sizeMode without selector or selectors', () => {
      const {selectorsToFindRegionsFor} = calculateSelectorsToFindRegionsFor({sizeMode: 'bla'})
      expect(selectorsToFindRegionsFor).to.be.undefined
    })

    it('handles sizeMode with selector, but no selectors', () => {
      const {selectorsToFindRegionsFor} = calculateSelectorsToFindRegionsFor({
        sizeMode: 'selector',
        selector: 'bla',
      })
      expect(selectorsToFindRegionsFor).to.eql(['bla'])
    })

    it('handles no sizeMode with selector', () => {
      const ignore = [{selector: 'bla'}]
      const {selectorsToFindRegionsFor} = calculateSelectorsToFindRegionsFor({ignore})
      expect(selectorsToFindRegionsFor).to.eql(['bla'])
    })

    it('handles non-array selectors', () => {
      const layout = {selector: 'bla'}
      const content = {selector: 'bla2'}
      const {selectorsToFindRegionsFor} = calculateSelectorsToFindRegionsFor({layout, content})
      expect(selectorsToFindRegionsFor).to.eql(['bla', 'bla2'])
    })

    it('handles array selectors', () => {
      const ignore = [{selector: 'bla'}]
      const layout = [{selector: 'blu'}]
      const {selectorsToFindRegionsFor} = calculateSelectorsToFindRegionsFor({ignore, layout})
      expect(selectorsToFindRegionsFor).to.eql(['bla', 'blu'])
    })

    it('handles non-array differnt index selectors without sizeMode or selector', () => {
      const layout = {selector: 'bla'}
      const {selectorsToFindRegionsFor} = calculateSelectorsToFindRegionsFor({layout})
      expect(selectorsToFindRegionsFor).to.eql(['bla'])
    })

    it('handles array different index selectors without sizeMode or selector', () => {
      const layout = [{selector: 'bla'}]
      const {selectorsToFindRegionsFor} = calculateSelectorsToFindRegionsFor({layout})
      expect(selectorsToFindRegionsFor).to.eql(['bla'])
    })

    it('handles mixed ignore regions with selectors and other region types', () => {
      const ignore = [{a: 'b'}, {selector: 'bla'}, {c: 'd'}, {selector: 'kuku'}]
      const {selectorsToFindRegionsFor} = calculateSelectorsToFindRegionsFor({ignore})
      expect(selectorsToFindRegionsFor).to.eql(['bla', 'kuku'])
    })

    it('handles sizeMode = selector, with selector', () => {
      const ignore = [{selector: 'ignore'}]
      const layout = [{selector: 'layout'}]
      const {selectorsToFindRegionsFor} = calculateSelectorsToFindRegionsFor({
        sizeMode: 'selector',
        selector: 'some_selector',
        ignore,
        layout,
      })
      expect(selectorsToFindRegionsFor).to.eql(['some_selector', 'ignore', 'layout'])
    })

    it('handles sizeMode = selector, without selector', () => {
      const {selectorsToFindRegionsFor} = calculateSelectorsToFindRegionsFor({
        sizeMode: 'selector',
        ignore: [{selector: 'ignore'}],
      })
      expect(selectorsToFindRegionsFor).to.eql([undefined, 'ignore'])
    })

    it('handles multiple selector arrays with duplicates and without sizeMode or selector', () => {
      const ignore = [
        {a: 'b'},
        {selector: 'bla'},
        {c: 'd'},
        {selector: 'kuku'},
        {selector: 'ignore'},
      ]
      const layout = [{a: 'b'}, {selector: 'bla'}, {c: 'd'}, {selector: 'layout'}]
      const strict = [{a: 'b'}, {selector: 'bla'}, {c: 'd'}, {selector: 'strict'}]
      const content = [{a: 'b'}, {selector: 'bla'}, {c: 'd'}, {selector: 'content'}]
      const floating = [
        {a: 'b'},
        {selector: 'bla'},
        {c: 'd'},
        {selector: 'kuku'},
        {selector: 'float'},
      ]
      const {selectorsToFindRegionsFor} = calculateSelectorsToFindRegionsFor({
        ignore,
        layout,
        strict,
        content,
        floating,
      })
      expect(selectorsToFindRegionsFor).to.eql([
        'bla',
        'kuku',
        'ignore',
        'bla',
        'layout',
        'bla',
        'strict',
        'bla',
        'content',
        'bla',
        'kuku',
        'float',
      ])
    })

    it('handles multiple selector arrays with duplicates and with sizeMode = selector', () => {
      const ignore = [
        {a: 'b'},
        {selector: 'bla'},
        {c: 'd'},
        {selector: 'kuku'},
        {selector: 'ignore'},
      ]
      const layout = {selector: 'layout'}
      const strict = [{selector: 'strict'}, {selector: 'yo'}, {d: 'g'}]
      const content = [{selector: 'content'}]
      const floating = [
        {a: 'b'},
        {selector: 'bla'},
        {c: 'd'},
        {selector: 'kuku'},
        {selector: 'float'},
      ]
      const {selectorsToFindRegionsFor} = calculateSelectorsToFindRegionsFor({
        ignore,
        layout,
        strict,
        content,
        floating,
        sizeMode: 'selector',
        selector: 'some_selector',
      })
      expect(selectorsToFindRegionsFor).to.eql([
        'some_selector',
        'bla',
        'kuku',
        'ignore',
        'layout',
        'strict',
        'yo',
        'content',
        'bla',
        'kuku',
        'float',
      ])
    })

    it('handles well formated typed selectors', () => {
      const ignore = {selector: 'bla'}
      const layout = {type: 'css', selector: 'bla1'}
      const strict = {type: 'xpath', selector: 'bla2'}
      const {selectorsToFindRegionsFor} = calculateSelectorsToFindRegionsFor({
        ignore,
        layout,
        strict,
      })
      expect(selectorsToFindRegionsFor).to.eql([
        'bla',
        {type: 'css', selector: 'bla1'},
        {type: 'xpath', selector: 'bla2'},
      ])
    })
  })

  describe('getMatchRegions', () => {
    it('handles a single selector', () => {
      const ignore = {selector: '.ignore'}
      const {getMatchRegions} = calculateSelectorsToFindRegionsFor({ignore})
      const ignoreRegionFromGrid = new Region({left: 1, top: 1, width: 2, height: 1})
      const selectorRegions = [[ignoreRegionFromGrid]]
      const regions = getMatchRegions({selectorRegions})
      expect(regions.ignore).to.eql([
        {left: 1, top: 1, width: 2, height: 1, coordinatesType: 'SCREENSHOT_AS_IS'},
      ])
    })

    it('handles a single selector in an array', () => {
      const layout = [{selector: '.layout'}]
      const {getMatchRegions} = calculateSelectorsToFindRegionsFor({layout})
      const ignoreRegionFromGrid = new Region({left: 1, top: 1, width: 2, height: 1})
      const selectorRegions = [[ignoreRegionFromGrid]]
      const regions = getMatchRegions({selectorRegions})
      expect(regions.ignore).to.be.undefined
      expect(regions.layout).to.eql([
        {left: 1, top: 1, width: 2, height: 1, coordinatesType: 'SCREENSHOT_AS_IS'},
      ])
    })

    it('handles multiple selectors', () => {
      const ignore = [{selector: '.ignore'}]
      const layout = [{selector: '.layout'}]
      const {getMatchRegions} = calculateSelectorsToFindRegionsFor({ignore, layout})

      const selectorRegions = [
        [new Region({left: 1, top: 1, width: 2, height: 1})],
        [new Region({left: 3, top: 3, width: 5, height: 4})],
      ]
      const regions = getMatchRegions({selectorRegions})

      expect(regions.ignore).to.eql([
        {left: 1, top: 1, width: 2, height: 1, coordinatesType: 'SCREENSHOT_AS_IS'},
      ])
      expect(regions.layout).to.eql([
        {left: 3, top: 3, width: 5, height: 4, coordinatesType: 'SCREENSHOT_AS_IS'},
      ])
    })

    it('handles multiple grid regions per selector', () => {
      const ignore = {selector: '.ignore'}
      const layout = {selector: '.layout'}
      const {getMatchRegions} = calculateSelectorsToFindRegionsFor({ignore, layout})

      const selectorRegions = [
        [
          new Region({left: 1, top: 1, width: 2, height: 1}),
          new Region({left: 2, top: 2, width: 3, height: 2}),
        ],
        [
          new Region({left: 3, top: 3, width: 4, height: 3}),
          new Region({left: 4, top: 4, width: 5, height: 4}),
          new Region({left: 5, top: 5, width: 6, height: 5}),
        ],
      ]
      const regions = getMatchRegions({selectorRegions})

      expect(regions.ignore).to.eql([
        {left: 1, top: 1, width: 2, height: 1, coordinatesType: 'SCREENSHOT_AS_IS'},
        {left: 2, top: 2, width: 3, height: 2, coordinatesType: 'SCREENSHOT_AS_IS'},
      ])
      expect(regions.layout).to.eql([
        {left: 3, top: 3, width: 4, height: 3, coordinatesType: 'SCREENSHOT_AS_IS'},
        {left: 4, top: 4, width: 5, height: 4, coordinatesType: 'SCREENSHOT_AS_IS'},
        {left: 5, top: 5, width: 6, height: 5, coordinatesType: 'SCREENSHOT_AS_IS'},
      ])
    })

    it('handles multiple non-array selectors', () => {
      const accessibility = {selector: 'ignore-me', accessibilityType: 'LargeText'}
      const floating = {
        selector: 'ignore-you',
        maxUpOffset: 10,
        maxDownOffset: 10,
        maxLeftOffset: 10,
        maxRightOffset: 10,
      }

      const {getMatchRegions} = calculateSelectorsToFindRegionsFor({accessibility, floating})

      const selectorRegions = [
        [new Region({left: 1, top: 1, width: 2, height: 1})],
        [new Region({left: 1, top: 1, width: 2, height: 1})],
      ]
      const regions = getMatchRegions({selectorRegions})

      expect(regions).to.eql({
        imageLocationRegion: undefined,
        accessibility: [
          {
            accessibilityType: 'LargeText',
            coordinatesType: 'SCREENSHOT_AS_IS',
            height: 1,
            left: 1,
            top: 1,
            width: 2,
          },
        ],
        floating: [
          {
            coordinatesType: 'SCREENSHOT_AS_IS',
            height: 1,
            left: 1,
            maxDownOffset: 10,
            maxLeftOffset: 10,
            maxRightOffset: 10,
            maxUpOffset: 10,
            top: 1,
            width: 2,
          },
        ],
      })
    })

    it('handles multiple array selectors', () => {
      const accessibility = [{selector: 'ignore-me', accessibilityType: 'LargeText'}]
      const floating = [
        {
          selector: 'ignore-you',
          maxUpOffset: 10,
          maxDownOffset: 10,
          maxLeftOffset: 10,
          maxRightOffset: 10,
        },
      ]

      const {getMatchRegions} = calculateSelectorsToFindRegionsFor({accessibility, floating})

      const selectorRegions = [
        [new Region({left: 1, top: 1, width: 2, height: 1})],
        [new Region({left: 1, top: 1, width: 2, height: 1})],
      ]
      const regions = getMatchRegions({selectorRegions})

      expect(regions.accessibility[0])
        .to.haveOwnProperty('accessibilityType')
        .and.equal('LargeText')

      expect(regions.floating[0])
        .to.haveOwnProperty('maxUpOffset')
        .and.equal(10)
    })

    it('handles multiple selectors with user-provided region', () => {
      const ignore = [
        {selector: '.ignore-1'},
        new Region({left: 3, top: 4, width: 5, height: 6}),
        {selector: '.ignore-2'},
      ]
      const layout = [{selector: '.layout'}]
      const {getMatchRegions} = calculateSelectorsToFindRegionsFor({ignore, layout})

      const selectorRegions = [
        [new Region({left: 1, top: 1, width: 2, height: 1})],
        [new Region({left: 1, top: 1, width: 2, height: 1})],
        [new Region({left: 3, top: 3, width: 5, height: 4})],
      ]
      const regions = getMatchRegions({selectorRegions})

      expect(regions.ignore).to.eql([
        {left: 1, top: 1, width: 2, height: 1, coordinatesType: 'SCREENSHOT_AS_IS'},
        {left: 3, top: 4, width: 5, height: 6, coordinatesType: 'SCREENSHOT_AS_IS'},
        {left: 1, top: 1, width: 2, height: 1, coordinatesType: 'SCREENSHOT_AS_IS'},
      ])
      expect(regions.layout).to.eql([
        {left: 3, top: 3, width: 5, height: 4, coordinatesType: 'SCREENSHOT_AS_IS'},
      ])
    })

    it('handles multiple selectors with user-provided region and imageLocationRegion', () => {
      const accessibility = [
        {selector: '.accessibility-1', accessibilityType: 'RegularText'},
        {selector: '.accessibility-2', accessibilityType: 'LargeText'},
      ]
      const floating = [
        {
          selector: 'float-1',
          maxUpOffset: 10,
          maxDownOffset: 10,
          maxLeftOffset: 10,
          maxRightOffset: 10,
        },
        {
          selector: 'float-2',
          maxUpOffset: 11,
          maxDownOffset: 11,
          maxLeftOffset: 11,
          maxRightOffset: 11,
        },
      ]

      const imageLocationRegion = new Region({left: 9, top: 8, width: 7, height: 6})
      const sizeMode = 'selector'
      const {getMatchRegions} = calculateSelectorsToFindRegionsFor({
        accessibility,
        floating,
        sizeMode,
      })

      const selectorRegions = [
        [imageLocationRegion],
        [new Region({left: 1, top: 1, width: 2, height: 1})],
        [new Region({left: 3, top: 3, width: 5, height: 4})],
        [new Region({left: 4, top: 3, width: 5, height: 2})],
        [new Region({left: 0, top: 1, width: 5, height: 3})],
      ]
      const regions = getMatchRegions({selectorRegions})

      expect(regions.accessibility).to.eql([
        {left: 0, top: 0, width: 2, height: 1, accessibilityType: 'RegularText'},
        {left: 0, top: 0, width: 5, height: 4, accessibilityType: 'LargeText'},
      ])
      expect(regions.floating).to.eql([
        {
          left: 0,
          top: 0,
          width: 5,
          height: 2,
          maxUpOffset: 10,
          maxDownOffset: 10,
          maxLeftOffset: 10,
          maxRightOffset: 10,
        },
        {
          left: 0,
          top: 0,
          width: 5,
          height: 3,
          maxUpOffset: 11,
          maxDownOffset: 11,
          maxLeftOffset: 11,
          maxRightOffset: 11,
        },
      ])

      expect(regions.imageLocationRegion).to.eql(imageLocationRegion)
    })
  })
})
