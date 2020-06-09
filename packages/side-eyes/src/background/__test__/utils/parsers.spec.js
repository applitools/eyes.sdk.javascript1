import { parseBrowsers, parseViewport } from '../../utils/parsers'

describe('parsers', () => {
  describe('parseViewport', () => {
    it('parses valid input', () => {
      expect(parseViewport('300x300')).toEqual({ width: 300, height: 300 })
    })
  })
  describe('parseBrowsers', () => {
    it('has sensible defaults', () => {
      const result = parseBrowsers().matrix[0]
      expect(result.width).toBeTruthy()
      expect(result.height).toBeTruthy()
      expect(result.name).toBeTruthy()
      expect(result.id).toBeUndefined()
    })

    it('parses browsers and viewports', () => {
      const result = parseBrowsers(['Firefox', 'IE10'], ['800x600', '1024x768']).matrix
      expect(result[0].width).toEqual(800)
      expect(result[0].height).toEqual(600)
      expect(result[0].name).toEqual('firefox')
      expect(result[1].width).toEqual(1024)
      expect(result[1].height).toEqual(768)
      expect(result[1].name).toEqual('firefox')
      expect(result[2].id).toEqual('IE_10')
      expect(result[3].id).toEqual('IE_10')
    })

    // no experimental browsers, and no viewport resolution limit
    it.skip('parses experimental browsers', () => {
      const { matrix, didRemoveResolution } = parseBrowsers(['Edge'], ['800x600', '1324x768'])
      expect(matrix[0].width).toEqual(800)
      expect(matrix[0].height).toEqual(600)
      expect(matrix[0].name).toEqual('edge')
      expect(matrix.length).toBe(1)
      expect(didRemoveResolution).toBeTruthy()
    })

    it('parses devices and orientations', () => {
      const result = parseBrowsers([], [], ['iPhone 4'], ['Landscape', 'Portrait']).matrix
      expect(result[0].deviceName).toEqual('iPhone 4')
      expect(result[0].screenOrientation).toEqual('landscape')
      expect(result[1].deviceName).toEqual('iPhone 4')
      expect(result[1].screenOrientation).toEqual('portrait')
    })

    it('parses browsers, viewports, devices, and orientations', () => {
      const result = parseBrowsers(['Chrome'], ['800x600', '1024x768'], ['iPhone 4'], ['Portrait', 'Landscape']).matrix
      expect(result).toEqual([
        { width: 800, height: 600, name: 'chrome' },
        { width: 1024, height: 768, name: 'chrome' },
        {
          screenOrientation: 'portrait',
          deviceName: 'iPhone 4',
          deviceId: 'iPhone_4',
        },
        {
          screenOrientation: 'landscape',
          deviceName: 'iPhone 4',
          deviceId: 'iPhone_4',
        },
      ])
    })

    it('ignores incomplete device configuration', () => {
      const result = parseBrowsers([], [], [], ['Landscape', 'Portrait']).matrix
      expect(result).toEqual([])
    })
  })
})
